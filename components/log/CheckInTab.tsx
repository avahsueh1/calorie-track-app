"use client";

import { useState } from "react";
import { useCheckIn } from "../providers/CheckInProvider";
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
import { cardStyle, colors, labelStyle, sans, sectionTitleStyle } from "../dashboard/theme";
import {
  cardSectionStyle,
  fieldLabel,
  primaryButtonStyle,
  textareaStyle,
} from "./shared";

function ScaleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ScaleRating;
  onChange: (v: ScaleRating) => void;
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
        style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "5px" }}
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
                minHeight: "36px",
                borderRadius: "10px",
                border: `1px solid ${selected ? colors.terracotta : colors.border}`,
                backgroundColor: selected ? colors.terracottaPale : colors.card,
                color: selected ? colors.terracotta : colors.muted,
                fontSize: "0.8rem",
                fontWeight: selected ? 700 : 500,
                fontFamily: sans,
                cursor: "pointer",
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

function SeverityRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: CravingLevel;
  onChange: (v: CravingLevel) => void;
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
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}
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
                minHeight: "36px",
                borderRadius: "999px",
                border: `1px solid ${selected ? colors.terracotta : colors.border}`,
                backgroundColor: selected ? colors.terracottaPale : colors.card,
                color: selected ? colors.terracotta : colors.muted,
                fontSize: "0.72rem",
                fontWeight: selected ? 700 : 500,
                fontFamily: sans,
                cursor: "pointer",
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

export function CheckInTab() {
  const { checkIn, updateCheckIn } = useCheckIn();
  const [draft, setDraft] = useState(() => cloneDailyCheckIn(checkIn));
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  function updateDraftScale(key: CheckInScaleField, value: ScaleRating) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSavedMessage(null);
  }

  function updateDraftSeverity(key: CheckInSeverityField, value: CravingLevel) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSavedMessage(null);
  }

  function handleSave() {
    updateCheckIn({
      ...draft,
      notes: draft.notes?.trim() ?? "",
    });
    setSavedMessage("Check-in saved");
  }

  return (
    <section style={{ ...cardStyle(), ...cardSectionStyle() }}>
      <h2 style={{ ...sectionTitleStyle(), marginBottom: "14px" }}>
        Body check-in
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {CHECK_IN_SCALE_FIELDS.map(({ key, label }) => (
          <ScaleRow
            key={key}
            label={label}
            value={draft[key]}
            onChange={(value) => updateDraftScale(key, value)}
          />
        ))}
        {CHECK_IN_SEVERITY_FIELDS.map(({ key, label }) => (
          <SeverityRow
            key={key}
            label={label}
            value={draft[key]}
            onChange={(value) => updateDraftSeverity(key, value)}
          />
        ))}
        <div>
          <label style={fieldLabel("Notes (optional)")} htmlFor="check-in-notes">
            Notes (optional)
          </label>
          <textarea
            id="check-in-notes"
            value={draft.notes ?? ""}
            onChange={(event) => {
              setDraft((current) => ({
                ...current,
                notes: event.target.value,
              }));
              setSavedMessage(null);
            }}
            placeholder="Anything you want to remember about today..."
            style={textareaStyle}
          />
        </div>
        {savedMessage && (
          <p
            style={{
              margin: 0,
              fontSize: "0.78rem",
              color: colors.sage,
              fontWeight: 600,
              fontFamily: sans,
            }}
          >
            {savedMessage}
          </p>
        )}
        <button type="button" onClick={handleSave} style={primaryButtonStyle()}>
          Save Check-In
        </button>
      </div>
    </section>
  );
}
