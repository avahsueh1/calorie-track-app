export type Sex = "male" | "female";

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

export interface DailyCheckIn {
  energy: 1 | 2 | 3 | 4 | 5;
  mood: 1 | 2 | 3 | 4 | 5;
  hunger: 1 | 2 | 3 | 4 | 5;
  cravings: "none" | "mild" | "strong";
  sleepQuality: 1 | 2 | 3 | 4 | 5;
  stress: 1 | 2 | 3 | 4 | 5;
  bloating: "none" | "mild" | "strong";
  soreness: "none" | "mild" | "strong";
  notes?: string;
}

export type DailyTargetMode =
  | "maintain"
  | "gentle_deficit"
  | "performance"
  | "recovery";
