/**
 * Deterministic String & Geographic Distance Utilities
 * Travel Technology Matching Algorithms (VoyageHack 4.0)
 */

// Common hospitality stop words that cause false matches if not stripped or weighted
const HOSPITALITY_STOP_WORDS = new Set([
  'the', 'hotel', 'hotels', 'resort', 'resorts', 'palace', 'suites', 'suite',
  'inn', 'luxury', 'boutique', 'international', 'intl', 'and', '&', 'spa',
  'grand', 'club', 'residency', 'towers', 'tower', 'apartments', 'stay'
]);

const ABBREVIATIONS: Record<string, string> = {
  'st': 'saint',
  'rd': 'road',
  'ave': 'avenue',
  'blvd': 'boulevard',
  'intl': 'international',
  'apt': 'airport',
  'arpt': 'airport',
  'hwy': 'highway',
  'ctr': 'centre',
  'center': 'centre',
  'plz': 'plaza',
  'sq': 'square'
};

/**
 * Normalizes hotel name by removing punctuation, standardizing tokens,
 * expanding common abbreviations, and removing non-distinctive hospitality stopwords.
 */
export function normalizeHotelName(rawName: string, keepHospitalityWords = false): string {
  if (!rawName) return '';
  
  let cleaned = rawName
    .toLowerCase()
    .replace(/['"’]/g, '') // remove apostrophes: Taj's -> Tajs
    .replace(/[^a-z0-9\s]/g, ' ') // replace punctuation with space
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = cleaned.split(' ').map(token => ABBREVIATIONS[token] || token);

  if (keepHospitalityWords) {
    return tokens.join(' ');
  }

  const filtered = tokens.filter(t => !HOSPITALITY_STOP_WORDS.has(t) && t.length > 1);
  return filtered.length > 0 ? filtered.join(' ') : tokens.join(' ');
}

/**
 * Levenshtein distance algorithm
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 0; i < a.length; i++) {
    let prev = i + 1;
    for (let j = 0; j < b.length; j++) {
      const val = a[i] === b[j] ? row[j] : Math.min(row[j], row[j + 1], prev) + 1;
      row[j] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }

  return row[b.length];
}

/**
 * Computes Levenshtein ratio scaled from 0 to 100
 */
export function levenshteinRatio(a: string, b: string): number {
  if (!a && !b) return 100;
  if (!a || !b) return 0;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 100;
  const dist = levenshteinDistance(a, b);
  return Math.round(((maxLen - dist) / maxLen) * 100);
}

/**
 * Token Sort Ratio: splits strings into tokens, sorts alphabetically, and compares
 * Example: "Taj Lands End" vs "Lands End Taj" -> 100%
 */
export function tokenSortRatio(strA: string, strB: string): number {
  const normA = normalizeHotelName(strA, true);
  const normB = normalizeHotelName(strB, true);
  
  const sortedA = normA.split(' ').filter(Boolean).sort().join(' ');
  const sortedB = normB.split(' ').filter(Boolean).sort().join(' ');
  
  return levenshteinRatio(sortedA, sortedB);
}

/**
 * Token Set Ratio: handles string subsets
 * Example: "The Leela Palace New Delhi Chanakyapuri" vs "The Leela Palace New Delhi"
 */
export function tokenSetRatio(strA: string, strB: string): number {
  const tokensA = new Set(normalizeHotelName(strA, true).split(' ').filter(Boolean));
  const tokensB = new Set(normalizeHotelName(strB, true).split(' ').filter(Boolean));

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  const intersection = Array.from(tokensA).filter(t => tokensB.has(t)).sort().join(' ');
  const sortedA = Array.from(tokensA).sort().join(' ');
  const sortedB = Array.from(tokensB).sort().join(' ');

  const ratio1 = levenshteinRatio(intersection, sortedA);
  const ratio2 = levenshteinRatio(intersection, sortedB);
  const ratio3 = levenshteinRatio(sortedA, sortedB);

  return Math.max(ratio1, ratio2, ratio3);
}

/**
 * Composite Multi-Method Name Similarity Score (0 to 100)
 */
export function calculateNameSimilarity(rawNameA: string, rawNameB: string): {
  score: number;
  normA: string;
  normB: string;
  details: {
    directRatio: number;
    tokenSort: number;
    tokenSet: number;
    strippedRatio: number;
  };
} {
  const normA = normalizeHotelName(rawNameA);
  const normB = normalizeHotelName(rawNameB);

  const directRatio = levenshteinRatio(rawNameA.toLowerCase(), rawNameB.toLowerCase());
  const tokenSort = tokenSortRatio(rawNameA, rawNameB);
  const tokenSet = tokenSetRatio(rawNameA, rawNameB);
  const strippedRatio = levenshteinRatio(normA, normB);

  // Take the highest confident signal
  const score = Math.max(directRatio, tokenSort, tokenSet, strippedRatio);

  return {
    score,
    normA,
    normB,
    details: { directRatio, tokenSort, tokenSet, strippedRatio }
  };
}

/**
 * Haversine formula to calculate great-circle distance between two GPS coordinates in meters
 */
export function haversineDistanceMeters(
  lat1: number | null,
  lon1: number | null,
  lat2: number | null,
  lon2: number | null
): number | null {
  if (lat1 === null || lon1 === null || lat2 === null || lon2 === null) {
    return null;
  }

  // Sanity check coordinates
  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return null;
  if (lat1 === 0 && lon1 === 0) return null; // Null island check

  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Normalizes phone number to digits-only last 10 digits
 */
export function normalizePhone(rawPhone: string): string {
  if (!rawPhone) return '';
  const digits = rawPhone.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

/**
 * Token overlap address similarity score (0 to 100)
 */
export function calculateAddressSimilarity(addrA: string, addrB: string, postalA?: string, postalB?: string): {
  score: number;
  postalMatch: boolean | null;
} {
  const normAddrA = addrA.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  const normAddrB = addrB.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 2);

  const setA = new Set(normAddrA);
  const setB = new Set(normAddrB);

  if (setA.size === 0 || setB.size === 0) {
    return { score: 50, postalMatch: null };
  }

  let matches = 0;
  setA.forEach(token => {
    if (setB.has(token)) matches++;
  });

  const unionSize = new Set([...setA, ...setB]).size;
  const jaccardScore = Math.round((matches / unionSize) * 100);

  let postalMatch: boolean | null = null;
  if (postalA && postalB) {
    const cleanPostA = postalA.replace(/\D/g, '');
    const cleanPostB = postalB.replace(/\D/g, '');
    if (cleanPostA.length >= 5 && cleanPostB.length >= 5) {
      postalMatch = cleanPostA === cleanPostB;
    }
  }

  let finalScore = jaccardScore;
  if (postalMatch === true) {
    finalScore = Math.min(100, finalScore + 25);
  } else if (postalMatch === false) {
    finalScore = Math.max(0, finalScore - 20);
  }

  return { score: finalScore, postalMatch };
}
