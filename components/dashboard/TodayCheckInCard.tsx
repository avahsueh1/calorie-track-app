"use client";

import { useState } from "react";
import { useCheckIn } from "../providers/CheckInProvider";
import type { DailyCheckIn } from "../../types";
import type {
  CravingLevel,
  ScaleRating,
} from "../../types/wellness";
import { cardStyle, colors, labelStyle, sans, sectionTitleStyle } from "./theme";

type DashboardCheckInFields = Pick<
  DailyCheckIn,
  "mood" | "energy" | "hunger" | "sleepQuality" | "stress" | "cravings"
>;

const scaleFields: {
  key: keyof Pick<
    DashboardCheckInFields,
    "mood" | "energy" | "hunger" | "sleepQuality" | "stress"
  >;
  label: string;
  summaryLabel: string;
}[] = [
  { key: "mood", label: "Mood", summaryLabel: "Mood" },
  { key: "energy", label: "Energy", summaryLabel: "Energy" },
  { key: "hunger", label: "Hunger", summaryLabel: "Hunger" },
  { key: "sleepQuality", label: "Sleep", summaryLabel: "Sleep" },
  { key: "stress", label: "Stress", summaryLabel: "Stress" },
];

const scaleOptions: ScaleRating[] = [1, 2, 3, 4, 5];

const cravingOptions: { value: CravingLevel; label: string }[] = [
  { value: "none", label: "None" },
  { value: "mild", label: "Mild" },
  { value: "strong", label: "Strong" },
];

const scaleWords = ["Very low", "Low", "Moderate", "Good", "High"];

function formatCravingSummary(value: CravingLevel): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function pillButtonStyle(variant: "primary" | "secondary" | "ghost") {
  if (variant === "primary") {
    return {
      fontSize: "0.72rem",
      fontWeight: 600,
      color: colors.card,
      backgroundColor: colors.terracotta,
      padding: "7px 14px",
      borderRadius: "999px",
      border: `1px solid ${colors.terracotta}`,
      cursor: "pointer",
      fontFamily: sans,
    };
  }

  if (variant === "secondary") {
    return {
      fontSize: "0.72rem",
      fontWeight: 600,
      color: colors.muted,
      backgroundColor: colors.shell,
      padding: "7px 14px",
      borderRadius: "999px",
      border: `1px solid ${colors.border}`,
      cursor: "pointer",
      fontFamily: sans,
    };
  }

  return {
    fontSize: "0.7rem",
    fontWeight: 600,
    color: colors.terracotta,
    backgroundColor: colors.terracottaPale,
    padding: "5px 12px",
    borderRadius: "999px",
    border: `1px solid ${colors.terracottaLight}`,
    cursor: "pointer",
    fontFamily: sans,
  };
}

function ScaleSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ScaleRating;
  onChange: (value: ScaleRating) => void;
}) {
  return (
    <div
      style={{
        backgroundColor: colors.shell,
        borderRadius: "14px",
        padding: "10px 12px",
        border: `1px solid ${colors.border}`,
      }}
    >
      <p style={{ ...labelStyle(), marginBottom: "8px" }}>{label}</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "5px",
        }}
        role="group"
        aria-label={label}
      >
        {scaleOptions.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option)}
              style={{
                minHeight: "32px",
                borderRadius: "10px",
                border: `1px solid ${selected ? colors.terracotta : colors.border}`,
                backgroundColor: selected ? colors.terracottaPale : colors.card,
                color: selected ? colors.terracotta : colors.muted,
                fontSize: "0.78rem",
                fontWeight: selected ? 700 : 500,
                fontFamily: sans,
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CravingSelector({
  value,
  onChange,
}: {
  value: CravingLevel;
  onChange: (value: CravingLevel) => void;
}) {
  return (
    <div
      style={{
        backgroundColor: colors.shell,
        borderRadius: "14px",
        padding: "10px 12px",
        border: `1px solid ${colors.border}`,
      }}
    >
      <p style={{ ...labelStyle(), marginBottom: "8px" }}>Cravings</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "6px",
        }}
        role="group"
        aria-label="Cravings"
      >
        {cravingOptions.map(({ value: option, label }) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option)}
              style={{
                minHeight: "32px",
                borderRadius: "999px",
                border: `1px solid ${selected ? colors.terracotta : colors.border}`,
                backgroundColor: selected ? colors.terracottaPale : colors.card,
                color: selected ? colors.terracotta : colors.muted,
                fontSize: "0.72rem",
                fontWeight: selected ? 700 : 500,
                fontFamily: sans,
                cursor: "pointer",
                padding: "6px 4px",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function buildSummarySentence(saved: DailyCheckIn): string {
  const energy = scaleWords[saved.energy - 1].toLowerCase();
  const mood = scaleWords[saved.mood - 1].toLowerCase();
  const stress = scaleWords[saved.stress - 1].toLowerCase();

  if (saved.cravings === "strong") {
    return `Strong cravings with ${energy} energy. Keep today steady and nourishing.`;
  }

  if (saved.stress >= 4) {
    return `${stress.charAt(0).toUpperCase() + stress.slice(1)} stress today. Prioritize rest and gentle nourishment.`;
  }

  if (saved.energy <= 2) {
    return `Energy feels ${energy} today. Choose steady meals and a calm pace.`;
  }

  if (saved.mood >= 4 && saved.cravings === "none") {
    return `Mood feels ${mood} with manageable hunger. A balanced day ahead.`;
  }

  if (saved.cravings === "mild") {
    return `Mild cravings with ${energy} energy. Keep today steady and nourishing.`;
  }

  return `Today's body signals look ${mood}. Stay aware and nourish at your own pace.`;
}

function scaleHelper(key: string, value: ScaleRating): string {
  const word = scaleWords[value - 1];
  const helpers: Record<string, Record<string, string>> = {
    mood: {
      "Very low": "Be gentle with yourself",
      Low: "Take things slowly",
      Moderate: "Feeling steady",
      Good: "Feeling steady",
      High: "Bright and uplifted",
    },
    energy: {
      "Very low": "Take it gently",
      Low: "Take it gently",
      Moderate: "Steady pace",
      Good: "Good momentum",
      High: "Strong reserves",
    },
    hunger: {
      "Very low": "Light appetite",
      Low: "Light appetite",
      Moderate: "Regular meals",
      Good: "Well fueled",
      High: "Fuel as needed",
    },
    sleepQuality: {
      "Very low": "Extra rest may help",
      Low: "Extra rest may help",
      Moderate: "Adequate rest",
      Good: "Rest helped",
      High: "Well rested",
    },
    stress: {
      "Very low": "Calm baseline",
      Low: "Calm baseline",
      Moderate: "Watch the pace",
      Good: "Manageable load",
      High: "Prioritize ease",
    },
  };
  return helpers[key]?.[word] ?? "Stay aware";
}

function cravingHelper(value: CravingLevel): string {
  if (value === "none") return "Cravings quiet";
  if (value === "mild") return "Manageable urges";
  return "Supportive snacks";
}

function MetricSummaryCell({
  icon,
  label,
  value,
  helper,
}: {
  icon: string;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div
      style={{
        backgroundColor: colors.shell,
        borderRadius: "16px",
        padding: "12px",
        border: `1px solid ${colors.border}`,
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
        minWidth: 0,
      }}
    >
      <span
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: colors.blush + "66",
          border: `1px solid ${colors.terracottaLight}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.85rem",
          lineHeight: 1,
          flexShrink: 0,
          color: colors.terracotta,
        }}
        aria-hidden="true"
      >
        {icon}
      </span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ ...labelStyle(), marginBottom: "3px", fontSize: "0.62rem" }}>
          {label}
        </p>
        <p
          style={{
            margin: "0 0 2px",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: colors.text,
            fontFamily: sans,
            lineHeight: 1.25,
          }}
        >
          {value}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "0.72rem",
            color: colors.muted,
            fontFamily: sans,
            lineHeight: 1.35,
          }}
        >
          {helper}
        </p>
      </div>
    </div>
  );
}

function CheckInSummary({ saved }: { saved: DailyCheckIn }) {
  const metrics = [
    {
      icon: "✦",
      label: "Mood",
      value: scaleWords[saved.mood - 1],
      helper: scaleHelper("mood", saved.mood),
    },
    {
      icon: "⚡",
      label: "Energy",
      value: scaleWords[saved.energy - 1],
      helper: scaleHelper("energy", saved.energy),
    },
    {
      icon: "♡",
      label: "Hunger",
      value: scaleWords[saved.hunger - 1],
      helper: scaleHelper("hunger", saved.hunger),
    },
    {
      icon: "◎",
      label: "Cravings",
      value: formatCravingSummary(saved.cravings),
      helper: cravingHelper(saved.cravings),
    },
    {
      icon: "☾",
      label: "Sleep",
      value: scaleWords[saved.sleepQuality - 1],
      helper: scaleHelper("sleepQuality", saved.sleepQuality),
    },
    {
      icon: "〜",
      label: "Stress",
      value: scaleWords[saved.stress - 1],
      helper: scaleHelper("stress", saved.stress),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <p
        style={{
          margin: 0,
          fontSize: "0.82rem",
          lineHeight: 1.5,
          color: colors.text,
          fontFamily: sans,
        }}
      >
        {buildSummarySentence(saved)}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "10px",
        }}
      >
        {metrics.map((metric) => (
          <MetricSummaryCell
            key={metric.label}
            icon={metric.icon}
            label={metric.label}
            value={metric.value}
            helper={metric.helper}
          />
        ))}
      </div>
    </div>
  );
}

function pickDashboardFields(value: DailyCheckIn): DashboardCheckInFields {
  return {
    mood: value.mood,
    energy: value.energy,
    hunger: value.hunger,
    sleepQuality: value.sleepQuality,
    stress: value.stress,
    cravings: value.cravings,
  };
}

export function TodayCheckInCard() {
  const { checkIn, updateCheckIn } = useCheckIn();
  const [draft, setDraft] = useState<DashboardCheckInFields>(() =>
    pickDashboardFields(checkIn),
  );
  const [isEditing, setIsEditing] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);

  function openEditor() {
    setDraft(pickDashboardFields(checkIn));
    setIsEditing(true);
    setJustUpdated(false);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  function handleSave() {
    updateCheckIn(draft);
    setIsEditing(false);
    setJustUpdated(true);
  }

  function updateDraftScale(
    key: (typeof scaleFields)[number]["key"],
    value: ScaleRating,
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  const statusLabel = justUpdated ? "Updated just now" : "Checked in today";

  return (
    <section style={{ ...cardStyle(), padding: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          marginBottom: !isEditing && justUpdated ? "6px" : "12px",
        }}
      >
        <h2 style={sectionTitleStyle()}>Today&apos;s check-in</h2>
        {!isEditing && (
          <button type="button" onClick={openEditor} style={pillButtonStyle("ghost")}>
            Update
          </button>
        )}
      </div>

      {!isEditing && (
        <p
          style={{
            margin: "0 0 12px",
            fontSize: "0.72rem",
            color: justUpdated ? colors.sage : colors.muted,
            fontWeight: justUpdated ? 600 : 500,
            fontFamily: sans,
          }}
        >
          {statusLabel}
        </p>
      )}

      {!isEditing ? (
        <CheckInSummary saved={checkIn} />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {scaleFields.map(({ key, label }) => (
              <ScaleSelector
                key={key}
                label={label}
                value={draft[key]}
                onChange={(value) => updateDraftScale(key, value)}
              />
            ))}
            <CravingSelector
              value={draft.cravings}
              onChange={(cravings) =>
                setDraft((current) => ({ ...current, cravings }))
              }
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "14px",
            }}
          >
            <button
              type="button"
              onClick={handleCancel}
              style={pillButtonStyle("secondary")}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              style={pillButtonStyle("primary")}
            >
              Update Check-In
            </button>
          </div>
        </>
      )}
    </section>
  );
}
