"use client";

import { useMemo } from "react";
import type {
  AppProfile,
  CalorieCyclingType,
  NutritionPlan,
  WeekdayKey,
} from "../../types/profile";
import {
  WEEKDAY_KEYS,
  WEEKDAY_LABELS,
  WEEKEND_DAY_KEYS,
  buildWeeklyCalorieTargets,
  calculateWeeklyTargetTotal,
  getSafeMinimumForProfile,
  weeklyTotalStatus,
} from "../../lib/calorieCycling";
import { formatNumber } from "../../lib/theme";
import { routes } from "../../lib/routes";
import { profileColors, profileSans } from "./theme";

export const WEEKLY_PATTERN_PATH = routes.weeklyCaloriePattern;

export const PLAN_TYPE_OPTIONS = [
  {
    id: "same_daily" as const,
    label: "Same target every day",
    description: "Use your daily average all week.",
  },
  {
    id: "weekend_high" as const,
    label: "Higher weekends, lower weekdays",
    description: "Shift more calories to your high days.",
  },
  {
    id: "custom" as const,
    label: "Custom weekly split",
    description: "Set each day yourself.",
  },
];

export const BOOST_OPTIONS = [
  {
    id: "mild" as const,
    label: "Mild",
    description: "+150 to +200 kcal on high days",
  },
  {
    id: "moderate" as const,
    label: "Moderate",
    description: "+250 to +350 kcal on high days",
  },
  { id: "custom" as const, label: "Custom", description: "Choose your own boost" },
];

export function planTypeLabel(type: CalorieCyclingType | undefined): string {
  return (
    PLAN_TYPE_OPTIONS.find((option) => option.id === type)?.label ??
    "Same target every day"
  );
}

export function useWeeklyPatternSummary(profile: AppProfile, plan: NutritionPlan) {
  const safeMinimum = getSafeMinimumForProfile(profile);
  const weeklyGoal = plan.calorieTarget * 7;
  const enabled = plan.calorieCyclingEnabled === true;
  const cyclingType = plan.calorieCyclingType ?? "same_daily";
  const highCalorieDays = plan.highCalorieDays ?? WEEKEND_DAY_KEYS;

  const dailyTargets = useMemo(
    () => buildWeeklyCalorieTargets(plan, safeMinimum),
    [plan, safeMinimum],
  );

  const weeklyTotal = calculateWeeklyTargetTotal(dailyTargets);
  const totalStatus = weeklyTotalStatus(weeklyTotal, weeklyGoal);
  const maxBarTarget = Math.max(...WEEKDAY_KEYS.map((day) => dailyTargets[day]));

  const summaryLabel = enabled
    ? planTypeLabel(cyclingType)
    : planTypeLabel("same_daily");

  return {
    safeMinimum,
    weeklyGoal,
    enabled,
    cyclingType,
    highCalorieDays,
    dailyTargets,
    weeklyTotal,
    totalStatus,
    maxBarTarget,
    summaryLabel,
  };
}

export function WeeklyTargetBar({
  day,
  target,
  maxTarget,
  isHighDay,
}: {
  day: WeekdayKey;
  target: number;
  maxTarget: number;
  isHighDay: boolean;
}) {
  const widthPct = maxTarget > 0 ? Math.max(8, (target / maxTarget) * 100) : 8;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "72px 1fr auto",
        alignItems: "center",
        gap: "10px",
        padding: "8px 10px",
        borderRadius: "12px",
        backgroundColor: isHighDay ? profileColors.blushBg : profileColors.cardSoft,
        border: `1px solid ${isHighDay ? profileColors.blushBorder : profileColors.border}`,
      }}
    >
      <span
        style={{
          fontSize: "0.76rem",
          fontWeight: 600,
          color: profileColors.text,
          fontFamily: profileSans,
        }}
      >
        {WEEKDAY_LABELS[day].slice(0, 3)}
      </span>
      <div
        style={{
          height: "8px",
          borderRadius: "999px",
          backgroundColor: profileColors.cream,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${widthPct}%`,
            height: "100%",
            borderRadius: "999px",
            backgroundColor: isHighDay
              ? profileColors.terracotta
              : profileColors.sage,
          }}
        />
      </div>
      <span
        style={{
          fontSize: "0.76rem",
          fontWeight: 600,
          color: profileColors.text,
          fontFamily: profileSans,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {formatNumber(target)}
      </span>
    </div>
  );
}
