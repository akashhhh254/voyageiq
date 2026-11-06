import { SightseeingProduct } from '../types';

export const SAMPLE_SIGHTSEEING_PRODUCTS: SightseeingProduct[] = [
  // Burj Khalifa Cluster
  {
    id: 'SS-BK-01',
    attractionName: 'Burj Khalifa',
    supplierId: 'TBO_Global',
    supplierName: 'TBO Global Feeds',
    supplierReliability: 0.96,
    packageTitle: 'At The Top – Level 124 & 125 (General Admission)',
    accessTier: 'STANDARD_ENTRY',
    hasHotelTransfer: false,
    transferType: 'NONE',
    hasMeal: false,
    durationHours: 1.5,
    priceINR: 3850,
    cancellationPolicy: 'FREE_CANCELLATION',
    inclusions: ['Entry to Levels 124 & 125', 'High-speed elevator', '360-degree observation deck access'],
    notes: 'Standard off-peak time slot. Direct turnstile barcode entry.',
  },
  {
    id: 'SS-BK-02',
    attractionName: 'Burj Khalifa',
    supplierId: 'Agoda_Partner',
    supplierName: 'Agoda Attractions',
    supplierReliability: 0.91,
    packageTitle: 'Sunset Prime Ticket – Levels 124 & 125',
    accessTier: 'SUNSET_PRIME',
    hasHotelTransfer: false,
    transferType: 'NONE',
    hasMeal: false,
    durationHours: 2.0,
    priceINR: 5950,
    cancellationPolicy: 'NON_REFUNDABLE',
    inclusions: ['Peak sunset hour slot (16:30 - 18:30)', 'Access to Levels 124 & 125', 'Telescope viewing access'],
    notes: 'Higher demand sunset golden hour tier.',
  },
  {
    id: 'SS-BK-03',
    attractionName: 'Burj Khalifa',
    supplierId: 'Hotelbeds_Feed',
    supplierName: 'Hotelbeds Activities',
    supplierReliability: 0.88,
    packageTitle: 'At The Top Level 124 + Shared Dubai Hotel Transfers',
    accessTier: 'STANDARD_ENTRY',
    hasHotelTransfer: true,
    transferType: 'SHARED_SHUTTLE',
    hasMeal: false,
    durationHours: 3.5,
    priceINR: 5200,
    cancellationPolicy: 'PARTIALLY_REFUNDABLE',
    inclusions: ['Level 124 & 125 ticket', 'Round-trip shared AC coach transfer from Downtown/Deira hotels'],
    notes: 'Includes logistics transfer; not identical to ticket-only product.',
  },
  {
    id: 'SS-BK-04',
    attractionName: 'Burj Khalifa',
    supplierId: 'Expedia_Affiliate',
    supplierName: 'Expedia Local Expert',
    supplierReliability: 0.94,
    packageTitle: 'Burj Khalifa SKY Level 148 VIP Luxury Experience',
    accessTier: 'UPPER_DECK_VIP',
    hasHotelTransfer: true,
    transferType: 'PRIVATE_CAR',
    hasMeal: true,
    mealDetails: 'VIP Lounge Signature Mocktails & Arabic Pastries',
    durationHours: 4.0,
    priceINR: 15400,
    cancellationPolicy: 'FREE_CANCELLATION',
    inclusions: [
      'Access to World’s Highest Observation Deck at Level 148 (555m)',
      'Fast-track skip-the-line queue bypass',
      'Exclusive outdoor terrace access',
      'Dedicated guest ambassador guide',
      'Private luxury sedan hotel pickup & drop-off',
      'Deluxe lounge refreshments',
    ],
    notes: 'Ultra-luxury VIP product. Caters to premium business/honeymoon traveler.',
  },

  // Taj Mahal Cluster
  {
    id: 'SS-TM-01',
    attractionName: 'Taj Mahal',
    supplierId: 'TBO_Global',
    supplierName: 'TBO Global Feeds',
    supplierReliability: 0.95,
    packageTitle: 'Taj Mahal Monument E-Ticket (Foreigner / High Priority Gate)',
    accessTier: 'STANDARD_ENTRY',
    hasHotelTransfer: false,
    transferType: 'NONE',
    hasMeal: false,
    durationHours: 2.0,
    priceINR: 1150,
    cancellationPolicy: 'FREE_CANCELLATION',
    inclusions: ['Skip-the-line ticket booth voucher', 'Shoe covers & bottled water at entry'],
    notes: 'Ticket only. Self-guided.',
  },
  {
    id: 'SS-TM-02',
    attractionName: 'Taj Mahal',
    supplierId: 'Direct_Connect',
    supplierName: 'Agra Heritage Direct',
    supplierReliability: 0.92,
    packageTitle: 'Sunrise Heritage Tour with Approved Historian Guide + 5★ Buffet Breakfast',
    accessTier: 'FAST_TRACK',
    hasHotelTransfer: true,
    transferType: 'SHARED_SHUTTLE',
    hasMeal: true,
    mealDetails: 'Full Luxury Buffet Breakfast at ITC Mughal / The Oberoi Amarvilas',
    durationHours: 5.0,
    priceINR: 4200,
    cancellationPolicy: 'FREE_CANCELLATION',
    inclusions: [
      'Entry ticket with express VIP queue',
      'Government-approved English-speaking architectural historian',
      'Battery van transfer to Western Gate',
      'Five-star hotel gourmet breakfast buffet',
      'Hotel pickup in Agra',
    ],
    notes: 'Comprehensive guided experience with luxury dining.',
  },
  {
    id: 'SS-TM-03',
    attractionName: 'Taj Mahal',
    supplierId: 'Hotelbeds_Feed',
    supplierName: 'Hotelbeds Activities',
    supplierReliability: 0.89,
    packageTitle: 'Same-Day Agra Tour by Private AC Car from New Delhi',
    accessTier: 'UPPER_DECK_VIP',
    hasHotelTransfer: true,
    transferType: 'PRIVATE_CAR',
    hasMeal: true,
    mealDetails: 'Lunch at Multi-Cuisine Agra Restaurant',
    durationHours: 12.0,
    priceINR: 8900,
    cancellationPolicy: 'PARTIALLY_REFUNDABLE',
    inclusions: [
      'Private air-conditioned chauffeur round-trip from Delhi/NCR',
      'Yamuna Expressway toll & parking fees',
      'Taj Mahal + Agra Fort guided visits',
      'Lunch at boutique restaurant',
    ],
    notes: 'Interstate day excursion package; not a localized city ticket.',
  },
];

