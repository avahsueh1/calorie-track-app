"use client";

import { useMemo } from "react";
import type { ProgressJournalEntry } from "../../types/wellness";
import type { UnitsPreference } from "../../types/profile";
import { buildProgressJournalStats } from "../../lib/progressJournal";
import { colors, sans, sectionTitleStyle, stackStyle, layout } from "../../lib/theme";
import { AppCard, PrimaryButton } from "../ui/primitives";
import { ProgressJournalLatestCard } from "./ProgressJournalLatestCard";
import { ProgressJournalPhotoStrip } from "./ProgressJournalPhotoStrip";
import { ProgressJournalSummaryBar } from "./ProgressJournalSummaryBar";
import { ProgressJournalTimeline } from "./ProgressJournalTimeline";
import { useProgressJournalGalleryNav } from "./useProgressJournalGalleryNav";

interface ProgressJournalPopulatedViewProps {
  entries: ProgressJournalEntry[];
  units: UnitsPreference;
  onAddEntry: () => void;
  onEditEntry: (date: string) => void;
  recentLimit?: number;
  showPhotoStrip?: boolean;
}

export function ProgressJournalPopulatedView({
  entries,
  units,
  onAddEntry,
  onEditEntry,
  recentLimit,
  showPhotoStrip = false,
}: ProgressJournalPopulatedViewProps) {
  const openGallery = useProgressJournalGalleryNav();
  const stats = useMemo(
    () => buildProgressJournalStats(entries, units),
    [entries, units],
  );
  const latest = entries[0];
  const recentEntries = recentLimit ? entries.slice(1, recentLimit + 1) : entries.slice(1);

  return (
    <div style={stackStyle(layout.cardGap)}>
      <ProgressJournalSummaryBar stats={stats} />

      <PrimaryButton type="button" onClick={onAddEntry}>
        Add entry
      </PrimaryButton>

      {latest ? (
        <ProgressJournalLatestCard
          entry={latest}
          units={units}
          allEntries={entries}
          onPress={onEditEntry}
          onPhotoPress={openGallery}
        />
      ) : null}

      {recentEntries.length > 0 ? (
        <AppCard padding="compact">
          <h2 style={{ ...sectionTitleStyle(), marginBottom: "12px" }}>
            Recent entries
          </h2>
          <ProgressJournalTimeline
            entries={recentEntries}
            allEntries={entries}
            units={units}
            onEditEntry={onEditEntry}
          />
        </AppCard>
      ) : null}

      {showPhotoStrip && stats.totalPhotos > 0 ? (
        <AppCard padding="compact">
          <ProgressJournalPhotoStrip
            entries={entries}
            onOpenGallery={openGallery}
          />
        </AppCard>
      ) : null}
    </div>
  );
}
