"use client";

import type { ProgressJournalEntry } from "../../types/wellness";
import type { UnitsPreference } from "../../types/profile";
import { colors, sans } from "../../lib/theme";
import { ProgressJournalEntryRow } from "./ProgressJournalEntryRow";

interface ProgressJournalTimelineProps {
  entries: ProgressJournalEntry[];
  units: UnitsPreference;
  allEntries?: ProgressJournalEntry[];
  onEditEntry?: (date: string) => void;
  limit?: number;
}

export function ProgressJournalTimeline({
  entries,
  units,
  allEntries,
  onEditEntry,
  limit,
}: ProgressJournalTimelineProps) {
  const visibleEntries = limit ? entries.slice(0, limit) : entries;
  const deltaSource = allEntries ?? visibleEntries;

  if (visibleEntries.length === 0) {
    return (
      <p
        style={{
          margin: 0,
          fontSize: "0.8rem",
          lineHeight: 1.5,
          color: colors.muted,
          fontFamily: sans,
          fontStyle: "italic",
        }}
      >
        No progress entries yet. Add a weigh-in, photo, or note to get started.
      </p>
    );
  }

  return (
    <ul
      style={{
        margin: 0,
        padding: 0,
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {visibleEntries.map((entry) => (
        <li key={entry.date}>
          <ProgressJournalEntryRow
            entry={entry}
            units={units}
            allEntries={deltaSource}
            onPress={onEditEntry}
          />
        </li>
      ))}
    </ul>
  );
}
