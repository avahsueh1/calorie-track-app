import type {
  AppProfile,
  GoalDirection,
} from "../types/profile";
import {
  formatHeightDisplay,
  formatWeightDisplay,
} from "../lib/profileBody";

/** Default body values produce ~1,290 BMR and ~2,000 TDEE (moderate activity). */
export const defaultAppProfile: AppProfile = {
  name: "Ava Hsueh",
  email: "avahsueh1@g.ucla.edu",
  age: 28,
  sex: "female",
  heightCm: 165,
  weightKg: 56,
  heightDisplay: formatHeightDisplay(165, "imperial"),
  weightDisplay: formatWeightDisplay(56, "imperial"),
  bodyFatPct: 24,
  activityLevel: "moderate",
  goalDirection: "maintain",
  dailyTargetMode: "maintain",
  cycleTrackingEnabled: true,
  lifeStage: "regular_cycle",
  lastPeriodStart: "2026-05-28",
  averageCycleLength: 28,
  averagePeriodLength: 5,
  units: "imperial",
  calorieDisplay: "net",
  checkInReminder: true,
  mealLogReminder: false,
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

export function getProfileFocusMessage(goalDirection: GoalDirection): string {
  switch (goalDirection) {
    case "gentle_fat_loss":
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
