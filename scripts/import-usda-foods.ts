#!/usr/bin/env npx tsx
/**
 * Download USDA FoodData Central datasets and import into Supabase `foods`.
 *
 * Usage:
 *   npm run usda:import                              # Foundation + SR Legacy (~8k foods)
 *   npm run usda:import -- --all                     # All datasets (~600k+ foods, ~3GB)
 *   npm run usda:import -- --datasets branded        # Branded only
 *   npm run usda:import -- --download-only --all     # Just download zips
 *   npm run usda:import -- --limit 100 --dry-run     # Preview first 100 rows
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (Project Settings → API → service_role)
 *
 * Also run supabase/migrations/002_foods_usda_columns.sql first.
 */

import { createClient } from "@supabase/supabase-js";
import { join } from "node:path";
import {
  ALL_IMPORTABLE_DATASETS,
  DATA_TYPE_MAP,
  NUTRIENT,
  USDA_DATASETS,
  type UsdaDatasetKey,
} from "./usda/config";
import {
  cleanDir,
  downloadFile,
  ensureDir,
  extractZip,
  findCsvFile,
  loadEnvLocal,
  parseArgs,
  readCsv,
} from "./usda/utils";

const ROOT = join(process.cwd(), "data", "usda");
const RAW_DIR = join(ROOT, "raw");
const EXTRACT_DIR = join(ROOT, "extracted");

interface FoodInsertRow {
  fdc_id: number;
  name: string;
  calories_per_serving: number;
  serving_unit: string;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  data_type: string;
  brand_owner: string | null;
  serving_size_g: number | null;
  created_by: null;
}

type NutrientMap = Map<
  number,
  Partial<Record<keyof typeof NUTRIENT, number>>
>;

