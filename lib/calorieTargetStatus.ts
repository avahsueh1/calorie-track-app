export const CALORIE_TARGET_NEAR_BAND = 100;

export type CalorieTargetStatus = "under" | "near" | "over" | "noData";

export interface CalorieTargetStatusInput {
  eaten?: number;
  burned?: number;
  target: number;
  netCalories?: number | null;
}

export function getCalorieTargetStatus({
  eaten = 0,
  burned = 0,
  target,
  netCalories,
}: CalorieTargetStatusInput): CalorieTargetStatus {
  const eatenVal = eaten ?? 0;
  const burnedVal = burned ?? 0;
  const hasLog =
    eatenVal > 0 || burnedVal > 0 || netCalories != null;

  if (!hasLog) {
    return "noData";
  }

  const net = netCalories ?? eatenVal - burnedVal;
  const min = target - CALORIE_TARGET_NEAR_BAND;
  const max = target + CALORIE_TARGET_NEAR_BAND;

  if (net < min) {
    return "under";
  }
  if (net > max) {
    return "over";
  }
  return "near";
}

export function getCalorieTargetRange(calorieTarget: number): {
  target: number;
  min: number;
  max: number;
} {
  return {
    target: calorieTarget,
    min: calorieTarget - CALORIE_TARGET_NEAR_BAND,
    max: calorieTarget + CALORIE_TARGET_NEAR_BAND,
  };
}

export function isNearCalorieTarget(net: number, target: number): boolean {
  return getCalorieTargetStatus({ target, netCalories: net }) === "near";
}
