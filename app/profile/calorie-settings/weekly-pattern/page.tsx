"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../../../../components/ui/AppShell";
import { WeeklyCaloriePatternSetup } from "../../../../components/profile/WeeklyCaloriePatternSetup";
import {
  profileColors,
  profileHelperStyle,
  profileMainStyle,
  profileSans,
  profileSerif,
} from "../../../../components/profile/theme";
import { AppButton } from "../../../../components/ui/primitives";
import { useProfile, useTrackingPreferences } from "../../../../components/providers/AppStateProvider";
import {
  calorieCyclingFieldsEqual,
  ensureCalorieCycling,
} from "../../../../lib/calorieCycling";
import { routes } from "../../../../lib/routes";
import type { NutritionPlan } from "../../../../types/profile";

function BackToCalorieSettingsLink() {
  return (
    <Link
      href={routes.calorieSettings}
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
      ← Back to calorie settings
    </Link>
  );
}

export default function WeeklyCaloriePatternPage() {
  const { profile, updateProfile } = useProfile();
  const { calorieTrackingEnabled } = useTrackingPreferences();
  const [draftPlan, setDraftPlan] = useState<NutritionPlan | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    setDraftPlan(profile.nutritionPlan);
  }, [profile.nutritionPlan]);

  const hasChanges = useMemo(
    () =>
      draftPlan !== null &&
      !calorieCyclingFieldsEqual(draftPlan, profile.nutritionPlan),
    [draftPlan, profile.nutritionPlan],
  );

  useEffect(() => {
    if (hasChanges) {
      setShowSaved(false);
    }
  }, [hasChanges]);

  if (!calorieTrackingEnabled) {
    return (
      <AppShell mainStyle={profileMainStyle()}>
        <BackToCalorieSettingsLink />
        <p style={{ ...profileHelperStyle(), margin: 0 }}>
          Nutrition tracking is turned off. Turn it on from your profile to set a
          weekly calorie pattern.
        </p>
      </AppShell>
    );
  }

  if (!draftPlan) {
    return null;
  }

  function handlePlanChange(plan: NutritionPlan) {
    setDraftPlan(ensureCalorieCycling(plan, profile));
  }

  function handleSavePattern() {
    if (!draftPlan || !hasChanges) {
      return;
    }
    updateProfile({ nutritionPlan: draftPlan });
    setShowSaved(true);
  }

  return (
    <AppShell mainStyle={profileMainStyle()}>
      <BackToCalorieSettingsLink />

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
          Weekly calorie pattern
        </h1>
        <p style={{ ...profileHelperStyle(), margin: 0 }}>
          Adjust how your daily calorie target is spread across the week.
        </p>
      </header>

      <WeeklyCaloriePatternSetup
        profile={profile}
        plan={draftPlan}
        onPlanChange={handlePlanChange}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <AppButton
          variant="primary"
          onClick={handleSavePattern}
          disabled={!hasChanges}
          style={{
            width: "100%",
            opacity: hasChanges ? 1 : 0.45,
            cursor: hasChanges ? "pointer" : "not-allowed",
          }}
        >
          Save pattern
        </AppButton>

        {showSaved && !hasChanges ? (
          <div
            role="status"
            aria-live="polite"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: profileColors.sage,
              fontFamily: profileSans,
              fontSize: "0.82rem",
              fontWeight: 600,
            }}
          >
            <Check size={18} strokeWidth={2.5} aria-hidden />
            Pattern saved
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
