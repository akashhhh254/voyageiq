import { SupplierRecord, HotelMatchResult, MatchEvidence, MatchDecision } from '../types';
import {
  calculateNameSimilarity,
  haversineDistanceMeters,
  normalizePhone,
  calculateAddressSimilarity,
} from './stringUtils';

/**
 * Compares two supplier hotel records using multi-signal deterministic heuristics.
 * Produces CONFIRMED_MATCH, POSSIBLE_MATCH, or DIFFERENT_PROPERTY with full explainability.
 */
export function matchHotelPair(listingA: SupplierRecord, listingB: SupplierRecord): HotelMatchResult {
  const positiveSignals: string[] = [];
  const negativeSignals: string[] = [];
  let vetoTriggered: string | undefined = undefined;

  // 1. City / Region sanity check
  const cityA = listingA.city.toLowerCase().trim();
  const cityB = listingB.city.toLowerCase().trim();
  const countryA = listingA.country.toLowerCase().trim();
  const countryB = listingB.country.toLowerCase().trim();

  if (countryA && countryB && countryA !== countryB) {
    vetoTriggered = `Different countries: "${listingA.country}" vs "${listingB.country}"`;
    return buildResult(listingA, listingB, 0, 'DIFFERENT_PROPERTY', {
      nameSimilarity: 0,
      geoDistanceMeters: null,
      geoScore: 0,
      addressSimilarity: 0,
      phoneMatch: false,
      starRatingMatch: false,
      normalizedNameA: listingA.hotelName,
      normalizedNameB: listingB.hotelName,
      positiveSignals,
      negativeSignals: [vetoTriggered],
      vetoTriggered,
    }, `Automatic rejection: Listings are located in entirely different countries (${listingA.country} vs ${listingB.country}).`);
  }

  if (cityA && cityB && !cityA.includes(cityB) && !cityB.includes(cityA)) {
    vetoTriggered = `Different cities: "${listingA.city}" vs "${listingB.city}"`;
    return buildResult(listingA, listingB, 5, 'DIFFERENT_PROPERTY', {
      nameSimilarity: 0,
      geoDistanceMeters: null,
      geoScore: 0,
      addressSimilarity: 0,
      phoneMatch: false,
      starRatingMatch: false,
      normalizedNameA: listingA.hotelName,
      normalizedNameB: listingB.hotelName,
      positiveSignals,
      negativeSignals: [vetoTriggered],
      vetoTriggered,
    }, `Rejection: Properties belong to distinct geographic cities (${listingA.city} vs ${listingB.city}).`);
  }

  // 2. Name Similarity
  const nameComp = calculateNameSimilarity(listingA.hotelName, listingB.hotelName);
  const nameScore = nameComp.score;

  if (nameScore >= 90) {
    positiveSignals.push(`Extremely high name similarity (${nameScore}%)`);
  } else if (nameScore >= 75) {
    positiveSignals.push(`Moderate name similarity (${nameScore}%)`);
  } else {
    negativeSignals.push(`Low name similarity (${nameScore}%)`);
  }

  // 3. Geographic Proximity (Haversine)
  const geoDistMeters = haversineDistanceMeters(listingA.lat, listingA.lng, listingB.lat, listingB.lng);
  let geoScore = 50; // Neutral baseline if coordinates missing

  if (geoDistMeters !== null) {
    if (geoDistMeters <= 150) {
      geoScore = 100;
      positiveSignals.push(`Colocated GPS coordinates (within ${geoDistMeters}m)`);
    } else if (geoDistMeters <= 400) {
      geoScore = 85;
      positiveSignals.push(`Close GPS proximity (${geoDistMeters}m apart)`);
    } else if (geoDistMeters <= 1000) {
      geoScore = 55;
      positiveSignals.push(`Neighborhood vicinity (${geoDistMeters}m apart)`);
    } else if (geoDistMeters <= 2000) {
      geoScore = 20;
      negativeSignals.push(`Significant geographic separation (${(geoDistMeters / 1000).toFixed(1)}km apart)`);
    } else {
      geoScore = 0;
      vetoTriggered = `Geographic separation of ${(geoDistMeters / 1000).toFixed(1)}km exceeds 2.0km physical hotel threshold`;
      negativeSignals.push(vetoTriggered);
    }
  } else {
    positiveSignals.push('GPS coordinates incomplete on one or both listings; falling back to address & name');
  }

  // 4. Address & Postal Code Similarity
  const addrComp = calculateAddressSimilarity(
    listingA.address,
    listingB.address,
    listingA.postalCode,
    listingB.postalCode
  );
  const addressScore = addrComp.score;

  if (addrComp.postalMatch === true) {
    positiveSignals.push(`Exact postal code match (${listingA.postalCode})`);
  } else if (addrComp.postalMatch === false) {
    negativeSignals.push(`Mismatched postal codes (${listingA.postalCode} vs ${listingB.postalCode})`);
  }

  if (addressScore >= 70) {
    positiveSignals.push(`Strong street & area token overlap (${addressScore}%)`);
  } else if (addressScore < 40) {
    negativeSignals.push(`Weak address similarity (${addressScore}%)`);
  }

  // 5. Phone Match
  const phoneA = normalizePhone(listingA.phone);
  const phoneB = normalizePhone(listingB.phone);
  let phoneMatch: boolean | null = null;

  if (phoneA && phoneB && phoneA.length >= 8 && phoneB.length >= 8) {
    phoneMatch = phoneA === phoneB;
    if (phoneMatch) {
      positiveSignals.push(`Direct phone number match (${phoneA})`);
    } else {
      negativeSignals.push(`Different listed phone numbers`);
    }
  }

  // 6. Star Rating Compatibility
  const starDiff = Math.abs(listingA.starRating - listingB.starRating);
  const starRatingMatch = starDiff <= 1;
  if (starDiff > 1.5) {
    negativeSignals.push(`Discrepancy in hotel category (${listingA.starRating}★ vs ${listingB.starRating}★)`);
  }

  // 7. Calculate Composite Confidence Score
  // Weights: Name 40%, Geo 30%, Address 20%, Phone 10%
  let rawConfidence = 0;
  if (geoDistMeters !== null) {
    rawConfidence =
      nameScore * 0.40 +
      geoScore * 0.30 +
      addressScore * 0.20 +
      (phoneMatch === true ? 100 : phoneMatch === false ? 20 : 60) * 0.10;
  } else {
    // Reallocate geo weight to address and name if geo missing
    rawConfidence =
      nameScore * 0.55 +
      addressScore * 0.35 +
      (phoneMatch === true ? 100 : phoneMatch === false ? 30 : 60) * 0.10;
  }

  // Check for Hard Veto
  if (vetoTriggered) {
    const finalScore = Math.min(rawConfidence, 25);
    return buildResult(
      listingA,
      listingB,
      finalScore,
      'DIFFERENT_PROPERTY',
      {
        nameSimilarity: nameScore,
        geoDistanceMeters: geoDistMeters,
        geoScore,
        addressSimilarity: addressScore,
        phoneMatch,
        starRatingMatch,
        normalizedNameA: nameComp.normA,
        normalizedNameB: nameComp.normB,
        positiveSignals,
        negativeSignals,
        vetoTriggered,
      },
      `Rejected due to Hard Veto: ${vetoTriggered}. Even if brand names match, physical separation confirms these are distinct facilities.`
    );
  }

  // Decision logic
  let decision: MatchDecision = 'DIFFERENT_PROPERTY';
  let explanation = '';

  const finalScore = Math.round(Math.min(100, Math.max(0, rawConfidence)));

  // Case A: Confirmed Match
  if (
    (finalScore >= 82 && (!geoDistMeters || geoDistMeters <= 500)) ||
    (geoDistMeters !== null && geoDistMeters <= 200 && nameScore >= 70) ||
    (phoneMatch === true && nameScore >= 75)
  ) {
    decision = 'CONFIRMED_MATCH';
    const distText = geoDistMeters !== null ? `within ${geoDistMeters}m GPS radius` : 'matching street address & city';
    explanation = `Confirmed Match (${finalScore}% confidence): "${listingA.hotelName}" and "${listingB.hotelName}" share high token similarity, identical locality in ${listingA.city}, and are located ${distText}.`;
  }
  // Case B: Possible Match (borderline / human review)
  else if (finalScore >= 52 || (nameScore >= 80 && (geoDistMeters === null || geoDistMeters <= 1200))) {
    decision = 'POSSIBLE_MATCH';
    explanation = `Possible Match (${finalScore}% confidence): Strong name overlap between "${listingA.hotelName}" and "${listingB.hotelName}", but missing definitive coordinates or phone confirmation requires manual review.`;
  }
  // Case C: Different Property
  else {
    decision = 'DIFFERENT_PROPERTY';
    explanation = `Different Property (${finalScore}% confidence): Insufficient matching evidence across name (${nameScore}%), address (${addressScore}%), and geographic coordinates.`;
  }

  const evidence: MatchEvidence = {
    nameSimilarity: nameScore,
    geoDistanceMeters: geoDistMeters,
    geoScore,
    addressSimilarity: addressScore,
    phoneMatch,
    starRatingMatch,
    normalizedNameA: nameComp.normA,
    normalizedNameB: nameComp.normB,
    positiveSignals,
    negativeSignals,
    vetoTriggered,
  };

  return buildResult(listingA, listingB, finalScore, decision, evidence, explanation);
}

