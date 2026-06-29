"use client";

import { Check, MessageSquareText, X } from "lucide-react";
import type { SymptomKey } from "../../types";
import { getSymptomOptions, optionGridColumns, selectionToStatusTone } from "../../lib/symptomOptions";
import { formatSymptomSelection } from "../../lib/checkInHelpers";
import { getSymptomIconStyle } from "../../lib/symptomIcons";
import { colors, sans } from "../../lib/theme";
import { ExpandableNoteCard } from "../ui/ExpandableNoteCard";
import { IconBubble } from "../ui/IconBubble";
import { StatusPill } from "../ui/StatusPill";

interface SymptomRowProps {
  symptomKey: SymptomKey;
  label: string;
  selected: boolean;
  expanded: boolean;
  selection?: string;
  note?: string;
  onSelect: () => void;
  onExpand: () => void;
  onRemove: () => void;
  onSelectionChange: (selection: string) => void;
  onNoteChange: (note: string) => void;
  onDone: () => void;
  hasUnsavedChanges: boolean;
}

export function SymptomRow({
  symptomKey,
  label,
  selected,
  expanded,
  selection,
  note,
  onSelect,
  onExpand,
  onRemove,
  onSelectionChange,
  onNoteChange,
  onDone,
  hasUnsavedChanges,
}: SymptomRowProps) {
  const iconStyle = getSymptomIconStyle(symptomKey);
  const options = getSymptomOptions(symptomKey);
  const hasNote = Boolean(note?.trim());
  const hasSelection = Boolean(selection);
  const selectionLabel = selection
    ? formatSymptomSelection(symptomKey, selection)
    : null;

  if (expanded) {
    return (
      <div
        style={{
          gridColumn: "1 / -1",
          borderRadius: "14px",
          border: `1px solid ${colors.terracottaLight}`,
          backgroundColor: colors.terracottaPale,
          padding: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "12px",
          }}
        >
          <IconBubble
            icon={iconStyle.icon}
            backgroundColor={iconStyle.backgroundColor}
            color={iconStyle.color}
            size="sm"
          />
          <span
            style={{
              flex: 1,
              fontSize: "0.9rem",
              fontWeight: 600,
              color: colors.text,
              fontFamily: sans,
            }}
          >
            {label}
          </span>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${label}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "999px",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.card,
              color: colors.muted,
              cursor: "pointer",
            }}
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: optionGridColumns(options.length),
            gap: "6px",
          }}
          role="group"
          aria-label={`${label} options`}
        >
          {options.map((option) => {
            const isActive = selection === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelectionChange(option.value)}
                style={{
                  minHeight: "34px",
                  borderRadius: "999px",
                  border: `1px solid ${isActive ? colors.terracotta : colors.border}`,
                  backgroundColor: isActive ? colors.card : colors.shell,
                  color: isActive ? colors.terracotta : colors.muted,
                  fontSize: "0.72rem",
                  fontWeight: isActive ? 700 : 500,
                  fontFamily: sans,
                  cursor: "pointer",
                  padding: "6px 8px",
                  lineHeight: 1.2,
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {hasSelection ? (
          <ExpandableNoteCard
            variant="inline"
            value={note ?? ""}
            onChange={onNoteChange}
            textareaId={`symptom-note-${symptomKey}`}
            subtitle={`Optional — details about ${label.toLowerCase()}`}
            placeholder={`Add a note about ${label.toLowerCase()}...`}
            defaultOpen={hasNote}
            minHeight={72}
          />
        ) : null}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "12px",
          }}
        >
          <button
            type="button"
            onClick={onDone}
            disabled={!hasUnsavedChanges}
            aria-label={`Done with ${label}`}
            aria-disabled={!hasUnsavedChanges}
            style={doneButtonStyle(hasUnsavedChanges)}
          >
            <Check size={15} strokeWidth={2.25} />
            Done
          </button>
        </div>
      </div>
    );
  }

  if (!selected) {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={false}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
          minHeight: "88px",
          padding: "12px 8px",
          borderRadius: "14px",
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.card,
          cursor: "pointer",
          fontFamily: sans,
          textAlign: "center",
          transition: "border-color 0.15s ease, background-color 0.15s ease",
        }}
      >
        <IconBubble
          icon={iconStyle.icon}
          backgroundColor={colors.shell}
          color={colors.muted}
          size="sm"
        />
        <span
          style={{
            fontSize: "0.76rem",
            fontWeight: 500,
            color: colors.muted,
            lineHeight: 1.3,
          }}
        >
          {label}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onExpand}
      aria-pressed
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        width: "100%",
        minHeight: "88px",
        padding: "12px 8px",
        borderRadius: "14px",
        border: `1px solid ${colors.terracottaLight}`,
        backgroundColor: colors.terracottaPale,
        cursor: "pointer",
        fontFamily: sans,
        textAlign: "center",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "20px",
          height: "20px",
          borderRadius: "999px",
          backgroundColor: colors.sage,
          color: colors.card,
        }}
        aria-hidden
      >
        <Check size={12} strokeWidth={2.5} />
      </span>
      <IconBubble
        icon={iconStyle.icon}
        backgroundColor={iconStyle.backgroundColor}
        color={iconStyle.color}
        size="sm"
      />
      <span
        style={{
          fontSize: "0.76rem",
          fontWeight: 600,
          color: colors.text,
          lineHeight: 1.3,
        }}
      >
        {label}
      </span>
      {selectionLabel ? (
        <StatusPill
          tone={selection ? selectionToStatusTone(selection) : "neutral"}
          value={selectionLabel}
          style={{ transform: "scale(0.92)", maxWidth: "100%" }}
        />
      ) : null}
      {hasNote ? (
        <MessageSquareText
          size={13}
          strokeWidth={1.75}
          color={colors.muted}
          aria-label="Has note"
        />
      ) : null}
    </button>
  );
}

function doneButtonStyle(hasUnsavedChanges: boolean) {
  if (hasUnsavedChanges) {
    return {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      minHeight: "36px",
      padding: "0 14px",
      borderRadius: "999px",
      border: `1px solid ${colors.sage}`,
      backgroundColor: colors.sage,
      color: colors.card,
      fontSize: "0.78rem",
      fontWeight: 600,
      fontFamily: sans,
      cursor: "pointer",
      boxShadow: "0 2px 6px rgba(125, 155, 138, 0.35)",
      transition:
        "border-color 0.15s ease, background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
    } as const;
  }

  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    minHeight: "36px",
    padding: "0 14px",
    borderRadius: "999px",
    border: "1px solid #D4CEC8",
    backgroundColor: "#E4DFD9",
    color: "#8A8178",
    fontSize: "0.78rem",
    fontWeight: 600,
    fontFamily: sans,
    cursor: "not-allowed",
    boxShadow: "none",
    opacity: 0.85,
    transition:
      "border-color 0.15s ease, background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
  } as const;
}
