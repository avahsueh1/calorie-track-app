import type {
  ActivityLevel,
  DailyTargetMode,
  LifeStage,
  Sex,
} from "./index";
import type { DetailedActivityProfile } from "./activity";

export type GoalDirection =
  | "maintain"
  | "gentle_fat_loss"
  | "fat_loss"
  | "build_muscle"
  | "improve_energy"
  | "recovery_consistency";

export type GoalRatePreference = "slow" | "moderate" | "faster";

export type NutritionPlanSource = "formula" | "manual";

export type WeekdayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type CalorieCyclingType = "same_daily" | "weekend_high" | "custom";

export type WeekendBoostPreset = "mild" | "moderate" | "custom";

export interface WeeklyDailyTargets {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

export interface MacroTargets {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface NutritionPlan {
  calorieTarget: number;
  macros: MacroTargets;
  source: NutritionPlanSource;
  goalRate: GoalRatePreference;
  calorieCyclingEnabled?: boolean;
  calorieCyclingType?: CalorieCyclingType;
  highCalorieDays?: WeekdayKey[];
  weekendBoost?: number;
  weekendBoostPreset?: WeekendBoostPreset;
  dailyTargets?: WeeklyDailyTargets;
}

export type ProfileLifeStage = LifeStage | "postpartum";

export type UnitsPreference = "imperial" | "metric";

export type CalorieDisplayPreference = "eaten" | "net";

export interface AppProfile {
  name: string;
  email: string;
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  heightDisplay: string;
  weightDisplay: string;
  bodyFatPct?: number;
  activityLevel: ActivityLevel;
  /** @deprecated Legacy field — stripped on load/save; activity level drives TDEE. */
  detailedActivityProfile?: DetailedActivityProfile;
  goalDirection: GoalDirection;
  /** @deprecated Migrated into nutritionPlan — kept for legacy localStorage only. */
  dailyTargetMode?: DailyTargetMode;
  goalRate: GoalRatePreference;
  nutritionPlan: NutritionPlan;
  cycleTrackingEnabled: boolean;
  lifeStage: ProfileLifeStage;
  lastPeriodStart: string;
  averageCycleLength: number;
  averagePeriodLength: number;
  units: UnitsPreference;
  calorieDisplay: CalorieDisplayPreference;
  checkInReminder: boolean;
  mealLogReminder: boolean;
}
