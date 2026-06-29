"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AppShell } from "../../components/ui/AppShell";
import { BodyPatternCalendar } from "../../components/insights/BodyPatternCalendar";
import { CALENDAR_COLORS } from "../../components/insights/bodyPatternCalendarUtils";
import { InsightsHeader } from "../../components/insights/InsightsHeader";
import { ProgressJournalSection } from "../../components/progress/ProgressJournalSection";
import { WeeklyEnergyChart } from "../../components/insights/WeeklyEnergyChart";
import {
  insightsLayout,
  insightsMainStyle,
  insightsSans,
} from "../../components/insights/theme";
import { routes } from "../../lib/routes";
import {
  useInsightsData,
  useTrackingPreferences,
} from "../../components/providers/AppStateProvider";
import { layout } from "../../lib/theme";
import { getInsightsModules } from "../../lib/trackingPreferences";
import {
  mergeAppLogsIntoCalendarEntries,
  mergeInsightsDayNotes,
  sampleBodyPatternMonthEntries,
  sampleWeeklyNetCopy,
} from "../../data/sampleInsights";

function InsightsCalendarEmptyState() {
  return (
    <section
      style={{
        width: "100%",
        maxWidth: insightsLayout.shellMaxWidth,
        margin: "0 auto",
        padding: layout.cardPadding,
        borderRadius: layout.cardRadius,
        backgroundColor: CALENDAR_COLORS.card,
        border: `1px solid ${CALENDAR_COLORS.border}`,
        boxShadow: "0 2px 20px rgba(60, 43, 36, 0.05)",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.9rem",
          lineHeight: 1.5,
          color: CALENDAR_COLORS.secondary,
          fontFamily: insightsSans,
        }}
      >
        Choose what to track to see patterns here.{" "}
        <Link
          href={routes.profile}
          style={{
            color: CALENDAR_COLORS.terracotta,
            textDecoration: "underline",
            textUnderlineOffset: "2px",
          }}
        >
          Update tracking preferences
        </Link>
      </p>
    </section>
  );
}

export default function InsightsPage() {
  const { trackingPreferences } = useTrackingPreferences();
  const insightsModules = useMemo(
    () => getInsightsModules(trackingPreferences),
    [trackingPreferences],
  );

  const {
    weeklyNetDays,
    weeklyTakeaway,
    dailyCalorieTarget,
    dailyTargetRange,
    macroTargets,
    loggedDaysCount,
    insightsDayNotes,
    dailyCheckIns,
    effectiveCycleSettings,
    periodLogs,
    profile,
    foodLogs,
    activityLogs,
    progressJournal,
    calorieTrackingEnabled,
    cycleTrackingEnabled,
  } = useInsightsData();

  const showCalendar = insightsModules.showCalendar;
  const calendarVariant = cycleTrackingEnabled ? "cycle" : "nutrition";

  const entriesByDate = useMemo(() => {
    const mergedNotes = mergeInsightsDayNotes(
      sampleBodyPatternMonthEntries,
      insightsDayNotes,
      dailyCheckIns,
    );

    return mergeAppLogsIntoCalendarEntries(
      mergedNotes,
      foodLogs,
      activityLogs,
    );
  }, [insightsDayNotes, dailyCheckIns, foodLogs, activityLogs]);

  const calendarRevisionKey = useMemo(
    () =>
      [
        effectiveCycleSettings.lastPeriodStart,
        effectiveCycleSettings.averageCycleLength,
        effectiveCycleSettings.averagePeriodLength,
        calorieTrackingEnabled,
        cycleTrackingEnabled,
        ...Object.keys(foodLogs),
        ...Object.keys(activityLogs),
        ...periodLogs.map(
          (log) => `${log.id}:${log.startDate}:${log.endDate ?? ""}`,
        ),
      ].join("|"),
    [
      effectiveCycleSettings,
      periodLogs,
      foodLogs,
      activityLogs,
      calorieTrackingEnabled,
      cycleTrackingEnabled,
    ],
  );

  const calendarDefaults = useMemo(() => {
    const today = new Date();
    return {
      initialYear: today.getFullYear(),
      initialMonth: today.getMonth(),
    };
  }, []);

  const targetRange = {
    min: dailyTargetRange.min,
    max: dailyTargetRange.max,
  };

  return (
    <AppShell mainStyle={insightsMainStyle()}>
      <InsightsHeader
        loggedDaysCount={loggedDaysCount}
        showCycleContext={insightsModules.showCycleHeader}
      />

      {insightsModules.showWeeklyEnergyChart ? (
        <WeeklyEnergyChart
          days={weeklyNetDays}
          tdeeTarget={dailyCalorieTarget}
          targetRange={targetRange}
          takeaway={weeklyTakeaway}
          tapHint={sampleWeeklyNetCopy.tapHint}
          netNote={sampleWeeklyNetCopy.netNote}
          footerMessage={sampleWeeklyNetCopy.footerMessage}
        />
      ) : null}

      {showCalendar ? (
        <BodyPatternCalendar
          key={calendarRevisionKey}
          mode="insights"
          calendarVariant={calendarVariant}
          entriesByDate={entriesByDate}
          dailyCheckIns={dailyCheckIns}
          profile={profile}
          macroTargets={macroTargets}
          cycleSettings={effectiveCycleSettings}
          periodLogs={periodLogs}
          initialYear={calendarDefaults.initialYear}
          initialMonth={calendarDefaults.initialMonth}
        />
      ) : (
        <InsightsCalendarEmptyState />
      )}

      {insightsModules.showProgressJournal ? (
        <ProgressJournalSection entries={progressJournal} units={profile.units} />
      ) : null}
    </AppShell>
  );
}
