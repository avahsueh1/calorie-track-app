"use client";

import { useState } from "react";
import { useCheckIn } from "../providers/CheckInProvider";
import type { DailyCheckIn } from "../../types";
import {
  CHECK_IN_SCALE_FIELDS,
  CHECK_IN_SCALE_OPTIONS,
  CHECK_IN_SCALE_WORDS,
  CHECK_IN_SEVERITY_FIELDS,
  CHECK_IN_SEVERITY_OPTIONS,
  cloneDailyCheckIn,
  formatSeverityLabel,
  type CheckInScaleField,
  type CheckInSeverityField,
  type CravingLevel,
  type ScaleRating,
} from "../../types/wellness";
import { cardStyle, colors, labelStyle, sans, sectionTitleStyle } from "./theme";

const summaryColors = {
  card: "#FFFDFB",
  inner: "#FBFAF7",
  text: "#3C2B24",
  secondary: "#7D7068",
  label: "#9A8176",
  terracotta: "#B97663",
  terracottaDark: "#744336",
  blushBg: "#FFF7F3",
  blushBorder: "#E8C2B6",
  sage: "#7E9A7C",
  sageBg: "#EEF4ED",
  border: "#E6D7CB",
  divider: "#EFE5DD",
  lavenderBg: "#ECE7F5",
  lavenderIcon: "#8D7BB8",
  goldBg: "#F7EFE8",
  goldIcon: "#B89A6D",
  blueBg: "#EAF2FA",
  blueIcon: "#7EA6C8",
};

const scaleWords = [...CHECK_IN_SCALE_WORDS];

function summaryCardStyle() {
  return {
    backgroundColor: summaryColors.card,
    borderRadius: "26px",
    border: `1px solid ${summaryColors.border}`,
    padding: "24px",
    boxShadow: "0 10px 28px rgba(60, 43, 36, 0.06)",
  };
}

function updateSummaryButtonStyle() {
  return {
    fontSize: "0.72rem",
    fontWeight: 600,
    color: summaryColors.terracottaDark,
    backgroundColor: summaryColors.blushBg,
    padding: "7px 14px",
    borderRadius: "999px",
    border: `1px solid ${summaryColors.blushBorder}`,
    cursor: "pointer",
    fontFamily: sans,
    flexShrink: 0,
  };
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
        {CHECK_IN_SCALE_OPTIONS.map((option) => {
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

function SeveritySelector({
  label,
  value,
  onChange,
}: {
  label: string;
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
      <p style={{ ...labelStyle(), marginBottom: "8px" }}>{label}</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "6px",
        }}
        role="group"
        aria-label={label}
      >
        {CHECK_IN_SEVERITY_OPTIONS.map((option) => {
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
              {formatSeverityLabel(option)}
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

function severityHelper(field: CheckInSeverityField, value: CravingLevel): string {
  const helpers: Record<CheckInSeverityField, Record<CravingLevel, string>> = {
    cravings: {
      none: "Cravings quiet",
      mild: "Notice and nourish",
      strong: "Supportive snacks",
    },
    bloating: {
      none: "Feeling comfortable",
      mild: "Gentle movement may help",
      strong: "Extra care may help",
    },
    soreness: {
      none: "Body feels recovered",
      mild: "Move gently today",
      strong: "Prioritize recovery",
    },
  };
  return helpers[field][value];
}

function MetricTile({
  icon,
  badgeBackground,
  iconColor,
  label,
  value,
  helper,
}: {
  icon: string;
  badgeBackground: string;
  iconColor: string;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <article
      style={{
        backgroundColor: summaryColors.card,
        border: `1px solid ${summaryColors.border}`,
        borderRadius: "18px",
        padding: "16px",
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        minWidth: 0,
      }}
    >
      <span
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          backgroundColor: badgeBackground,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.95rem",
          lineHeight: 1,
          flexShrink: 0,
          color: iconColor,
        }}
        aria-hidden="true"
      >
        {icon}
      </span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p
          style={{
            margin: "0 0 4px",
            fontSize: "0.62rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: summaryColors.label,
            fontFamily: sans,
            lineHeight: 1.3,
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: "0 0 4px",
            fontSize: "1.15rem",
            fontWeight: 700,
            color: summaryColors.text,
            fontFamily: sans,
            lineHeight: 1.2,
          }}
        >
          {value}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "0.88rem",
            color: summaryColors.secondary,
            fontFamily: sans,
            lineHeight: 1.4,
          }}
        >
          {helper}
        </p>
      </div>
    </article>
  );
}

function CheckInSummary({ saved }: { saved: DailyCheckIn }) {
  const metrics = [
    {
      icon: "✦",
      badgeBackground: summaryColors.blushBg,
      iconColor: summaryColors.terracotta,
      key: "mood",
      label: "Mood",
      value: scaleWords[saved.mood - 1],
      helper: scaleHelper("mood", saved.mood),
    },
    {
      icon: "⚡",
      badgeBackground: summaryColors.goldBg,
      iconColor: summaryColors.goldIcon,
      key: "energy",
      label: "Energy",
      value: scaleWords[saved.energy - 1],
      helper: scaleHelper("energy", saved.energy),
    },
    {
      icon: "♡",
      badgeBackground: summaryColors.sageBg,
      iconColor: summaryColors.sage,
      key: "hunger",
      label: "Hunger",
      value: scaleWords[saved.hunger - 1],
      helper: scaleHelper("hunger", saved.hunger),
    },
    {
      icon: "☾",
      badgeBackground: summaryColors.lavenderBg,
      iconColor: summaryColors.lavenderIcon,
      key: "sleepQuality",
      label: "Sleep",
      value: scaleWords[saved.sleepQuality - 1],
      helper: scaleHelper("sleepQuality", saved.sleepQuality),
    },
    {
      icon: "〜",
      badgeBackground: summaryColors.blueBg,
      iconColor: summaryColors.blueIcon,
      key: "stress",
      label: "Stress",
      value: scaleWords[saved.stress - 1],
      helper: scaleHelper("stress", saved.stress),
    },
    {
      icon: "◎",
      badgeBackground: summaryColors.blushBg,
      iconColor: summaryColors.terracotta,
      key: "cravings",
      label: "Cravings",
      value: formatSeverityLabel(saved.cravings),
      helper: severityHelper("cravings", saved.cravings),
    },
    {
      icon: "◌",
      badgeBackground: summaryColors.goldBg,
      iconColor: summaryColors.goldIcon,
      key: "bloating",
      label: "Bloating",
      value: formatSeverityLabel(saved.bloating),
      helper: severityHelper("bloating", saved.bloating),
    },
    {
      icon: "↯",
      badgeBackground: summaryColors.sageBg,
      iconColor: summaryColors.sage,
      key: "soreness",
      label: "Soreness",
      value: formatSeverityLabel(saved.soreness),
      helper: severityHelper("soreness", saved.soreness),
    },
  ];

  const notesPreview = saved.notes?.trim();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <p
        style={{
          margin: 0,
          padding: "15px 16px",
          borderRadius: "18px",
          backgroundColor: summaryColors.blushBg,
          border: `1px solid ${summaryColors.blushBorder}`,
          fontSize: "0.95rem",
          lineHeight: 1.55,
          color: summaryColors.terracottaDark,
          fontFamily: sans,
        }}
      >
        {buildSummarySentence(saved)}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(158px, 1fr))",
          gap: "12px",
        }}
      >
        {metrics.map((metric) => (
          <MetricTile
            key={metric.key}
            icon={metric.icon}
            badgeBackground={metric.badgeBackground}
            iconColor={metric.iconColor}
            label={metric.label}
            value={metric.value}
            helper={metric.helper}
          />
        ))}
      </div>

      {notesPreview ? (
        <p
          style={{
            margin: 0,
            padding: "12px 14px",
            borderRadius: "16px",
            backgroundColor: summaryColors.inner,
            fontSize: "0.78rem",
            lineHeight: 1.5,
            color: summaryColors.secondary,
            fontFamily: sans,
            fontStyle: "italic",
          }}
        >
          “{notesPreview.length > 120 ? `${notesPreview.slice(0, 120)}…` : notesPreview}”
        </p>
      ) : null}
    </div>
  );
}

