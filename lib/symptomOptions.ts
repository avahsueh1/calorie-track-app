import type { SymptomKey, SymptomSeverity } from "../types";

export interface SymptomOption {
  value: string;
  label: string;
}

export interface SymptomCatalogItem {
  key: SymptomKey;
  label: string;
  options: SymptomOption[];
}

export type SymptomCategory = "physical" | "mental" | "lifestyle";

export const CHECK_IN_SECTIONS: {
  category: SymptomCategory;
  title: string;
  items: SymptomCatalogItem[];
}[] = [
  {
    category: "physical",
    title: "Physical Symptoms",
    items: [
      {
        key: "bloating",
        label: "Bloating",
        options: [
          { value: "light", label: "Light" },
          { value: "moderate", label: "Moderate" },
          { value: "heavy", label: "Heavy" },
        ],
      },
      {
        key: "cramps",
        label: "Cramps",
        options: [
          { value: "mild", label: "Mild" },
          { value: "moderate", label: "Moderate" },
          { value: "strong", label: "Strong" },
        ],
      },
      {
        key: "breastSoreness",
        label: "Breast soreness",
        options: [
          { value: "tender", label: "Tender" },
          { value: "sore", label: "Sore" },
          { value: "very_sore", label: "Very sore" },
        ],
      },
      {
        key: "headache",
        label: "Headache",
        options: [
          { value: "mild", label: "Mild" },
          { value: "moderate", label: "Moderate" },
          { value: "severe", label: "Severe" },
        ],
      },
      {
        key: "acne",
        label: "Acne",
        options: [
          { value: "few_spots", label: "Few spots" },
          { value: "moderate", label: "Moderate" },
          { value: "breakout", label: "Breakout" },
        ],
      },
      {
        key: "backPain",
        label: "Back pain",
        options: [
          { value: "lower", label: "Lower back" },
          { value: "upper", label: "Upper back" },
          { value: "full", label: "Full back" },
        ],
      },
      {
        key: "nausea",
        label: "Nausea",
        options: [
          { value: "mild", label: "Mild" },
          { value: "moderate", label: "Moderate" },
          { value: "strong", label: "Strong" },
        ],
      },
      {
        key: "discharge",
        label: "Discharge",
        options: [
          { value: "clear", label: "Clear" },
          { value: "white", label: "White" },
          { value: "yellow", label: "Yellow" },
          { value: "brown", label: "Brown" },
          { value: "pink", label: "Pink" },
        ],
      },
      {
        key: "fatigue",
        label: "Fatigue",
        options: [
          { value: "mild", label: "Mild" },
          { value: "moderate", label: "Moderate" },
          { value: "exhausted", label: "Exhausted" },
        ],
      },
    ],
  },
  {
    category: "mental",
    title: "Mental & Emotional Check-In",
    items: [
      {
        key: "anxiety",
        label: "Anxiety",
        options: [
          { value: "mild", label: "Mild" },
          { value: "moderate", label: "Moderate" },
          { value: "strong", label: "Strong" },
        ],
      },
      {
        key: "stress",
        label: "Stress",
        options: [
          { value: "mild", label: "Mild" },
          { value: "moderate", label: "Moderate" },
          { value: "overwhelming", label: "Overwhelming" },
        ],
      },
      {
        key: "sadness",
        label: "Sadness",
        options: [
          { value: "mild", label: "Mild" },
          { value: "moderate", label: "Moderate" },
          { value: "deep", label: "Deep" },
        ],
      },
      {
        key: "depression",
        label: "Depression",
        options: [
          { value: "mild", label: "Mild" },
          { value: "moderate", label: "Moderate" },
          { value: "strong", label: "Strong" },
        ],
      },
      {
        key: "irritability",
        label: "Irritability",
        options: [
          { value: "mild", label: "Mild" },
          { value: "moderate", label: "Moderate" },
          { value: "strong", label: "Strong" },
        ],
      },
      {
        key: "moodSwings",
        label: "Mood swings",
        options: [
          { value: "subtle", label: "Subtle" },
          { value: "noticeable", label: "Noticeable" },
          { value: "intense", label: "Intense" },
        ],
      },
      {
        key: "lowMotivation",
        label: "Low motivation",
        options: [
          { value: "mild", label: "Mild" },
          { value: "moderate", label: "Moderate" },
          { value: "strong", label: "Strong" },
        ],
      },
      {
        key: "brainFog",
        label: "Brain fog",
        options: [
          { value: "mild", label: "Mild" },
          { value: "moderate", label: "Moderate" },
          { value: "heavy", label: "Heavy" },
        ],
      },
    ],
  },
  {
    category: "lifestyle",
    title: "Energy & Lifestyle",
    items: [
      {
        key: "energy",
        label: "Energy level",
        options: [
          { value: "low", label: "Low" },
          { value: "steady", label: "Steady" },
          { value: "high", label: "High" },
        ],
      },
      {
        key: "sleepQuality",
        label: "Sleep quality",
        options: [
          { value: "poor", label: "Poor" },
          { value: "fair", label: "Fair" },
          { value: "restful", label: "Restful" },
        ],
      },
      {
        key: "appetite",
        label: "Appetite",
        options: [
          { value: "low", label: "Low" },
          { value: "normal", label: "Normal" },
          { value: "high", label: "High" },
        ],
      },
      {
        key: "exercise",
        label: "Exercise",
        options: [
          { value: "none", label: "None" },
          { value: "light", label: "Light" },
          { value: "moderate", label: "Moderate" },
          { value: "intense", label: "Intense" },
        ],
      },
      {
        key: "cravings",
        label: "Cravings",
        options: [
          { value: "none", label: "None" },
          { value: "sweet", label: "Sweet" },
          { value: "salty", label: "Salty" },
          { value: "carbs", label: "Carbs" },
        ],
      },
      {
        key: "hydration",
        label: "Hydration",
        options: [
          { value: "low", label: "Low" },
          { value: "okay", label: "Okay" },
          { value: "good", label: "Well hydrated" },
        ],
      },
    ],
  },
];

