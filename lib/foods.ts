import type { FoodRow, FoodSearchResult } from "../types/database";

export function mapFoodRow(row: FoodRow): FoodSearchResult {
  return {
    id: row.id,
    name: row.name,
    caloriesPerServing: Number(row.calories_per_serving),
    servingUnit: row.serving_unit,
    proteinG: Number(row.protein_g ?? 0),
    carbsG: Number(row.carbs_g ?? 0),
    fatG: Number(row.fat_g ?? 0),
    fiberG: Number(row.fiber_g ?? 0),
  };
}

export function normalizeFoodQuery(query: string): string {
  return query.trim().slice(0, 80);
}

/** Show a shorter, everyday label in search results. */
export function formatFoodDisplayName(name: string): string {
  const chickenCut = name.match(
    /^Chicken, broilers? or fryers?, (breast|thigh|drumstick|wing),.*?cooked, (\w+)/i,
  );
  if (chickenCut) {
    return `Chicken ${chickenCut[1]}, ${chickenCut[2]}`;
  }

  return name
    .replace(/,\s*broilers? or fryers,/gi, " ")
    .replace(/,\s*meat only,/gi, " ")
    .replace(/,\s*skinless,\s*boneless,/gi, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/,\s*,/g, ",")
    .trim();
}
