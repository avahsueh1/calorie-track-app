"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AppShell } from "../../../components/ui/AppShell";
import { ActivityBaselineCard } from "../../../components/profile/ActivityBaselineCard";
import { BodyEnergyCard } from "../../../components/profile/BodyEnergyCard";
import { CaloriePlanCard } from "../../../components/profile/CaloriePlanCard";
import { GoalsCard } from "../../../components/profile/GoalsCard";
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
import { useProfile, useTrackingPreferences } from "../../../components/providers/AppStateProvider";
import {
  feetInchesToCm,
  getProfileEnergyMetrics,
  kgToLb,
  lbToKg,
} from "../../../lib/profileBody";
import { routes } from "../../../lib/routes";
import type { ActivityLevel, Sex } from "../../../types";
import type {
  GoalDirection,
  GoalRatePreference,
  NutritionPlan,
} from "../../../types/profile";

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

export default function CalorieSettingsPage() {
  const { profile, updateProfile } = useProfile();
  const { calorieTrackingEnabled } = useTrackingPreferences();
  const { draftProfile, patchDraft, savedMessage } = useProfileDraft({
    profile,
    onSave: updateProfile,
  });

  const energyMetrics = useMemo(
    () => getProfileEnergyMetrics(draftProfile),
    [draftProfile],
  );
  const { bmr: displayBmr, maintenanceTdee: displayTdee } = energyMetrics;

  function handleHeightChange(feet: number, inches: number) {
    patchDraft({ heightCm: feetInchesToCm(feet, inches) });
  }

  function handleWeightLbChange(weightLb: number) {
    patchDraft({ weightKg: lbToKg(weightLb) });
  }

  if (!calorieTrackingEnabled) {
    return (
      <AppShell mainStyle={profileMainStyle()}>
        <BackToProfileLink />
        <p style={{ ...profileHelperStyle(), margin: 0 }}>
          Nutrition tracking is turned off. Enable it under{" "}
          <Link href={routes.profile} style={{ color: profileColors.terracotta }}>
            What would you like to track?
          </Link>{" "}
          on your profile to edit calorie settings.
        </p>
      </AppShell>
    );
  }

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
          Calorie plan
        </h1>
        <p style={{ ...profileHelperStyle(), margin: 0 }}>
          Changes apply across Today, Log, and Insights.
        </p>
      </header>

      <ProfileSettingsTabs active="calorie" />

      <BodyEnergyCard
        age={draftProfile.age}
        sex={draftProfile.sex}
        heightCm={draftProfile.heightCm}
        weightLb={kgToLb(draftProfile.weightKg)}
        bodyFatPct={draftProfile.bodyFatPct}
        bmr={displayBmr}
        tdee={displayTdee}
        onAgeChange={(value) => patchDraft({ age: value })}
        onSexChange={(value: Sex) => patchDraft({ sex: value })}
        onHeightChange={handleHeightChange}
        onWeightLbChange={handleWeightLbChange}
        onBodyFatPctChange={(value) => patchDraft({ bodyFatPct: value })}
      />

      <ActivityBaselineCard
        activityLevel={draftProfile.activityLevel}
        onActivityLevelChange={(value: ActivityLevel) =>
          patchDraft({
            activityLevel: value,
            detailedActivityProfile: undefined,
          })
        }
      />

      <GoalsCard
        profile={draftProfile}
        goalDirection={draftProfile.goalDirection}
        goalRate={draftProfile.goalRate}
        onGoalDirectionChange={(value: GoalDirection) =>
          patchDraft({ goalDirection: value })
        }
        onGoalRateChange={(value: GoalRatePreference) =>
          patchDraft({ goalRate: value })
        }
      />

      <CaloriePlanCard
        profile={draftProfile}
        onNutritionPlanChange={(nutritionPlan: NutritionPlan) =>
          patchDraft({ nutritionPlan })
        }
      />

      <ProfileSavedStatus message={savedMessage} />
    </AppShell>
  );
}
