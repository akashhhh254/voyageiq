import { SupplierRecord, EvaluationMetrics, HotelMatchResult } from '../types';
import { matchHotelPair, clusterHotelListings } from './hotelDeduplication';

export interface EdgeCaseTestResult {
  testId: string;
  category: string;
  description: string;
  listingA: SupplierRecord;
  listingB: SupplierRecord;
  groundTruthMatch: boolean;
  algorithmDecision: 'CONFIRMED_MATCH' | 'POSSIBLE_MATCH' | 'DIFFERENT_PROPERTY';
  confidenceScore: number;
  passed: boolean;
  notes: string;
}

/**
 * Runs complete scientific evaluation against the ground-truth benchmark dataset.
 * Computes Precision, Recall, F1, Confusion Matrix, and Travel Arbitrage.
 */
export function runEvaluationBenchmark(
  records: SupplierRecord[],
  sampleSizeLimit = 350
): {
  metrics: EvaluationMetrics;
  edgeCaseResults: EdgeCaseTestResult[];
  pairwiseSample: HotelMatchResult[];
} {
  const startTime = performance.now();

  let tp = 0;
  let fp = 0;
  let tn = 0;
  let fn = 0;

  const pairwiseSample: HotelMatchResult[] = [];
  let evaluatedPairs = 0;

  // We test intra-cluster pairs (known matches) and challenging cross-cluster pairs
  for (let i = 0; i < records.length; i++) {
    for (let j = i + 1; j < records.length; j++) {
      const recA = records[i];
      const recB = records[j];

      // Prioritize same-city pairs and known edge cases to keep benchmark sharp & realistic
      const sameCity = recA.city.toLowerCase() === recB.city.toLowerCase();
      const sameCluster = Boolean(recA.clusterId && recB.clusterId && recA.clusterId === recB.clusterId);

      // Evaluate all intra-cluster pairs, and sample cross-cluster pairs from same city
      if (!sameCluster && !sameCity && evaluatedPairs > 50) continue;

      const result = matchHotelPair(recA, recB);
      evaluatedPairs++;

      const isGroundTruthPositive = sameCluster;
      const isPredictedPositive = result.decision === 'CONFIRMED_MATCH';

      if (isPredictedPositive && isGroundTruthPositive) {
        tp++;
      } else if (isPredictedPositive && !isGroundTruthPositive) {
        fp++; // Crucial travel bug: incorrectly merged 2 different hotels!
      } else if (!isPredictedPositive && !isGroundTruthPositive) {
        tn++;
      } else if (!isPredictedPositive && isGroundTruthPositive) {
        fn++; // Missed duplicate
      }

      if (pairwiseSample.length < 50) {
        pairwiseSample.push(result);
      }

      if (evaluatedPairs >= sampleSizeLimit) break;
    }
    if (evaluatedPairs >= sampleSizeLimit) break;
  }

  const precision = tp + fp > 0 ? tp / (tp + fp) : 1;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 1;
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  const total = tp + fp + tn + fn;
  const accuracy = total > 0 ? (tp + tn) / total : 1;

  // Clustering to calculate duplicate reduction
  const clusteringResult = clusterHotelListings(records);
  const totalClusters = clusteringResult.clusters.length + clusteringResult.unmatched.length;
  const duplicateReductionPercentage =
    records.length > 0
      ? Math.round(((records.length - totalClusters) / records.length) * 1000) / 10
      : 0;

  // Calculate price arbitrage identified
  let totalSavings = 0;
  let savingsOpportunities = 0;

  clusteringResult.clusters.forEach(cluster => {
    const prices = cluster.map(r => r.priceINR);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    if (maxP > minP) {
      totalSavings += maxP - minP;
      savingsOpportunities++;
    }
  });

  const avgSavings = savingsOpportunities > 0 ? Math.round(totalSavings / savingsOpportunities) : 0;
  const executionTimeMs = Math.round((performance.now() - startTime) * 10) / 10;

  const metrics: EvaluationMetrics = {
    totalEvaluatedPairs: evaluatedPairs,
    truePositives: tp,
    falsePositives: fp,
    trueNegatives: tn,
    falseNegatives: fn,
    precision: Math.round(precision * 1000) / 10,
    recall: Math.round(recall * 1000) / 10,
    f1Score: Math.round(f1Score * 1000) / 10,
    accuracy: Math.round(accuracy * 1000) / 10,
    totalRawListings: records.length,
    unifiedClustersCount: totalClusters,
    duplicateReductionPercentage,
    totalIdentifiedSavingsINR: totalSavings,
    averageSavingsPerBookingINR: avgSavings,
    executionTimeMs,
  };

  // Dedicated Stress-Test Edge Cases
  const edgeCaseResults: EdgeCaseTestResult[] = evaluateDifficultEdgeCases(records);

  return {
    metrics,
    edgeCaseResults,
    pairwiseSample,
  };
}

