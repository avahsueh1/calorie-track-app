"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AppShell } from "../../components/ui/AppShell";
import { BodyPatternCalendar } from "../../components/insights/BodyPatternCalendar";
import { CALENDAR_COLORS } from "../../components/insights/bodyPatternCalendarUtils";
import { InsightsHeader } from "../../components/insights/InsightsHeader";
import { InsightsPatternCard } from "../../components/insights/InsightsPatternCard";
import { InsightsSidebar } from "../../components/insights/InsightsSidebar";
import { ProgressJournalSection } from "../../components/progress/ProgressJournalSection";
import { WeeklyEnergyChart } from "../../components/insights/WeeklyEnergyChart";
import {
  insightsCardStyle,
  insightsColors,
  insightsSectionTitleStyle,
  insightsLayout,
  insightsMainStyle,
  insightsSans,
} from "../../components/insights/theme";
import { getCalorieTargetStatus } from "../../lib/calorieTargetStatus";
import { formatWeightDisplay } from "../../lib/profileBody";
import { routes } from "../../lib/routes";
import {
  useCycleContext,
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
  const { cycleContext } = useCycleContext();
  const insightsModules = useMemo(
    () => getInsightsModules(trackingPreferences),
    [trackingPreferences],
  );

  const {
    weeklyNetDays,
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
    patternInsightCards,
    calorieTrackingEnabled,
    cycleTrackingEnabled,
  } = useInsightsData();

  const showCalendar = insightsModules.showCalendar;
  const calendarVariant = cycleTrackingEnabled ? "cycle" : "nutrition";
  const showCalories = insightsModules.showWeeklyEnergyChart;
  const showJournal = insightsModules.showProgressJournal;
  const showPatternCard =
    insightsModules.showCycleHeader && patternInsightCards.length > 0;

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

  const avgNet = Math.round(
    weeklyNetDays.reduce((sum, day) => sum + day.net, 0) / weeklyNetDays.length,
  );
  const avgTarget = Math.round(
    weeklyNetDays.reduce((sum, day) => sum + day.target, 0) / weeklyNetDays.length,
  );
  const nearTargetPct = Math.round(
    (weeklyNetDays.filter(
      (day) =>
        getCalorieTargetStatus({
          eaten: day.eaten,
          burned: day.burned,
          target: day.target,
          netCalories: day.net,
        }) === "near",
    ).length /
      weeklyNetDays.length) *
      100,
  );
  const latestWeight =
    progressJournal[0]?.weightKg && progressJournal[0].weightKg > 0
      ? formatWeightDisplay(progressJournal[0].weightKg, profile.units)
      : "—";

  return (
    <AppShell mainStyle={insightsMainStyle({ gap: "14px", padding: "20px 24px" })}>
      <div className="insights-home">
        <InsightsHeader
          loggedDaysCount={loggedDaysCount}
          showCycleContext={insightsModules.showCycleHeader}
        />

        <section style={{ ...insightsCardStyle(), padding: "14px 16px" }}>
          <div className="insights-frameb-statstrip">
            <div className="insights-frameb-stat">
              <p className="insights-frameb-label">Avg intake</p>
              <p className="insights-frameb-value">{avgNet.toLocaleString()} kcal</p>
            </div>
            <div className="insights-frameb-stat">
              <p className="insights-frameb-label">Avg target</p>
              <p className="insights-frameb-value">{avgTarget.toLocaleString()} kcal</p>
            </div>
            <div className="insights-frameb-stat">
              <p className="insights-frameb-label">Near target</p>
              <p className="insights-frameb-value">{nearTargetPct}%</p>
            </div>
            <div className="insights-frameb-stat">
              <p className="insights-frameb-label">Weight</p>
              <p className="insights-frameb-value">{latestWeight}</p>
            </div>
            <div className="insights-frameb-stat">
              <p className="insights-frameb-label">Days tracked</p>
              <p className="insights-frameb-value">{loggedDaysCount}</p>
            </div>
          </div>
        </section>

        <div className="insights-frameb-body">
          <div className="insights-frameb-left">
            {showCalories ? (
              <WeeklyEnergyChart
                days={weeklyNetDays}
                tdeeTarget={dailyCalorieTarget}
                targetRange={targetRange}
                tapHint={sampleWeeklyNetCopy.tapHint}
                netNote={sampleWeeklyNetCopy.netNote}
              />
            ) : null}

            {showJournal ? (
              <ProgressJournalSection
                entries={progressJournal}
                units={profile.units}
                variant="bento"
              />
            ) : null}

            {insightsModules.showSymptomInsights ? (
              <section style={{ ...insightsCardStyle(), padding: "14px 16px" }}>
                <p style={{ ...insightsSectionTitleStyle(), marginBottom: "10px" }}>
                  Most logged this cycle
                </p>
                <InsightsSidebar
                  dailyCheckIns={dailyCheckIns}
                  cycleSettings={effectiveCycleSettings}
                  periodLogs={periodLogs}
                  patternInsightCards={patternInsightCards}
                  showSymptomInsights
                  hidePatterns
                  embedded
                />
              </section>
            ) : null}
          </div>

          <div className="insights-frameb-right">
            {showPatternCard ? (
              <InsightsPatternCard card={patternInsightCards[0]} />
            ) : (
              <section style={{ ...insightsCardStyle(), padding: "14px 16px" }}>
                <p className="insights-frameb-label">Right now</p>
                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: "1.2rem",
                    color: insightsColors.text,
                  }}
                >
                  {cycleContext.cycleDayLabel || "Cycle tracking off"}
                </p>
                <p style={{ margin: "4px 0 0", color: insightsColors.terracotta }}>
                  {cycleContext.phaseLabel}
                </p>
              </section>
            )}

            {showCalendar ? (
              <section style={{ ...insightsCardStyle(), padding: "14px 16px" }}>
                <p style={{ ...insightsSectionTitleStyle(), marginBottom: "10px" }}>
                  Cycle & check-in patterns
                </p>
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
                  density="compact"
                  embedded
                  showHeader={false}
                  maxWidth="none"
                />
              </section>
            ) : (
              <InsightsCalendarEmptyState />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
