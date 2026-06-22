"use client";

import { useRef, useState } from "react";
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
import { CheckInSummaryView } from "../dashboard/CheckInSummaryView";
import { cardStyle, colors, labelStyle, sans, sectionTitleStyle } from "../dashboard/theme";
import {
  cardSectionStyle,
  fieldLabel,
  primaryButtonStyle,
  secondaryButtonStyle,
  textareaStyle,
} from "./shared";

const SAVE_FEEDBACK_MS = 450;

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

function editSummaryButtonStyle() {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "28px",
    padding: "0 11px",
    fontSize: "0.75rem",
    fontWeight: 500,
    color: "#744336",
    backgroundColor: "#FFFDFC",
    borderRadius: "999px",
    border: "1px solid #E8C9BC",
    cursor: "pointer",
    fontFamily: sans,
    flexShrink: 0,
    lineHeight: 1,
    WebkitTapHighlightColor: "transparent",
  } as const;
}

export function CheckInTab() {
  const { checkIn, updateCheckIn } = useCheckIn();
  const summaryRef = useRef<HTMLElement>(null);
  const [draft, setDraft] = useState<DailyCheckIn>(() => cloneDailyCheckIn(checkIn));
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  function openEditor() {
    setDraft(cloneDailyCheckIn(checkIn));
    setIsEditing(true);
    setJustSaved(false);
  }

  function handleCancel() {
    setDraft(cloneDailyCheckIn(checkIn));
    setIsEditing(false);
    setIsSaving(false);
  }

  function updateDraftScale(key: CheckInScaleField, value: ScaleRating) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateDraftSeverity(key: CheckInSeverityField, value: CravingLevel) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    if (isSaving) return;

    setIsSaving(true);
    updateCheckIn({
      ...draft,
      notes: draft.notes?.trim() ?? "",
    });

    window.setTimeout(() => {
      setIsSaving(false);
      setJustSaved(true);
      setIsEditing(false);

      window.setTimeout(() => {
        summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }, SAVE_FEEDBACK_MS);
  }

  const statusLabel = justSaved ? "Saved" : "Checked in today";
  const saveButtonLabel = isSaving ? "Saving..." : "Save Check-In";

  if (isEditing) {
    return (
      <section style={{ ...cardStyle(), ...cardSectionStyle() }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            marginBottom: "14px",
          }}
        >
          <h2 style={sectionTitleStyle()}>Body check-in</h2>
        </div>

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
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              placeholder="Anything you want to remember about today..."
              style={textareaStyle}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
            }}
          >
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              style={secondaryButtonStyle()}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              style={{
                ...primaryButtonStyle(),
                opacity: isSaving ? 0.85 : 1,
                cursor: isSaving ? "wait" : "pointer",
              }}
            >
              {saveButtonLabel}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={summaryRef}
      style={{ ...cardStyle(), ...cardSectionStyle() }}
    >
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
            fontSize: "1.25rem",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            color: colors.text,
            minWidth: 0,
          }}
        >
          Body check-in
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
            color: justSaved ? colors.sage : colors.muted,
            fontWeight: justSaved ? 600 : 500,
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
