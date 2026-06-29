"use client";

import { Info } from "lucide-react";
import {
  insightsColors,
  insightsSans,
} from "../insights/theme";
import { progressJournalLayout } from "./progressJournalUi";

export function ProgressJournalInfoStrip() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: progressJournalLayout.groupGap,
        padding: progressJournalLayout.cardPadding,
        borderRadius: progressJournalLayout.noteRadius,
        backgroundColor: "rgba(248, 243, 238, 0.72)",
        border: `1px solid ${insightsColors.border}`,
        boxSizing: "border-box",
      }}
    >
      <Info
        size={15}
        strokeWidth={1.75}
        color={insightsColors.textSecondary}
        style={{ flexShrink: 0, marginTop: "1px", opacity: 0.85 }}
        aria-hidden
      />
      <p
        style={{
          margin: 0,
          fontFamily: insightsSans,
          fontSize: "0.8125rem",
          lineHeight: 1.45,
          color: insightsColors.textSecondary,
        }}
      >
        Weight, photos, and notes for the same day stay connected. Log a few
        weigh-ins to see a clearer trend — daily changes are normal.
      </p>
    </div>
  );
}
