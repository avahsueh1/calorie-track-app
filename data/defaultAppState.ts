import { getDefaultAppProfile } from "./defaultProfile";
import { ensureNutritionPlan } from "../lib/nutritionPlan";
import { getDefaultTrackingPreferences, normalizeTrackingPreferences } from "../lib/trackingPreferences";
import { sanitizeAppProfile } from "../lib/profileBody";
import {
  getDefaultDailyActivities,
  getDefaultDailyFoods,
} from "./sampleDashboard";
import { normalizeDailyCheckIn } from "../lib/checkInHelpers";
import { mergeLegacyInsightsNotesIntoCheckIns } from "../lib/dayNotes";
import {
  migrateLegacyProgressData,
  normalizeProgressJournal,
} from "../lib/progressJournal";
import type { DailyCheckIn } from "../types";
import type { AppProfile } from "../types/profile";
import type {
  DailyActivityEntry,
  DailyFoodEntry,
  MealType,
  PeriodFlow,
  PeriodLog,
  ProgressPhoto,
  WeightLogEntry,
} from "../types/wellness";
import {
  APP_STATE_STORAGE_KEY,
  APP_STATE_VERSION,
  applyCycleSettingsToProfile,
  buildCycleSettingsFromPeriodLogs,
  coalescePeriodLogs,
  extractCycleSettings,
  loadLegacyStorageSnapshot,
  normalizeCycleSettings,
  todayDateKey,
  type AppState,
} from "../lib/appStateHelpers";

/** Blobs saved before `version` was written to localStorage. */
const LEGACY_APP_STATE_VERSION = 0;

function readStoredVersion(raw: Partial<AppState> | null | undefined): number {
  if (!raw || typeof raw.version !== "number" || Number.isNaN(raw.version)) {
    return LEGACY_APP_STATE_VERSION;
  }

  return raw.version;
}

/**
 * Apply incremental migrations for a saved version before normalize fills defaults.
 * Add a branch here when bumping APP_STATE_VERSION.
 */
function migrateAppStateToCurrent(
  raw: Partial<AppState>,
  savedVersion: number,
): Partial<AppState> {
  let migrated: Partial<AppState> = { ...raw };

  if (savedVersion < 1) {
    // Legacy unified blob (no version field): preserve all present fields;
    // normalizeAppState supplies trackingPreferences, cycleSettings, etc.
  }

  if (savedVersion < 3) {
    const legacy = migrated as LegacyAppStateBlob;
    migrated = {
      ...migrated,
      progressJournal: {
        ...migrateLegacyProgressData(
          legacy.weightLogs ?? [],
          legacy.progressPhotos ?? [],
        ),
        ...normalizeProgressJournal(legacy.progressJournal),
      },
    };
  }

  return migrated;
}

type LegacyAppStateBlob = Partial<AppState> & {
  weightLogs?: WeightLogEntry[];
  progressPhotos?: ProgressPhoto[];
  progressJournal?: Partial<AppState>["progressJournal"];
};

type StoredFoodEntry = DailyFoodEntry & { mealType?: MealType };

function normalizeProfile(value: AppProfile): AppProfile {
  const defaults = getDefaultAppProfile();
  return ensureNutritionPlan(
    sanitizeAppProfile({
      ...value,
      age: Number(value.age) || defaults.age,
      heightCm: Number(value.heightCm) || defaults.heightCm,
      weightKg: Number(value.weightKg) || defaults.weightKg,
      averageCycleLength:
        Number(value.averageCycleLength) || defaults.averageCycleLength,
      averagePeriodLength:
        Number(value.averagePeriodLength) || defaults.averagePeriodLength,
      goalRate: value.goalRate ?? defaults.goalRate,
      nutritionPlan: value.nutritionPlan ?? defaults.nutritionPlan,
    }),
  );
}

function normalizeFoodEntry(raw: StoredFoodEntry): DailyFoodEntry {
  return {
    id: raw.id,
    name: raw.name ?? "",
    meal: raw.meal ?? raw.mealType ?? "Snack",
    calories: Number(raw.calories) || 0,
    protein: Number(raw.protein) || 0,
    carbs: Number(raw.carbs) || 0,
    fat: Number(raw.fat) || 0,
  };
}

function normalizeActivityEntry(raw: DailyActivityEntry): DailyActivityEntry {
  return {
    id: raw.id,
    name: raw.name ?? "",
    durationMinutes: Number(raw.durationMinutes) || 0,
    caloriesBurned: Number(raw.caloriesBurned) || 0,
    intensity: raw.intensity ?? "Moderate",
  };
}

function normalizeCheckIn(value: unknown): DailyCheckIn {
  return normalizeDailyCheckIn(value);
}

function normalizeFoodLogs(
  foodLogs: Record<string, StoredFoodEntry[]>,
): Record<string, DailyFoodEntry[]> {
  return Object.fromEntries(
    Object.entries(foodLogs).map(([dateKey, foods]) => [
      dateKey,
      (foods ?? []).map(normalizeFoodEntry),
    ]),
  );
}

function normalizeActivityLogs(
  activityLogs: Record<string, DailyActivityEntry[]>,
): Record<string, DailyActivityEntry[]> {
  return Object.fromEntries(
    Object.entries(activityLogs).map(([dateKey, activities]) => [
      dateKey,
      (activities ?? []).map(normalizeActivityEntry),
    ]),
  );
}

