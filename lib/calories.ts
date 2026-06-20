import type {
  ActivityLevel,
  ActivityLogInput,
  DailySummary,
  FoodLogInput,
  Sex,
  UserProfile,
} from "../types";
import type { DailySummaryDisplay, MacroSummary } from "../types/wellness";

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
  foods: { protein: number; carbs: number; fat: number }[],
  targets: { protein: number; carbs: number; fat: number },
  colors: { protein: string; carbs: string; fat: string },
): MacroSummary[] {
  const totals = foods.reduce(
    (acc, food) => ({
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat,
    }),
    { protein: 0, carbs: 0, fat: 0 },
  );

  return [
    {
      label: "Protein",
      grams: totals.protein,
      percent: Math.min(
        100,
        Math.round((totals.protein / targets.protein) * 100),
      ),
      color: colors.protein,
    },
    {
      label: "Carbs",
      grams: totals.carbs,
      percent: Math.min(100, Math.round((totals.carbs / targets.carbs) * 100)),
      color: colors.carbs,
    },
    {
      label: "Fat",
      grams: totals.fat,
      percent: Math.min(100, Math.round((totals.fat / targets.fat) * 100)),
      color: colors.fat,
    },
  ];
}
