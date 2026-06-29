"use client";

import type { TrackingPreset } from "../../lib/trackingPreferences";
import {
  TRACKING_PRESET_OPTIONS,
  preferencesFromPreset,
  trackingPresetFromPreferences,
} from "../../lib/trackingPreferences";
import type { TrackingPreferences } from "../../lib/trackingPreferences";
import { ProfileOptionGroup } from "./ProfileOptionGroup";
import {
  profileCardStyle,
  profileColors,
  profileHelperStyle,
  profileSans,
  profileSectionTitleStyle,
} from "./theme";
import { layout } from "../../lib/theme";

interface TrackingPreferencesCardProps {
  preferences: TrackingPreferences;
  onChange: (preferences: TrackingPreferences) => void;
}

export function TrackingPreferencesCard({
  preferences,
  onChange,
}: TrackingPreferencesCardProps) {
  const selectedPreset = trackingPresetFromPreferences(preferences);

  return (
    <section
      style={{
        ...profileCardStyle(),
        padding: layout.cardPadding,
      }}
    >
      <h2 style={{ ...profileSectionTitleStyle(), margin: "0 0 8px" }}>
        What would you like to track?
      </h2>
      <p
        style={{
          ...profileHelperStyle(),
          margin: "0 0 20px",
          fontSize: "0.76rem",
          lineHeight: 1.55,
        }}
      >
        You can change this anytime. Turning nutrition off hides calorie UI but
        keeps your saved logs and plan.
      </p>

      <ProfileOptionGroup
        name="tracking-preset"
        label=""
        options={TRACKING_PRESET_OPTIONS}
        value={selectedPreset}
        onChange={(preset: TrackingPreset) =>
          onChange(preferencesFromPreset(preset))
        }
      />

      <p
        style={{
          margin: "16px 0 0",
          paddingTop: "14px",
          borderTop: `1px solid ${profileColors.divider}`,
          fontSize: "0.72rem",
          color: profileColors.textSecondary,
          fontFamily: profileSans,
          lineHeight: 1.5,
        }}
      >
        {preferences.calorieTrackingEnabled && preferences.cycleTrackingEnabled
          ? "Showing cycle and nutrition features."
          : preferences.calorieTrackingEnabled
            ? "Showing nutrition features only."
            : preferences.cycleTrackingEnabled
              ? "Showing cycle features only."
              : "Choose a tracking style above to get started."}
      </p>
    </section>
  );
}
