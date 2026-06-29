/** Specific exercise categories used for MET-based calorie estimates. */
export type ActivityType =
  | "yoga"
  | "strength"
  | "cardio"
  | "walking"
  | "pilates"
  | "cycling"
  | "running"
  | "mixed";

/**
 * Optional, more detailed activity inputs for TDEE estimates.
 * All fields are optional so existing profiles keep working unchanged.
 */
export interface DetailedActivityProfile {
  /** @deprecated Use training mix hours instead. */
  workoutsPerWeek?: number;
  /** @deprecated Use training mix hours instead; kept for legacy saved profiles. */
  workoutHoursPerWeek?: number;
  yogaHoursPerWeek?: number;
  strengthTrainingHoursPerWeek?: number;
  cardioHoursPerWeek?: number;
  walkingHoursPerWeek?: number;
  /** Average daily step count — used for a separate step-calorie estimate. */
  averageDailySteps?: number;
  /** Workout styles when weekly hours are known but not split by type. */
  activityTypes?: ActivityType[];
}
