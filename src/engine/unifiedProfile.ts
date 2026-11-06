import { SupplierRecord, UnifiedHotelProfile, ValueWeights } from '../types';
import { extractRoomAttributes } from './roomMapping';
import { rankOffers } from './offerOptimization';

/**
 * Consolidates multiple supplier records for the same hotel into a single unified master hotel profile.
 * Retains transparency by attributing every offer to its respective source supplier.
 */
export function buildUnifiedHotelProfile(
  cluster: SupplierRecord[],
  weights?: ValueWeights
): UnifiedHotelProfile {
  if (cluster.length === 0) {
    throw new Error('Cannot build profile from empty cluster');
  }

  // Sort by supplier reliability descending to pick the best master attributes
  const sortedByReliability = [...cluster].sort(
    (a, b) => b.supplierReliability - a.supplierReliability
  );
  const primaryRecord = sortedByReliability[0];

  // Best master hotel name: preferred from highest reliability supplier with cleanest title
  const masterName = primaryRecord.hotelName;

  // Standardized address: most detailed address string
  const addresses = cluster.map(c => c.address).filter(Boolean);
  const standardizedAddress =
    addresses.sort((a, b) => b.length - a.length)[0] || primaryRecord.address;

  // GPS coordinates: from first valid pair
  const validGeo = cluster.find(c => c.lat !== null && c.lng !== null);
  const lat = validGeo?.lat || primaryRecord.lat || 0;
  const lng = validGeo?.lng || primaryRecord.lng || 0;

  // Phone: standardized
  const phone = primaryRecord.phone;

  // Star Rating
  const starRating = primaryRecord.starRating;

  // Best description
  const descriptions = cluster.map(c => c.roomDescription || '').filter(Boolean);
  const bestDescription =
    descriptions.sort((a, b) => b.length - a.length)[0] ||
    `${masterName} is a premier ${starRating}-star property located in ${primaryRecord.city}, offering world-class hospitality, luxury rooms, and strategic accessibility.`;

  // Best image
  const primaryImage =
    cluster.find(c => c.imageUrl)?.imageUrl ||
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80';

  // Consolidated amenities
  const amenitySet = new Set<string>();
  cluster.forEach(c => {
    (c.inclusions || []).forEach(inc => amenitySet.add(inc));
  });
  // Add common baseline amenities
  amenitySet.add('Free High-Speed Wi-Fi');
  amenitySet.add('24-Hour Front Desk');
  amenitySet.add('Air Conditioning');
  if (starRating >= 4) {
    amenitySet.add('Swimming Pool');
    amenitySet.add('Fitness Centre / Gymnasium');
  }
  if (starRating === 5) {
    amenitySet.add('Full-Service Luxury Spa');
    amenitySet.add('24-Hour Concierge');
    amenitySet.add('Valet Parking');
  }

  const contributingSuppliers = Array.from(new Set(cluster.map(c => c.supplierId)));

  // Group listings into standardized room categories
  const roomGroups: Record<string, SupplierRecord[]> = {};

  cluster.forEach(record => {
    const attrs = extractRoomAttributes(record);
    const categoryKey = `${attrs.category}_${attrs.bedType}_${attrs.view}`;
    if (!roomGroups[categoryKey]) roomGroups[categoryKey] = [];
    roomGroups[categoryKey].push(record);
  });

  const roomCategories = Object.entries(roomGroups).map(([key, offers]) => {
    const attrs = extractRoomAttributes(offers[0]);
    const prices = offers.map(o => o.priceINR);
    const scoredOffers = rankOffers(offers, weights);

    const bedText = attrs.numberOfBeds > 1 ? `${attrs.numberOfBeds}x ${attrs.bedType}` : `${attrs.bedType} Bed`;
    const viewText = attrs.view !== 'NO_SPECIFIC_VIEW' ? `(${attrs.view.replace('_', ' ')} View)` : '';
    const categoryTitle = `${attrs.category.charAt(0) + attrs.category.slice(1).toLowerCase()} Room - ${bedText} ${viewText}`.trim();

    return {
      categoryKey: key,
      categoryTitle,
      bedType: attrs.bedType,
      view: attrs.view,
      lowestPriceINR: Math.min(...prices),
      highestPriceINR: Math.max(...prices),
      offersCount: offers.length,
      offers: scoredOffers,
    };
  });

  return {
    id: `UNIFIED-${primaryRecord.clusterId || primaryRecord.id}`,
    masterName,
    city: primaryRecord.city,
    country: primaryRecord.country,
    standardizedAddress,
    starRating,
    lat,
    lng,
    phone,
    bestDescription,
    primaryImage,
    allAmenities: Array.from(amenitySet),
    contributingSuppliers,
    supplierListingsCount: cluster.length,
    roomCategories,
  };
}
