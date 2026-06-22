"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { AppShell } from "../../../../components/ui/AppShell";
import { BodyPatternDayDetail } from "../../../../components/insights/BodyPatternDayDetail";
import { isValidDateKey } from "../../../../components/insights/bodyPatternCalendarUtils";
import { insightsColors, insightsSans } from "../../../../components/insights/theme";
import {
  resolveBodyPatternCalendarDay,
  sampleBodyPatternMonthEntries,
} from "../../../../data/sampleInsights";

function BackToInsightsLink() {
  return (
    <Link
      href="/insights"
      style={{
        alignSelf: "flex-start",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 0",
        background: "transparent",
        fontFamily: insightsSans,
        fontSize: "0.8125rem",
        fontWeight: 500,
        color: insightsColors.textSecondary,
        textDecoration: "none",
        lineHeight: 1.3,
      }}
    >
      ← Back to Insights
    </Link>
  );
}

export default function InsightsDayPage() {
  const params = useParams();
  const dateParam = typeof params.date === "string" ? params.date : "";

  const day = useMemo(() => {
    if (!isValidDateKey(dateParam)) {
      return null;
    }
    return resolveBodyPatternCalendarDay(dateParam, sampleBodyPatternMonthEntries);
  }, [dateParam]);

  if (!day) {
    return (
      <AppShell mainStyle={{ gap: "10px", paddingBottom: "12px" }}>
        <BackToInsightsLink />
        <p
          style={{
            margin: 0,
            fontFamily: insightsSans,
            fontSize: "0.9rem",
            color: insightsColors.textSecondary,
          }}
        >
          That date could not be found.
        </p>
      </AppShell>
    );
  }

  return (
    <AppShell mainStyle={{ gap: "14px", paddingTop: "12px", paddingBottom: "12px" }}>
      <BackToInsightsLink />

      <BodyPatternDayDetail
        dateKey={day.dateKey}
        cycleDay={day.cycleDay}
        phase={day.phase}
        entry={day.entry}
      />
    </AppShell>
  );
}
