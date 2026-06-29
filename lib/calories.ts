import type {
  ActivityLevel,
  ActivityLogInput,
  DailySummary,
  FoodLogInput,
  Sex,
  UserProfile,
} from "../types";
import type { ActivityType, DetailedActivityProfile } from "../types/activity";
import type { DailySummaryDisplay, MacroSummary } from "../types/wellness";

export type { ActivityType, DetailedActivityProfile };

/** Standard activity multipliers applied to BMR for the simple TDEE estimate. */
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

/**
 * Conservative MET defaults for common workout styles.
 * These are rough population averages, not personalized lab measurements.
 */
export const ACTIVITY_TYPE_MET: Record<ActivityType, number> = {
  yoga: 2.5,
  pilates: 3.0,
  strength: 3.5,
  walking: 3.3,
  cycling: 6.0,
  running: 8.0,
  cardio: 5.0,
  mixed: 5.0,
};

export function calculateBmr(input: {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
}): number {
  const { age, sex, heightCm, weightKg } = input;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;

  return Math.round(sex === "male" ? base + 5 : base - 161);
}

/** Katch-McArdle BMR from lean mass — used when body fat % is available. */
export function calculateLeanMassBmr(
  weightKg: number,
  bodyFatPct: number,
): number {
  const leanMassKg = weightKg * (1 - bodyFatPct / 100);
  return Math.round(370 + 21.6 * leanMassKg);
}

/**
 * BMR estimate. Averages Mifflin-St Jeor with Katch-McArdle when body fat % exists.
 */
export function resolveBmr(input: {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  bodyFatPct?: number;
}): number {
  const mifflin = calculateBmr(input);

  if (input.bodyFatPct !== undefined && input.bodyFatPct > 0) {
    const katch = calculateLeanMassBmr(input.weightKg, input.bodyFatPct);
    return Math.round((mifflin + katch) / 2);
  }

  return mifflin;
}

/** Classic BMR × activity-level multiplier estimate. */
export function calculateSimpleTdee(profile: UserProfile): number {
  return Math.round(
    calculateBmr(profile) * ACTIVITY_MULTIPLIERS[profile.activityLevel],
  );
}

export interface DetailedTdeeInput {
  bmr: number;
  weightKg: number;
  baselineActivityLevel: ActivityLevel;
  detailedActivityProfile: DetailedActivityProfile;
}

/**
 * Rough daily calories from steps alone.
 * Formula: steps × weightKg × 0.0005 — approximate, not a medical measurement.
 */
export function estimateStepCalories(steps: number, weightKg: number): number {
  if (steps <= 0 || weightKg <= 0) {
    return 0;
  }

  return Math.round(steps * weightKg * 0.0005);
}

/**
 * Calories burned for a single activity using MET.
 * Formula: MET × weightKg × durationHours — standard exercise-physiology estimate.
 */
export function estimateActivityCaloriesFromMET(
  met: number,
  weightKg: number,
  durationHours: number,
): number {
  if (met <= 0 || weightKg <= 0 || durationHours <= 0) {
    return 0;
  }

  return Math.round(met * weightKg * durationHours);
}

/**
 * Weekly exercise calories from typed training-mix hours (MET × weight × hours).
 */
export function estimateWeeklyExerciseCalories(
  profile: DetailedActivityProfile,
  weightKg: number,
): number {
  if (weightKg <= 0) {
    return 0;
  }

  const yogaHours = profile.yogaHoursPerWeek ?? 0;
  const strengthHours = profile.strengthTrainingHoursPerWeek ?? 0;
  const cardioHours = profile.cardioHoursPerWeek ?? 0;
  const walkingHours = profile.walkingHoursPerWeek ?? 0;

  let total = 0;
  total += estimateActivityCaloriesFromMET(
    ACTIVITY_TYPE_MET.yoga,
    weightKg,
    yogaHours,
  );
  total += estimateActivityCaloriesFromMET(
    ACTIVITY_TYPE_MET.strength,
    weightKg,
    strengthHours,
  );
  total += estimateActivityCaloriesFromMET(
    ACTIVITY_TYPE_MET.cardio,
    weightKg,
    cardioHours,
  );
  total += estimateActivityCaloriesFromMET(
    ACTIVITY_TYPE_MET.walking,
    weightKg,
    walkingHours,
  );

  return total;
}

/** Spread weekly exercise calories evenly across seven days. */
export function estimateAverageDailyExerciseCalories(
  weeklyExerciseCalories: number,
): number {
  if (weeklyExerciseCalories <= 0) {
    return 0;
  }

  return Math.round(weeklyExerciseCalories / 7);
}

/**
 * When detailed exercise/step data is present, cap the baseline multiplier
 * at "light" so structured exercise and steps are not double-counted.
 */
export function resolveDetailedBaselineMultiplier(
  baselineActivityLevel: ActivityLevel,
): number {
  return Math.min(
    ACTIVITY_MULTIPLIERS[baselineActivityLevel],
    ACTIVITY_MULTIPLIERS.light,
  );
}

/**
 * TDEE from BMR plus a lower baseline multiplier, plus average daily
 * exercise and step calories. All values are estimates, not exact needs.
 */
