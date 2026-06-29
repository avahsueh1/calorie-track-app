"use client";

import { ChevronRight, Flame } from "lucide-react";
import type { AppProfile } from "../../types/profile";
import { getActivityLevelOption } from "../../lib/activityLevelOptions";
import { getGoalDirectionLabel } from "../../lib/goalOptions";
import { routes } from "../../lib/routes";
import { formatNumber } from "../../lib/theme";
import { ProfileSettingsModuleLink } from "./ProfileSettingsModuleLink";
import {
  profileSettingsModuleCardStyle,
  profileSettingsModuleHeaderStyle,
  profileSettingsModuleIconStyle,
} from "./shared";
import {
  profileColors,
  profileSans,
  profileSectionTitleStyle,
} from "./theme";

interface CalorieSettingsSectionProps {
  profile: AppProfile;
}

export function CalorieSettingsSection({ profile }: CalorieSettingsSectionProps) {
  const calorieTarget = profile.nutritionPlan.calorieTarget;
  const goalLabel = getGoalDirectionLabel(profile.goalDirection);
  const activityLabel = getActivityLevelOption(profile.activityLevel).label;

  return (
    <section style={profileSettingsModuleCardStyle()}>
      <div style={profileSettingsModuleHeaderStyle()}>
        <span
          aria-hidden="true"
          style={profileSettingsModuleIconStyle(
            profileColors.blushBg,
            profileColors.terracotta,
          )}
        >
          <Flame size={20} strokeWidth={2.2} />
        </span>
        <div style={{ flex: 1, minWidth: 0, paddingTop: "2px" }}>
          <h2
            style={{
              ...profileSectionTitleStyle(),
              margin: "0 0 6px",
            }}
          >
            Calorie settings
          </h2>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: "0.84rem",
              fontWeight: 600,
              color: profileColors.text,
              fontFamily: profileSans,
              lineHeight: 1.35,
            }}
          >
            {formatNumber(calorieTarget)} kcal/day · {goalLabel}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "0.76rem",
              color: profileColors.textSecondary,
              fontFamily: profileSans,
              lineHeight: 1.4,
            }}
          >
            {activityLabel}
          </p>
        </div>
      </div>

      <ProfileSettingsModuleLink href={routes.calorieSettings}>
        Change plan
        <ChevronRight size={16} strokeWidth={2.2} />
      </ProfileSettingsModuleLink>
    </section>
  );
}
