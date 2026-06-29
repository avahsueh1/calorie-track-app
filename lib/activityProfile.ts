import type { ActivityType, DetailedActivityProfile } from "../types/activity";

export const ACTIVITY_TYPE_OPTIONS: { id: ActivityType; label: string }[] = [
  { id: "yoga", label: "Yoga" },
  { id: "strength", label: "Strength" },
  { id: "cardio", label: "Cardio" },
  { id: "walking", label: "Walking" },
  { id: "pilates", label: "Pilates" },
  { id: "cycling", label: "Cycling" },
  { id: "running", label: "Running" },
  { id: "mixed", label: "Mixed" },
];

/** Parse a non-negative number from user input; empty → undefined. */
export function parseOptionalPositiveNumber(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const numeric = Number(trimmed);
  if (Number.isNaN(numeric) || numeric < 0) {
    return undefined;
  }

  return numeric;
}

function pickPositive(
  value: number | undefined,
): number | undefined {
  if (value === undefined || value <= 0) {
    return undefined;
  }

  return value;
}

/** Strip empty/zero values so storage stays clean and fallback logic works. */
export function normalizeDetailedActivityProfile(
  profile?: DetailedActivityProfile | null,
): DetailedActivityProfile | undefined {
  if (!profile) {
    return undefined;
  }

  const normalized: DetailedActivityProfile = {};

  // workoutsPerWeek / workoutHoursPerWeek omitted — use training mix hours.

  const yogaHoursPerWeek = pickPositive(profile.yogaHoursPerWeek);
  if (yogaHoursPerWeek !== undefined) {
    normalized.yogaHoursPerWeek = yogaHoursPerWeek;
  }

  const strengthTrainingHoursPerWeek = pickPositive(
    profile.strengthTrainingHoursPerWeek,
  );
  if (strengthTrainingHoursPerWeek !== undefined) {
    normalized.strengthTrainingHoursPerWeek = strengthTrainingHoursPerWeek;
  }

  const cardioHoursPerWeek = pickPositive(profile.cardioHoursPerWeek);
  if (cardioHoursPerWeek !== undefined) {
    normalized.cardioHoursPerWeek = cardioHoursPerWeek;
  }

  const walkingHoursPerWeek = pickPositive(profile.walkingHoursPerWeek);
  if (walkingHoursPerWeek !== undefined) {
    normalized.walkingHoursPerWeek = walkingHoursPerWeek;
  }

  const averageDailySteps = pickPositive(profile.averageDailySteps);
  if (averageDailySteps !== undefined) {
    normalized.averageDailySteps = Math.round(averageDailySteps);
  }

  const activityTypes = [...new Set(profile.activityTypes ?? [])];
  if (activityTypes.length > 0) {
    normalized.activityTypes = activityTypes;
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

export function toggleActivityType(
  current: ActivityType[] | undefined,
  type: ActivityType,
): ActivityType[] | undefined {
  const selected = current ?? [];
  const next = selected.includes(type)
    ? selected.filter((entry) => entry !== type)
    : [...selected, type];

  return next.length > 0 ? next : undefined;
}
