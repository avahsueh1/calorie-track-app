"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useMemo } from "react";
import type { ProgressJournalEntry } from "../../types/wellness";
import type { UnitsPreference } from "../../types/profile";
import {
  buildProgressJournalStats,
  formatProgressJournalDateShort,
} from "../../lib/progressJournal";
import { formatWeightDisplay } from "../../lib/profileBody";
import { routes } from "../../lib/routes";
import { WeightTrendChart } from "../insights/WeightTrendChart";
import {
  insightsCardStyle,
  insightsColors,
  insightsSans,
  insightsSectionTitleStyle,
} from "../insights/theme";
import { ProgressJournalPhotoThumb } from "./ProgressJournalEntryRow";

interface ProgressJournalSectionProps {
  entries: ProgressJournalEntry[];
  units: UnitsPreference;
  variant?: "default" | "bento";
}

function journalOpenButtonStyle(): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "fit-content",
    padding: "7px 12px",
    borderRadius: "999px",
    border: `1px solid ${insightsColors.border}`,
    backgroundColor: insightsColors.cardSoft,
    color: insightsColors.terracotta,
    fontFamily: insightsSans,
    fontSize: "0.8rem",
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
    boxSizing: "border-box",
  };
}

export function ProgressJournalSection({
  entries,
  units,
  variant = "default",
}: ProgressJournalSectionProps) {
  const isBento = variant === "bento";
  const stats = useMemo(
    () => buildProgressJournalStats(entries, units),
    [entries, units],
  );
  const weightEntries = useMemo(
    () => entries.filter((entry) => entry.weightKg != null && entry.weightKg > 0),
    [entries],
  );
  const latest = entries[0];
  const hasEntries = entries.length > 0;

  const summaryLine = [
    stats.currentWeightLabel,
    stats.changeSinceLastLabel
      ? `${stats.changeSinceLastLabel} since last`
      : null,
    stats.totalPhotos > 0
      ? `${stats.totalPhotos} photo${stats.totalPhotos === 1 ? "" : "s"}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section
      className={`insights-panel ${isBento ? "insights-bento-journal" : ""}`}
      style={{ ...insightsCardStyle(), padding: "14px 16px" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: isBento ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: hasEntries ? "6px" : "8px",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h2 style={{ ...insightsSectionTitleStyle(), margin: 0 }}>
            Progress Journal
          </h2>
          {hasEntries && isBento && summaryLine ? (
            <p
              style={{
                margin: "2px 0 0",
                fontSize: "0.72rem",
                lineHeight: 1.35,
                color: insightsColors.textSecondary,
                fontFamily: insightsSans,
              }}
            >
              {summaryLine}
            </p>
          ) : null}
        </div>
        {hasEntries ? (
          <Link
            href={routes.progressJournal}
            style={{
              flexShrink: 0,
              fontSize: "0.76rem",
              fontWeight: 600,
              color: insightsColors.terracotta,
              fontFamily: insightsSans,
              textDecoration: "none",
            }}
          >
            Open →
          </Link>
        ) : null}
      </div>

      {!hasEntries ? (
        <p
          style={{
            margin: "0 0 4px",
            fontSize: "0.78rem",
            lineHeight: 1.45,
            color: insightsColors.textSecondary,
            fontFamily: insightsSans,
          }}
        >
          Track weight, photos, and notes together by date.
        </p>
      ) : (
        <>
          {summaryLine && !isBento ? (
            <p
              style={{
                margin: "0 0 8px",
                fontSize: "0.76rem",
                lineHeight: 1.4,
                color: insightsColors.textSecondary,
                fontFamily: insightsSans,
              }}
            >
              {summaryLine}
            </p>
          ) : null}

          {latest && !isBento ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "8px",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: insightsColors.textSecondary,
                    fontFamily: insightsSans,
                  }}
                >
                  Latest
                </p>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: insightsColors.text,
                    fontFamily: insightsSans,
                  }}
                >
                  {formatProgressJournalDateShort(latest.date)}
                  {latest.weightKg != null && latest.weightKg > 0
                    ? ` · ${formatWeightDisplay(latest.weightKg, units)}`
                    : ""}
                </p>
              </div>
              <ProgressJournalPhotoThumb
                photoDataUrl={latest.photoDataUrl}
                size={36}
              />
            </div>
          ) : null}

          <WeightTrendChart
            entries={weightEntries}
            units={units}
            embedded
            showTitle={false}
            showMetricStrip={false}
            showTrendMessage={false}
          />
        </>
      )}

      <Link
        href={routes.progressJournal}
        className="insights-panel-footer"
        style={journalOpenButtonStyle()}
      >
        {hasEntries ? "View progress journal" : "Start progress journal"}
      </Link>
    </section>
  );
}
