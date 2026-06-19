import {
  calculateDailySummary,
  calculateTdee,
} from "../lib/calories";
import type {
  ActivityLogInput,
  DailyCheckIn,
  FoodLogInput,
  UserProfile,
} from "../types";
import type {
  CycleContextDisplay,
  DailySummaryDisplay,
  MacroSummary,
  WellnessUser,
} from "../types/wellness";

const sampleProfile: UserProfile = {
  age: 28,
  sex: "female",
  heightCm: 165,
  weightKg: 56,
  activityLevel: "moderate",
};

const sampleFoodLogs: FoodLogInput[] = [
  { caloriesPerServing: 520, servings: 1 },
  { caloriesPerServing: 450, servings: 2 },
];

const sampleActivityLogs: ActivityLogInput[] = [
  { metValue: 5, weightKg: 64, durationMinutes: 60 },
];

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

export const sampleCycleContext: CycleContextDisplay = {
  phaseLabel: "Luteal phase",
  cycleDayLabel: "Cycle day 18",
  insightTitle: "Luteal phase insight",
  insightMessage:
    "Energy and hunger can trend higher here. Use this as awareness, not a prescription.",
};

export const patternInsightsMessage =
  "Log 7 days to compare mood, nourishment, and cycle context.";

export function getSampleMacros(): MacroSummary[] {
  return [
    { label: "Protein", grams: 82, percent: 72, color: "#B86B52" },
    { label: "Carbs", grams: 145, percent: 58, color: "#7D9B8A" },
    { label: "Fat", grams: 48, percent: 64, color: "#E8D5B0" },
  ];
}

export function getSampleDailySummary(): DailySummaryDisplay {
  const tdee = calculateTdee(sampleProfile);
  const summary = calculateDailySummary(
    sampleFoodLogs,
    sampleActivityLogs,
    tdee,
  );

  return {
    eaten: summary.totalFoodCalories,
    burned: summary.totalActivityCalories,
    net: summary.netCalories,
    tdee: summary.tdee,
    remaining: summary.remainingCalories,
    ringValue: summary.netCalories,
    ringTarget: summary.tdee,
    ringPercent: Math.round((summary.netCalories / summary.tdee) * 100),
  };
}
