import type { Sex } from "../types";
import type {
  AppProfile,
  GoalDirection,
  GoalRatePreference,
  MacroTargets,
  NutritionPlan,
} from "../types/profile";
import { calculateTdee, resolveBmr } from "./calories";
import {
  calorieCyclingFieldsEqual,
  ensureCalorieCycling,
} from "./calorieCycling";
import { kgToLb, toUserProfile } from "./profileBody";

export { getCalorieTargetRange } from "./calorieTargetStatus";

const DEFAULT_FIBER_TARGET = 25;
const FAT_CALORIE_RATIO = 0.25;

const GOAL_PACE_ADJUSTMENTS: Partial<
  Record<GoalDirection, Record<GoalRatePreference, number>>
> = {
  gentle_fat_loss: { slow: -175, moderate: -250, faster: -350 },
  fat_loss: { slow: -375, moderate: -500, faster: -625 },
  build_muscle: { slow: 175, moderate: 250, faster: 350 },
  improve_energy: { slow: 75, moderate: 100, faster: 150 },
  recovery_consistency: { slow: 35, moderate: 50, faster: 75 },
};

export function getGoalCalorieAdjustment(
  goalDirection: GoalDirection,
  goalRate: GoalRatePreference,
): number {
  const adjustments = GOAL_PACE_ADJUSTMENTS[goalDirection];
  if (!adjustments) {
    return 0;
  }

  return adjustments[goalRate];
}

export interface SuggestedNutritionPlan {
  bmr: number;
  maintenanceTdee: number;
  calorieTarget: number;
  macros: MacroTargets;
  goalDirection: GoalDirection;
  goalRate: GoalRatePreference;
}

export interface NutritionPlanInput {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  bodyFatPct?: number;
  activityLevel: AppProfile["activityLevel"];
  detailedActivityProfile?: AppProfile["detailedActivityProfile"];
  goalDirection: GoalDirection;
  goalRate: GoalRatePreference;
}

function proteinGramsPerLb(goalDirection: GoalDirection): number {
  switch (goalDirection) {
    case "build_muscle":
      return 1;
    case "gentle_fat_loss":
    case "fat_loss":
      return 0.95;
    case "improve_energy":
      return 0.85;
    default:
      return 0.8;
  }
}

function baseGoalCalorieAdjustment(goalDirection: GoalDirection): number {
  switch (goalDirection) {
    case "gentle_fat_loss":
      return -250;
    case "fat_loss":
      return -500;
    case "build_muscle":
      return 250;
    case "improve_energy":
      return 100;
    case "recovery_consistency":
      return 50;
    default:
      return 0;
  }
}

export function goalDirectionHasPaceAdjustment(
  goalDirection: GoalDirection,
): boolean {
  return baseGoalCalorieAdjustment(goalDirection) !== 0;
}

/** ~3,500 kcal per lb of body weight change. */
export function estimateWeeklyWeightChangeLb(
  maintenanceTdee: number,
  calorieTarget: number,
): number {
  return (calorieTarget - maintenanceTdee) * 7 / 3500;
}

function formatFractionalLb(value: number): string {
  if (value < 0.2) {
    return "under ¼";
  }
  if (value < 0.35) {
    return "about ¼";
  }
  if (value < 0.65) {
    return "about ½";
  }
  if (value < 0.85) {
    return "about ¾";
  }
  if (value < 1.15) {
    return "about 1";
  }
  if (value < 1.4) {
    return "about 1¼";
  }
  if (value < 1.65) {
    return "about 1½";
  }
  if (value < 1.9) {
    return "about 1¾";
  }

  return `about ${Math.round(value * 2) / 2}`;
}

export function formatWeeklyWeightChangePhrase(
  maintenanceTdee: number,
  calorieTarget: number,
): string | null {
  const lbsPerWeek = estimateWeeklyWeightChangeLb(
    maintenanceTdee,
    calorieTarget,
  );

  if (Math.abs(lbsPerWeek) < 0.1) {
    return null;
  }

  const magnitude = formatFractionalLb(Math.abs(lbsPerWeek));
  return lbsPerWeek < 0
    ? `${magnitude} lb/week loss`
    : `${magnitude} lb/week gain`;
}

function paceClampOffset(
  adjustment: number,
  goalRate: GoalRatePreference,
): number {
  if (adjustment < 0) {
    return goalRate === "slow" ? 80 : goalRate === "moderate" ? 35 : 0;
  }

  if (adjustment > 0) {
    return goalRate === "faster" ? 80 : goalRate === "moderate" ? 35 : 0;
  }

  return 0;
}

export function clampCalorieTarget(
  target: number,
  input: { bmr: number; maintenanceTdee: number; sex: Sex },
  options?: {
    goalDirection?: GoalDirection;
    goalRate?: GoalRatePreference;
  },
): number {
  const minimum = Math.max(
    input.sex === "male" ? 1500 : 1200,
    Math.round(input.bmr * 1.1),
  );
  const maxDeficit = Math.round(input.maintenanceTdee * 0.25);
  const baseMinTarget = Math.max(minimum, input.maintenanceTdee - maxDeficit);
  const adjustment =
    options?.goalDirection && options?.goalRate
      ? getGoalCalorieAdjustment(options.goalDirection, options.goalRate)
      : 0;
  const paceOffset = options?.goalRate
    ? paceClampOffset(adjustment, options.goalRate)
    : 0;
  const minTarget = baseMinTarget + (adjustment < 0 ? paceOffset : 0);
  const maxTarget =
    input.maintenanceTdee + 500 - (adjustment > 0 ? paceOffset : 0);

  return Math.round(Math.min(maxTarget, Math.max(minTarget, target)));
}

