import { getEmptyDailyCheckIn } from "../lib/checkInHelpers";
import type { DailyCheckIn } from "../types";
import type {
  CycleContextDisplay,
  DailyActivityEntry,
  DailyFoodEntry,
  WellnessUser,
} from "../types/wellness";
export const DAILY_CALORIE_TARGET = 2000; // legacy sample data only — live target from profile.nutritionPlan

/** Legacy sample macro targets for demo calendar entries without profile context. */
export const macroTargets = {
  protein: 114,
  carbs: 250,
  fat: 75,
  fiber: 25,
};

export const macroColors = {
  protein: "#B86B52",
  carbs: "#7D9B8A",
  fat: "#E8D5B0",
  fiber: "#4D8B7A",
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

/** Empty check-in used when no entry exists for today. */
export function getDefaultDailyCheckIn(): DailyCheckIn {
  return getEmptyDailyCheckIn();
}

export const sampleUser: WellnessUser = {
  name: "Ava",
  focusMessage: "Focus on nourishment",
};

/** Sample cycle context for dashboard — not yet driven by profile cycle settings. */

export const sampleCycleContext: CycleContextDisplay = {
  phaseLabel: "Luteal phase",
  cycleDay: 18,
  cycleDayLabel: "Cycle day 18",
  insightTitle: "Luteal phase insight",
  insightMessage:
    "Energy and hunger can trend higher here. Use this as awareness, not a prescription.",
};
