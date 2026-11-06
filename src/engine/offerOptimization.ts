import { SupplierRecord, ValueWeights, ScoredOffer } from '../types';

export const DEFAULT_WEIGHTS: ValueWeights = {
  priceWeight: 0.40,
  cancellationWeight: 0.20,
  reliabilityWeight: 0.20,
  inclusionsWeight: 0.10,
  paymentFlexibilityWeight: 0.10,
};

/**
 * Calculates deterministic component scores and the final True Value Score for an offer
 * within a competitive hotel / room cluster.
 */
export function scoreOffer(
  offer: SupplierRecord,
  allClusterOffers: SupplierRecord[],
  weights: ValueWeights = DEFAULT_WEIGHTS
): ScoredOffer {
  const prices = allClusterOffers.map(o => o.priceINR);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // 1. Price Competitiveness Score (0 to 100)
  // 100 if minPrice, scaled down linearly as price exceeds minPrice
  let priceScore = 100;
  if (minPrice > 0 && maxPrice > minPrice) {
    const priceRatio = (offer.priceINR - minPrice) / minPrice;
    priceScore = Math.max(0, Math.round(100 - priceRatio * 150));
  } else if (offer.priceINR === minPrice) {
    priceScore = 100;
  }

  // 2. Cancellation Score (0 to 100)
  let cancellationScore = 20;
  if (offer.cancellationPolicy === 'FREE_CANCELLATION') {
    cancellationScore = 100;
    if (offer.cancellationDeadlineHours <= 24) cancellationScore = 100;
    else if (offer.cancellationDeadlineHours <= 48) cancellationScore = 95;
  } else if (offer.cancellationPolicy === 'PARTIALLY_REFUNDABLE') {
    cancellationScore = 55;
  } else {
    // Non-refundable
    cancellationScore = 15;
  }

  // 3. Supplier Reliability Score (0 to 100)
  const reliabilityScore = Math.round((offer.supplierReliability || 0.8) * 100);

  // 4. Inclusions Score (0 to 100)
  let inclusionsScore = 30;
  switch (offer.mealPlan) {
    case 'ALL_INCLUSIVE':
      inclusionsScore = 100;
      break;
    case 'HALF_BOARD':
      inclusionsScore = 85;
      break;
    case 'BREAKFAST_INCLUDED':
      inclusionsScore = 70;
      break;
    case 'ROOM_ONLY':
    default:
      inclusionsScore = 30;
      break;
  }
  // Extra inclusions bonus
  const incCount = offer.inclusions?.length || 0;
  inclusionsScore = Math.min(100, inclusionsScore + incCount * 5);

  // 5. Payment Flexibility Score (0 to 100)
  let paymentScore = 60;
  if (offer.paymentType === 'PAY_AT_HOTEL' || offer.paymentType === 'PAY_LATER') {
    paymentScore = 100;
  } else {
    paymentScore = 65; // Pay now
  }

  // Composite True Value Score
  const totalWeight =
    weights.priceWeight +
    weights.cancellationWeight +
    weights.reliabilityWeight +
    weights.inclusionsWeight +
    weights.paymentFlexibilityWeight;

  const rawScore =
    (priceScore * weights.priceWeight +
      cancellationScore * weights.cancellationWeight +
      reliabilityScore * weights.reliabilityWeight +
      inclusionsScore * weights.inclusionsWeight +
      paymentScore * weights.paymentFlexibilityWeight) /
    (totalWeight || 1);

  const trueValueScore = Math.round(Math.min(100, Math.max(0, rawScore)));

  // Identify strengths & trade-offs
  const mainStrengths: string[] = [];
  const tradeOffs: string[] = [];

  if (offer.priceINR === minPrice) {
    mainStrengths.push('Lowest available rate across all suppliers');
  } else {
    const diff = offer.priceINR - minPrice;
    tradeOffs.push(`+₹${diff.toLocaleString('en-IN')} vs lowest raw rate`);
  }

  if (offer.cancellationPolicy === 'FREE_CANCELLATION') {
    mainStrengths.push(`Free cancellation up to ${offer.cancellationDeadlineHours}h prior`);
  } else if (offer.cancellationPolicy === 'NON_REFUNDABLE') {
    tradeOffs.push('100% Non-refundable booking conditions');
  }

  if (offer.supplierReliability >= 0.90) {
    mainStrengths.push(`Tier-1 Supplier reliability rating (${Math.round(offer.supplierReliability * 100)}%)`);
  } else if (offer.supplierReliability < 0.80) {
    tradeOffs.push(`Lower supplier fulfillment SLA (${Math.round(offer.supplierReliability * 100)}%)`);
  }

  if (offer.mealPlan === 'BREAKFAST_INCLUDED' || offer.mealPlan === 'ALL_INCLUSIVE' || offer.mealPlan === 'HALF_BOARD') {
    mainStrengths.push(`${offer.mealPlan.replace('_', ' ')} included`);
  } else {
    tradeOffs.push('Room-only (meals excluded)');
  }

  const priceDeltaVsBest = offer.priceINR - minPrice;
  const priceSavingsPercentVsHighest = maxPrice > minPrice
    ? Math.round(((maxPrice - offer.priceINR) / maxPrice) * 100)
    : 0;

  return {
    record: offer,
    trueValueScore,
    rank: 1, // updated after sorting
    priceScore,
    cancellationScore,
    reliabilityScore,
    inclusionsScore,
    paymentScore,
    priceDeltaVsBest,
    priceSavingsPercentVsHighest,
    mainStrengths,
    tradeOffs,
    isRecommended: false,
  };
}