function normalizeCheckIns(
  dailyCheckIns: Record<string, DailyCheckIn>,
): Record<string, DailyCheckIn> {
  return Object.fromEntries(
    Object.entries(dailyCheckIns).map(([dateKey, checkIn]) => [
      dateKey,
      normalizeCheckIn(checkIn),
    ]),
  );
}

function normalizePeriodLog(raw: PeriodLog): PeriodLog {
  const flow: PeriodFlow | undefined =
    raw.flow === "light" || raw.flow === "medium" || raw.flow === "heavy"
      ? raw.flow
      : undefined;

  return {
    id: raw.id,
    startDate: raw.startDate,
    endDate: raw.endDate,
    flow,
  };
}

function normalizePeriodLogs(periodLogs: PeriodLog[]): PeriodLog[] {
  return coalescePeriodLogs(
    (periodLogs ?? [])
      .map(normalizePeriodLog)
      .filter((log) => Boolean(log.startDate)),
  );
}

export function getDefaultAppState(): AppState {
  const profile = getDefaultAppProfile();
  const today = todayDateKey();

  return {
    version: APP_STATE_VERSION,
    profile,
    trackingPreferences: getDefaultTrackingPreferences(),
    foodLogs: {
      [today]: getDefaultDailyFoods(),
    },
    activityLogs: {
      [today]: getDefaultDailyActivities(),
    },
    dailyCheckIns: {},
    progressJournal: {},
    periodLogs: [],
    cycleSettings: extractCycleSettings(profile),
    insightsDayNotes: {},
  };
}

function migrateCheckInNotesToInsightsDayNotes(
  dailyCheckIns: Record<string, DailyCheckIn>,
  insightsDayNotes: Record<string, string>,
): Record<string, string> {
  const merged = { ...insightsDayNotes };

  for (const [dateKey, checkIn] of Object.entries(dailyCheckIns)) {
    const note = checkIn.notes?.trim();
    if (note) {
      merged[dateKey] = note;
    }
  }

  return merged;
}

export function normalizeAppState(raw: Partial<AppState> | null | undefined): AppState {
  const defaults = getDefaultAppState();
  if (!raw) {
    return defaults;
  }

  const profile = normalizeProfile({
    ...defaults.profile,
    ...(raw.profile ?? {}),
  });
  const trackingPreferences = normalizeTrackingPreferences(
    raw.trackingPreferences,
    profile,
  );
  const periodLogs = normalizePeriodLogs(raw.periodLogs ?? defaults.periodLogs);
  const profileCycleSettings = normalizeCycleSettings(
    extractCycleSettings(profile),
  );
  const cycleSettings = buildCycleSettingsFromPeriodLogs(
    {
      ...profileCycleSettings,
      ...(raw.cycleSettings ?? {}),
      cycleTrackingEnabled: trackingPreferences.cycleTrackingEnabled,
    },
    periodLogs,
  );
  const normalizedCheckIns = normalizeCheckIns(raw.dailyCheckIns ?? defaults.dailyCheckIns);
  const legacyInsightsNotes =
    raw.insightsDayNotes ?? defaults.insightsDayNotes;
  const dailyCheckIns = mergeLegacyInsightsNotesIntoCheckIns(
    normalizedCheckIns,
    legacyInsightsNotes,
  );
  const insightsDayNotes = migrateCheckInNotesToInsightsDayNotes(
    dailyCheckIns,
    legacyInsightsNotes,
  );

  const legacyRaw = raw as LegacyAppStateBlob;
  const progressJournal = normalizeProgressJournal(
    legacyRaw.progressJournal ??
      migrateLegacyProgressData(
        legacyRaw.weightLogs ?? [],
        legacyRaw.progressPhotos ?? [],
      ),
  );

  return {
    version: APP_STATE_VERSION,
    profile: applyCycleSettingsToProfile(profile, cycleSettings),
    trackingPreferences,
    foodLogs: normalizeFoodLogs(raw.foodLogs ?? defaults.foodLogs),
    activityLogs: normalizeActivityLogs(raw.activityLogs ?? defaults.activityLogs),
    dailyCheckIns,
    progressJournal,
    periodLogs,
    cycleSettings,
    insightsDayNotes,
  };
}

export function loadAppStateFromStorage(): AppState {
  if (typeof window === "undefined") {
    return getDefaultAppState();
  }

  try {
    const raw = localStorage.getItem(APP_STATE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      const savedVersion = readStoredVersion(parsed);
      const migrated = migrateAppStateToCurrent(parsed, savedVersion);
      return normalizeAppState(migrated);
    }
  } catch {
    // fall through to legacy migration
  }

  const legacy = loadLegacyStorageSnapshot();
  if (legacy) {
    return normalizeAppState(
      migrateAppStateToCurrent(
        {
          ...getDefaultAppState(),
          profile: legacy.profile,
          foodLogs: legacy.foodLogs,
          activityLogs: legacy.activityLogs,
          dailyCheckIns: legacy.dailyCheckIns,
        },
        LEGACY_APP_STATE_VERSION,
      ),
    );
  }

  return getDefaultAppState();
}

export function saveAppStateToStorage(state: AppState): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeAppState(state);

  localStorage.setItem(
    APP_STATE_STORAGE_KEY,
    JSON.stringify({
      ...normalized,
      version: APP_STATE_VERSION,
    }),
  );
}
