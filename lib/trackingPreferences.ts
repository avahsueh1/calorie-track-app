import type { AppProfile } from "../types/profile";
import type { AppState } from "./appStateHelpers";

export type LogTab =
  | "food"
  | "activity"
  | "check-in"
  | "progress-journal"
  | "cycle-journal";

export interface TrackingPreferences {
  cycleTrackingEnabled: boolean;
  calorieTrackingEnabled: boolean;
}

export type TrackingPreset =
  | "cycle_only"
  | "cycle_and_nutrition"
  | "nutrition_only"
  | "not_sure";

export const TRACKING_PRESET_OPTIONS: {
  id: TrackingPreset;
  label: string;
  description: string;
}[] = [
  {
    id: "cycle_and_nutrition",
    label: "Cycle + nutrition",
    description: "Track your cycle, food, and calorie goals together.",
  },
  {
    id: "cycle_only",
    label: "Cycle only",
    description: "Focus on cycle, symptoms, and wellness without calorie targets.",
  },
  {
    id: "nutrition_only",
    label: "Nutrition only",
    description: "Track food, calories, and macros without cycle context.",
  },
  {
    id: "not_sure",
    label: "Not sure yet",
    description: "Start with cycle tracking. Add nutrition anytime in Profile.",
  },
];

export function getDefaultTrackingPreferences(): TrackingPreferences {
  return {
    cycleTrackingEnabled: true,
    calorieTrackingEnabled: true,
  };
}

export function normalizeTrackingPreferences(
  raw: Partial<TrackingPreferences> | null | undefined,
  profile?: AppProfile,
): TrackingPreferences {
  if (
    raw &&
    typeof raw.cycleTrackingEnabled === "boolean" &&
    typeof raw.calorieTrackingEnabled === "boolean"
  ) {
    return {
      cycleTrackingEnabled: raw.cycleTrackingEnabled,
      calorieTrackingEnabled: raw.calorieTrackingEnabled,
    };
  }

  return {
    cycleTrackingEnabled: profile?.cycleTrackingEnabled ?? true,
    calorieTrackingEnabled: true,
  };
}

export function preferencesFromPreset(
  preset: TrackingPreset,
): TrackingPreferences {
  switch (preset) {
    case "cycle_only":
      return { cycleTrackingEnabled: true, calorieTrackingEnabled: false };
    case "cycle_and_nutrition":
      return { cycleTrackingEnabled: true, calorieTrackingEnabled: true };
    case "nutrition_only":
      return { cycleTrackingEnabled: false, calorieTrackingEnabled: true };
    case "not_sure":
      return { cycleTrackingEnabled: true, calorieTrackingEnabled: false };
  }
}

export function trackingPresetFromPreferences(
  preferences: TrackingPreferences,
): TrackingPreset {
  if (preferences.cycleTrackingEnabled && preferences.calorieTrackingEnabled) {
    return "cycle_and_nutrition";
  }
  if (preferences.cycleTrackingEnabled && !preferences.calorieTrackingEnabled) {
    return "cycle_only";
  }
  if (!preferences.cycleTrackingEnabled && preferences.calorieTrackingEnabled) {
    return "nutrition_only";
  }
  return "not_sure";
}

export function isCalorieTrackingEnabled(
  state: Pick<AppState, "trackingPreferences">,
): boolean {
  return state.trackingPreferences.calorieTrackingEnabled;
}

export function isCycleTrackingEnabled(
  state: Pick<AppState, "trackingPreferences">,
): boolean {
  return state.trackingPreferences.cycleTrackingEnabled;
}

const LOG_TAB_ORDER: LogTab[] = [
  "food",
  "activity",
  "check-in",
  "progress-journal",
  "cycle-journal",
];

export function getVisibleLogTabs(
  preferences: TrackingPreferences,
): LogTab[] {
  const tabs: LogTab[] = ["check-in"];

  if (isProgressJournalEnabled(preferences)) {
    tabs.push("progress-journal");
  }

  if (preferences.calorieTrackingEnabled) {
    tabs.unshift("food", "activity");
  }

  if (preferences.cycleTrackingEnabled) {
    tabs.push("cycle-journal");
  }

  return LOG_TAB_ORDER.filter((tab) => tabs.includes(tab));
}

export function getDefaultLogTab(preferences: TrackingPreferences): LogTab {
  return getVisibleLogTabs(preferences)[0] ?? "check-in";
}

export function resolveLogTab(
  tabParam: string | null,
  preferences: TrackingPreferences,
): LogTab {
  const visible = getVisibleLogTabs(preferences);
  const normalizedParam =
    tabParam === "weight" ? "progress-journal" : tabParam;
  if (normalizedParam && visible.includes(normalizedParam as LogTab)) {
    return normalizedParam as LogTab;
  }
  return getDefaultLogTab(preferences);
}

export function getHomeModules(preferences: TrackingPreferences) {
  return {
    showCalorieCard: preferences.calorieTrackingEnabled,
    showFoodLogPrompts: preferences.calorieTrackingEnabled,
    showCycleInsights: preferences.cycleTrackingEnabled,
    showCycleHeader: preferences.cycleTrackingEnabled,
    showProgressJournal: isProgressJournalEnabled(preferences),
  };
}

/** Weight / progress journal — tied to nutrition tracking modes. */
export function isProgressJournalEnabled(
  preferences: TrackingPreferences,
): boolean {
  return preferences.calorieTrackingEnabled;
}

export function getInsightsModules(preferences: TrackingPreferences) {
  return {
    showWeeklyEnergyChart: preferences.calorieTrackingEnabled,
    showCalendar:
      preferences.cycleTrackingEnabled || preferences.calorieTrackingEnabled,
    showProgressJournal: isProgressJournalEnabled(preferences),
    showCycleHeader: preferences.cycleTrackingEnabled,
    showSymptomInsights: preferences.cycleTrackingEnabled,
  };
}

export function trackingPreferencesEqual(
  a: TrackingPreferences,
  b: TrackingPreferences,
): boolean {
  return (
    a.cycleTrackingEnabled === b.cycleTrackingEnabled &&
    a.calorieTrackingEnabled === b.calorieTrackingEnabled
  );
}
