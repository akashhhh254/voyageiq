export type SupplierId =
  | 'TBO_Global'
  | 'Agoda_Partner'
  | 'Hotelbeds_Feed'
  | 'Expedia_Affiliate'
  | 'Direct_Connect';

export type AvailabilityStatus = 'AVAILABLE' | 'FEW_LEFT' | 'ON_REQUEST';
export type CancellationPolicy = 'FREE_CANCELLATION' | 'PARTIALLY_REFUNDABLE' | 'NON_REFUNDABLE';
export type MealPlan = 'ROOM_ONLY' | 'BREAKFAST_INCLUDED' | 'HALF_BOARD' | 'ALL_INCLUSIVE';
export type BedType = 'KING' | 'QUEEN' | 'TWIN' | 'DOUBLE' | 'SINGLE' | 'UNSPECIFIED';
export type RoomView = 'SEA_OCEAN' | 'CITY' | 'GARDEN' | 'POOL' | 'COURTYARD' | 'NO_SPECIFIC_VIEW';
export type PaymentType = 'PAY_NOW' | 'PAY_AT_HOTEL' | 'PAY_LATER';

export interface SupplierRecord {
  id: string;
  clusterId?: string; // Ground truth cluster identifier
  supplierId: SupplierId;
  supplierName: string;
  supplierReliability: number; // 0.0 to 1.0
  hotelName: string;
  normalizedName?: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  starRating: number;
  roomName: string;
  roomDescription: string;
  priceINR: number;
  currency: string;
  availability: AvailabilityStatus;
  cancellationPolicy: CancellationPolicy;
  cancellationDeadlineHours: number; // e.g. 24 or 48 hours before check-in
  mealPlan: MealPlan;
  bedType: BedType;
  numberOfBeds: number;
  roomSizeSqFt: number | null;
  view: RoomView;
  smoking: boolean;
  inclusions: string[];
  paymentType: PaymentType;
  imageUrl?: string;
  notes?: string;
}

export type MatchDecision = 'CONFIRMED_MATCH' | 'POSSIBLE_MATCH' | 'DIFFERENT_PROPERTY';

export interface MatchEvidence {
  nameSimilarity: number; // 0 to 100
  geoDistanceMeters: number | null; // meters
  geoScore: number; // 0 to 100
  addressSimilarity: number; // 0 to 100
  phoneMatch: boolean | null;
  starRatingMatch: boolean;
  normalizedNameA: string;
  normalizedNameB: string;
  positiveSignals: string[];
  negativeSignals: string[];
  vetoTriggered?: string;
}

export interface HotelMatchResult {
  listingA: SupplierRecord;
  listingB: SupplierRecord;
  confidenceScore: number; // 0 to 100
  decision: MatchDecision;
  evidence: MatchEvidence;
  explanation: string;
  isGroundTruthMatch?: boolean;
}

export interface NormalizedRoomAttributes {
  category: 'STANDARD' | 'DELUXE' | 'SUPERIOR' | 'EXECUTIVE' | 'SUITE' | 'VILLA' | 'PREMIUM' | 'CLUB' | 'UNKNOWN';
  bedType: BedType;
  numberOfBeds: number;
  view: RoomView;
  mealPlan: MealPlan;
  cancellation: CancellationPolicy;
  roomSizeSqFt: number | null;
  inclusions: string[];
}

export type RoomMatchDecision = 'EQUIVALENT' | 'COMPATIBLE_UPGRADE' | 'INCOMPATIBLE';

export interface RoomComparisonResult {
  recordA: SupplierRecord;
  recordB: SupplierRecord;
  roomAAttrs: NormalizedRoomAttributes;
  roomBAttrs: NormalizedRoomAttributes;
  decision: RoomMatchDecision;
  confidence: number;
  matchingAttributes: string[];
  differingAttributes: string[];
  explanation: string;
  isSameRoomDifferentRate: boolean;
}

export interface ValueWeights {
  priceWeight: number; // e.g. 0.40
  cancellationWeight: number; // e.g. 0.20
  reliabilityWeight: number; // e.g. 0.20
  inclusionsWeight: number; // e.g. 0.10
  paymentFlexibilityWeight: number; // e.g. 0.10
}

export interface ScoredOffer {
  record: SupplierRecord;
  trueValueScore: number; // 0 to 100
  rank: number;
  priceScore: number;
  cancellationScore: number;
  reliabilityScore: number;
  inclusionsScore: number;
  paymentScore: number;
  priceDeltaVsBest: number;
  priceSavingsPercentVsHighest: number;
  mainStrengths: string[];
  tradeOffs: string[];
  isRecommended: boolean;
}

export interface UnifiedHotelProfile {
  id: string;
  masterName: string;
  city: string;
  country: string;
  standardizedAddress: string;
  starRating: number;
  lat: number;
  lng: number;
  phone: string;
  bestDescription: string;
  primaryImage: string;
  allAmenities: string[];
  contributingSuppliers: SupplierId[];
  supplierListingsCount: number;
  roomCategories: {
    categoryKey: string;
    categoryTitle: string;
    bedType: BedType;
    view: RoomView;
    lowestPriceINR: number;
    highestPriceINR: number;
    offersCount: number;
    offers: ScoredOffer[];
  }[];
}

export interface SightseeingProduct {
  id: string;
  attractionName: string;
  supplierId: SupplierId;
  supplierName: string;
  supplierReliability: number;
  packageTitle: string;
  accessTier: 'STANDARD_ENTRY' | 'UPPER_DECK_VIP' | 'SUNSET_PRIME' | 'FAST_TRACK';
  hasHotelTransfer: boolean;
  transferType: 'NONE' | 'SHARED_SHUTTLE' | 'PRIVATE_CAR';
  hasMeal: boolean;
  mealDetails?: string;
  durationHours: number;
  priceINR: number;
  cancellationPolicy: CancellationPolicy;
  inclusions: string[];
  notes?: string;
}

export interface EvaluationMetrics {
  totalEvaluatedPairs: number;
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
  precision: number;
  recall: number;
  f1Score: number;
  accuracy: number;
  totalRawListings: number;
  unifiedClustersCount: number;
  duplicateReductionPercentage: number;
  totalIdentifiedSavingsINR: number;
  averageSavingsPerBookingINR: number;
  executionTimeMs: number;
}
