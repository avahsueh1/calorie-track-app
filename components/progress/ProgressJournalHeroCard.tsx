"use client";

import type { CSSProperties } from "react";
import type { ProgressJournalEntry } from "../../types/wellness";
import type { UnitsPreference } from "../../types/profile";
import { formatProgressJournalDate } from "../../lib/progressJournal";
import { formatWeightDisplay } from "../../lib/profileBody";
import {
  insightsColors,
  insightsSans,
  insightsSerif,
} from "../insights/theme";
import { ProgressJournalPhotoThumb } from "./ProgressJournalEntryRow";
import { progressJournalLayout } from "./progressJournalUi";

interface ProgressJournalHeroCardProps {
  entry: ProgressJournalEntry | null;
  units: UnitsPreference;
  headline: string;
  onPhotoPress?: (date: string) => void;
  style?: CSSProperties;
}

export function ProgressJournalHeroCard({
  entry,
  units,
  headline,
  onPhotoPress,
  style,
}: ProgressJournalHeroCardProps) {
  const hasWeight = entry?.weightKg != null && entry.weightKg > 0;
  const weightLabel = hasWeight
    ? formatWeightDisplay(entry!.weightKg!, units)
    : null;

  return (
    <div
      style={{
        padding: progressJournalLayout.cardPadding,
        borderRadius: progressJournalLayout.heroRadius,
        backgroundColor: "#FFFDFB",
        border: `1px solid ${insightsColors.border}`,
        boxShadow: "0 2px 16px rgba(60, 43, 36, 0.04)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: progressJournalLayout.groupGap,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {weightLabel ? (
            <>
              <p
                style={{
                  margin: 0,
                  fontFamily: insightsSerif,
                  fontSize: "2rem",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  color: insightsColors.text,
                }}
              >
                {weightLabel}
              </p>
              {entry ? (
                <p
                  style={{
                    margin: `${progressJournalLayout.groupGap} 0 0`,
                    fontFamily: insightsSans,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: insightsColors.textSecondary,
                    lineHeight: 1.35,
                  }}
                >
                  {formatProgressJournalDate(entry.date)}
                </p>
              ) : null}
            </>
          ) : entry ? (
            <p
              style={{
                margin: 0,
                fontFamily: insightsSerif,
                fontSize: "1.35rem",
                fontWeight: 400,
                lineHeight: 1.2,
                color: insightsColors.text,
              }}
            >
              {formatProgressJournalDate(entry.date)}
            </p>
          ) : (
            <p
              style={{
                margin: 0,
                fontFamily: insightsSerif,
                fontSize: "1.35rem",
                fontWeight: 400,
                lineHeight: 1.2,
                color: insightsColors.text,
              }}
            >
              Your progress
            </p>
          )}

          <p
            style={{
              margin: `${progressJournalLayout.groupGap} 0 0`,
              fontFamily: insightsSans,
              fontSize: "0.8125rem",
              lineHeight: 1.45,
              color: insightsColors.textSecondary,
            }}
          >
            {headline}
          </p>
        </div>

        {entry?.photoDataUrl ? (
          <ProgressJournalPhotoThumb
            photoDataUrl={entry.photoDataUrl}
            alt={`Progress photo for ${entry.date}`}
            size={52}
            onPress={
              onPhotoPress ? () => onPhotoPress(entry.date) : undefined
            }
          />
        ) : null}
      </div>
    </div>
  );
}
