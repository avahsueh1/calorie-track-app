import type { GoalDirection, GoalRatePreference } from "../types/profile";
import { formatNumber } from "./theme";
import {
  formatWeeklyWeightChangePhrase,
  generateSuggestedNutritionPlan,
  getGoalCalorieAdjustment,
  goalDirectionHasPaceAdjustment,
  type NutritionPlanInput,
  type SuggestedNutritionPlan,
} from "./nutritionPlan";

export interface GoalOption<T extends string> {
  id: T;
  label: string;
  description: string;
}

export const GOAL_DIRECTION_OPTIONS: GoalOption<GoalDirection>[] = [
  {
    id: "maintain",
    label: "Maintain",
    description:
      "Eat around maintenance — no intentional surplus or deficit.",
  },
  {
    id: "gentle_fat_loss",
    label: "Gentle fat loss",
    description:
      "Light deficit (~250 kcal/day) — slow, sustainable loss of about ½ lb per week.",
  },
  {
    id: "fat_loss",
    label: "Fat loss",
    description:
      "Moderate deficit (~500 kcal/day) — faster loss when you have room above safe minimums.",
  },
  {
    id: "build_muscle",
    label: "Muscle gain",
    description:
      "Small surplus (~200–300 kcal/day) with steady protein for strength and recovery.",
  },
  {
    id: "improve_energy",
    label: "Performance / energy",
    description:
      "At or slightly above maintenance — extra fuel for workouts and busy days.",
  },
  {
    id: "recovery_consistency",
    label: "Recovery / consistency",
    description:
      "Flexible targets — prioritize showing up and steady habits over perfect numbers.",
  },
];

const GOAL_RATE_META: Record<
  GoalRatePreference,
  Pick<GoalOption<GoalRatePreference>, "label" | "description">
> = {
  slow: {
    label: "Slow",
    description: "Smaller calorie shifts — gentler pace.",
  },
  moderate: {
    label: "Moderate",
    description: "Balanced pace — default for most people.",
  },
  faster: {
    label: "Faster",
    description: "A bit more aggressive, still clamped to safe minimums.",
  },
};

export const GOAL_RATE_OPTIONS: GoalOption<GoalRatePreference>[] = (
  ["slow", "moderate", "faster"] as const
).map((id) => ({
  id,
  ...GOAL_RATE_META[id],
}));

export interface GoalRateSelectableOption extends GoalOption<GoalRatePreference> {
  subtitle?: string;
}

export function buildGoalRateOptions(
  input: NutritionPlanInput,
): GoalRateSelectableOption[] {
  return (["slow", "moderate", "faster"] as const).map((goalRate) => {
    const suggested = generateSuggestedNutritionPlan({ ...input, goalRate });
    const weeklyPhrase = formatWeeklyWeightChangePhrase(
      suggested.maintenanceTdee,
      suggested.calorieTarget,
    );
    const subtitle = weeklyPhrase
      ? `${formatNumber(suggested.calorieTarget)} kcal/day · ${weeklyPhrase}`
      : `${formatNumber(suggested.calorieTarget)} kcal/day`;

    return {
      id: goalRate,
      label: GOAL_RATE_META[goalRate].label,
      subtitle,
      description: GOAL_RATE_META[goalRate].description,
    };
  });
}

export function shouldShowGoalRatePicker(goalDirection: GoalDirection): boolean {
  return goalDirectionHasPaceAdjustment(goalDirection);
}

export function getGoalDirectionLabel(goalDirection: GoalDirection): string {
  return (
    GOAL_DIRECTION_OPTIONS.find((option) => option.id === goalDirection)?.label ??
    "Maintain"
  );
}

export function describeSuggestedCalorieTarget(
  suggested: Pick<SuggestedNutritionPlan, "maintenanceTdee" | "goalDirection" | "goalRate" | "calorieTarget">,
): string {
  const adjustment = getGoalCalorieAdjustment(
    suggested.goalDirection,
    suggested.goalRate,
  );

  if (adjustment === 0) {
    return `About ${formatNumber(suggested.calorieTarget)} kcal — matches your maintenance estimate.`;
  }

  const direction = adjustment < 0 ? "below" : "above";
  return `About ${formatNumber(suggested.calorieTarget)} kcal — roughly ${formatNumber(Math.abs(adjustment))} ${direction} maintenance.`;
}
