import type {
  ActivityLevel,
  DailyTargetMode,
  LifeStage,
  Sex,
} from "./index";

export type GoalDirection =
  | "maintain"
  | "gentle_fat_loss"
  | "build_muscle"
  | "improve_energy"
  | "recovery_consistency";

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
  goalDirection: GoalDirection;
  dailyTargetMode: DailyTargetMode;
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
