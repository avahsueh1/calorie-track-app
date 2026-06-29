"use client";

import type {
  CalorieDisplayPreference,
  UnitsPreference,
} from "../../types/profile";
import {
  profileCardStyle,
  profileColors,
  profileHelperStyle,
  profileSans,
  profileSectionLabelStyle,
  profileSectionTitleStyle,
} from "./theme";
import { layout, sectionHeaderSpacing } from "../../lib/theme";
import { profilePillStyle } from "./shared";

interface PreferencesCardProps {
  units: UnitsPreference;
  calorieDisplay: CalorieDisplayPreference;
  checkInReminder: boolean;
  mealLogReminder: boolean;
  waterReminder: boolean;
  profileVisibility: "private" | "public";
  onUnitsChange: (value: UnitsPreference) => void;
  onCalorieDisplayChange: (value: CalorieDisplayPreference) => void;
  onCheckInReminderChange: (enabled: boolean) => void;
  onMealLogReminderChange: (enabled: boolean) => void;
  onWaterReminderChange: (enabled: boolean) => void;
}

function ToggleRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        padding: "10px 0",
        borderBottom: `1px solid ${profileColors.divider}`,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: "0.82rem",
            fontWeight: 500,
            color: profileColors.text,
            fontFamily: profileSans,
          }}
        >
          {label}
        </p>
        {description && (
          <p style={{ ...profileHelperStyle(), fontSize: "0.72rem", marginTop: "2px" }}>
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        style={{
          width: "48px",
          height: "28px",
          borderRadius: "999px",
          border: `1px solid ${profileColors.blushBorder}`,
          backgroundColor: checked ? profileColors.sage : profileColors.cardSoft,
          padding: "3px",
          cursor: disabled ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: checked ? "flex-end" : "flex-start",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: profileColors.card,
            boxShadow: "0 1px 3px rgba(60, 43, 36, 0.12)",
          }}
        />
      </button>
    </div>
  );
}

export function PreferencesCard({
  units,
  calorieDisplay,
  checkInReminder,
  mealLogReminder,
  waterReminder,
  profileVisibility,
  onUnitsChange,
  onCalorieDisplayChange,
  onCheckInReminderChange,
  onMealLogReminderChange,
  onWaterReminderChange,
}: PreferencesCardProps) {
  return (
    <section style={{ ...profileCardStyle(), padding: layout.cardPadding }}>
      <h2 style={{ ...profileSectionTitleStyle(), ...sectionHeaderSpacing() }}>
        Preferences &amp; Privacy
      </h2>

      <p style={{ ...profileSectionLabelStyle(), marginBottom: "8px" }}>Units</p>
      <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
        {(["imperial", "metric"] as UnitsPreference[]).map((option) => (
          <button
            key={option}
            type="button"
            style={{ ...profilePillStyle(units === option), flex: 1 }}
            onClick={() => onUnitsChange(option)}
          >
            {option === "imperial" ? "Imperial" : "Metric"}
          </button>
        ))}
      </div>

      <p style={{ ...profileSectionLabelStyle(), marginBottom: "8px" }}>Calorie display</p>
      <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
        <button
          type="button"
          style={{ ...profilePillStyle(calorieDisplay === "eaten"), flex: 1 }}
          onClick={() => onCalorieDisplayChange("eaten")}
        >
          Food eaten
        </button>
        <button
          type="button"
          style={{ ...profilePillStyle(calorieDisplay === "net"), flex: 1 }}
          onClick={() => onCalorieDisplayChange("net")}
        >
          Net after activity
        </button>
      </div>
      <p
        style={{
          ...profileHelperStyle(),
          margin: "0 0 14px",
          fontSize: "0.72rem",
          fontStyle: "italic",
        }}
      >
        Local preference only — dashboard ring currently shows net after activity.
      </p>

      <p style={{ ...profileSectionLabelStyle(), marginBottom: "4px" }}>Reminders</p>
      <ToggleRow
        label="Check-in reminder"
        checked={checkInReminder}
        onChange={onCheckInReminderChange}
      />
      <ToggleRow
        label="Meal log reminder"
        checked={mealLogReminder}
        onChange={onMealLogReminderChange}
      />
      <ToggleRow
        label="Water reminder"
        description="Coming later"
        checked={waterReminder}
        disabled
        onChange={onWaterReminderChange}
      />

      <p
        style={{
          ...profileSectionLabelStyle(),
          marginTop: "14px",
          marginBottom: "8px",
        }}
      >
        Profile visibility
      </p>
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button
          type="button"
          style={{ ...profilePillStyle(profileVisibility === "private"), flex: 1 }}
          onClick={() => undefined}
        >
          Private
        </button>
        <button
          type="button"
          style={{
            ...profilePillStyle(false),
            flex: 1,
            opacity: 0.45,
            cursor: "default",
          }}
          disabled
        >
          Public (later)
        </button>
      </div>

      <p
        style={{
          ...profileHelperStyle(),
          margin: 0,
          padding: "10px 12px",
          borderRadius: "12px",
          backgroundColor: profileColors.blushBg,
          border: `1px solid ${profileColors.blushBorder}`,
          fontSize: "0.75rem",
        }}
      >
        Public profiles are not shared until you choose to enable them.
      </p>
    </section>
  );
}