function buildResult(
  listingA: SupplierRecord,
  listingB: SupplierRecord,
  confidenceScore: number,
  decision: MatchDecision,
  evidence: MatchEvidence,
  explanation: string
): HotelMatchResult {
  const isGroundTruthMatch =
    Boolean(listingA.clusterId && listingB.clusterId && listingA.clusterId === listingB.clusterId);

  return {
    listingA,
    listingB,
    confidenceScore,
    decision,
    evidence,
    explanation,
    isGroundTruthMatch,
  };
}

/**
 * Deduplicates a list of supplier hotel listings into clustered master hotels.
 */
export function clusterHotelListings(listings: SupplierRecord[]): {
  clusters: SupplierRecord[][];
  unmatched: SupplierRecord[];
  pairwiseComparisons: HotelMatchResult[];
} {
  const clusters: SupplierRecord[][] = [];
  const pairwiseComparisons: HotelMatchResult[] = [];
  const visited = new Set<string>();

  for (let i = 0; i < listings.length; i++) {
    const itemA = listings[i];
    if (visited.has(itemA.id)) continue;

    const currentCluster: SupplierRecord[] = [itemA];
    visited.add(itemA.id);

    for (let j = i + 1; j < listings.length; j++) {
      const itemB = listings[j];
      if (visited.has(itemB.id)) continue;

      const result = matchHotelPair(itemA, itemB);
      pairwiseComparisons.push(result);

      if (result.decision === 'CONFIRMED_MATCH') {
        currentCluster.push(itemB);
        visited.add(itemB.id);
      }
    }

    clusters.push(currentCluster);
  }

  const singletons = clusters.filter(c => c.length === 1).map(c => c[0]);
  const matchedClusters = clusters.filter(c => c.length > 1);

  return {
    clusters: matchedClusters,
    unmatched: singletons,
    pairwiseComparisons,
  };
}
