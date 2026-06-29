"use client";

import { useMemo } from "react";
import type { AppProfile, GoalDirection, GoalRatePreference } from "../../types/profile";
import {
  buildGoalRateOptions,
  GOAL_DIRECTION_OPTIONS,
  shouldShowGoalRatePicker,
} from "../../lib/goalOptions";
import {
  profileCardStyle,
  profileColors,
  profileHelperStyle,
  profileSectionTitleStyle,
} from "./theme";
import { profileCardPadding } from "./shared";
import { ProfileCollapsibleOptionGroup } from "./ProfileCollapsibleOptionGroup";

interface GoalsCardProps {
  profile: AppProfile;
  goalDirection: GoalDirection;
  goalRate: GoalRatePreference;
  onGoalDirectionChange: (value: GoalDirection) => void;
  onGoalRateChange: (value: GoalRatePreference) => void;
}

export function GoalsCard({
  profile,
  goalDirection,
  goalRate,
  onGoalDirectionChange,
  onGoalRateChange,
}: GoalsCardProps) {
  const showPace = shouldShowGoalRatePicker(goalDirection);

  const paceOptions = useMemo(
    () =>
      buildGoalRateOptions({
        age: profile.age,
        sex: profile.sex,
        heightCm: profile.heightCm,
        weightKg: profile.weightKg,
        bodyFatPct: profile.bodyFatPct,
        activityLevel: profile.activityLevel,
        detailedActivityProfile: profile.detailedActivityProfile,
        goalDirection,
        goalRate,
      }),
    [profile, goalDirection, goalRate],
  );

  return (
    <section style={{ ...profileCardStyle(), ...profileCardPadding() }}>
      <h2 style={{ ...profileSectionTitleStyle(), marginBottom: "14px" }}>Goals</h2>

      <ProfileCollapsibleOptionGroup
        name="profile-goal-direction"
        label="Goal direction"
        options={GOAL_DIRECTION_OPTIONS}
        value={goalDirection}
        onChange={onGoalDirectionChange}
      />

      {showPace ? (
        <ProfileCollapsibleOptionGroup
          name="profile-goal-rate"
          label="Preferred pace"
          options={paceOptions}
          value={goalRate}
          onChange={onGoalRateChange}
        />
      ) : null}

      <p
        style={{
          ...profileHelperStyle(),
          padding: "10px 12px",
          borderRadius: "12px",
          backgroundColor: profileColors.cream,
          border: `1px solid ${profileColors.divider}`,
          margin: 0,
        }}
      >
        {showPace
          ? "Pace sets your calorie target and an estimated weekly weight change. Your calorie plan below updates automatically."
          : "Your calorie plan below updates from this goal and your profile."}
      </p>
    </section>
  );
}
