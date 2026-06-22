"use client";

import { useState } from "react";
import { useCheckIn } from "../providers/CheckInProvider";
import type { DailyCheckIn } from "../../types";
import {
  CHECK_IN_SCALE_FIELDS,
  CHECK_IN_SCALE_OPTIONS,
  CHECK_IN_SEVERITY_FIELDS,
  CHECK_IN_SEVERITY_OPTIONS,
  cloneDailyCheckIn,
  formatSeverityLabel,
  type CheckInScaleField,
  type CheckInSeverityField,
  type CravingLevel,
  type ScaleRating,
} from "../../types/wellness";
import { CheckInSummaryView } from "./CheckInSummaryView";
import { cardStyle, colors, labelStyle, sans, sectionTitleStyle } from "./theme";

const palette = {
  neutral: {
    text: "#272018",
    label: "#5C4A42",
  },
  accent: {
    dark: "#744336",
    bg: "#FFF4EF",
    border: "#E8C2B6",
  },
} as const;

function summaryCardStyle() {
  return {
    backgroundColor: "transparent",
    borderRadius: 0,
    border: "none",
    padding: 0,
    boxShadow: "none",
  };
}

function editSummaryButtonStyle() {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "28px",
    padding: "0 11px",
    fontSize: "0.75rem",
    fontWeight: 500,
    color: palette.accent.dark,
    backgroundColor: "#FFFDFC",
    borderRadius: "999px",
    border: "1px solid #E8C9BC",
    cursor: "pointer",
    fontFamily: sans,
    flexShrink: 0,
    lineHeight: 1,
    marginTop: "-6px",
    WebkitTapHighlightColor: "transparent",
  } as const;
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
    <section style={{ ...summaryCardStyle(), marginTop: 0 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto",
          columnGap: "8px",
          rowGap: "4px",
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            margin: 0,
            gridColumn: 1,
            gridRow: 1,
            alignSelf: "center",
            fontFamily: sans,
            fontSize: "1.625rem",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            color: palette.neutral.text,
            minWidth: 0,
          }}
        >
          Today&apos;s check-in
        </h2>
        <button
          type="button"
          onClick={openEditor}
          style={{
            ...editSummaryButtonStyle(),
            gridColumn: 2,
            gridRow: 1,
            alignSelf: "center",
            justifySelf: "end",
          }}
        >
          Edit
        </button>
        <p
          style={{
            margin: 0,
            gridColumn: 1,
            gridRow: 2,
            fontSize: "0.75rem",
            color: palette.neutral.label,
            fontWeight: 500,
            fontFamily: sans,
          }}
        >
          {statusLabel}
        </p>
      </div>

      <CheckInSummaryView saved={checkIn} onRowPress={openEditor} />
    </section>
  );
}
