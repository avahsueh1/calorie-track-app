import {
  formatHeightDisplay,
  formatWeightDisplay,
} from "./profileBody";
import {
  nutritionPlanFromProfileInput,
  syncFormulaNutritionPlan,
} from "./nutritionPlan";
import type { AppProfile } from "../types/profile";

/** Apply profile field updates and keep nutrition plan in sync with goals/body inputs. */
export function applyProfilePatch(
  current: AppProfile,
  updates: Partial<AppProfile>,
): AppProfile {
  const next: AppProfile = { ...current, ...updates };

  if (updates.heightCm !== undefined) {
    next.heightDisplay = formatHeightDisplay(next.heightCm, next.units);
  }

  if (updates.weightKg !== undefined) {
    next.weightDisplay = formatWeightDisplay(next.weightKg, next.units);
  }

  if (updates.units !== undefined && updates.units !== current.units) {
    next.heightDisplay = formatHeightDisplay(next.heightCm, next.units);
    next.weightDisplay = formatWeightDisplay(next.weightKg, next.units);
  }

  const nutritionInputsChanged =
    updates.goalRate !== undefined ||
    updates.goalDirection !== undefined ||
    updates.activityLevel !== undefined ||
    updates.age !== undefined ||
    updates.sex !== undefined ||
    updates.heightCm !== undefined ||
    updates.weightKg !== undefined ||
    updates.bodyFatPct !== undefined;

  if (
    nutritionInputsChanged &&
    next.nutritionPlan.source !== "manual"
  ) {
    next.nutritionPlan = nutritionPlanFromProfileInput(next);
  } else if (
    (updates.goalRate !== undefined || updates.goalDirection !== undefined) &&
    next.nutritionPlan.source !== "manual"
  ) {
    next.nutritionPlan = nutritionPlanFromProfileInput(next);
  }

  return syncFormulaNutritionPlan(next);
}
