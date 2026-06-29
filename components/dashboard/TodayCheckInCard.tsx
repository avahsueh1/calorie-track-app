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
import { cardStyle, colors, sans } from "./theme";
import { spacing } from "../../lib/theme";

function logCheckInButtonStyle() {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "28px",
    padding: "0 11px",
    fontSize: "0.75rem",
    fontWeight: 500,
    color: "#744336",
    backgroundColor: "#FFFDFC",
    borderRadius: "999px",
    border: "1px solid #E8C9BC",
    cursor: "pointer",
    fontFamily: sans,
    flexShrink: 0,
    lineHeight: 1,
    textDecoration: "none",
    WebkitTapHighlightColor: "transparent",
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
    <section
      style={{
        ...cardStyle(),
        padding: 0,
        backgroundColor: "transparent",
        border: "none",
        boxShadow: "none",
        display: "flex",
        flexDirection: "column",
        gap: spacing.block,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto",
          columnGap: "8px",
          rowGap: "4px",
        }}
      >
        <h2
          style={{
            margin: 0,
            gridColumn: 1,
            gridRow: 1,
            alignSelf: "center",
            fontFamily: sans,
            fontSize: "1.625rem",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            color: "#272018",
            minWidth: 0,
          }}
        >
          Today&apos;s check-in
        </h2>
        <Link
          href={routes.logWithTab("check-in")}
          style={{
            ...logCheckInButtonStyle(),
            gridColumn: 2,
            gridRow: 1,
            alignSelf: "center",
            justifySelf: "end",
          }}
        >
          {hasContent ? "Edit" : "Log check-in"}
        </Link>
        <p
          style={{
            margin: 0,
            gridColumn: 1,
            gridRow: 2,
            fontSize: "0.75rem",
            color: colors.muted,
            fontWeight: 500,
            fontFamily: sans,
          }}
        >
          {hasContent ? "Checked in today" : "Optional symptom logger"}
        </p>
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
    </section>
  );
}
