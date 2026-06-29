"use client";

import { useEffect, useState } from "react";
import type { PeriodFlow, PeriodLog } from "../../types/wellness";
import { colors, sans, sectionTitleStyle } from "../dashboard/theme";
import { AppButton, OutlineButton, PrimaryButton } from "../ui/primitives";
import { PeriodFlowSelector } from "./PeriodFlowSelector";
import { fieldLabel, inputStyle } from "./shared";

interface AddPeriodLogSheetProps {
  open: boolean;
  editingLog?: PeriodLog | null;
  startDate: string;
  endDate: string;
  onClose: () => void;
  onSave: (entry: Omit<PeriodLog, "id">) => void;
  onDelete?: () => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export function AddPeriodLogSheet({
  open,
  editingLog = null,
  startDate,
  endDate,
  onClose,
  onSave,
  onDelete,
  onStartDateChange,
  onEndDateChange,
}: AddPeriodLogSheetProps) {
  const [flow, setFlow] = useState<PeriodFlow | "">("");
  const [error, setError] = useState("");
  const isEditing = editingLog !== null;

  useEffect(() => {
    if (!open) {
      return;
    }

    setFlow(editingLog?.flow ?? "");
    setError("");
  }, [open, editingLog]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  function handleSubmit() {
    if (!startDate) {
      setError("Start date is required.");
      return;
    }

    if (endDate && endDate < startDate) {
      setError("End date must be on or after the start date.");
      return;
    }

    onSave({
      startDate,
      endDate: endDate || undefined,
      flow: flow || undefined,
    });
    onClose();
  }

  function handleDelete() {
    if (!onDelete) {
      return;
    }

    const confirmed = window.confirm(
      "Remove this period entry? Your cycle predictions will update.",
    );
    if (!confirmed) {
      return;
    }

    onDelete();
    onClose();
  }

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "rgba(39, 32, 24, 0.32)",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="period-log-title"
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "18px",
          borderRadius: "20px",
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`,
          boxShadow: "0 12px 40px rgba(60, 43, 36, 0.16)",
        }}
      >
        <h3
          id="period-log-title"
          style={{
            ...sectionTitleStyle(),
            marginBottom: "6px",
          }}
        >
          {isEditing ? "Edit period" : "Add period"}
        </h3>
        <p
          style={{
            margin: "0 0 16px",
            fontSize: "0.78rem",
            lineHeight: 1.5,
            color: colors.muted,
            fontFamily: sans,
          }}
        >
          {isEditing
            ? "Update dates or flow for this period entry."
            : "Log period dates to keep your cycle context up to date."}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={fieldLabel("Start date")} htmlFor="period-start">
              Start date
            </label>
            <input
              id="period-start"
              type="date"
              required
              value={startDate}
              onChange={(event) => {
                onStartDateChange(event.target.value);
                setError("");
              }}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={fieldLabel("End date")} htmlFor="period-end">
              End date (optional)
            </label>
            <input
              id="period-end"
              type="date"
              value={endDate}
              onChange={(event) => {
                onEndDateChange(event.target.value);
                setError("");
              }}
              style={inputStyle}
            />
          </div>

          <PeriodFlowSelector value={flow} onChange={setFlow} />
        </div>

        {error ? (
          <p
            style={{
              margin: "12px 0 0",
              fontSize: "0.75rem",
              color: colors.terracotta,
              fontFamily: sans,
            }}
          >
            {error}
          </p>
        ) : null}

        {isEditing && onDelete ? (
          <AppButton
            type="button"
            variant="ghost"
            onClick={handleDelete}
            style={{ width: "100%", marginTop: "14px" }}
          >
            Delete period
          </AppButton>
        ) : null}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginTop: "16px",
          }}
        >
          <OutlineButton type="button" onClick={onClose}>
            Cancel
          </OutlineButton>
          <PrimaryButton type="button" onClick={handleSubmit}>
            {isEditing ? "Save changes" : "Save period"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
