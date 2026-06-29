"use client";

import { useMemo } from "react";
import type { ActivityLevel } from "../../types";
import { ACTIVITY_LEVEL_OPTIONS } from "../../lib/activityLevelOptions";
import { profileCardPadding } from "./shared";
import { ProfileCollapsibleOptionGroup } from "./ProfileCollapsibleOptionGroup";
import {
  profileCardStyle,
  profileHelperStyle,
  profileSectionTitleStyle,
} from "./theme";

interface ActivityBaselineCardProps {
  activityLevel: ActivityLevel;
  onActivityLevelChange: (value: ActivityLevel) => void;
}

export function ActivityBaselineCard({
  activityLevel,
  onActivityLevelChange,
}: ActivityBaselineCardProps) {
  const options = useMemo(
    () =>
      ACTIVITY_LEVEL_OPTIONS.map((option) => ({
        id: option.id,
        label: option.label,
        subtitle: option.subtitle,
        description: option.description,
        examples: option.examples,
      })),
    [],
  );

  return (
    <section style={{ ...profileCardStyle(), ...profileCardPadding() }}>
      <h2 style={{ ...profileSectionTitleStyle(), marginBottom: "6px" }}>
        Activity Baseline
      </h2>
      <p
        style={{
          ...profileHelperStyle(),
          marginBottom: "14px",
          fontSize: "0.76rem",
        }}
      >
        Choose the option that best matches a typical week. This shapes your
        maintenance calorie estimate above.
      </p>

      <ProfileCollapsibleOptionGroup
        name="profile-activity-level"
        label="Daily activity level"
        options={options}
        value={activityLevel}
        onChange={onActivityLevelChange}
      />
    </section>
  );
}
