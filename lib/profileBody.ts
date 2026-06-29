import type { ActivityLevel, Sex } from "../types";
import type { DetailedActivityProfile } from "../types/activity";
import type { AppProfile, GoalRatePreference, NutritionPlan, UnitsPreference } from "../types/profile";
import { calculateBmr, calculateTdee, resolveBmr } from "./calories";
import { getCalorieTargetForProfileDate } from "./calorieCycling";
import { nutritionPlansEqual } from "./nutritionPlan";
import { todayDateKey } from "./appStateHelpers";

/** Drop legacy detailed activity inputs — UI now uses activity level only. */
export function sanitizeAppProfile(profile: AppProfile): AppProfile {
  if (!profile.detailedActivityProfile) {
    return profile;
  }

  return { ...profile, detailedActivityProfile: undefined };
}

/** BMR, maintenance TDEE, and saved calorie target from one profile snapshot. */
export function getProfileEnergyMetrics(profile: AppProfile) {
  const sanitized = sanitizeAppProfile(profile);
  const userProfile = toUserProfile(sanitized);
  const maintenanceTdee = calculateTdee(userProfile);
  const bmr = resolveBmr(sanitized);

  return {
    userProfile,
    bmr,
    maintenanceTdee,
    dailyCalorieTarget: getCalorieTargetForProfileDate(
      sanitized,
      todayDateKey(),
    ),
    macroTargets: sanitized.nutritionPlan.macros,
  };
}

/** Stable comparison for profile save/dirty tracking. */
export function profilesEqual(a: AppProfile, b: AppProfile): boolean {
  return (
    a.name === b.name &&
    a.email === b.email &&
    a.age === b.age &&
    a.sex === b.sex &&
    a.heightCm === b.heightCm &&
    a.weightKg === b.weightKg &&
    a.heightDisplay === b.heightDisplay &&
    a.weightDisplay === b.weightDisplay &&
    a.bodyFatPct === b.bodyFatPct &&
    a.activityLevel === b.activityLevel &&
    detailedActivityProfilesEqual(
      a.detailedActivityProfile,
      b.detailedActivityProfile,
    ) &&
    a.goalDirection === b.goalDirection &&
    a.goalRate === b.goalRate &&
    nutritionPlansEqual(a.nutritionPlan, b.nutritionPlan) &&
    a.cycleTrackingEnabled === b.cycleTrackingEnabled &&
    a.lifeStage === b.lifeStage &&
    a.lastPeriodStart === b.lastPeriodStart &&
    a.averageCycleLength === b.averageCycleLength &&
    a.averagePeriodLength === b.averagePeriodLength &&
    a.units === b.units &&
    a.calorieDisplay === b.calorieDisplay &&
    a.checkInReminder === b.checkInReminder &&
    a.mealLogReminder === b.mealLogReminder
  );
}

function detailedActivityProfilesEqual(
  a?: DetailedActivityProfile,
  b?: DetailedActivityProfile,
): boolean {
  if (!a && !b) {
    return true;
  }

  if (!a || !b) {
    return false;
  }

  return (
    a.workoutsPerWeek === b.workoutsPerWeek &&
    a.workoutHoursPerWeek === b.workoutHoursPerWeek &&
    a.yogaHoursPerWeek === b.yogaHoursPerWeek &&
    a.strengthTrainingHoursPerWeek === b.strengthTrainingHoursPerWeek &&
    a.cardioHoursPerWeek === b.cardioHoursPerWeek &&
    a.walkingHoursPerWeek === b.walkingHoursPerWeek &&
    a.averageDailySteps === b.averageDailySteps &&
    JSON.stringify(a.activityTypes ?? []) === JSON.stringify(b.activityTypes ?? [])
  );
}

/** Parse weight from display text; returns kg or null if unparseable. */
export function parseWeightToKg(
  value: string,
  units: UnitsPreference = "imperial",
): number | null {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) {
    return null;
  }

  const lbMatch = trimmed.match(/^([\d.]+)\s*(?:lb|lbs|pounds?)?$/);
  if (lbMatch) {
    return Math.round(Number(lbMatch[1]) * 0.453592 * 10) / 10;
  }

  const kgMatch = trimmed.match(/^([\d.]+)\s*(?:kg|kilograms?)?$/);
  if (kgMatch) {
    return Math.round(Number(kgMatch[1]) * 10) / 10;
  }

  const numeric = Number(trimmed.replace(/[^\d.]/g, ""));
  if (Number.isNaN(numeric) || numeric <= 0) {
    return null;
  }

  return units === "imperial"
    ? Math.round(numeric * 0.453592 * 10) / 10
    : Math.round(numeric * 10) / 10;
}

