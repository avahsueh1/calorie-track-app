import type { DailyCheckIn, LegacyDailyCheckIn, SymptomEntry, SymptomKey, SymptomSeverity } from "../types";
import {
  CHECK_IN_SECTIONS,
  getDefaultSymptomSelection,
  getSymptomCatalogItem,
  getSymptomSelectionLabel,
  isValidSymptomSelection,
  mapSeverityToSelection,
  selectionToMetricScore,
  type SymptomCategory,
} from "./symptomOptions";

export type { SymptomCategory } from "./symptomOptions";
export { CHECK_IN_SECTIONS } from "./symptomOptions";

const SECTION_LABELS: Record<SymptomCategory, string> = {
  physical: "Physical",
  mental: "Mental & Emotional",
  lifestyle: "Energy & Lifestyle",
};

export function getEmptyDailyCheckIn(): DailyCheckIn {
  return { symptoms: {}, notes: "" };
}

function buildSymptomEntry(
  key: SymptomKey,
  selection: string,
  note?: string,
): SymptomEntry | null {
  if (!isValidSymptomSelection(key, selection)) {
    return null;
  }

  const trimmedNote = note?.trim();
  return trimmedNote
    ? { selection, note: trimmedNote }
    : { selection };
}

export function cloneDailyCheckIn(value: DailyCheckIn): DailyCheckIn {
  const symptoms: Partial<Record<SymptomKey, SymptomEntry>> = {};

  for (const [key, entry] of Object.entries(value.symptoms)) {
    if (!entry) {
      continue;
    }
    const symptomKey = key as SymptomKey;
    const cloned = buildSymptomEntry(symptomKey, entry.selection, entry.note);
    if (cloned) {
      symptoms[symptomKey] = cloned;
    }
  }

  return {
    symptoms,
    notes: value.notes ?? "",
  };
}

export function formatSymptomSelection(
  key: SymptomKey,
  selection: string,
): string {
  return getSymptomSelectionLabel(key, selection);
}

function isLegacyDailyCheckIn(value: unknown): value is LegacyDailyCheckIn {
  if (!value || typeof value !== "object") {
    return false;
  }

  return "mood" in value || "energy" in value || "cravings" in value;
}

function scaleToSeverity(scale: number): SymptomSeverity {
  if (scale <= 2) {
    return "mild";
  }
  if (scale === 3) {
    return "moderate";
  }
  return "strong";
}

function legacyLevelToSeverity(
  value: "none" | "mild" | "strong" | undefined,
): SymptomSeverity | null {
  if (!value || value === "none") {
    return null;
  }
  if (value === "mild") {
    return "mild";
  }
  return "strong";
}

function setSymptomFromSeverity(
  symptoms: Partial<Record<SymptomKey, SymptomEntry>>,
  key: SymptomKey,
  severity: SymptomSeverity | null,
) {
  if (severity) {
    symptoms[key] = { selection: mapSeverityToSelection(key, severity) };
  }
}

export function migrateLegacyDailyCheckIn(value: LegacyDailyCheckIn): DailyCheckIn {
  const symptoms: Partial<Record<SymptomKey, SymptomEntry>> = {};

  if (typeof value.energy === "number") {
    setSymptomFromSeverity(symptoms, "energy", scaleToSeverity(value.energy));
  }
  if (typeof value.sleepQuality === "number") {
    setSymptomFromSeverity(
      symptoms,
      "sleepQuality",
      scaleToSeverity(value.sleepQuality),
    );
  }
  if (typeof value.hunger === "number") {
    setSymptomFromSeverity(symptoms, "appetite", scaleToSeverity(value.hunger));
  }
  if (typeof value.stress === "number") {
    setSymptomFromSeverity(symptoms, "stress", scaleToSeverity(value.stress));
  }
  if (typeof value.mood === "number") {
    if (value.mood <= 2) {
      setSymptomFromSeverity(symptoms, "sadness", scaleToSeverity(value.mood));
    } else if (value.mood >= 4) {
      setSymptomFromSeverity(symptoms, "lowMotivation", "mild");
    }
  }

  const cravingsSeverity = legacyLevelToSeverity(value.cravings);
  if (cravingsSeverity === "mild") {
    symptoms.cravings = { selection: "sweet" };
  } else if (cravingsSeverity === "strong") {
    symptoms.cravings = { selection: "carbs" };
  }

  const bloatingSeverity = legacyLevelToSeverity(value.bloating);
  if (bloatingSeverity) {
    setSymptomFromSeverity(symptoms, "bloating", bloatingSeverity);
  }

  if (value.soreness === "mild") {
    symptoms.breastSoreness = { selection: "tender" };
  } else if (value.soreness === "strong") {
    symptoms.breastSoreness = { selection: "very_sore" };
  }

  return {
    symptoms,
    notes: value.notes ?? "",
  };
}