/**
 * Specifically tests the hardest edge cases designed to fool simplistic models:
 * 1. Same brand name, different location in same city (e.g. Taj Lands End vs Taj Mahal Palace)
 * 2. Airport vs City branches (JW Marriott Juhu vs JW Marriott Sahar Airport)
 * 3. Spelling errors / name variants with missing GPS
 * 4. Distinct neighboring luxury resorts in Goa (Taj Fort Aguada vs Taj Holiday Village)
 */
function evaluateDifficultEdgeCases(records: SupplierRecord[]): EdgeCaseTestResult[] {
  const findById = (id: string) => records.find(r => r.id === id);

  const tests: {
    testId: string;
    category: string;
    description: string;
    idA: string;
    idB: string;
    groundTruthMatch: boolean;
    notes: string;
  }[] = [
    {
      testId: 'EDGE-01',
      category: 'Negative: Brand Overlap in Same City',
      description: 'Taj Lands End (Bandra) vs Taj Mahal Palace (Colaba) — both 5★ Taj hotels in Mumbai 24km apart',
      idA: 'TBO-TLE-01',
      idB: 'TBO-TMP-01',
      groundTruthMatch: false,
      notes: 'Must trigger Hard Veto on >2km geographic distance and distinct street addresses.',
    },
    {
      testId: 'EDGE-02',
      category: 'Negative: Airport vs City Center',
      description: 'JW Marriott Mumbai Juhu (Beach) vs JW Marriott Mumbai Sahar (Airport)',
      idA: 'TBO-JWJ-01',
      idB: 'EXP-JWS-01',
      groundTruthMatch: false,
      notes: 'Same hotel brand and city, but separated by 7km. Merging would cause severe guest disruption.',
    },
    {
      testId: 'EDGE-03',
      category: 'Positive: Missing GPS Fallback',
      description: 'Taj Lands End (TBO) vs Taj Landsend Hotel (Hotelbeds) with null GPS coordinates',
      idA: 'TBO-TLE-01',
      idB: 'HB-TLE-03',
      groundTruthMatch: true,
      notes: 'Tests deterministic fallback to phone number normalization and postal code matching.',
    },
    {
      testId: 'EDGE-04',
      category: 'Negative: Intra-Metropolitan Distinctions',
      description: 'Radisson Blu Plaza Delhi Airport vs Radisson Blu Marina Connaught Place',
      idA: 'TBO-RBD-01',
      idB: 'EXP-RBM-01',
      groundTruthMatch: false,
      notes: 'Must not conflate airport property with central business district property 15km away.',
    },
    {
      testId: 'EDGE-05',
      category: 'Positive: Extreme Name Variance',
      description: 'ITC Grand Chola, a Luxury Collection Hotel vs Grand Chola ITC Guindy Chennai',
      idA: 'TBO-ITC-01',
      idB: 'AGD-ITC-02',
      groundTruthMatch: true,
      notes: 'Token sort and token set ratios overcome rearranged name tokens.',
    },
    {
      testId: 'EDGE-06',
      category: 'Negative: Neighboring Beach Resorts',
      description: 'Taj Fort Aguada Resort & Spa vs Taj Holiday Village Resort & Spa (Candolim, Goa)',
      idA: 'TBO-TFA-01',
      idB: 'EXP-THV-01',
      groundTruthMatch: false,
      notes: '600m apart in Goa; distinct telephone numbers and address markers protect against false merge.',
    },
  ];

  const results: EdgeCaseTestResult[] = [];

  for (const t of tests) {
    const a = findById(t.idA);
    const b = findById(t.idB);

    if (a && b) {
      const match = matchHotelPair(a, b);
      const isMatch = match.decision === 'CONFIRMED_MATCH';
      const passed = isMatch === t.groundTruthMatch;

      results.push({
        testId: t.testId,
        category: t.category,
        description: t.description,
        listingA: a,
        listingB: b,
        groundTruthMatch: t.groundTruthMatch,
        algorithmDecision: match.decision,
        confidenceScore: match.confidenceScore,
        passed,
        notes: t.notes,
      });
    }
  }

  return results;
}