function num(value: string | undefined): number | null {
  if (value === undefined || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function buildNutrientMap(foodNutrientRows: Record<string, string>[]): NutrientMap {
  const map: NutrientMap = new Map();
  const idByKey = {
    ENERGY_KCAL: NUTRIENT.ENERGY_KCAL,
    PROTEIN: NUTRIENT.PROTEIN,
    CARBS: NUTRIENT.CARBS,
    FAT: NUTRIENT.FAT,
    FIBER: NUTRIENT.FIBER,
  } as const;

  for (const row of foodNutrientRows) {
    const fdcId = Number(row.fdc_id);
    const nutrientId = Number(row.nutrient_id);
    const amount = num(row.amount);
    if (!fdcId || amount === null) {
      continue;
    }

    let nutrients = map.get(fdcId);
    if (!nutrients) {
      nutrients = {};
      map.set(fdcId, nutrients);
    }

    for (const [key, id] of Object.entries(idByKey)) {
      if (nutrientId === id) {
        nutrients[key as keyof typeof NUTRIENT] = amount;
      }
    }
  }

  return map;
}

function buildBrandedMeta(
  brandedRows: Record<string, string>[],
): Map<number, { brandOwner: string | null; servingUnit: string; servingSizeG: number | null }> {
  const map = new Map<
    number,
    { brandOwner: string | null; servingUnit: string; servingSizeG: number | null }
  >();

  for (const row of brandedRows) {
    const fdcId = Number(row.fdc_id);
    if (!fdcId) {
      continue;
    }

    const servingSize = num(row.serving_size);
    const servingUnitRaw = row.serving_size_unit?.trim() || "g";
    const household = row.household_serving_fulltext?.trim();
    const servingUnit =
      household ||
      (servingSize ? `${servingSize} ${servingUnitRaw}` : "1 serving");

    map.set(fdcId, {
      brandOwner: row.brand_owner?.trim() || null,
      servingUnit,
      servingSizeG: servingUnitRaw.toLowerCase() === "g" ? servingSize : null,
    });
  }

  return map;
}

function scalePerServing(
  per100g: number | undefined,
  servingSizeG: number | null,
): number | null {
  if (per100g === undefined) {
    return null;
  }
  if (!servingSizeG || servingSizeG <= 0) {
    return round1(per100g);
  }
  return round1((per100g / 100) * servingSizeG);
}

function foodRowToInsert(
  food: Record<string, string>,
  nutrients: NutrientMap,
  brandedMeta: Map<
    number,
    { brandOwner: string | null; servingUnit: string; servingSizeG: number | null }
  >,
): FoodInsertRow | null {
  const fdcId = Number(food.fdc_id);
  const name = food.description?.trim();
  const dataType = food.data_type?.trim();
  if (!fdcId || !name || !dataType) {
    return null;
  }

  const nutrient = nutrients.get(fdcId) ?? {};
  const caloriesPer100g = nutrient.ENERGY_KCAL;
  if (caloriesPer100g === undefined || caloriesPer100g <= 0) {
    return null;
  }

  const branded = brandedMeta.get(fdcId);
  const isBranded = dataType === "branded_food";
  const servingSizeG = isBranded ? (branded?.servingSizeG ?? null) : 100;
  const servingUnit = isBranded
    ? (branded?.servingUnit ?? "1 serving")
    : "100g";

  const calories = isBranded
    ? (scalePerServing(caloriesPer100g, servingSizeG) ?? round1(caloriesPer100g))
    : round1(caloriesPer100g);

  const protein = isBranded
    ? scalePerServing(nutrient.PROTEIN, servingSizeG)
    : round1(nutrient.PROTEIN ?? 0);
  const carbs = isBranded
    ? scalePerServing(nutrient.CARBS, servingSizeG)
    : round1(nutrient.CARBS ?? 0);
  const fat = isBranded
    ? scalePerServing(nutrient.FAT, servingSizeG)
    : round1(nutrient.FAT ?? 0);
  const fiber = isBranded
    ? scalePerServing(nutrient.FIBER, servingSizeG)
    : nutrient.FIBER !== undefined
      ? round1(nutrient.FIBER)
      : null;

  const displayName =
    isBranded && branded?.brandOwner
      ? `${name} (${branded.brandOwner})`
      : name;

  return {
    fdc_id: fdcId,
    name: displayName.slice(0, 500),
    calories_per_serving: calories,
    serving_unit: servingUnit.slice(0, 200),
    protein_g: protein,
    carbs_g: carbs,
    fat_g: fat,
    fiber_g: fiber,
    data_type: dataType,
    brand_owner: branded?.brandOwner ?? null,
    serving_size_g: servingSizeG,
    created_by: null,
  };
}

async function importDataset(
  datasetKey: UsdaDatasetKey,
  limit: number,
): Promise<FoodInsertRow[]> {
  const config = USDA_DATASETS[datasetKey];
  const extractPath = join(EXTRACT_DIR, datasetKey);
  const zipPath = join(RAW_DIR, `${datasetKey}.zip`);

  await downloadFile(config.url, zipPath);
  extractZip(zipPath, extractPath);

  const foodCsv = readCsv(findCsvFile(extractPath, "food.csv"));
  const nutrientCsv = readCsv(findCsvFile(extractPath, "food_nutrient.csv"));
  const nutrientMap = buildNutrientMap(nutrientCsv);

  let brandedMeta = new Map<
    number,
    { brandOwner: string | null; servingUnit: string; servingSizeG: number | null }
  >();

  if (datasetKey === "branded") {
    try {
      const brandedCsv = readCsv(findCsvFile(extractPath, "branded_food.csv"));
      brandedMeta = buildBrandedMeta(brandedCsv);
    } catch {
      console.warn("branded_food.csv not found; using generic serving labels.");
    }
  }

  const expectedType = DATA_TYPE_MAP[datasetKey];
  const rows: FoodInsertRow[] = [];

  for (const food of foodCsv) {
    if (expectedType && food.data_type !== expectedType) {
      continue;
    }

    const insert = foodRowToInsert(food, nutrientMap, brandedMeta);
    if (!insert) {
      continue;
    }

    rows.push(insert);
    if (limit > 0 && rows.length >= limit) {
      break;
    }
  }

  console.log(`Parsed ${rows.length} foods from ${config.label}`);
  return rows;
}

async function upsertFoods(rows: FoodInsertRow[], dryRun: boolean) {
  if (rows.length === 0) {
    return;
  }

  if (dryRun) {
    console.log("Dry run — first 5 rows:");
    console.log(JSON.stringify(rows.slice(0, 5), null, 2));
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
    );
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Replace prior USDA imports so re-runs stay idempotent.
  const { error: deleteError } = await supabase
    .from("foods")
    .delete()
    .not("fdc_id", "is", null);

  if (deleteError) {
    throw new Error(`Could not clear prior USDA foods: ${deleteError.message}`);
  }

  const batchSize = 500;
  let inserted = 0;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase.from("foods").insert(batch);

    if (error) {
      throw new Error(`Supabase upsert failed: ${error.message}`);
    }

    inserted += batch.length;
    process.stdout.write(`\rImported ${inserted}/${rows.length} foods...`);
  }

  process.stdout.write("\n");
}

function resolveDatasetKeys(requested: string[]): UsdaDatasetKey[] {
  const keys: UsdaDatasetKey[] = [];
  for (const value of requested) {
    const normalized = value.toLowerCase() as UsdaDatasetKey;
    if (!ALL_IMPORTABLE_DATASETS.includes(normalized)) {
      throw new Error(
        `Unknown dataset "${value}". Use: ${ALL_IMPORTABLE_DATASETS.join(", ")}`,
      );
    }
    keys.push(normalized);
  }
  return keys;
}

async function main() {
  loadEnvLocal();
  const options = parseArgs(process.argv.slice(2));

  if (options.clean) {
    cleanDir(ROOT);
  }

  ensureDir(RAW_DIR);
  ensureDir(EXTRACT_DIR);

  const datasetKeys = resolveDatasetKeys(options.datasets);

  if (datasetKeys.includes("branded") || datasetKeys.includes("fndds")) {
    console.warn(
      "\n⚠ Large dataset selected. Branded (~3GB) and FNDDS (~1.6GB) may exceed Supabase free-tier storage.",
    );
    console.warn("  Consider --limit 5000 for testing, or upgrade your Supabase plan.\n");
  }

  if (options.downloadOnly) {
    for (const key of datasetKeys) {
      const zipPath = join(RAW_DIR, `${key}.zip`);
      await downloadFile(USDA_DATASETS[key].url, zipPath);
      extractZip(zipPath, join(EXTRACT_DIR, key));
    }
    console.log(`\nDownloads ready in ${ROOT}`);
    return;
  }

  const allRows: FoodInsertRow[] = [];
  const seenFdc = new Set<number>();

  for (const key of datasetKeys) {
    const rows = await importDataset(key, options.limit);
    for (const row of rows) {
      if (seenFdc.has(row.fdc_id)) {
        continue;
      }
      seenFdc.add(row.fdc_id);
      allRows.push(row);
      if (options.limit > 0 && allRows.length >= options.limit) {
        break;
      }
    }
    if (options.limit > 0 && allRows.length >= options.limit) {
      break;
    }
  }

  console.log(`\nTotal unique foods to import: ${allRows.length}`);
  await upsertFoods(allRows, options.dryRun);
  console.log("Done.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
