import type {
  AppProfile,
  GoalDirection,
} from "../types/profile";
import {
  formatHeightDisplay,
  formatWeightDisplay,
} from "../lib/profileBody";
import {
  generateSuggestedNutritionPlan,
  suggestedToNutritionPlan,
} from "../lib/nutritionPlan";

const baseProfileFields = {
  name: "Ava Hsueh",
  email: "avahsueh1@g.ucla.edu",
  age: 28,
  sex: "female" as const,
  heightCm: 165,
  weightKg: 56,
  bodyFatPct: 24,
  activityLevel: "moderate" as const,
  goalDirection: "maintain" as const,
  goalRate: "moderate" as const,
  cycleTrackingEnabled: true,
  lifeStage: "regular_cycle" as const,
  lastPeriodStart: "2026-05-28",
  averageCycleLength: 28,
  averagePeriodLength: 5,
  units: "imperial" as const,
  calorieDisplay: "net" as const,
  checkInReminder: true,
  mealLogReminder: false,
};

/** Default body values produce ~1,290 BMR and ~2,000 TDEE (moderate activity). */
export const defaultAppProfile: AppProfile = {
  ...baseProfileFields,
  heightDisplay: formatHeightDisplay(165, "imperial"),
  weightDisplay: formatWeightDisplay(56, "imperial"),
  nutritionPlan: suggestedToNutritionPlan(
    generateSuggestedNutritionPlan(baseProfileFields),
  ),
};

export function getDefaultAppProfile(): AppProfile {
  return {
    ...defaultAppProfile,
    heightDisplay: formatHeightDisplay(defaultAppProfile.heightCm, defaultAppProfile.units),
    weightDisplay: formatWeightDisplay(defaultAppProfile.weightKg, defaultAppProfile.units),
  };
}

export function getProfileFirstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

export function getProfileInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase() || "?";
}

export function getProfileFocusMessage(goalDirection: GoalDirection): string {
  switch (goalDirection) {
    case "gentle_fat_loss":
      return "Focus on steady nourishment";
    case "fat_loss":
      return "Focus on steady nourishment";
    case "build_muscle":
      return "Focus on protein and recovery";
    case "improve_energy":
      return "Focus on balanced fuel";
    case "recovery_consistency":
      return "Focus on consistency, not perfection";
    default:
      return "Focus on nourishment";
  }
}
