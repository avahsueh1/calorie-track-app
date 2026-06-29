"use client";

import { useMemo } from "react";
import type { ProgressJournalEntry } from "../../types/wellness";
import type { UnitsPreference } from "../../types/profile";
import {
  buildProgressJournalStats,
  truncateNotePreview,
} from "../../lib/progressJournal";
import {
  buildWeightChartPoints,
  buildWeightTrendSummary,
} from "../../lib/weightChart";
import { WeightTrendChart } from "../insights/WeightTrendChart";
import {
  insightsCardStyle,
  insightsSectionTitleStyle,
} from "../insights/theme";
import { AppButton } from "../ui/primitives";
import { ProgressJournalHeroCard } from "./ProgressJournalHeroCard";
import { ProgressJournalInfoStrip } from "./ProgressJournalInfoStrip";
import { ProgressJournalSecondaryStats } from "./ProgressJournalSecondaryStats";
import { ProgressJournalTimeline } from "./ProgressJournalTimeline";
import { useProgressJournalGalleryNav } from "./useProgressJournalGalleryNav";
import {
  progressJournalLayout,
  progressJournalPageStackStyle,
} from "./progressJournalUi";

interface ProgressJournalFullViewProps {
  entries: ProgressJournalEntry[];
  units: UnitsPreference;
  onAddEntry: () => void;
  onEditEntry: (date: string) => void;
}

export function ProgressJournalFullView({
  entries,
  units,
  onAddEntry,
  onEditEntry,
}: ProgressJournalFullViewProps) {
  const openGallery = useProgressJournalGalleryNav();
  const stats = useMemo(
    () => buildProgressJournalStats(entries, units),
    [entries, units],
  );
  const weightEntries = useMemo(
    () => entries.filter((entry) => entry.weightKg != null && entry.weightKg > 0),
    [entries],
  );
  const chartPoints = useMemo(
    () => buildWeightChartPoints(entries),
    [entries],
  );
  const trend = useMemo(
    () => buildWeightTrendSummary(chartPoints, units),
    [chartPoints, units],
  );

  const latest = entries[0] ?? null;
  const recentEntries = entries.slice(1);
  const headline =
    trend.message ||
    (latest?.note?.trim()
      ? truncateNotePreview(latest.note, 72)
      : "Track weight, photos, and notes together by date.");

  return (
    <div style={progressJournalPageStackStyle()}>
      <ProgressJournalHeroCard
        entry={latest}
        units={units}
        headline={headline}
        onPhotoPress={openGallery}
      />

      <ProgressJournalSecondaryStats
        stats={stats}
        weighInCount={trend.pointCount}
        onPhotosPress={() => openGallery()}
      />

      {weightEntries.length > 0 ? (
        <WeightTrendChart
          entries={weightEntries}
          units={units}
          density="page"
          showMetricStrip={false}
          showTrendMessage={false}
        />
      ) : null}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: progressJournalLayout.groupGap,
        }}
      >
        <AppButton
          variant="primary"
          onClick={onAddEntry}
          style={{ width: "100%" }}
        >
          Add entry
        </AppButton>
        {latest ? (
          <AppButton
            variant="ghost"
            onClick={() => onEditEntry(latest.date)}
            style={{ width: "100%" }}
          >
            Edit latest entry
          </AppButton>
        ) : null}
      </div>

      {recentEntries.length > 0 ? (
        <section
          style={{
            ...insightsCardStyle(),
            padding: progressJournalLayout.cardPadding,
            borderRadius: progressJournalLayout.cardRadius,
          }}
        >
          <h2
            style={{
              ...insightsSectionTitleStyle(),
              margin: `0 0 ${progressJournalLayout.groupGap}`,
            }}
          >
            Recent entries
          </h2>
          <ProgressJournalTimeline
            entries={recentEntries}
            allEntries={entries}
            units={units}
            onEditEntry={onEditEntry}
          />
        </section>
      ) : null}

      <ProgressJournalInfoStrip />
    </div>
  );
}
