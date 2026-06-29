"use client";

import type { ProgressJournalStats } from "../../lib/progressJournal";
import {
  insightsColors,
  insightsSans,
  insightsSerif,
} from "../insights/theme";
import { progressJournalLayout } from "./progressJournalUi";

interface ProgressJournalSecondaryStatsProps {
  stats: ProgressJournalStats;
  weighInCount: number;
  onPhotosPress?: () => void;
}

function StatCell({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress?: () => void;
}) {
  const content = (
    <>
      <span
        style={{
          display: "block",
          fontFamily: insightsSans,
          fontSize: "14px",
          fontWeight: 500,
          color: insightsColors.textSecondary,
          lineHeight: 1.2,
        }}
      >
        {label}
      </span>
      <span
        style={{
          display: "block",
          marginTop: "6px",
          fontFamily: insightsSerif,
          fontSize: "22px",
          fontWeight: 400,
          color: insightsColors.text,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </span>
    </>
  );

  const boxStyle = {
    minHeight: "68px",
    maxHeight: "72px",
    padding: progressJournalLayout.cardPadding,
    borderRadius: progressJournalLayout.statRadius,
    backgroundColor: insightsColors.cardSoft,
    border: `1px solid ${insightsColors.border}`,
    boxSizing: "border-box" as const,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    minWidth: 0,
    width: "100%",
  };

  if (!onPress) {
    return <div style={boxStyle}>{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={`Open photo gallery, ${value} photos`}
      style={{
        ...boxStyle,
        cursor: "pointer",
        textAlign: "left",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {content}
    </button>
  );
}

export function ProgressJournalSecondaryStats({
  stats,
  weighInCount,
  onPhotosPress,
}: ProgressJournalSecondaryStatsProps) {
  return (
    <div>
      <p
        style={{
          margin: `0 0 ${progressJournalLayout.groupGap}`,
          fontFamily: insightsSans,
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: insightsColors.textSecondary,
        }}
      >
        At a glance
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: progressJournalLayout.groupGap,
        }}
      >
        <StatCell
          label="Since last"
          value={stats.changeSinceLastLabel ?? "—"}
        />
        <StatCell
          label="Weigh-ins"
          value={String(weighInCount)}
        />
        <StatCell
          label="Photos"
          value={String(stats.totalPhotos)}
          onPress={
            stats.totalPhotos > 0 && onPhotosPress ? onPhotosPress : undefined
          }
        />
      </div>
    </div>
  );
}
