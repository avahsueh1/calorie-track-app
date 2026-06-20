"use client";

import { BottomNav } from "../../components/dashboard/BottomNav";
import { BodyPatternCalendar } from "../../components/insights/BodyPatternCalendar";
import { InsightsHeader } from "../../components/insights/InsightsHeader";
import { PatternInsightCards } from "../../components/insights/PatternInsightCards";
import { WeeklyEnergyChart } from "../../components/insights/WeeklyEnergyChart";
import { useInsightsData } from "../../components/providers/AppStateProvider";
import {
  insightsMainStyle,
  insightsPageOuterStyle,
  insightsShellStyle,
} from "../../components/insights/theme";
import {
  sampleBodyPatternCalendarCopy,
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
    <div style={insightsPageOuterStyle()}>
      <div style={insightsShellStyle()}>
        <main style={insightsMainStyle()}>
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
            initialSelectedDate={sampleBodyPatternCalendarDefaults.initialSelectedDate}
            subtitle={sampleBodyPatternCalendarCopy.subtitle}
            tapHint={sampleBodyPatternCalendarCopy.tapHint}
          />
          <PatternInsightCards cards={patternInsightCards} />
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
