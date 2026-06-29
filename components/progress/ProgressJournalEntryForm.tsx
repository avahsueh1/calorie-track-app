"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import type { ProgressJournalEntry } from "../../types/wellness";
import type { UnitsPreference } from "../../types/profile";
import type { ProgressJournalUpsert } from "../../lib/progressJournal";
import { getProgressJournalEntry } from "../../lib/progressJournal";
import { compressImageFile } from "../../lib/imageCompress";
import { todayDateKey } from "../../lib/appStateHelpers";
import { kgToLb, lbToKg } from "../../lib/profileBody";
import { colors, sans, sectionTitleStyle } from "../../lib/theme";
import { AppCard, DailyNote, PrimaryButton } from "../ui/primitives";
import {
  fieldLabel,
  inputStyle,
  secondaryButtonStyle,
  textareaStyle,
} from "../log/shared";

interface ProgressJournalEntryFormProps {
  journalByDate: Record<string, ProgressJournalEntry>;
  units: UnitsPreference;
  initialDate?: string;
  title?: string;
  onSave: (patch: ProgressJournalUpsert) => void;
  onCancel?: () => void;
  onSaved?: () => void;
}

export function ProgressJournalEntryForm({
  journalByDate,
  units,
  initialDate,
  title = "Add entry",
  onSave,
  onCancel,
  onSaved,
}: ProgressJournalEntryFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState(initialDate ?? todayDateKey());
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pendingPhoto, setPendingPhoto] = useState<string | null | undefined>(
    undefined,
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDate(initialDate ?? todayDateKey());
  }, [initialDate]);

  useEffect(() => {
    const existing = getProgressJournalEntry(journalByDate, date);
    if (existing?.weightKg != null) {
      const displayWeight =
        units === "metric" ? existing.weightKg : kgToLb(existing.weightKg);
      setWeight(String(displayWeight));
    } else {
      setWeight("");
    }
    setNote(existing?.note ?? "");
    setPhotoPreview(existing?.photoDataUrl ?? null);
    setPendingPhoto(undefined);
    setError("");
  }, [date, journalByDate, units]);

  async function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    setError("");
    setBusy(true);

    try {
      const dataUrl = await compressImageFile(file);
      setPhotoPreview(dataUrl);
      setPendingPhoto(dataUrl);
    } catch {
      setError("Could not add that photo. Try another image.");
    } finally {
      setBusy(false);
    }
  }

  function handleClearPhoto() {
    setPhotoPreview(null);
    setPendingPhoto(null);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedNote = note.trim();
    const trimmedWeight = weight.trim();
    const parsedWeight = trimmedWeight ? Number(trimmedWeight) : undefined;
    const hasWeight =
      parsedWeight !== undefined && !Number.isNaN(parsedWeight) && parsedWeight > 0;
    const hasPhoto =
      pendingPhoto !== undefined ? Boolean(pendingPhoto) : Boolean(photoPreview);
    const hasNote = Boolean(trimmedNote);

    if (!hasWeight && !hasPhoto && !hasNote) {
      setError("Add a weight, photo, or note before saving.");
      return;
    }

    if (trimmedWeight && !hasWeight) {
      setError("Enter a valid weight.");
      return;
    }

    const weightKg = hasWeight
      ? units === "metric"
        ? parsedWeight
        : lbToKg(parsedWeight!)
      : trimmedWeight === ""
        ? null
        : undefined;

    setError("");
    onSave({
      date,
      weightKg,
      photoDataUrl: pendingPhoto,
      note: trimmedNote || null,
    });
    onSaved?.();
  }

  const weightLabel =
    units === "metric" ? "Weight (kg, optional)" : "Weight (lb, optional)";

  return (
    <AppCard padding="compact">
      <h2 style={{ ...sectionTitleStyle(), marginBottom: "10px" }}>{title}</h2>
      <DailyNote
        variant="empty"
        bodyStyle={{ fontSize: "0.76rem", marginBottom: "14px" }}
      >
        Weight, photo, and note are all optional — add any combination for this
        date.
      </DailyNote>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <div>
          <label style={fieldLabel("Date")} htmlFor="progress-journal-date">
            Date
          </label>
          <input
            id="progress-journal-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={fieldLabel(weightLabel)} htmlFor="progress-journal-weight">
            {weightLabel}
          </label>
          <input
            id="progress-journal-weight"
            type="number"
            min={0}
            step={0.1}
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            placeholder={units === "metric" ? "e.g. 56.2" : "e.g. 124"}
            style={inputStyle}
          />
        </div>

        <div>
          <span style={fieldLabel("Progress photo (optional)")}>
            Progress photo (optional)
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "9px 12px",
                borderRadius: "999px",
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.card,
                color: colors.text,
                fontFamily: sans,
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: busy ? "wait" : "pointer",
              }}
            >
              <Camera size={14} strokeWidth={1.75} aria-hidden />
              {busy ? "Adding…" : photoPreview ? "Replace photo" : "Add photo"}
            </button>
            {photoPreview ? (
              <button
                type="button"
                onClick={handleClearPhoto}
                style={{
                  border: "none",
                  background: "transparent",
                  color: colors.muted,
                  fontFamily: sans,
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: "2px",
                }}
              >
                Remove photo
              </button>
            ) : null}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
            style={{ display: "none" }}
            aria-hidden
          />
          {photoPreview ? (
            <div
              style={{
                marginTop: "10px",
                width: "56px",
                borderRadius: "10px",
                overflow: "hidden",
                border: `1px solid ${colors.border}`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoPreview}
                alt="Selected progress photo preview"
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                }}
              />
            </div>
          ) : null}
        </div>

        <div>
          <label style={fieldLabel("Note (optional)")} htmlFor="progress-journal-note">
            Note (optional)
          </label>
          <textarea
            id="progress-journal-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="How are you feeling? Anything you want to remember?"
            style={textareaStyle}
            rows={3}
          />
        </div>

        {error ? (
          <p
            style={{
              margin: 0,
              fontSize: "0.78rem",
              color: colors.terracotta,
              fontFamily: sans,
            }}
          >
            {error}
          </p>
        ) : null}

        <PrimaryButton type="submit">Save entry</PrimaryButton>
        {onCancel ? (
          <button type="button" onClick={onCancel} style={secondaryButtonStyle()}>
            Cancel
          </button>
        ) : null}
      </form>
    </AppCard>
  );
}
