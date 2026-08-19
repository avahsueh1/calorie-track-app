/**
 * USDA FoodData Central bulk download URLs.
 * @see https://fdc.nal.usda.gov/download-datasets/
 *
 * File naming pattern: FoodData_Central_{type}_{format}_{date}.zip
 */
export const USDA_RELEASE = "2024-10-31";

export type UsdaDatasetKey =
  | "foundation"
  | "sr-legacy"
  | "fndds"
  | "branded"
  | "full-csv";

export const USDA_DATASETS: Record<
  UsdaDatasetKey,
  {
    label: string;
    url: string;
    unzippedApprox: string;
    notes?: string;
  }
> = {
  foundation: {
    label: "Foundation Foods",
    url: `https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_foundation_food_csv_${USDA_RELEASE}.zip`,
    unzippedApprox: "~26 MB",
    notes: "Best quality data for whole foods and ingredients.",
  },
  "sr-legacy": {
    label: "SR Legacy",
    url: `https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip`,
    unzippedApprox: "~54 MB",
    notes: "Historical reference foods; final release (2018).",
  },
  fndds: {
    label: "FNDDS (Survey Foods)",
    url: `https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_survey_food_csv_${USDA_RELEASE}.zip`,
    unzippedApprox: "~1.6 GB",
    notes: "Foods used in dietary surveys.",
  },
  branded: {
    label: "Branded Foods",
    url: `https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_branded_food_csv_${USDA_RELEASE}.zip`,
    unzippedApprox: "~2.9 GB",
    notes: "Packaged / chain products. Very large.",
  },
  "full-csv": {
    label: "Full download (all types, CSV)",
    url: `https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_csv_${USDA_RELEASE}.zip`,
    unzippedApprox: "~3.1 GB",
    notes: "Single archive with all CSV tables.",
  },
};

/** Nutrient IDs in USDA food_nutrient.csv */
export const NUTRIENT = {
  ENERGY_KCAL: 1008,
  PROTEIN: 1003,
  CARBS: 1005,
  FAT: 1004,
  FIBER: 1079,
} as const;

export const DATA_TYPE_MAP: Record<UsdaDatasetKey, string | null> = {
  foundation: "foundation_food",
  "sr-legacy": "sr_legacy_food",
  fndds: "survey_fndds_food",
  branded: "branded_food",
  "full-csv": null,
};

export const ALL_IMPORTABLE_DATASETS: UsdaDatasetKey[] = [
  "foundation",
  "sr-legacy",
  "fndds",
  "branded",
];