export function estimateDetailedTDEE(input: DetailedTdeeInput): number {
  const { bmr, weightKg, baselineActivityLevel, detailedActivityProfile } =
    input;

  const baselineCalories =
    bmr * resolveDetailedBaselineMultiplier(baselineActivityLevel);

  const weeklyExercise = estimateWeeklyExerciseCalories(
    detailedActivityProfile,
    weightKg,
  );
  const dailyExercise = estimateAverageDailyExerciseCalories(weeklyExercise);

  const dailySteps = detailedActivityProfile.averageDailySteps ?? 0;
  const dailyStepCalories = estimateStepCalories(dailySteps, weightKg);

  return Math.round(baselineCalories + dailyExercise + dailyStepCalories);
}

/** True when the profile has enough detail to use the detailed TDEE path. */
export function hasDetailedActivityData(
  profile?: DetailedActivityProfile | null,
): boolean {
  if (!profile) {
    return false;
  }

  return (
    (profile.averageDailySteps ?? 0) > 0 ||
    (profile.yogaHoursPerWeek ?? 0) > 0 ||
    (profile.strengthTrainingHoursPerWeek ?? 0) > 0 ||
    (profile.cardioHoursPerWeek ?? 0) > 0 ||
    (profile.walkingHoursPerWeek ?? 0) > 0 ||
    (profile.workoutHoursPerWeek ?? 0) > 0
  );
}

/**
 * Main TDEE entry point. Uses the detailed estimate when optional activity
 * detail exists; otherwise falls back to the classic activity-level formula.
 */
export function calculateTdee(profile: UserProfile): number {
  if (hasDetailedActivityData(profile.detailedActivityProfile)) {
    return estimateDetailedTDEE({
      bmr: calculateBmr(profile),
      weightKg: profile.weightKg,
      baselineActivityLevel: profile.activityLevel,
      detailedActivityProfile: profile.detailedActivityProfile!,
    });
  }

  return calculateSimpleTdee(profile);
}

export function calculateFoodCalories(input: FoodLogInput): number {
  return input.caloriesPerServing * input.servings;
}

export function calculateActivityCalories(input: ActivityLogInput): number {
  return estimateActivityCaloriesFromMET(
    input.metValue,
    input.weightKg,
    input.durationMinutes / 60,
  );
}

export function calculateDailySummary(
  foodLogs: FoodLogInput[],
  activityLogs: ActivityLogInput[],
  tdee: number,
): DailySummary {
  const totalFoodCalories = foodLogs.reduce(
    (sum, log) => sum + calculateFoodCalories(log),
    0,
  );
  const totalActivityCalories = activityLogs.reduce(
    (sum, log) => sum + calculateActivityCalories(log),
    0,
  );
  const netCalories = totalFoodCalories - totalActivityCalories;
  const remainingCalories = tdee - netCalories;

  return {
    totalFoodCalories,
    totalActivityCalories,
    netCalories,
    tdee,
    remainingCalories,
  };
}

export function calculateEatenCalories(
  foods: { calories: number }[],
): number {
  return foods.reduce(
    (sum, food) =>
      sum + calculateFoodCalories({ caloriesPerServing: food.calories, servings: 1 }),
    0,
  );
}

export function calculateBurnedCalories(
  activities: { caloriesBurned: number }[],
): number {
  return activities.reduce((sum, activity) => sum + activity.caloriesBurned, 0);
}

/** Single source for dashboard + log calorie summary display. */
export function buildDailySummaryDisplay(
  foods: { calories: number }[],
  activities: { caloriesBurned: number }[],
  tdee: number,
): DailySummaryDisplay {
  const eaten = calculateEatenCalories(foods);
  const burned = calculateBurnedCalories(activities);
  const net = eaten - burned;
  const remaining = tdee - net;

  return {
    eaten,
    burned,
    net,
    tdee,
    remaining,
    ringValue: net,
    ringTarget: tdee,
    ringPercent: tdee > 0 ? Math.round((net / tdee) * 100) : 0,
  };
}

export function buildMacroSummaryFromFoods(
  foods: { protein: number; carbs: number; fat: number; fiber?: number }[],
  targets: { protein: number; carbs: number; fat: number; fiber: number },
  colors: { protein: string; carbs: string; fat: string; fiber: string },
): MacroSummary[] {
  type MacroTotals = {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };

  const totals = foods.reduce<MacroTotals>(
    (acc, food) => ({
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat,
      fiber: acc.fiber + (food.fiber ?? 0),
    }),
    { protein: 0, carbs: 0, fat: 0, fiber: 0 },
  );

  const entries: {
    label: string;
    key: "protein" | "carbs" | "fat" | "fiber";
    colorKey: MacroSummary["colorKey"];
  }[] = [
    { label: "Protein", key: "protein", colorKey: "protein" },
    { label: "Carbs", key: "carbs", colorKey: "carbs" },
    { label: "Fat", key: "fat", colorKey: "fat" },
    { label: "Fiber", key: "fiber", colorKey: "fiber" },
  ];

  return entries.map(({ label, key, colorKey }) => {
    const grams = totals[key];
    const targetGrams = targets[key];
    return {
      label,
      grams,
      targetGrams,
      unit: "g" as const,
      percent:
        targetGrams > 0
          ? Math.min(100, Math.round((grams / targetGrams) * 100))
          : 0,
      color: colors[key],
      colorKey,
    };
  });
}

export {
  buildWeeklyCalorieTargets,
  calculateWeeklyTargetTotal,
  getCalorieTargetForDate,
  getCalorieTargetForProfileDate,
} from "./calorieCycling";