export interface GroupedSightseeingCluster {
  attractionName: string;
  totalSuppliers: number;
  minPrice: number;
  maxPrice: number;
  distinctTiers: string[];
  products: SightseeingProduct[];
  differentiationAnalysis: {
    rule: string;
    description: string;
    avoidedMistake: string;
  }[];
}

/**
 * Groups and analyzes sightseeing products by destination attraction
 * while safeguarding against false package consolidation.
 */
export function groupSightseeingProducts(products: SightseeingProduct[] = SAMPLE_SIGHTSEEING_PRODUCTS): GroupedSightseeingCluster[] {
  const groups: Record<string, SightseeingProduct[]> = {};

  products.forEach(p => {
    if (!groups[p.attractionName]) groups[p.attractionName] = [];
    groups[p.attractionName].push(p);
  });

  return Object.entries(groups).map(([attractionName, items]) => {
    const prices = items.map(i => i.priceINR);
    const tiers = Array.from(new Set(items.map(i => i.accessTier)));

    const differentiationAnalysis = [
      {
        rule: 'Access Tier Differentiation',
        description: `Preserved distinctions between Standard Ground Access (e.g. Level 124) and VIP Upper Observatory (Level 148 SKY).`,
        avoidedMistake: 'Never merge a ₹3,850 general ticket with a ₹15,400 VIP lounge package just because both have "Burj Khalifa" in the title.',
      },
      {
        rule: 'Logistics & Transfer Decoupling',
        description: `Identified transfer modalities (No Transfer vs Shared AC Shuttle vs Private Chauffeur Sedan).`,
        avoidedMistake: 'Prevented customer arriving at monument expecting hotel pickup that was omitted by a cheaper alternative supplier.',
      },
      {
        rule: 'Inclusions & Meal Normalization',
        description: `Flagged meal inclusions (Gourmet Breakfast, VIP Lounge pastries) vs admission-only tariffs.`,
        avoidedMistake: 'Displaying an admission-only ticket as "cheaper" than a full excursion with meals and private driver.',
      },
    ];

    return {
      attractionName,
      totalSuppliers: new Set(items.map(i => i.supplierId)).size,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      distinctTiers: tiers,
      products: items,
      differentiationAnalysis,
    };
  });
}
