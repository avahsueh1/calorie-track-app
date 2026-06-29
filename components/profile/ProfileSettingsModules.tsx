"use client";

import type { AppProfile } from "../../types/profile";
import { CalorieSettingsSection } from "./CalorieSettingsSection";
import { CycleLifeStageSection } from "./CycleLifeStageSection";
import { profileColors, profileHelperStyle, profileSans } from "./theme";

interface ProfileSettingsModulesProps {
  profile: AppProfile;
  calorieTrackingEnabled: boolean;
  cycleTrackingEnabled: boolean;
}

export function ProfileSettingsModules({
  profile,
  calorieTrackingEnabled,
  cycleTrackingEnabled,
}: ProfileSettingsModulesProps) {
  if (!calorieTrackingEnabled && !cycleTrackingEnabled) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div>
        <p
          style={{
            margin: "0 0 4px",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: profileColors.textSecondary,
            fontFamily: profileSans,
          }}
        >
          Plan &amp; cycle settings
        </p>
        <p style={{ ...profileHelperStyle(), margin: 0, fontSize: "0.76rem" }}>
          Open a dedicated page to edit your calorie plan or cycle tracking.
        </p>
      </div>

      {calorieTrackingEnabled ? <CalorieSettingsSection profile={profile} /> : null}
      {cycleTrackingEnabled ? (
        <CycleLifeStageSection
          profile={profile}
          cycleTrackingEnabled={cycleTrackingEnabled}
        />
      ) : null}
    </div>
  );
}
