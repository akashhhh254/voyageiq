import {
  SupplierRecord,
  NormalizedRoomAttributes,
  RoomComparisonResult,
  RoomMatchDecision,
  BedType,
  RoomView,
  MealPlan,
} from '../types';

/**
 * Normalizes raw supplier room title and description into structured attributes.
 */
export function extractRoomAttributes(record: SupplierRecord): NormalizedRoomAttributes {
  const text = `${record.roomName} ${record.roomDescription || ''}`.toLowerCase();

  // 1. Room Category
  let category: NormalizedRoomAttributes['category'] = 'STANDARD';
  if (text.includes('presidential') || text.includes('penthouse') || text.includes('royal suite')) {
    category = 'SUITE';
  } else if (text.includes('suite')) {
    category = 'SUITE';
  } else if (text.includes('villa')) {
    category = 'VILLA';
  } else if (text.includes('executive') || text.includes('club') || text.includes('lounge access')) {
    category = 'EXECUTIVE';
  } else if (text.includes('premium')) {
    category = 'PREMIUM';
  } else if (text.includes('superior')) {
    category = 'SUPERIOR';
  } else if (text.includes('deluxe') || text.includes('dlx')) {
    category = 'DELUXE';
  }

  // 2. Bed Type
  let bedType: BedType = record.bedType || 'UNSPECIFIED';
  let numberOfBeds = record.numberOfBeds || 1;

  if (text.includes('twin') || text.includes('2 single') || text.includes('two twin') || text.includes('2 twin')) {
    bedType = 'TWIN';
    numberOfBeds = 2;
  } else if (text.includes('king') || text.includes('1 king') || text.includes('king size')) {
    bedType = 'KING';
    numberOfBeds = 1;
  } else if (text.includes('queen') || text.includes('1 queen')) {
    bedType = 'QUEEN';
    numberOfBeds = 1;
  } else if (text.includes('double') || text.includes('full bed')) {
    bedType = 'DOUBLE';
    numberOfBeds = 1;
  } else if (text.includes('single')) {
    bedType = 'SINGLE';
    numberOfBeds = 1;
  }

  // 3. View
  let view: RoomView = record.view || 'NO_SPECIFIC_VIEW';
  if (text.includes('sea view') || text.includes('ocean view') || text.includes('ocean facing') || text.includes('sea facing') || text.includes('coastal')) {
    view = 'SEA_OCEAN';
  } else if (text.includes('city view') || text.includes('skyline view') || text.includes('urban view')) {
    view = 'CITY';
  } else if (text.includes('garden view') || text.includes('park view')) {
    view = 'GARDEN';
  } else if (text.includes('pool view') || text.includes('poolside')) {
    view = 'POOL';
  } else if (text.includes('courtyard')) {
    view = 'COURTYARD';
  }

  // 4. Meal Plan
  let mealPlan: MealPlan = record.mealPlan || 'ROOM_ONLY';
  if (text.includes('all inclusive') || text.includes('all-inclusive')) {
    mealPlan = 'ALL_INCLUSIVE';
  } else if (text.includes('half board') || text.includes('breakfast and dinner') || text.includes('map plan')) {
    mealPlan = 'HALF_BOARD';
  } else if (text.includes('breakfast included') || text.includes('with breakfast') || text.includes('free breakfast') || text.includes('bb')) {
    mealPlan = 'BREAKFAST_INCLUDED';
  } else if (text.includes('room only') || text.includes('ep plan') || text.includes('no meal')) {
    mealPlan = 'ROOM_ONLY';
  }

  // 5. Room Size
  let roomSizeSqFt = record.roomSizeSqFt;
  if (!roomSizeSqFt) {
    const sqftMatch = text.match(/(\d{3,4})\s*(sq\s*ft|sqft|sq\.ft)/);
    const sqmMatch = text.match(/(\d{2,3})\s*(sq\s*m|sqm|m²)/);
    if (sqftMatch) {
      roomSizeSqFt = parseInt(sqftMatch[1], 10);
    } else if (sqmMatch) {
      roomSizeSqFt = Math.round(parseInt(sqmMatch[1], 10) * 10.764);
    }
  }

  return {
    category,
    bedType,
    numberOfBeds,
    view,
    mealPlan,
    cancellation: record.cancellationPolicy,
    roomSizeSqFt,
    inclusions: record.inclusions || [],
  };
}

/**
 * Compares two room listings under the same hotel property.
 * Enforces business rules against false merges of king vs twin, sea vs city, etc.
 */
