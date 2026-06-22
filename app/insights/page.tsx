"use client";

import { AppShell } from "../../components/ui/AppShell";
import { BodyPatternCalendar } from "../../components/insights/BodyPatternCalendar";
import { InsightsHeader } from "../../components/insights/InsightsHeader";
import { PatternInsightCards } from "../../components/insights/PatternInsightCards";
import { WeeklyEnergyChart } from "../../components/insights/WeeklyEnergyChart";
import { insightsMainStyle } from "../../components/insights/theme";
import { useInsightsData } from "../../components/providers/AppStateProvider";
import {
  sampleBodyPatternCalendarDefaults,
  sampleBodyPatternMonthEntries,
  sampleWeeklyNetCopy,
} from "../../data/sampleInsights";

export default function InsightsPage() {
  const {
    weeklyNetDays,
    weeklyTakeaway,
    patternInsightCards,
    tdee,
    loggedDaysCount,
  } = useInsightsData();

  const targetRange = {
    min: tdee - 100,
    max: tdee + 100,
  };

  return (
    <AppShell mainStyle={insightsMainStyle()}>
      <InsightsHeader loggedDaysCount={loggedDaysCount} />
      <WeeklyEnergyChart
        days={weeklyNetDays}
        tdeeTarget={tdee}
        targetRange={targetRange}
        takeaway={weeklyTakeaway}
        tapHint={sampleWeeklyNetCopy.tapHint}
        netNote={sampleWeeklyNetCopy.netNote}
        footerMessage={sampleWeeklyNetCopy.footerMessage}
      />
      <BodyPatternCalendar
        entriesByDate={sampleBodyPatternMonthEntries}
        initialYear={sampleBodyPatternCalendarDefaults.initialYear}
        initialMonth={sampleBodyPatternCalendarDefaults.initialMonth}
      />
      <PatternInsightCards cards={patternInsightCards} />
    </AppShell>
  );
}