export function generateMacroTargets(
  calorieTarget: number,
  weightKg: number,
  goalDirection: GoalDirection,
): MacroTargets {
  const weightLb = kgToLb(weightKg);
  const protein = Math.max(
    50,
    Math.round(weightLb * proteinGramsPerLb(goalDirection)),
  );
  const fatCalories = calorieTarget * FAT_CALORIE_RATIO;
  const fat = Math.max(35, Math.round(fatCalories / 9));
  const remainingCalories = Math.max(
    0,
    calorieTarget - protein * 4 - fat * 9,
  );
  const carbs = Math.max(50, Math.round(remainingCalories / 4));

  return {
    protein,
    carbs,
    fat,
    fiber: DEFAULT_FIBER_TARGET,
  };
}

export function generateSuggestedNutritionPlan(
  input: NutritionPlanInput,
): SuggestedNutritionPlan {
  const userProfile = toUserProfile({
    age: input.age,
    sex: input.sex,
    heightCm: input.heightCm,
    weightKg: input.weightKg,
    bodyFatPct: input.bodyFatPct,
    activityLevel: input.activityLevel,
    detailedActivityProfile: input.detailedActivityProfile,
  });

  const bmr = resolveBmr(input);
  const maintenanceTdee = calculateTdee(userProfile);
  const rawTarget =
    maintenanceTdee +
    getGoalCalorieAdjustment(input.goalDirection, input.goalRate);
  const calorieTarget = clampCalorieTarget(rawTarget, {
    bmr,
    maintenanceTdee,
    sex: input.sex,
  }, {
    goalDirection: input.goalDirection,
    goalRate: input.goalRate,
  });
  const macros = generateMacroTargets(
    calorieTarget,
    input.weightKg,
    input.goalDirection,
  );

  return {
    bmr,
    maintenanceTdee,
    calorieTarget,
    macros,
    goalDirection: input.goalDirection,
    goalRate: input.goalRate,
  };
}

export function suggestedToNutritionPlan(
  suggested: SuggestedNutritionPlan,
): NutritionPlan {
  return ensureCalorieCycling({
    calorieTarget: suggested.calorieTarget,
    macros: suggested.macros,
    source: "formula",
    goalRate: suggested.goalRate,
    calorieCyclingEnabled: false,
    calorieCyclingType: "same_daily",
  });
}

export function nutritionPlanFromProfileInput(
  profile: AppProfile,
): NutritionPlan {
  return suggestedToNutritionPlan(
    generateSuggestedNutritionPlan({
      age: profile.age,
      sex: profile.sex,
      heightCm: profile.heightCm,
      weightKg: profile.weightKg,
      bodyFatPct: profile.bodyFatPct,
      activityLevel: profile.activityLevel,
      detailedActivityProfile: profile.detailedActivityProfile,
      goalDirection: profile.goalDirection,
      goalRate: profile.goalRate ?? "moderate",
    }),
  );
}

/** Recompute formula plans when profile inputs change; leave manual plans untouched. */
export function syncFormulaNutritionPlan(profile: AppProfile): AppProfile {
  if (!profile.nutritionPlan || profile.nutritionPlan.source === "manual") {
    return {
      ...profile,
      nutritionPlan: ensureCalorieCycling(profile.nutritionPlan, profile),
    };
  }

  const nextPlan = nutritionPlanFromProfileInput(profile);
  const cycling = profile.nutritionPlan;

  return {
    ...profile,
    nutritionPlan: ensureCalorieCycling(
      {
        ...nextPlan,
        calorieCyclingEnabled: cycling.calorieCyclingEnabled,
        calorieCyclingType: cycling.calorieCyclingType,
        highCalorieDays: cycling.highCalorieDays,
        weekendBoost: cycling.weekendBoost,
        weekendBoostPreset: cycling.weekendBoostPreset,
        dailyTargets: cycling.dailyTargets,
      },
      profile,
    ),
  };
}

export function ensureNutritionPlan(profile: AppProfile): AppProfile {
  const normalized: AppProfile = {
    ...profile,
    goalRate: profile.goalRate ?? "moderate",
  };

  if (!normalized.nutritionPlan?.calorieTarget) {
    return {
      ...normalized,
      nutritionPlan: ensureCalorieCycling(
        nutritionPlanFromProfileInput(normalized),
        normalized,
      ),
    };
  }

  if (normalized.nutritionPlan.source === "manual") {
    return {
      ...normalized,
      nutritionPlan: ensureCalorieCycling(
        {
          ...normalized.nutritionPlan,
          macros: {
            ...normalized.nutritionPlan.macros,
            fiber:
              normalized.nutritionPlan.macros.fiber ?? DEFAULT_FIBER_TARGET,
          },
        },
        normalized,
      ),
    };
  }

  return syncFormulaNutritionPlan(normalized);
}

export function nutritionPlansEqual(
  a: NutritionPlan,
  b: NutritionPlan,
): boolean {
  return (
    a.calorieTarget === b.calorieTarget &&
    a.source === b.source &&
    a.goalRate === b.goalRate &&
    a.macros.protein === b.macros.protein &&
    a.macros.carbs === b.macros.carbs &&
    a.macros.fat === b.macros.fat &&
    a.macros.fiber === b.macros.fiber &&
    calorieCyclingFieldsEqual(a, b)
  );
}

export function isManualNutritionPlan(plan: NutritionPlan): boolean {
  return plan.source === "manual";
}