export function compareRoomTypes(recordA: SupplierRecord, recordB: SupplierRecord): RoomComparisonResult {
  const roomAAttrs = extractRoomAttributes(recordA);
  const roomBAttrs = extractRoomAttributes(recordB);

  const matchingAttributes: string[] = [];
  const differingAttributes: string[] = [];

  // 1. Bed Configuration Check
  let bedCompatible = false;
  if (roomAAttrs.bedType === roomBAttrs.bedType && roomAAttrs.numberOfBeds === roomBAttrs.numberOfBeds) {
    bedCompatible = true;
    matchingAttributes.push(`Bed Configuration: Identical (${roomAAttrs.numberOfBeds}x ${roomAAttrs.bedType})`);
  } else {
    differingAttributes.push(`Bed Discrepancy: ${roomAAttrs.numberOfBeds}x ${roomAAttrs.bedType} vs ${roomBAttrs.numberOfBeds}x ${roomBAttrs.bedType}`);
  }

  // 2. Room Tier Category Check
  let categoryCompatible = false;
  if (roomAAttrs.category === roomBAttrs.category) {
    categoryCompatible = true;
    matchingAttributes.push(`Room Category: ${roomAAttrs.category}`);
  } else {
    differingAttributes.push(`Category Discrepancy: ${roomAAttrs.category} vs ${roomBAttrs.category}`);
  }

  // 3. View Check
  let viewCompatible = false;
  if (roomAAttrs.view === roomBAttrs.view) {
    viewCompatible = true;
    matchingAttributes.push(`View: ${roomAAttrs.view.replace('_', ' ')}`);
  } else {
    differingAttributes.push(`View Discrepancy: ${roomAAttrs.view} vs ${roomBAttrs.view}`);
  }

  // 4. Meal Plan & Cancellation Check
  if (roomAAttrs.mealPlan === roomBAttrs.mealPlan) {
    matchingAttributes.push(`Meal Plan: ${roomAAttrs.mealPlan}`);
  } else {
    differingAttributes.push(`Meal Plan: ${roomAAttrs.mealPlan} vs ${roomBAttrs.mealPlan}`);
  }

  if (roomAAttrs.cancellation === roomBAttrs.cancellation) {
    matchingAttributes.push(`Cancellation: ${roomAAttrs.cancellation}`);
  } else {
    differingAttributes.push(`Cancellation Policy: ${roomAAttrs.cancellation} vs ${roomBAttrs.cancellation}`);
  }

  // Compute Decision and Confidence
  let decision: RoomMatchDecision = 'INCOMPATIBLE';
  let confidence = 0;
  let explanation = '';
  let isSameRoomDifferentRate = false;

  // Strict physical room match: Same category, bed type, and view
  const isPhysicalRoomMatch = categoryCompatible && bedCompatible && viewCompatible;

  if (isPhysicalRoomMatch) {
    // Check if commercial terms differ
    const sameCommercialTerms =
      roomAAttrs.mealPlan === roomBAttrs.mealPlan &&
      roomAAttrs.cancellation === roomBAttrs.cancellation;

    if (sameCommercialTerms) {
      decision = 'EQUIVALENT';
      confidence = 96;
      explanation = `Exact Room Match: Both suppliers offer identical physical inventory (${roomAAttrs.category}, ${roomAAttrs.bedType}, ${roomAAttrs.view}) with matching meal and cancellation terms. Suitable for direct price arbitrage comparison.`;
    } else {
      decision = 'EQUIVALENT';
      confidence = 90;
      isSameRoomDifferentRate = true;
      explanation = `Same Physical Room, Different Rate Plan: Identical ${roomAAttrs.category} (${roomAAttrs.bedType}, ${roomAAttrs.view}), but with differing conditions (${differingAttributes.filter(d => d.includes('Meal') || d.includes('Cancellation')).join(', ')}). Best-Value scoring must normalize for meal/cancellation value.`;
    }
  } else if (categoryCompatible && (bedCompatible || viewCompatible)) {
    decision = 'COMPATIBLE_UPGRADE';
    confidence = 65;
    explanation = `Compatible Category but Feature Difference: Rooms share base tier (${roomAAttrs.category}), but differ in ${differingAttributes.join(' & ')}. Should NOT be silently merged as identical.`;
  } else {
    decision = 'INCOMPATIBLE';
    confidence = 25;
    explanation = `Incompatible Rooms: Material differences detected (${differingAttributes.join(', ')}). Merging these products would cause booking discrepancies or customer complaints.`;
  }

  return {
    recordA,
    recordB,
    roomAAttrs,
    roomBAttrs,
    decision,
    confidence,
    matchingAttributes,
    differingAttributes,
    explanation,
    isSameRoomDifferentRate,
  };
}