const catalogByKey = new Map<SymptomKey, SymptomCatalogItem>(
  CHECK_IN_SECTIONS.flatMap((section) => section.items).map((item) => [item.key, item]),
);

export function getSymptomCatalogItem(key: SymptomKey): SymptomCatalogItem {
  const item = catalogByKey.get(key);
  if (!item) {
    throw new Error(`Unknown symptom key: ${key}`);
  }
  return item;
}

export function getSymptomOptions(key: SymptomKey): SymptomOption[] {
  return getSymptomCatalogItem(key).options;
}

export function getDefaultSymptomSelection(key: SymptomKey): string {
  return getSymptomOptions(key)[0].value;
}

export function getSymptomSelectionLabel(
  key: SymptomKey,
  selection: string,
): string {
  const match = getSymptomOptions(key).find((option) => option.value === selection);
  return match?.label ?? selection;
}

export function isValidSymptomSelection(
  key: SymptomKey,
  selection: string,
): boolean {
  return getSymptomOptions(key).some((option) => option.value === selection);
}

export function mapSeverityToSelection(
  key: SymptomKey,
  severity: SymptomSeverity,
): string {
  const options = getSymptomOptions(key);
  const index = severity === "mild" ? 0 : severity === "moderate" ? 1 : 2;
  return options[Math.min(index, options.length - 1)].value;
}

export function optionGridColumns(optionCount: number): string {
  if (optionCount <= 2) {
    return "repeat(2, minmax(0, 1fr))";
  }
  if (optionCount === 3) {
    return "repeat(3, minmax(0, 1fr))";
  }
  return "repeat(2, minmax(0, 1fr))";
}

const LIFESTYLE_SYMPTOM_KEYS = new Set<SymptomKey>([
  "energy",
  "sleepQuality",
  "appetite",
  "exercise",
  "hydration",
]);

const POSITIVE_SYMPTOM_KEYS = new Set<SymptomKey>(["discharge"]);

export function isLifestyleSymptomKey(key: SymptomKey): boolean {
  return LIFESTYLE_SYMPTOM_KEYS.has(key);
}

export function getSymptomSentiment(
  key: SymptomKey,
): "positive" | "negative" {
  if (POSITIVE_SYMPTOM_KEYS.has(key)) {
    return "positive";
  }
  return "negative";
}

export function selectionToMetricScore(
  key: SymptomKey,
  selection: string,
): number | null {
  const options = getSymptomOptions(key);
  const index = options.findIndex((option) => option.value === selection);
  if (index < 0) {
    return null;
  }
  if (options.length === 1) {
    return 3;
  }
  const normalized = index / (options.length - 1);
  return Math.round((2 + normalized * 2) * 10) / 10;
}

export function selectionToStatusTone(selection: string): "mild" | "moderate" | "strong" | "neutral" {
  const normalized = selection.toLowerCase();
  if (
    ["mild", "light", "low", "few_spots", "tender", "subtle", "none", "clear", "okay", "fair", "poor", "steady", "normal"].includes(
      normalized,
    )
  ) {
    return "mild";
  }
  if (
    ["strong", "severe", "heavy", "exhausted", "overwhelming", "deep", "intense", "very_sore", "breakout", "high", "restful", "good", "intense"].includes(
      normalized,
    )
  ) {
    return "strong";
  }
  return "moderate";
}
