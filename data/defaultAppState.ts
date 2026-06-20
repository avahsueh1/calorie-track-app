import { getDefaultAppProfile } from "./defaultProfile";
import {
  getDefaultDailyActivities,
  getDefaultDailyCheckIn,
  getDefaultDailyFoods,
} from "./sampleDashboard";
import type { DailyCheckIn } from "../types";
import type { AppProfile } from "../types/profile";
import type {
  DailyActivityEntry,
  DailyFoodEntry,
  MealType,
} from "../types/wellness";
import {
  APP_STATE_VERSION,
  applyCycleSettingsToProfile,
  extractCycleSettings,
  loadLegacyStorageSnapshot,
  todayDateKey,
  type AppState,
} from "../lib/appStateHelpers";

type StoredFoodEntry = DailyFoodEntry & { mealType?: MealType };

function normalizeProfile(value: AppProfile): AppProfile {
  const defaults = getDefaultAppProfile();
  return {
    ...value,
    age: Number(value.age) || defaults.age,
    heightCm: Number(value.heightCm) || defaults.heightCm,
    weightKg: Number(value.weightKg) || defaults.weightKg,
    averageCycleLength:
      Number(value.averageCycleLength) || defaults.averageCycleLength,
    averagePeriodLength:
      Number(value.averagePeriodLength) || defaults.averagePeriodLength,
  };
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

function normalizeCheckIn(value: DailyCheckIn): DailyCheckIn {
  return {
    ...value,
    notes: value.notes ?? "",
  };
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

export function getDefaultAppState(): AppState {
  const profile = getDefaultAppProfile();
  const today = todayDateKey();

  return {
    version: APP_STATE_VERSION,
    profile,
    foodLogs: {
      [today]: getDefaultDailyFoods(),
    },
    activityLogs: {
      [today]: getDefaultDailyActivities(),
    },
    dailyCheckIns: {
      [today]: getDefaultDailyCheckIn(),
    },
    weightLogs: [],
    cycleSettings: extractCycleSettings(profile),
  };
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
  const cycleSettings = {
    ...defaults.cycleSettings,
    ...(raw.cycleSettings ?? {}),
  };

  return {
    version: APP_STATE_VERSION,
    profile: applyCycleSettingsToProfile(profile, cycleSettings),
    foodLogs: normalizeFoodLogs(raw.foodLogs ?? defaults.foodLogs),
    activityLogs: normalizeActivityLogs(raw.activityLogs ?? defaults.activityLogs),
    dailyCheckIns: normalizeCheckIns(raw.dailyCheckIns ?? defaults.dailyCheckIns),
    weightLogs: raw.weightLogs ?? defaults.weightLogs,
    cycleSettings,
  };
}

export function loadAppStateFromStorage(): AppState {
  if (typeof window === "undefined") {
    return getDefaultAppState();
  }

  try {
    const raw = localStorage.getItem("calorie-track-app:app-state");
    if (raw) {
      return normalizeAppState(JSON.parse(raw) as Partial<AppState>);
    }
  } catch {
    // fall through to legacy migration
  }

  const legacy = loadLegacyStorageSnapshot();
  if (legacy) {
    return normalizeAppState({
      ...getDefaultAppState(),
      profile: legacy.profile,
      foodLogs: legacy.foodLogs,
      activityLogs: legacy.activityLogs,
      dailyCheckIns: legacy.dailyCheckIns,
    });
  }

  return getDefaultAppState();
}

export function saveAppStateToStorage(state: AppState): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    "calorie-track-app:app-state",
    JSON.stringify(normalizeAppState(state)),
  );
}
