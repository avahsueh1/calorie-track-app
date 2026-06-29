export type Sex = "male" | "female";

export type { ActivityType, DetailedActivityProfile } from "./activity";

import type { DetailedActivityProfile } from "./activity";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export interface UserProfile {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  bodyFatPct?: number;
  activityLevel: ActivityLevel;
  /** Optional detailed activity inputs for a more specific TDEE estimate. */
  detailedActivityProfile?: DetailedActivityProfile;
}

export interface FoodLogInput {
  caloriesPerServing: number;
  servings: number;
}

export interface ActivityLogInput {
  metValue: number;
  weightKg: number;
  durationMinutes: number;
}

export interface DailySummary {
  totalFoodCalories: number;
  totalActivityCalories: number;
  netCalories: number;
  tdee: number;
  remainingCalories: number;
}

export type SymptomSeverity = "mild" | "moderate" | "strong";

export interface SymptomEntry {
  selection: string;
  note?: string;
}

export type SymptomKey =
  | "bloating"
  | "cramps"
  | "breastSoreness"
  | "headache"
  | "acne"
  | "backPain"
  | "nausea"
  | "discharge"
  | "fatigue"
  | "anxiety"
  | "stress"
  | "sadness"
  | "depression"
  | "irritability"
  | "moodSwings"
  | "lowMotivation"
  | "brainFog"
  | "energy"
  | "sleepQuality"
  | "appetite"
  | "exercise"
  | "cravings"
  | "hydration";

export interface DailyCheckIn {
  symptoms: Partial<Record<SymptomKey, SymptomEntry>>;
  notes?: string;
}

/** Pre-symptom-logger shape kept for migration from storage and sample data. */
export interface LegacyDailyCheckIn {
  energy?: 1 | 2 | 3 | 4 | 5;
  mood?: 1 | 2 | 3 | 4 | 5;
  hunger?: 1 | 2 | 3 | 4 | 5;
  cravings?: "none" | "mild" | "strong";
  sleepQuality?: 1 | 2 | 3 | 4 | 5;
  stress?: 1 | 2 | 3 | 4 | 5;
  bloating?: "none" | "mild" | "strong";
  soreness?: "none" | "mild" | "strong";
  notes?: string;
}

export type DailyTargetMode =
  | "maintain"
  | "gentle_deficit"
  | "performance"
  | "recovery";

export type LifeStage =
  | "regular_cycle"
  | "irregular_cycle"
  | "perimenopause"
  | "menopause"
  | "prefer_not_to_say";

export interface CycleContext {
  cycleTrackingEnabled: boolean;
  cycleDay?: number;
  estimatedPhase?: string;
  periodExpectedInDays?: number;
  lifeStage?: LifeStage;
}
