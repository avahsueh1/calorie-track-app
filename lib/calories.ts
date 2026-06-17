import type {
  ActivityLevel,
  ActivityLogInput,
  DailySummary,
  FoodLogInput,
  Sex,
  UserProfile,
} from "../types";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculateBmr(input: {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
}): number {
  const { age, sex, heightCm, weightKg } = input;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;

  return sex === "male" ? base + 5 : base - 161;
}

export function calculateTdee(profile: UserProfile): number {
  return Math.round(
    calculateBmr(profile) * ACTIVITY_MULTIPLIERS[profile.activityLevel],
  );
}

export function calculateFoodCalories(input: FoodLogInput): number {
  return input.caloriesPerServing * input.servings;
}

export function calculateActivityCalories(input: ActivityLogInput): number {
  return (
    input.metValue * input.weightKg * (input.durationMinutes / 60)
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
