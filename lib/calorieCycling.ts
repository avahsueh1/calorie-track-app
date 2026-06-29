import type { Sex } from "../types";
import type {
  AppProfile,
  CalorieCyclingType,
  NutritionPlan,
  WeekdayKey,
  WeeklyDailyTargets,
  WeekendBoostPreset,
} from "../types/profile";
import { resolveBmr } from "./calories";

export const WEEKDAY_KEYS: WeekdayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const WEEKDAY_LABELS: Record<WeekdayKey, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const WEEKEND_DAY_KEYS: WeekdayKey[] = ["saturday", "sunday"];

export const BOOST_PRESET_VALUES: Record<
  Exclude<WeekendBoostPreset, "custom">,
  number
> = {
  mild: 175,
  moderate: 300,
};

const JS_DAY_TO_WEEKDAY: WeekdayKey[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function roundCalories(value: number): number {
  return Math.round(value / 5) * 5;
}

export function getWeekdayKeyFromDateKey(dateKey: string): WeekdayKey {
  const jsDay = new Date(`${dateKey}T12:00:00`).getDay();
  return JS_DAY_TO_WEEKDAY[jsDay] ?? "monday";
}

export function getSafeMinimumCalories(input: {
  sex: Sex;
  bmr: number;
}): number {
  return Math.max(
    input.sex === "male" ? 1500 : 1200,
    Math.round(input.bmr * 1.1),
  );
}

export function getSafeMinimumForProfile(profile: AppProfile): number {
  return getSafeMinimumCalories({
    sex: profile.sex,
    bmr: resolveBmr(profile),
  });
}

export function createUniformDailyTargets(
  calorieTarget: number,
): WeeklyDailyTargets {
  const rounded = roundCalories(calorieTarget);
  return {
    monday: rounded,
    tuesday: rounded,
    wednesday: rounded,
    thursday: rounded,
    friday: rounded,
    saturday: rounded,
    sunday: rounded,
  };
}

export function calculateWeeklyTargetTotal(
  targets: WeeklyDailyTargets,
): number {
  return WEEKDAY_KEYS.reduce((sum, day) => sum + targets[day], 0);
}

function distributeCalorieDelta(
  targets: WeeklyDailyTargets,
  delta: number,
): WeeklyDailyTargets {
  if (delta === 0) {
    return { ...targets };
  }

  const next = { ...targets };
  const step = delta > 0 ? 5 : -5;
  let remaining = Math.abs(delta);
  const order =
    delta > 0
      ? [...WEEKDAY_KEYS]
      : [...WEEKDAY_KEYS].reverse();

  while (remaining > 0) {
    let adjusted = false;
    for (const day of order) {
      if (remaining <= 0) {
        break;
      }
      const candidate = next[day] + step;
      if (candidate < 800) {
        continue;
      }
      next[day] = candidate;
      remaining -= 5;
      adjusted = true;
    }
    if (!adjusted) {
      break;
    }
  }

  return next;
}

export function rebalanceWeeklyTargets(
  targets: WeeklyDailyTargets,
  weeklyGoal: number,
): WeeklyDailyTargets {
  const rounded = WEEKDAY_KEYS.reduce(
    (acc, day) => {
      acc[day] = roundCalories(targets[day]);
      return acc;
    },
    {} as WeeklyDailyTargets,
  );

  const total = calculateWeeklyTargetTotal(rounded);
  return distributeCalorieDelta(rounded, weeklyGoal - total);
}

export function buildWeekendHighTargets(
  dailyTarget: number,
  highCalorieDays: WeekdayKey[],
  weekendBoost: number,
  safeMinimum: number,
): WeeklyDailyTargets {
  const weeklyCalories = dailyTarget * 7;
  const highDays =
    highCalorieDays.length > 0 ? highCalorieDays : WEEKEND_DAY_KEYS;
  const highCount = highDays.length;
  const lowCount = 7 - highCount;

  if (lowCount <= 0) {
    return createUniformDailyTargets(dailyTarget);
  }

  let highTarget = roundCalories(dailyTarget + weekendBoost);
  let lowTarget = roundCalories(
    (weeklyCalories - highTarget * highCount) / lowCount,
  );

  if (lowTarget < safeMinimum) {
    lowTarget = roundCalories(safeMinimum);
    highTarget = roundCalories(
      (weeklyCalories - lowTarget * lowCount) / highCount,
    );
    highTarget = Math.max(highTarget, safeMinimum);
  }

  const draft = createUniformDailyTargets(lowTarget);
  for (const day of highDays) {
    draft[day] = highTarget;
  }

  return rebalanceWeeklyTargets(draft, weeklyCalories);
}

export function buildWeeklyCalorieTargets(
  plan: NutritionPlan,
  safeMinimum = 1200,
): WeeklyDailyTargets {
  const averageTarget = plan.calorieTarget;
  const weeklyGoal = averageTarget * 7;
  const type = plan.calorieCyclingType ?? "same_daily";
  const enabled = plan.calorieCyclingEnabled === true;

  if (!enabled || type === "same_daily") {
    return createUniformDailyTargets(averageTarget);
  }

  if (type === "custom" && plan.dailyTargets) {
    return rebalanceWeeklyTargets(plan.dailyTargets, weeklyGoal);
  }

  const boost = plan.weekendBoost ?? BOOST_PRESET_VALUES.moderate;
  const highDays = plan.highCalorieDays ?? WEEKEND_DAY_KEYS;
  return buildWeekendHighTargets(averageTarget, highDays, boost, safeMinimum);
}

export function getCalorieTargetForDate(
  plan: NutritionPlan,
  dateKey: string,
  safeMinimum = 1200,
): number {
  const targets = buildWeeklyCalorieTargets(plan, safeMinimum);
  const weekday = getWeekdayKeyFromDateKey(dateKey);
  return targets[weekday];
}

export function getCalorieTargetForProfileDate(
  profile: AppProfile,
  dateKey: string,
): number {
  return getCalorieTargetForDate(
    profile.nutritionPlan,
    dateKey,
    getSafeMinimumForProfile(profile),
  );
}

export function getWeekendBoostFromPreset(
  preset: WeekendBoostPreset | undefined,
  customValue?: number,
): number {
  if (preset === "custom") {
    return roundCalories(customValue ?? BOOST_PRESET_VALUES.moderate);
  }
  if (preset === "mild") {
    return BOOST_PRESET_VALUES.mild;
  }
  return BOOST_PRESET_VALUES.moderate;
}

export function weeklyTotalStatus(
  total: number,
  weeklyGoal: number,
): "on_target" | "over" | "under" {
  if (total > weeklyGoal) {
    return "over";
  }
  if (total < weeklyGoal) {
    return "under";
  }
  return "on_target";
}

export function ensureCalorieCycling(
  plan: NutritionPlan,
  profile?: AppProfile,
): NutritionPlan {
  const safeMinimum = profile ? getSafeMinimumForProfile(profile) : 1200;
  const enabled = plan.calorieCyclingEnabled === true;
  const type: CalorieCyclingType = plan.calorieCyclingType ?? "same_daily";
  const preset = plan.weekendBoostPreset ?? "moderate";
  const boost =
    plan.weekendBoost ?? getWeekendBoostFromPreset(preset, plan.weekendBoost);
  const highCalorieDays = plan.highCalorieDays ?? WEEKEND_DAY_KEYS;

  const dailyTargets = buildWeeklyCalorieTargets(
    {
      ...plan,
      calorieCyclingEnabled: enabled,
      calorieCyclingType: type,
      weekendBoost: boost,
      weekendBoostPreset: preset,
      highCalorieDays,
      dailyTargets: plan.dailyTargets,
    },
    safeMinimum,
  );

  return {
    ...plan,
    calorieCyclingEnabled: enabled,
    calorieCyclingType: type,
    highCalorieDays,
    weekendBoost: boost,
    weekendBoostPreset: preset,
    dailyTargets,
  };
}

export function calorieCyclingFieldsEqual(
  a: NutritionPlan,
  b: NutritionPlan,
): boolean {
  return (
    a.calorieCyclingEnabled === b.calorieCyclingEnabled &&
    a.calorieCyclingType === b.calorieCyclingType &&
    a.weekendBoost === b.weekendBoost &&
    a.weekendBoostPreset === b.weekendBoostPreset &&
    JSON.stringify(a.highCalorieDays ?? []) ===
      JSON.stringify(b.highCalorieDays ?? []) &&
    JSON.stringify(a.dailyTargets ?? null) ===
      JSON.stringify(b.dailyTargets ?? null)
  );
}
