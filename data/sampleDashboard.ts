import type { DailyCheckIn } from "../types";
import type {
  CycleContextDisplay,
  DailyActivityEntry,
  DailyFoodEntry,
  WellnessUser,
} from "../types/wellness";
export const DAILY_CALORIE_TARGET = 2000; // legacy reference; live TDEE comes from ProfileProvider

/** Macro progress targets (placeholder until tied to profile goals). */
export const macroTargets = {
  protein: 114,
  carbs: 250,
  fat: 75,
};

export const macroColors = {
  protein: "#B86B52",
  carbs: "#7D9B8A",
  fat: "#E8D5B0",
};

/** Default today's food logs (1420 kcal total). */
export const defaultDailyFoods: DailyFoodEntry[] = [
  {
    id: "sample-food-1",
    name: "Chicken & rice bowl",
    meal: "Lunch",
    calories: 520,
    protein: 42,
    carbs: 48,
    fat: 12,
  },
  {
    id: "sample-food-2",
    name: "Avocado toast",
    meal: "Snack",
    calories: 900,
    protein: 40,
    carbs: 97,
    fat: 36,
  },
];

/** Default today's activity logs (320 kcal burned). */
export const defaultDailyActivities: DailyActivityEntry[] = [
    {
      id: "sample-activity-1",
      name: "Light walk",
      durationMinutes: 60,
      caloriesBurned: 320,
      intensity: "Moderate",
    },
  ];

export function getDefaultDailyFoods(): DailyFoodEntry[] {
  return defaultDailyFoods.map((entry) => ({ ...entry }));
}

export function getDefaultDailyActivities(): DailyActivityEntry[] {
  return defaultDailyActivities.map((entry) => ({ ...entry }));
}

/** Single default source for today's body check-in (shared by provider + UI). */
export const defaultDailyCheckIn: DailyCheckIn = {
  energy: 3,
  mood: 4,
  hunger: 3,
  cravings: "mild",
  sleepQuality: 4,
  stress: 2,
  bloating: "mild",
  soreness: "none",
  notes: "",
};

export function getDefaultDailyCheckIn(): DailyCheckIn {
  return { ...defaultDailyCheckIn, notes: defaultDailyCheckIn.notes ?? "" };
}

export const sampleUser: WellnessUser = {
  name: "Ava",
  focusMessage: "Focus on nourishment",
};

/** Sample cycle context for dashboard — not yet driven by profile cycle settings. */

export const sampleCycleContext: CycleContextDisplay = {
  phaseLabel: "Luteal phase",
  cycleDayLabel: "Cycle day 18",
  insightTitle: "Luteal phase insight",
  insightMessage:
    "Energy and hunger can trend higher here. Use this as awareness, not a prescription.",
};

export const patternInsightsMessage =
  "Log 7 days to compare mood, nourishment, and cycle context.";
