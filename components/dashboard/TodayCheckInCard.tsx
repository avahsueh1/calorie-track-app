"use client";

import Link from "next/link";
import { routes } from "../../lib/routes";
import { useCheckIn } from "../providers/CheckInProvider";
import {
  useInsightsData,
  useTrackingPreferences,
} from "../providers/AppStateProvider";
import { hasCheckInContent } from "../../lib/checkInHelpers";
import { todayDateKey } from "../../lib/appStateHelpers";
import { PatternInsightCards } from "../insights/PatternInsightCards";
import { DayNotesSection } from "../insights/DayNotesSection";
import { CheckInSummaryView } from "./CheckInSummaryView";
import { AppCard } from "../ui/AppCard";
import { colors, sans } from "./theme";

function logCheckInButtonStyle() {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "32px",
    padding: "0 14px",
    fontSize: "0.78rem",
    fontWeight: 600,
    color: colors.terracotta,
    backgroundColor: colors.card,
    borderRadius: "999px",
    border: `1px solid ${colors.terracottaLight}`,
    cursor: "pointer",
    fontFamily: sans,
    flexShrink: 0,
    lineHeight: 1,
    textDecoration: "none",
  } as const;
}

export function TodayCheckInCard() {
  const { checkIn } = useCheckIn();
  const { patternInsightCards } = useInsightsData();
  const { homeModules } = useTrackingPreferences();
  const hasContent = hasCheckInContent(checkIn);
  const showInsights =
    homeModules.showCycleInsights && patternInsightCards.length > 0;

  return (
    <AppCard padding="standard">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontFamily: sans,
              fontSize: "1rem",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: colors.text,
            }}
          >
            Today&apos;s check-in
          </h2>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "0.78rem",
              color: colors.muted,
              fontFamily: sans,
            }}
          >
            {hasContent ? "Checked in today" : "Optional symptom logger"}
          </p>
        </div>
        <Link
          href={routes.logWithTab("check-in")}
          style={logCheckInButtonStyle()}
        >
          {hasContent ? "Edit" : "Log check-in"}
        </Link>
      </div>

      <CheckInSummaryView
        saved={checkIn}
        notesSection={
          <DayNotesSection
            dateKey={todayDateKey()}
            entry={null}
            variant="reminder"
            placeholder="Add your personal thoughts about today..."
          />
        }
        footerSection={
          showInsights ? (
            <PatternInsightCards cards={patternInsightCards} />
          ) : null
        }
      />
    </AppCard>
  );
}
