"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { AppShell } from "../../../../components/ui/AppShell";
import { BodyPatternDayDetail } from "../../../../components/insights/BodyPatternDayDetail";
import { isValidDateKey } from "../../../../components/insights/bodyPatternCalendarUtils";
import { insightsColors, insightsMainStyle, insightsSans } from "../../../../components/insights/theme";
import { getCalorieTargetForProfileDate } from "../../../../lib/calorieCycling";
import { routes } from "../../../../lib/routes";
import { useInsightsData } from "../../../../components/providers/AppStateProvider";
import {
  mergeAppLogsIntoCalendarEntries,
  mergeInsightsDayNotes,
  resolveBodyPatternCalendarDay,
  sampleBodyPatternMonthEntries,
} from "../../../../data/sampleInsights";

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

export default function InsightsDayPage() {
  const params = useParams();
  const dateParam = typeof params.date === "string" ? params.date : "";
  const { insightsDayNotes, effectiveCycleSettings, periodLogs, dailyCheckIns, profile, macroTargets, foodLogs, activityLogs, calorieTrackingEnabled, cycleTrackingEnabled } =
    useInsightsData();

  const day = useMemo(() => {
    if (!isValidDateKey(dateParam)) {
      return null;
    }

    const entriesByDate = mergeAppLogsIntoCalendarEntries(
      mergeInsightsDayNotes(
        sampleBodyPatternMonthEntries,
        insightsDayNotes,
        dailyCheckIns,
      ),
      foodLogs,
      activityLogs,
    );

    return resolveBodyPatternCalendarDay(
      dateParam,
      entriesByDate,
      insightsDayNotes,
      effectiveCycleSettings,
      periodLogs,
      dailyCheckIns,
    );
  }, [dateParam, insightsDayNotes, effectiveCycleSettings, periodLogs, dailyCheckIns, foodLogs, activityLogs]);

  if (!day) {
    return (
      <AppShell mainStyle={insightsMainStyle()}>
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
    <AppShell mainStyle={insightsMainStyle()}>
      <BackToInsightsLink />

      <BodyPatternDayDetail
        dateKey={day.dateKey}
        cycleDay={day.cycleDay}
        phase={day.phase}
        entry={day.entry}
        storedCheckIn={dailyCheckIns[day.dateKey] ?? null}
        calorieTarget={getCalorieTargetForProfileDate(profile, day.dateKey)}
        macroTargets={macroTargets}
        showCalorieSummary={calorieTrackingEnabled}
        showCycleContext={cycleTrackingEnabled}
      />
    </AppShell>
  );
}