/** Parse height from display text; returns cm or null if unparseable. */
export function parseHeightToCm(
  value: string,
  units: UnitsPreference = "imperial",
): number | null {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) {
    return null;
  }

  const ftInMatch = trimmed.match(
    /^(\d+)\s*(?:ft|feet|')\s*(\d+(?:\.\d+)?)?\s*(?:in|inches|")?$/,
  );
  if (ftInMatch) {
    const feet = Number(ftInMatch[1]);
    const inches = ftInMatch[2] ? Number(ftInMatch[2]) : 0;
    return Math.round((feet * 12 + inches) * 2.54);
  }

  const cmMatch = trimmed.match(/^([\d.]+)\s*(?:cm|centimeters?)?$/);
  if (cmMatch) {
    return Math.round(Number(cmMatch[1]));
  }

  const numeric = Number(trimmed.replace(/[^\d.]/g, ""));
  if (Number.isNaN(numeric) || numeric <= 0) {
    return null;
  }

  return units === "imperial" ? Math.round(numeric * 2.54) : Math.round(numeric);
}

export function parseBodyFatPct(value: string): number | undefined {
  const trimmed = value.trim().replace("%", "");
  if (!trimmed) {
    return undefined;
  }
  const numeric = Number(trimmed);
  return Number.isNaN(numeric) || numeric <= 0 ? undefined : numeric;
}

export function feetInchesToCm(feet: number, inches: number): number {
  return Math.round((feet * 12 + inches) * 2.54);
}

export function cmToFeetInches(heightCm: number): { feet: number; inches: number } {
  const totalInches = Math.round(heightCm / 2.54);
  return {
    feet: Math.floor(totalInches / 12),
    inches: totalInches % 12,
  };
}

export function lbToKg(weightLb: number): number {
  return Math.round(weightLb * 0.453592 * 10) / 10;
}

export function kgToLb(weightKg: number): number {
  return Math.round(weightKg / 0.453592);
}

export const BODY_FAT_RANGE_OPTIONS = [
  { value: "", label: "Not set", midpoint: undefined },
  { value: "under-18", label: "Under 18%", midpoint: 16 },
  { value: "18-21", label: "18–21%", midpoint: 20 },
  { value: "22-25", label: "22–25%", midpoint: 24 },
  { value: "26-29", label: "26–29%", midpoint: 28 },
  { value: "30-34", label: "30–34%", midpoint: 32 },
  { value: "35-plus", label: "35%+", midpoint: 38 },
] as const;

export type BodyFatRangeKey = (typeof BODY_FAT_RANGE_OPTIONS)[number]["value"];

export function bodyFatPctToRangeKey(bodyFatPct?: number): BodyFatRangeKey {
  if (bodyFatPct === undefined) {
    return "";
  }
  if (bodyFatPct < 18) {
    return "under-18";
  }
  if (bodyFatPct <= 21) {
    return "18-21";
  }
  if (bodyFatPct <= 25) {
    return "22-25";
  }
  if (bodyFatPct <= 29) {
    return "26-29";
  }
  if (bodyFatPct <= 34) {
    return "30-34";
  }
  return "35-plus";
}

export function bodyFatRangeKeyToPct(key: BodyFatRangeKey): number | undefined {
  const option = BODY_FAT_RANGE_OPTIONS.find((entry) => entry.value === key);
  return option?.midpoint;
}

export function formatWeightDisplay(weightKg: number, units: UnitsPreference): string {
  if (units === "metric") {
    return `${Math.round(weightKg * 10) / 10} kg`;
  }
  return `${Math.round(weightKg / 0.453592)} lb`;
}

export function formatHeightDisplay(heightCm: number, units: UnitsPreference): string {
  if (units === "metric") {
    return `${heightCm} cm`;
  }
  const totalInches = Math.round(heightCm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet} ft ${inches} in`;
}

export function toUserProfile(input: {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  bodyFatPct?: number;
  activityLevel: ActivityLevel;
  detailedActivityProfile?: DetailedActivityProfile;
}) {
  return {
    age: input.age,
    sex: input.sex,
    heightCm: input.heightCm,
    weightKg: input.weightKg,
    bodyFatPct: input.bodyFatPct,
    activityLevel: input.activityLevel,
    detailedActivityProfile: undefined,
  };
}