type StoredSymptomEntry = SymptomEntry & { severity?: SymptomSeverity };

function normalizeSymptomEntry(
  key: SymptomKey,
  raw: StoredSymptomEntry,
): SymptomEntry | null {
  let selection = raw.selection;

  if (!selection && raw.severity) {
    selection = mapSeverityToSelection(key, raw.severity);
  }

  if (!selection) {
    return null;
  }

  return buildSymptomEntry(key, selection, raw.note);
}

export function normalizeDailyCheckIn(value: unknown): DailyCheckIn {
  if (!value || typeof value !== "object") {
    return getEmptyDailyCheckIn();
  }

  if (isLegacyDailyCheckIn(value) && !("symptoms" in value)) {
    return migrateLegacyDailyCheckIn(value);
  }

  const record = value as DailyCheckIn;
  const symptoms: Partial<Record<SymptomKey, SymptomEntry>> = {};

  for (const [key, entry] of Object.entries(record.symptoms ?? {})) {
    const symptomKey = key as SymptomKey;
    const normalized = normalizeSymptomEntry(
      symptomKey,
      entry as StoredSymptomEntry,
    );
    if (normalized) {
      symptoms[symptomKey] = normalized;
    }
  }

  return {
    symptoms,
    notes: record.notes ?? "",
  };
}

export function mergeDayCheckIns(
  primary: DailyCheckIn,
  fallback: DailyCheckIn,
): DailyCheckIn {
  return {
    symptoms: { ...fallback.symptoms, ...primary.symptoms },
    notes: primary.notes?.trim() || fallback.notes?.trim() || "",
  };
}

export function countSelectedSymptoms(checkIn: DailyCheckIn): number {
  return Object.keys(checkIn.symptoms).length;
}

export function hasCheckInContent(checkIn: DailyCheckIn): boolean {
  return countSelectedSymptoms(checkIn) > 0 || Boolean(checkIn.notes?.trim());
}

export function areDailyCheckInsEqual(a: DailyCheckIn, b: DailyCheckIn): boolean {
  const aKeys = Object.keys(a.symptoms).sort();
  const bKeys = Object.keys(b.symptoms).sort();

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (const key of aKeys) {
    const symptomKey = key as SymptomKey;
    const aEntry = a.symptoms[symptomKey];
    const bEntry = b.symptoms[symptomKey];
    if (aEntry?.selection !== bEntry?.selection) {
      return false;
    }
    if ((aEntry?.note ?? "") !== (bEntry?.note ?? "")) {
      return false;
    }
  }

  return (a.notes ?? "") === (b.notes ?? "");
}

export function getSymptomLabel(key: SymptomKey): string {
  return getSymptomCatalogItem(key).label;
}

export function getSelectedSymptomsByCategory(checkIn: DailyCheckIn) {
  return CHECK_IN_SECTIONS.map((section) => ({
    category: section.category,
    title: SECTION_LABELS[section.category],
    items: section.items
      .map((item) => {
        const entry = checkIn.symptoms[item.key];
        if (!entry) {
          return null;
        }
        return {
          key: item.key,
          label: item.label,
          selection: entry.selection,
          selectionLabel: getSymptomSelectionLabel(item.key, entry.selection),
          note: entry.note,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null),
  })).filter((section) => section.items.length > 0);
}

export function getDefaultSelectionForSymptom(key: SymptomKey): string {
  return getDefaultSymptomSelection(key);
}

export { selectionToMetricScore };
