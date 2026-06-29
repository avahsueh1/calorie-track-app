"use client";

import type { ProgressJournalEntry } from "../../types/wellness";
import type { UnitsPreference } from "../../types/profile";
import {
  formatProgressJournalDateShort,
  getWeightDeltaKg,
  truncateNotePreview,
} from "../../lib/progressJournal";
import { formatWeightDisplay } from "../../lib/profileBody";
import { colors, sans } from "../../lib/theme";
import { StatusPill } from "../ui/StatusPill";
import {
  progressNoPhotoLabelStyle,
  progressPhotoThumbStyle,
} from "./progressJournalUi";

interface ProgressJournalEntryRowProps {
  entry: ProgressJournalEntry;
  units: UnitsPreference;
  allEntries: ProgressJournalEntry[];
  onPress?: (date: string) => void;
  showNote?: boolean;
}

function formatDeltaLabel(deltaKg: number, units: UnitsPreference): string {
  const sign = deltaKg > 0 ? "+" : deltaKg < 0 ? "−" : "";
  const abs = Math.abs(deltaKg);
  if (units === "metric") {
    return `${sign}${Math.round(abs * 10) / 10} kg`;
  }
  return `${sign}${Math.round(abs / 0.453592)} lb`;
}

export function ProgressJournalPhotoThumb({
  photoDataUrl,
  alt,
  size,
  onPress,
}: {
  photoDataUrl?: string;
  alt?: string;
  size?: number;
  onPress?: () => void;
}) {
  if (!photoDataUrl) {
    return <span style={progressNoPhotoLabelStyle()}>No photo</span>;
  }

  const thumb = (
    <div style={progressPhotoThumbStyle(size)} aria-hidden={!alt}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoDataUrl}
        alt={alt ?? ""}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );

  if (!onPress) {
    return thumb;
  }

  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={alt ?? "Open photo gallery"}
      style={{
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        flexShrink: 0,
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {thumb}
    </button>
  );
}

export function ProgressJournalEntryRow({
  entry,
  units,
  allEntries,
  onPress,
  showNote = false,
}: ProgressJournalEntryRowProps) {
  const hasWeight = entry.weightKg != null && entry.weightKg > 0;
  const deltaKg = getWeightDeltaKg(entry, allEntries);
  const notePreview = entry.note?.trim()
    ? truncateNotePreview(entry.note, 56)
    : undefined;

  const content = (
  <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr) auto",
          gap: "10px",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.78rem",
              fontWeight: 600,
              color: colors.text,
              fontFamily: sans,
              lineHeight: 1.25,
            }}
          >
            {formatProgressJournalDateShort(entry.date)}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            minWidth: 0,
          }}
        >
          {hasWeight ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                flexWrap: "wrap",
              }}
            >
              <StatusPill
                tone="neutral"
                value={formatWeightDisplay(entry.weightKg!, units)}
              />
              {deltaKg != null && Math.abs(deltaKg) >= 0.1 ? (
                <StatusPill
                  tone={deltaKg < 0 ? "sage" : deltaKg > 0 ? "terracotta" : "neutral"}
                  value={formatDeltaLabel(deltaKg, units)}
                  variant="plain"
                />
              ) : null}
            </div>
          ) : (
            <span
              style={{
                fontSize: "0.72rem",
                color: colors.muted,
                fontFamily: sans,
                fontStyle: "italic",
              }}
            >
              No weight logged
            </span>
          )}
        </div>

        <ProgressJournalPhotoThumb
          photoDataUrl={entry.photoDataUrl}
          alt={entry.note?.trim() ? `Progress photo for ${entry.date}` : undefined}
        />
      </div>

      {showNote && notePreview ? (
        <p
          style={{
            margin: "8px 0 0",
            fontSize: "0.74rem",
            lineHeight: 1.45,
            color: colors.muted,
            fontFamily: sans,
          }}
        >
          {notePreview}
        </p>
      ) : null}
    </>
  );

  if (!onPress) {
    return (
      <div
        style={{
          padding: "11px 12px",
          borderRadius: "14px",
          backgroundColor: "#F7EFE8",
          border: "1px solid #E6D7CB",
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onPress(entry.date)}
      style={{
        display: "block",
        width: "100%",
        padding: "11px 12px",
        borderRadius: "14px",
        backgroundColor: "#F7EFE8",
        border: "1px solid #E6D7CB",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: sans,
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {content}
    </button>
  );
}
