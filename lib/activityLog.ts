import type { ActivityIntensity } from "../types/wellness";
import { estimateActivityCaloriesFromMET } from "./calories";

/** Broad activity categories shown in the log UI. */
export type LogActivityKind =
  | "walking"
  | "running"
  | "cycling"
  | "strength"
  | "yoga_pilates"
  | "sports"
  | "dance"
  | "housework"
  | "other";

export type OtherActivityIntensity = "light" | "moderate" | "vigorous";

export const LOG_ACTIVITY_OPTIONS: {
  id: LogActivityKind;
  label: string;
}[] = [
  { id: "walking", label: "Walking" },
  { id: "running", label: "Running" },
  { id: "cycling", label: "Cycling" },
  { id: "strength", label: "Strength training" },
  { id: "yoga_pilates", label: "Yoga / Pilates" },
  { id: "sports", label: "Sports" },
  { id: "dance", label: "Dance" },
  { id: "housework", label: "Housework" },
  { id: "other", label: "Other" },
];

/** Conservative MET defaults for preset log activity types. */
export const LOG_ACTIVITY_MET: Record<
  Exclude<LogActivityKind, "other">,
  number
> = {
  walking: 3.3,
  running: 8.0,
  cycling: 6.0,
  strength: 3.5,
  yoga_pilates: 2.5,
  sports: 5.0,
  dance: 4.5,
  housework: 3.0,
};

/** MET defaults when the user picks Other + intensity. */
export const OTHER_INTENSITY_MET: Record<OtherActivityIntensity, number> = {
  light: 2.5,
  moderate: 4.0,
  vigorous: 6.5,
};

export const OTHER_INTENSITY_OPTIONS: {
  id: OtherActivityIntensity;
  label: string;
}[] = [
  { id: "light", label: "Light" },
  { id: "moderate", label: "Moderate" },
  { id: "vigorous", label: "Vigorous" },
];

export function resolveLogActivityMet(
  kind: LogActivityKind,
  otherIntensity: OtherActivityIntensity = "moderate",
): number {
  if (kind === "other") {
    return OTHER_INTENSITY_MET[otherIntensity];
  }

  return LOG_ACTIVITY_MET[kind];
}

export function mapOtherIntensityToStored(
  intensity: OtherActivityIntensity,
): ActivityIntensity {
  if (intensity === "light") {
    return "Gentle";
  }

  if (intensity === "vigorous") {
    return "High";
  }

  return "Moderate";
}

export function presetStoredIntensity(kind: LogActivityKind): ActivityIntensity {
  if (kind === "running" || kind === "sports" || kind === "dance") {
    return "High";
  }

  if (
    kind === "yoga_pilates" ||
    kind === "housework" ||
    kind === "walking"
  ) {
    return "Gentle";
  }

  return "Moderate";
}

export function resolveLogActivityDisplayName(
  kind: LogActivityKind,
  customName?: string,
): string {
  if (kind === "other") {
    const trimmed = customName?.trim();
    return trimmed || "Other activity";
  }

  return (
    LOG_ACTIVITY_OPTIONS.find((option) => option.id === kind)?.label ??
    "Activity"
  );
}

/**
 * Estimate calories for a logged activity.
 * Manual calories win when provided — for users who already know the value.
 */
export function estimateLogActivityCalories(input: {
  kind: LogActivityKind;
  weightKg: number;
  durationMinutes: number;
  otherIntensity?: OtherActivityIntensity;
  manualCalories?: number;
}): number {
  if (input.manualCalories != null && input.manualCalories > 0) {
    return Math.round(input.manualCalories);
  }

  const met = resolveLogActivityMet(
    input.kind,
    input.otherIntensity ?? "moderate",
  );

  return estimateActivityCaloriesFromMET(
    met,
    input.weightKg,
    input.durationMinutes / 60,
  );
}

export function parsePositiveMinutes(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const minutes = Number(trimmed);
  if (Number.isNaN(minutes) || minutes <= 0) {
    return null;
  }

  return Math.round(minutes);
}

export function parseOptionalManualCalories(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const calories = Number(trimmed);
  if (Number.isNaN(calories) || calories <= 0) {
    return undefined;
  }

  return Math.round(calories);
}
