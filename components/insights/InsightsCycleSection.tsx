"use client";

import type { DailyCheckIn } from "../../types";
import type { AppProfile, MacroTargets } from "../../types/profile";
import type {
  BodyPatternCalendarDay,
  CycleSettings,
  PatternInsightCardData,
  PeriodLog,
} from "../../types/wellness";
import { BodyPatternCalendar } from "./BodyPatternCalendar";
import type { InsightsCalendarVariant } from "./BodyPatternCalendar";
import { InsightsSidebar } from "./InsightsSidebar";
import {
  insightsCardStyle,
  insightsColors,
  insightsSans,
  insightsSectionTitleStyle,
} from "./theme";

interface InsightsCycleSectionProps {
  calendarVariant: InsightsCalendarVariant;
  entriesByDate: Record<string, BodyPatternCalendarDay>;
  dailyCheckIns: Record<string, DailyCheckIn>;
  profile: AppProfile;
  macroTargets: MacroTargets;
  cycleSettings: CycleSettings;
  periodLogs: PeriodLog[];
  initialYear: number;
  initialMonth: number;
  calendarRevisionKey: string;
  patternInsightCards: PatternInsightCardData[];
  showSymptomInsights: boolean;
  hidePatterns?: boolean;
}

export function InsightsCycleSection({
  calendarVariant,
  entriesByDate,
  dailyCheckIns,
  profile,
  macroTargets,
  cycleSettings,
  periodLogs,
  initialYear,
  initialMonth,
  calendarRevisionKey,
  patternInsightCards,
  showSymptomInsights,
  hidePatterns = false,
}: InsightsCycleSectionProps) {
  const showSidebar =
    showSymptomInsights || (!hidePatterns && patternInsightCards.length > 0);
  const title =
    calendarVariant === "cycle"
      ? "Cycle & check-in patterns"
      : "Nutrition & check-in patterns";

  return (
    <section
      className="insights-cycle-section insights-bento-cycle"
      style={{
        ...insightsCardStyle(),
        padding: "14px 16px",
      }}
    >
      <header className="insights-cycle-header">
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ ...insightsSectionTitleStyle(), fontSize: "0.92rem", margin: 0 }}>
            {title}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "0.72rem",
              lineHeight: 1.4,
              color: insightsColors.textSecondary,
              fontFamily: insightsSans,
            }}
          >
            Tap a date for details
          </p>
        </div>
      </header>

      <div
        className={
          showSidebar ? "insights-cycle-grid" : "insights-cycle-grid-single"
        }
      >
        <BodyPatternCalendar
          key={calendarRevisionKey}
          mode="insights"
          calendarVariant={calendarVariant}
          entriesByDate={entriesByDate}
          dailyCheckIns={dailyCheckIns}
          profile={profile}
          macroTargets={macroTargets}
          cycleSettings={cycleSettings}
          periodLogs={periodLogs}
          initialYear={initialYear}
          initialMonth={initialMonth}
          density="compact"
          embedded
          showHeader={false}
          maxWidth="none"
        />

        {showSidebar ? (
          <InsightsSidebar
            dailyCheckIns={dailyCheckIns}
            cycleSettings={cycleSettings}
            periodLogs={periodLogs}
            patternInsightCards={patternInsightCards}
            showSymptomInsights={showSymptomInsights}
            hidePatterns={hidePatterns}
            embedded
          />
        ) : null}
      </div>
    </section>
  );
}
