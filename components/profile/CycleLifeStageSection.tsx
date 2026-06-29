"use client";

import { ChevronRight, Moon } from "lucide-react";
import type { AppProfile, ProfileLifeStage } from "../../types/profile";
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

const LIFE_STAGE_LABELS: Record<ProfileLifeStage, string> = {
  regular_cycle: "Regular cycle",
  irregular_cycle: "Irregular cycle",
  perimenopause: "Perimenopause",
  menopause: "Menopause",
  postpartum: "Postpartum",
  prefer_not_to_say: "Prefer not to say",
};

interface CycleLifeStageSectionProps {
  profile: AppProfile;
  cycleTrackingEnabled: boolean;
}

export function CycleLifeStageSection({
  profile,
  cycleTrackingEnabled,
}: CycleLifeStageSectionProps) {
  const lifeStageLabel = LIFE_STAGE_LABELS[profile.lifeStage];
  const trackingSummary = cycleTrackingEnabled ? "Tracking on" : "Tracking off";
  const cycleSummary = cycleTrackingEnabled
    ? `${profile.averageCycleLength}-day cycle · ${profile.averagePeriodLength}-day period`
    : lifeStageLabel;

  return (
    <section style={profileSettingsModuleCardStyle()}>
      <div style={profileSettingsModuleHeaderStyle()}>
        <span
          aria-hidden="true"
          style={profileSettingsModuleIconStyle(
            profileColors.lavender,
            profileColors.terracottaDark,
          )}
        >
          <Moon size={20} strokeWidth={2.2} />
        </span>
        <div style={{ flex: 1, minWidth: 0, paddingTop: "2px" }}>
          <h2
            style={{
              ...profileSectionTitleStyle(),
              margin: "0 0 6px",
            }}
          >
            Cycle &amp; life stage
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
            {trackingSummary} · {lifeStageLabel}
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
            {cycleSummary}
          </p>
        </div>
      </div>

      <ProfileSettingsModuleLink href="/profile/cycle-settings">
        Change cycle settings
        <ChevronRight size={16} strokeWidth={2.2} />
      </ProfileSettingsModuleLink>
    </section>
  );
}
