"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AppShell } from "../../../components/ui/AppShell";
import { HealthPatternReportView } from "../../../components/insights/report/HealthPatternReportView";
import {
  insightsColors,
  insightsMainStyle,
  insightsSans,
} from "../../../components/insights/theme";
import {
  useInsightsData,
  useTrackingPreferences,
} from "../../../components/providers/AppStateProvider";
import { buildHealthPatternReport } from "../../../lib/reportAnalytics";
import { routes } from "../../../lib/routes";

function BackToInsightsLink() {
  return (
    <Link
      href={routes.insights}
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

export default function HealthPatternReportPage() {
  const { trackingPreferences } = useTrackingPreferences();
  const {
    dailyCheckIns,
    foodLogs,
    activityLogs,
    progressJournalByDate,
    effectiveCycleSettings,
    periodLogs,
    profile,
  } = useInsightsData();

  const report = useMemo(
    () =>
      buildHealthPatternReport({
        calorieTrackingEnabled: trackingPreferences.calorieTrackingEnabled,
        cycleTrackingEnabled: trackingPreferences.cycleTrackingEnabled,
        dailyCheckIns,
        foodLogs,
        activityLogs,
        progressJournal: progressJournalByDate,
        cycleSettings: effectiveCycleSettings,
        periodLogs,
        profile,
      }),
    [
      trackingPreferences,
      dailyCheckIns,
      foodLogs,
      activityLogs,
      progressJournalByDate,
      effectiveCycleSettings,
      periodLogs,
      profile,
    ],
  );

  return (
    <AppShell mainStyle={insightsMainStyle()}>
      <BackToInsightsLink />
      <div style={{ marginTop: "18px" }}>
        <HealthPatternReportView report={report} />
      </div>
    </AppShell>
  );
}
