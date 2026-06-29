"use client";

import type { ProgressJournalEntry } from "../../types/wellness";
import type { UnitsPreference } from "../../types/profile";
import { formatProgressJournalDate, truncateNotePreview } from "../../lib/progressJournal";
import { formatWeightDisplay } from "../../lib/profileBody";
import { colors, sans, sectionTitleStyle } from "../../lib/theme";
import { AppCard, DailyNote } from "../ui/primitives";
import { StatusPill } from "../ui/StatusPill";
import { ProgressJournalEntryRow, ProgressJournalPhotoThumb } from "./ProgressJournalEntryRow";

interface ProgressJournalLatestCardProps {
  entry: ProgressJournalEntry;
  units: UnitsPreference;
  allEntries: ProgressJournalEntry[];
  onPress?: (date: string) => void;
  onPhotoPress?: (date: string) => void;
}

export function ProgressJournalLatestCard({
  entry,
  units,
  allEntries,
  onPress,
  onPhotoPress,
}: ProgressJournalLatestCardProps) {
  const hasWeight = entry.weightKg != null && entry.weightKg > 0;
  const hasNote = Boolean(entry.note?.trim());

  const inner = (
    <>
      <p
        style={{
          margin: "0 0 10px",
          fontSize: "0.62rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: colors.muted,
          fontFamily: sans,
        }}
      >
        Latest entry
      </p>

      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              ...sectionTitleStyle(),
              margin: "0 0 8px",
              fontSize: "0.95rem",
            }}
          >
            {formatProgressJournalDate(entry.date)}
          </h3>

          {hasWeight ? (
            <StatusPill
              tone="neutral"
              value={formatWeightDisplay(entry.weightKg!, units)}
            />
          ) : (
            <StatusPill tone="lavender" value="No weight" variant="plain" />
          )}

          {hasNote ? (
            <DailyNote
              variant="summary"
              label="Note"
              style={{ marginTop: "12px" }}
              bodyStyle={{ fontSize: "0.78rem" }}
            >
              {truncateNotePreview(entry.note!, 120)}
            </DailyNote>
          ) : null}
        </div>

        <ProgressJournalPhotoThumb
          photoDataUrl={entry.photoDataUrl}
          alt={`Latest progress photo for ${entry.date}`}
          size={56}
          onPress={
            onPhotoPress
              ? () => onPhotoPress(entry.date)
              : undefined
          }
        />
      </div>
    </>
  );

  if (!onPress) {
    return <AppCard padding="compact">{inner}</AppCard>;
  }

  return (
    <AppCard padding="compact" style={{ padding: 0, overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => onPress(entry.date)}
        style={{
          display: "block",
          width: "100%",
          padding: "16px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: sans,
        }}
      >
        {inner}
      </button>
    </AppCard>
  );
}

export function ProgressJournalLatestCardCompact({
  entry,
  units,
  allEntries,
  onPress,
}: ProgressJournalLatestCardProps) {
  return (
    <AppCard padding="compact" style={{ padding: "0", overflow: "hidden" }}>
      <p
        style={{
          margin: 0,
          padding: "12px 14px 0",
          fontSize: "0.62rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: colors.muted,
          fontFamily: sans,
        }}
      >
        Latest entry
      </p>
      <div style={{ padding: "8px 10px 10px" }}>
        <ProgressJournalEntryRow
          entry={entry}
          units={units}
          allEntries={allEntries}
          onPress={onPress}
          showNote
        />
      </div>
    </AppCard>
  );
}
