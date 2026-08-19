"use client";

import { useMemo } from "react";
import type { DailyCheckIn } from "../../types";
import type { CycleSettings, PeriodLog, PatternInsightCardData } from "../../types/wellness";
import { buildSymptomInsightsData } from "../../lib/symptomInsights";
import { PatternInsightCards } from "./PatternInsightCards";
import { SymptomInsightsContent } from "./symptomInsights/SymptomInsightsContent";
import {
  insightsCardStyle,
  insightsColors,
  insightsSans,
  insightsSectionTitleStyle,
} from "./theme";

interface InsightsSidebarProps {
  dailyCheckIns: Record<string, DailyCheckIn>;
  cycleSettings: CycleSettings;
  periodLogs: PeriodLog[];
  patternInsightCards: PatternInsightCardData[];
  showSymptomInsights: boolean;
  embedded?: boolean;
  hidePatterns?: boolean;
}

export function InsightsSidebar({
  dailyCheckIns,
  cycleSettings,
  periodLogs,
  patternInsightCards,
  showSymptomInsights,
  embedded = false,
  hidePatterns = false,
}: InsightsSidebarProps) {
  const symptomData = useMemo(
    () =>
      buildSymptomInsightsData(dailyCheckIns, cycleSettings, periodLogs),
    [dailyCheckIns, cycleSettings, periodLogs],
  );

  const hasSymptoms = showSymptomInsights && symptomData.totalCheckInDays > 0;
  const hasPatterns = !hidePatterns && patternInsightCards.length > 0;

  if (!showSymptomInsights && !hasPatterns) {
    return null;
  }

  const body = (
    <div className="insights-sidebar-body">
      {showSymptomInsights ? (
        <SymptomInsightsContent
          data={symptomData}
          embedded
          compact={embedded}
          showPhaseBreakdown={false}
          showLoggingSummary={!embedded}
        />
      ) : null}

      {hasPatterns ? (
        <div className={showSymptomInsights ? "insights-sidebar-patterns" : undefined}>
          <PatternInsightCards cards={patternInsightCards} compact={embedded} />
        </div>
      ) : null}

      {!hasSymptoms && !hasPatterns ? (
        <p
          style={{
            margin: embedded ? "0" : "8px 0 0",
            fontSize: "0.78rem",
            lineHeight: 1.45,
            color: insightsColors.textSecondary,
            fontFamily: insightsSans,
            fontStyle: "italic",
          }}
        >
          Log check-ins to see symptom and cycle patterns here.
        </p>
      ) : null}
    </div>
  );

  if (embedded) {
    return (
      <div className="insights-sidebar-embedded">
        {hasSymptoms ? (
          <p
            style={{
              margin: "0 0 6px",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: insightsColors.textSecondary,
              fontFamily: insightsSans,
            }}
          >
            Top symptoms
          </p>
        ) : null}
        {body}
      </div>
    );
  }

  return (
    <aside
      className="insights-panel insights-sidebar"
      style={{
        ...insightsCardStyle(),
        padding: "16px 18px",
      }}
    >
      <h2 style={{ ...insightsSectionTitleStyle(), fontSize: "0.92rem" }}>
        {hasSymptoms ? "Symptom insights" : "Cycle patterns"}
      </h2>
      {body}
    </aside>
  );
}