/**
 * Optimizes and ranks all supplier offers for a hotel/room category using the True Value formula.
 */
export function rankOffers(
  offers: SupplierRecord[],
  weights: ValueWeights = DEFAULT_WEIGHTS,
  strategy: 'TRUE_VALUE' | 'CHEAPEST' | 'FLEXIBILITY' | 'RELIABILITY' = 'TRUE_VALUE'
): ScoredOffer[] {
  if (offers.length === 0) return [];

  const scored = offers.map(o => scoreOffer(o, offers, weights));

  // Sort based on selected strategy
  scored.sort((a, b) => {
    if (strategy === 'CHEAPEST') {
      return a.record.priceINR - b.record.priceINR;
    }
    if (strategy === 'FLEXIBILITY') {
      return b.cancellationScore - a.cancellationScore || b.trueValueScore - a.trueValueScore;
    }
    if (strategy === 'RELIABILITY') {
      return b.reliabilityScore - a.reliabilityScore || b.trueValueScore - a.trueValueScore;
    }
    // Default: TRUE_VALUE
    return b.trueValueScore - a.trueValueScore;
  });

  // Assign ranks
  scored.forEach((item, index) => {
    item.rank = index + 1;
    item.isRecommended = index === 0;
  });

  return scored;
}

/**
 * Generates natural language audit explainability for why Rank #1 won over Rank #2.
 */
export function explainRankingDecision(
  winner: ScoredOffer,
  runnerUp?: ScoredOffer
): {
  headline: string;
  summary: string;
  keyFactors: string[];
} {
  if (!runnerUp) {
    return {
      headline: `Only one supplier offer available for this inventory`,
      summary: `Offer provided by ${winner.record.supplierName} with True Value Score of ${winner.trueValueScore}/100.`,
      keyFactors: winner.mainStrengths,
    };
  }

  const keyFactors: string[] = [];

  const isWinnerCheaper = winner.record.priceINR < runnerUp.record.priceINR;
  const isWinnerMoreExpensive = winner.record.priceINR > runnerUp.record.priceINR;
  const priceDiff = Math.abs(winner.record.priceINR - runnerUp.record.priceINR);

  let headline = '';
  if (isWinnerCheaper) {
    headline = `${winner.record.supplierName} wins: Lower price (-₹${priceDiff.toLocaleString('en-IN')}) with superior value terms`;
    keyFactors.push(`Direct price arbitrage: ₹${priceDiff.toLocaleString('en-IN')} cheaper`);
  } else if (isWinnerMoreExpensive) {
    headline = `${winner.record.supplierName} wins on True Value despite +₹${priceDiff.toLocaleString('en-IN')} premium`;
    keyFactors.push(`Quality & flexibility offset price difference of ₹${priceDiff.toLocaleString('en-IN')}`);
  } else {
    headline = `${winner.record.supplierName} wins on superior fulfillment SLA and inclusions`;
    keyFactors.push('Identical price point; decision governed by terms and reliability');
  }

  // Cancellation factor
  if (winner.record.cancellationPolicy === 'FREE_CANCELLATION' && runnerUp.record.cancellationPolicy !== 'FREE_CANCELLATION') {
    keyFactors.push(`Risk mitigation: Free cancellation vs runner-up's ${runnerUp.record.cancellationPolicy.replace('_', ' ')}`);
  }

  // Meal factor
  if (winner.record.mealPlan !== 'ROOM_ONLY' && runnerUp.record.mealPlan === 'ROOM_ONLY') {
    keyFactors.push(`Meal inclusion value: ${winner.record.mealPlan.replace('_', ' ')} included`);
  }

  // Reliability factor
  if (winner.record.supplierReliability > runnerUp.record.supplierReliability) {
    const diffPct = Math.round((winner.record.supplierReliability - runnerUp.record.supplierReliability) * 100);
    keyFactors.push(`Supplier fulfillment safety: +${diffPct}% higher reliability SLA`);
  }

  const summary = `${winner.record.supplierName} scored ${winner.trueValueScore}/100 vs ${runnerUp.record.supplierName} (${runnerUp.trueValueScore}/100). The scoring engine prioritizes actual customer booking safety and net value rather than superficial raw price discounting.`;

  return { headline, summary, keyFactors };
}
