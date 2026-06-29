"use client";

import { useRouter } from "next/navigation";
import type { NutritionPlan } from "../../types/profile";
import { AppButton, AppCard } from "../ui/primitives";
import { planTypeLabel, WEEKLY_PATTERN_PATH } from "./weeklyPatternShared";
import {
  profileColors,
  profileSans,
  profileSectionTitleStyle,
} from "./theme";

interface WeeklyCaloriePatternPreviewCardProps {
  plan: NutritionPlan;
}

export function WeeklyCaloriePatternPreviewCard({
  plan,
}: WeeklyCaloriePatternPreviewCardProps) {
  const router = useRouter();
  const enabled = plan.calorieCyclingEnabled === true;
  const cyclingType = plan.calorieCyclingType ?? "same_daily";
  const summaryLine = enabled
    ? planTypeLabel(cyclingType)
    : "Same target every day";

  return (
    <AppCard variant="soft" padding="14px">
      <div style={{ marginBottom: "12px" }}>
        <h3 style={{ ...profileSectionTitleStyle(), marginBottom: "2px" }}>
          Weekly calorie pattern
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "0.76rem",
            color: profileColors.textSecondary,
            fontFamily: profileSans,
            lineHeight: 1.35,
          }}
        >
          {summaryLine}
        </p>
      </div>

      <AppButton
        variant="secondary"
        onClick={() => router.push(WEEKLY_PATTERN_PATH)}
        style={{ width: "100%" }}
      >
        {enabled ? "Edit plan" : "Set up"}
      </AppButton>
    </AppCard>
  );
}
