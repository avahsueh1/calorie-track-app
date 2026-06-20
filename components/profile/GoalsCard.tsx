"use client";

import type { DailyTargetMode } from "../../types";
import type { GoalDirection } from "../../types/profile";
import {
  profileCardStyle,
  profileColors,
  profileHelperStyle,
  profileSectionLabelStyle,
  profileSectionTitleStyle,
} from "./theme";
import { profileCardPadding, profilePillStyle } from "./shared";

const goalDirectionOptions: { id: GoalDirection; label: string }[] = [
  { id: "maintain", label: "Maintain" },
  { id: "gentle_fat_loss", label: "Gentle fat loss" },
  { id: "build_muscle", label: "Build muscle" },
  { id: "improve_energy", label: "Improve energy" },
  { id: "recovery_consistency", label: "Recovery / consistency" },
];

const dailyTargetOptions: { id: DailyTargetMode; label: string }[] = [
  { id: "maintain", label: "Maintain" },
  { id: "gentle_deficit", label: "Gentle deficit" },
  { id: "performance", label: "Performance / energy" },
  { id: "recovery", label: "Recovery day" },
];

interface GoalsCardProps {
  goalDirection: GoalDirection;
  dailyTargetMode: DailyTargetMode;
  onGoalDirectionChange: (value: GoalDirection) => void;
  onDailyTargetModeChange: (value: DailyTargetMode) => void;
}

function PillGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <p style={{ ...profileSectionLabelStyle(), marginBottom: "8px" }}>{label}</p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            style={{
              ...profilePillStyle(value === option.id),
              flex: "1 1 calc(50% - 8px)",
              minWidth: "120px",
            }}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function GoalsCard({
  goalDirection,
  dailyTargetMode,
  onGoalDirectionChange,
  onDailyTargetModeChange,
}: GoalsCardProps) {
  return (
    <section style={{ ...profileCardStyle(), ...profileCardPadding() }}>
      <h2 style={{ ...profileSectionTitleStyle(), marginBottom: "14px" }}>Goals</h2>

      <PillGroup
        label="Goal direction"
        options={goalDirectionOptions}
        value={goalDirection}
        onChange={onGoalDirectionChange}
      />

      <PillGroup
        label="Daily target mode"
        options={dailyTargetOptions}
        value={dailyTargetMode}
        onChange={onDailyTargetModeChange}
      />

      <p
        style={{
          ...profileHelperStyle(),
          padding: "10px 12px",
          borderRadius: "12px",
          backgroundColor: profileColors.cream,
          border: `1px solid ${profileColors.divider}`,
        }}
      >
        Goals can change. This app focuses on trends, not perfect days.
      </p>
    </section>
  );
}
