"use client";

import Link from "next/link";
import { AppShell } from "../../../components/ui/AppShell";
import { CycleLifeStageCard } from "../../../components/profile/CycleLifeStageCard";
import { ProfileSettingsTabs } from "../../../components/profile/ProfileSettingsTabs";
import { ProfileSavedStatus } from "../../../components/profile/ProfileSavedStatus";
import { useProfileDraft } from "../../../components/profile/useProfileDraft";
import {
  profileColors,
  profileHelperStyle,
  profileMainStyle,
  profileSans,
  profileSerif,
} from "../../../components/profile/theme";
import { useProfile } from "../../../components/providers/AppStateProvider";
import { routes } from "../../../lib/routes";
import type { ProfileLifeStage } from "../../../types/profile";

function BackToProfileLink() {
  return (
    <Link
      href={routes.profile}
      style={{
        alignSelf: "flex-start",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 0",
        background: "transparent",
        fontFamily: profileSans,
        fontSize: "0.8125rem",
        fontWeight: 500,
        color: profileColors.textSecondary,
        textDecoration: "none",
        lineHeight: 1.3,
      }}
    >
      ← Back to Profile
    </Link>
  );
}

export default function CycleSettingsPage() {
  const { profile, updateProfile } = useProfile();
  const { draftProfile, patchDraft, savedMessage } = useProfileDraft({
    profile,
    onSave: updateProfile,
  });

  return (
    <AppShell mainStyle={profileMainStyle()}>
      <BackToProfileLink />

      <header>
        <h1
          style={{
            margin: "0 0 6px",
            fontFamily: profileSerif,
            fontSize: "1.75rem",
            fontWeight: 400,
            color: profileColors.text,
            letterSpacing: "-0.02em",
          }}
        >
          Cycle &amp; life stage
        </h1>
        <p style={{ ...profileHelperStyle(), margin: 0 }}>
          Optional context for patterns across Insights and your calendar.
        </p>
      </header>

      <ProfileSettingsTabs active="cycle" />

      <CycleLifeStageCard
        cycleTrackingEnabled={draftProfile.cycleTrackingEnabled}
        lifeStage={draftProfile.lifeStage}
        averageCycleLength={String(draftProfile.averageCycleLength)}
        averagePeriodLength={String(draftProfile.averagePeriodLength)}
        onCycleTrackingChange={(enabled) =>
          patchDraft({ cycleTrackingEnabled: enabled })
        }
        onLifeStageChange={(value: ProfileLifeStage) =>
          patchDraft({ lifeStage: value })
        }
        onAverageCycleLengthChange={(value) =>
          patchDraft({
            averageCycleLength: Number(value) || draftProfile.averageCycleLength,
          })
        }
        onAveragePeriodLengthChange={(value) =>
          patchDraft({
            averagePeriodLength: Number(value) || draftProfile.averagePeriodLength,
          })
        }
      />

      <ProfileSavedStatus message={savedMessage} />
    </AppShell>
  );
}
