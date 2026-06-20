"use client";

import type { ProfileLifeStage } from "../../types/profile";
import {
  profileCardStyle,
  profileColors,
  profileHelperStyle,
  profileSectionLabelStyle,
  profileSectionTitleStyle,
} from "./theme";
import {
  profileCardPadding,
  profileFieldLabel,
  profileInputStyle,
  profilePillStyle,
} from "./shared";

const lifeStageOptions: { id: ProfileLifeStage; label: string }[] = [
  { id: "regular_cycle", label: "Regular cycle" },
  { id: "irregular_cycle", label: "Irregular cycle" },
  { id: "perimenopause", label: "Perimenopause" },
  { id: "menopause", label: "Menopause" },
  { id: "postpartum", label: "Postpartum" },
  { id: "prefer_not_to_say", label: "Prefer not to say" },
];

interface CycleLifeStageCardProps {
  cycleTrackingEnabled: boolean;
  lifeStage: ProfileLifeStage;
  lastPeriodStart: string;
  averageCycleLength: string;
  averagePeriodLength: string;
  onCycleTrackingChange: (enabled: boolean) => void;
  onLifeStageChange: (value: ProfileLifeStage) => void;
  onLastPeriodStartChange: (value: string) => void;
  onAverageCycleLengthChange: (value: string) => void;
  onAveragePeriodLengthChange: (value: string) => void;
}

export function CycleLifeStageCard({
  cycleTrackingEnabled,
  lifeStage,
  lastPeriodStart,
  averageCycleLength,
  averagePeriodLength,
  onCycleTrackingChange,
  onLifeStageChange,
  onLastPeriodStartChange,
  onAverageCycleLengthChange,
  onAveragePeriodLengthChange,
}: CycleLifeStageCardProps) {
  return (
    <section style={{ ...profileCardStyle(), ...profileCardPadding() }}>
      <h2 style={{ ...profileSectionTitleStyle(), marginBottom: "14px" }}>
        Cycle &amp; Life Stage
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          padding: "12px 14px",
          marginBottom: "16px",
          borderRadius: "14px",
          backgroundColor: profileColors.lavender,
          border: `1px solid ${profileColors.border}`,
        }}
      >
        <div>
          <p style={{ ...profileSectionLabelStyle(), marginBottom: "4px" }}>
            Cycle tracking
          </p>
          <p style={{ ...profileHelperStyle(), fontSize: "0.75rem" }}>
            Optional context for patterns
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={cycleTrackingEnabled}
          onClick={() => onCycleTrackingChange(!cycleTrackingEnabled)}
          style={{
            width: "48px",
            height: "28px",
            borderRadius: "999px",
            border: `1px solid ${profileColors.blushBorder}`,
            backgroundColor: cycleTrackingEnabled
              ? profileColors.sage
              : profileColors.cardSoft,
            padding: "3px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: cycleTrackingEnabled ? "flex-end" : "flex-start",
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

      <p style={{ ...profileSectionLabelStyle(), marginBottom: "8px" }}>Life stage</p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        {lifeStageOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            style={{
              ...profilePillStyle(lifeStage === option.id),
              flex: "1 1 calc(50% - 8px)",
              minWidth: "130px",
            }}
            onClick={() => onLifeStageChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "14px",
          opacity: cycleTrackingEnabled ? 1 : 0.55,
        }}
      >
        <div>
          <label style={profileFieldLabel("Last period start")} htmlFor="last-period">
            Last period start date
          </label>
          <input
            id="last-period"
            type="date"
            value={lastPeriodStart}
            onChange={(e) => onLastPeriodStartChange(e.target.value)}
            disabled={!cycleTrackingEnabled}
            style={profileInputStyle}
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px",
          }}
        >
          <div>
            <label style={profileFieldLabel("Avg cycle length")} htmlFor="cycle-length">
              Average cycle length
            </label>
            <input
              id="cycle-length"
              type="number"
              min={0}
              value={averageCycleLength}
              onChange={(e) => onAverageCycleLengthChange(e.target.value)}
              disabled={!cycleTrackingEnabled}
              placeholder="days"
              style={profileInputStyle}
            />
          </div>
          <div>
            <label style={profileFieldLabel("Avg period length")} htmlFor="period-length">
              Average period length
            </label>
            <input
              id="period-length"
              type="number"
              min={0}
              value={averagePeriodLength}
              onChange={(e) => onAveragePeriodLengthChange(e.target.value)}
              disabled={!cycleTrackingEnabled}
              placeholder="days"
              style={profileInputStyle}
            />
          </div>
        </div>
      </div>

      <p
        style={{
          ...profileHelperStyle(),
          padding: "10px 12px",
          borderRadius: "12px",
          backgroundColor: profileColors.blue,
          fontSize: "0.75rem",
        }}
      >
        Used to add context to energy, hunger, cravings, and weight patterns.
      </p>
    </section>
  );
}
