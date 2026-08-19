/** Bigram overlap similarity (0–1). Handles typos like "chiken" → "chicken". */
export function bigramSimilarity(a: string, b: string): number {
  const left = a.toLowerCase().trim();
  const right = b.toLowerCase().trim();
  if (!left || !right) {
    return 0;
  }
  if (left === right) {
    return 1;
  }
  if (left.includes(right) || right.includes(left)) {
    return 0.95;
  }

  const bigrams = (value: string) => {
    const set = new Set<string>();
    for (let i = 0; i < value.length - 1; i += 1) {
      set.add(value.slice(i, i + 2));
    }
    return set;
  };

  const aBigrams = bigrams(left);
  const bBigrams = bigrams(right);
  if (aBigrams.size === 0 || bBigrams.size === 0) {
    return 0;
  }

  let overlap = 0;
  for (const gram of aBigrams) {
    if (bBigrams.has(gram)) {
      overlap += 1;
    }
  }

  return (2 * overlap) / (aBigrams.size + bBigrams.size);
}

function nameWords(name: string): string[] {
  return name.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

export interface FoodMatchMeta {
  dataType?: string | null;
}

/** Prefer everyday names like "Chicken breast, grilled" over USDA jargon. */
function everydayNameBoost(name: string): number {
  let boost = 0;
  const normalized = name.toLowerCase();

  if (
    /^chicken (breast|thigh|drumstick|wing), (grilled|roasted|baked|raw|cooked)/.test(
      normalized,
    )
  ) {
    boost += 0.28;
  } else if (/^chicken (breast|thigh)/.test(normalized)) {
    boost += 0.18;
  }

  if (/^(banana|apple|rice|salmon|egg|oatmeal|yogurt|broccoli)/.test(normalized)) {
    boost += 0.1;
  }

  if (
    normalized.includes("broilers or fryers") ||
    normalized.includes("broiler or fryers")
  ) {
    boost -= 0.24;
  }
  if (normalized.includes("meat only")) {
    boost -= 0.07;
  }
  if (normalized.includes("skinless") && normalized.includes("boneless")) {
    boost -= 0.05;
  }
  if (normalized.includes("babyfood")) {
    boost -= 0.14;
  }
  if (/^[a-z0-9\s&]+,\s/.test(normalized)) {
    boost -= 0.1;
  }

  const commaCount = (name.match(/,/g) ?? []).length;
  boost -= commaCount * 0.045;

  if (name.length > 60) {
    boost -= 0.14;
  } else if (name.length <= 32) {
    boost += 0.1;
  }

  if (/(grilled|roasted|baked|boiled|raw)/.test(normalized)) {
    boost += 0.07;
  }

  return boost;
}

export function foodMatchScore(
  name: string,
  query: string,
  meta: FoodMatchMeta = {},
): number {
  const normalizedName = name.toLowerCase();
  const normalizedQuery = query.toLowerCase().trim();
  const words = nameWords(name);
  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);

  if (!normalizedQuery) {
    return 0;
  }

  let score = 0;

  if (normalizedName === normalizedQuery) {
    score = 1;
  } else if (normalizedName.startsWith(normalizedQuery)) {
    score = 0.96;
  } else {
    const queryWordIndex = words.findIndex((word) => word === normalizedQuery);
    const queryWordPrefixIndex = words.findIndex((word) =>
      word.startsWith(normalizedQuery),
    );

    if (queryWordIndex === 0) {
      score = 0.94;
    } else if (queryWordIndex > 0) {
      score = 0.84 - queryWordIndex * 0.04;
    } else if (queryWordPrefixIndex === 0) {
      score = 0.9;
    } else if (queryWordPrefixIndex > 0) {
      score = 0.8 - queryWordPrefixIndex * 0.04;
    } else if (
      queryWords.length > 1 &&
      queryWords.every((part) => words.some((word) => word.includes(part)))
    ) {
      score = 0.78;
    } else if (normalizedName.includes(normalizedQuery)) {
      const index = normalizedName.indexOf(normalizedQuery);
      score = 0.72 - Math.min(index / 100, 0.12);
    } else {
      const wordScores = words.map((word) =>
        bigramSimilarity(normalizedQuery, word),
      );
      score = Math.max(
        bigramSimilarity(normalizedQuery, normalizedName),
        ...wordScores,
      );
    }
  }

  if (
    queryWords.length > 1 &&
    queryWords.every((part) => normalizedName.includes(part))
  ) {
    score += 0.12;
  }

  score += everydayNameBoost(name);

  if (meta.dataType === "foundation_food") {
    score += 0.08;
  } else if (meta.dataType === "sr_legacy_food") {
    score -= 0.03;
  }

  return Math.max(0, Math.min(1, score));
}

export function rankFoodMatches<T extends { name: string; data_type?: string | null }>(
  foods: T[],
  query: string,
  limit: number,
): T[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return foods.slice(0, limit);
  }

  const minScore = normalizedQuery.length >= 5 ? 0.35 : 0.4;

  return foods
    .map((item) => ({
      item,
      score: foodMatchScore(item.name, normalizedQuery, {
        dataType: item.data_type,
      }),
    }))
    .filter((entry) => entry.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

export function fuzzySearchPrefix(query: string): string | null {
  const trimmed = query.trim();
  if (trimmed.length < 3) {
    return null;
  }
  return trimmed.slice(0, 3);
}