export function TodayCheckInCard() {
  const { checkIn, updateCheckIn } = useCheckIn();
  const [draft, setDraft] = useState<DailyCheckIn>(() => cloneDailyCheckIn(checkIn));
  const [isEditing, setIsEditing] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);

  function openEditor() {
    setDraft(cloneDailyCheckIn(checkIn));
    setIsEditing(true);
    setJustUpdated(false);
  }

  function handleCancel() {
    setDraft(cloneDailyCheckIn(checkIn));
    setIsEditing(false);
  }

  function handleSave() {
    updateCheckIn({
      ...draft,
      notes: draft.notes?.trim() ?? "",
    });
    setIsEditing(false);
    setJustUpdated(true);
  }

  function updateDraftScale(key: CheckInScaleField, value: ScaleRating) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateDraftSeverity(key: CheckInSeverityField, value: CravingLevel) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  const statusLabel = justUpdated ? "Updated just now" : "Checked in today";

  if (isEditing) {
    return (
      <section style={{ ...cardStyle(), padding: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            marginBottom: "12px",
          }}
        >
          <h2 style={sectionTitleStyle()}>Today&apos;s check-in</h2>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {CHECK_IN_SCALE_FIELDS.map(({ key, label }) => (
            <ScaleSelector
              key={key}
              label={label}
              value={draft[key]}
              onChange={(value) => updateDraftScale(key, value)}
            />
          ))}
          {CHECK_IN_SEVERITY_FIELDS.map(({ key, label }) => (
            <SeveritySelector
              key={key}
              label={label}
              value={draft[key]}
              onChange={(value) => updateDraftSeverity(key, value)}
            />
          ))}
          <div
            style={{
              backgroundColor: colors.shell,
              borderRadius: "14px",
              padding: "10px 12px",
              border: `1px solid ${colors.border}`,
            }}
          >
            <label
              htmlFor="dashboard-check-in-notes"
              style={{ ...labelStyle(), display: "block", marginBottom: "8px" }}
            >
              Notes (optional)
            </label>
            <textarea
              id="dashboard-check-in-notes"
              value={draft.notes ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              placeholder="Anything you want to remember about today..."
              rows={3}
              style={{
                width: "100%",
                boxSizing: "border-box",
                borderRadius: "12px",
                border: `1px solid ${colors.border}`,
                padding: "10px 12px",
                fontSize: "0.82rem",
                lineHeight: 1.45,
                fontFamily: sans,
                color: colors.text,
                backgroundColor: colors.card,
                resize: "vertical",
              }}
            />
          </div>
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
      </section>
    );
  }

  return (
    <section style={summaryCardStyle()}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
          marginBottom: "18px",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h2
            style={{
              margin: 0,
              fontFamily: sans,
              fontSize: "1.35rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              color: summaryColors.text,
            }}
          >
            Today&apos;s check-in
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: "0.74rem",
              color: summaryColors.sage,
              fontWeight: 600,
              fontFamily: sans,
            }}
          >
            {statusLabel}
          </p>
        </div>
        <button type="button" onClick={openEditor} style={updateSummaryButtonStyle()}>
          Update
        </button>
      </div>

      <CheckInSummary saved={checkIn} />
    </section>
  );
}
