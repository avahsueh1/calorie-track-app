/**
 * Lightweight sanity checks for calorie formula helpers.
 * Run manually: npx tsx lib/calorieFormulaChecks.ts
 */
import {
  calculateSimpleTdee,
  calculateTdee,
  estimateActivityCaloriesFromMET,
  estimateAverageDailyExerciseCalories,
  estimateDetailedTDEE,
  estimateStepCalories,
  estimateWeeklyExerciseCalories,
  hasDetailedActivityData,
  resolveBmr,
} from "./calories";
import { estimateLogActivityCalories } from "./activityLog";
import {
  clampCalorieTarget,
  generateSuggestedNutritionPlan,
  getGoalCalorieAdjustment,
} from "./nutritionPlan";
import type { UserProfile } from "../types";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Calorie formula check failed: ${message}`);
  }
}

const baseProfile: UserProfile = {
  age: 28,
  sex: "female",
  heightCm: 165,
  weightKg: 56,
  activityLevel: "moderate",
};

export function runCalorieFormulaChecks(): void {
  assert(
    estimateStepCalories(10_000, 70) === Math.round(10_000 * 70 * 0.0005),
    "step calories formula",
  );

  assert(
    estimateActivityCaloriesFromMET(5, 70, 1) === 350,
    "MET formula for 1 hour at 5 MET / 70 kg",
  );

  const weekly = estimateWeeklyExerciseCalories(
    {
      yogaHoursPerWeek: 2,
      strengthTrainingHoursPerWeek: 1,
    },
    70,
  );
  assert(
    weekly === Math.round(2.5 * 70 * 2 + 3.5 * 70 * 1),
    "weekly exercise from typed hour fields",
  );

  assert(
    estimateAverageDailyExerciseCalories(700) === 100,
    "average daily exercise calories",
  );

  assert(!hasDetailedActivityData(undefined), "empty profile is not detailed");
  assert(
    hasDetailedActivityData({ averageDailySteps: 8_000 }),
    "steps alone counts as detailed",
  );

  const simple = calculateSimpleTdee(baseProfile);
  const fallback = calculateTdee(baseProfile);
  assert(simple === fallback, "simple TDEE matches default calculateTdee");

  const detailed = estimateDetailedTDEE({
    bmr: 1_300,
    weightKg: 56,
    baselineActivityLevel: "moderate",
    detailedActivityProfile: {
      yogaHoursPerWeek: 3,
      averageDailySteps: 8_000,
    },
  });
  assert(detailed > 1_300, "detailed TDEE should exceed BMR alone");

  const bmrWithBodyFat = resolveBmr({ ...baseProfile, bodyFatPct: 24 });
  assert(bmrWithBodyFat > 0, "resolveBmr with body fat returns positive value");

  const gentleAdjustment = getGoalCalorieAdjustment(
    "gentle_fat_loss",
    "moderate",
  );
  assert(gentleAdjustment === -250, "gentle fat loss adjustment");

  const suggested = generateSuggestedNutritionPlan({
    ...baseProfile,
    goalDirection: "gentle_fat_loss",
    goalRate: "moderate",
  });
  assert(
    suggested.calorieTarget < suggested.maintenanceTdee,
    "gentle fat loss target is below maintenance",
  );
  assert(
    suggested.calorieTarget ===
      clampCalorieTarget(
        suggested.maintenanceTdee + gentleAdjustment,
        {
          bmr: suggested.bmr,
          maintenanceTdee: suggested.maintenanceTdee,
          sex: "female",
        },
        {
          goalDirection: "gentle_fat_loss",
          goalRate: "moderate",
        },
      ),
    "clamped calorie target matches plan output",
  );
  assert(suggested.macros.protein > 0, "macro protein target is positive");

  assert(
    estimateLogActivityCalories({
      kind: "other",
      weightKg: 70,
      durationMinutes: 60,
      otherIntensity: "moderate",
    }) === 280,
    "other moderate MET estimate",
  );

  assert(
    estimateLogActivityCalories({
      kind: "walking",
      weightKg: 70,
      durationMinutes: 30,
      manualCalories: 200,
    }) === 200,
    "manual override wins",
  );
}

if (require.main === module) {
  runCalorieFormulaChecks();
  console.log("Calorie formula checks passed.");
}
