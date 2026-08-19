"use client";

import { useMemo } from "react";
import type { DailyCheckIn } from "../../types";
import type { CycleSettings, PeriodLog } from "../../types/wellness";
import { buildSymptomInsightsData } from "../../lib/symptomInsights";
import {
  insightsCardStyle,
  insightsColors,
  insightsSans,
  insightsSerif,
  insightsSubtitleStyle,
} from "./theme";
import { SymptomInsightsContent } from "./symptomInsights/SymptomInsightsContent";

interface SymptomInsightsSectionProps {
  dailyCheckIns: Record<string, DailyCheckIn>;
  cycleSettings: CycleSettings;
  periodLogs: PeriodLog[];
  compact?: boolean;
}

export function SymptomInsightsSection({
  dailyCheckIns,
  cycleSettings,
  periodLogs,
  compact = false,
}: SymptomInsightsSectionProps) {
  const data = useMemo(
    () =>
      buildSymptomInsightsData(
        dailyCheckIns,
        cycleSettings,
        periodLogs,
      ),
    [dailyCheckIns, cycleSettings, periodLogs],
  );

  return (
    <section
      className="insights-panel"
      style={{
        ...insightsCardStyle(),
        ...(compact
          ? { padding: "16px 18px", overflow: "auto" as const }
          : {}),
      }}
    >
      <header style={{ marginBottom: compact ? "12px" : "18px" }}>
        <h2
          style={{
            margin: "0 0 6px",
            fontFamily: compact ? insightsSans : insightsSerif,
            fontSize: compact ? "0.92rem" : "1.2rem",
            fontWeight: compact ? 600 : 400,
            color: insightsColors.text,
            letterSpacing: compact ? undefined : "-0.02em",
          }}
        >
          Symptom Insights
        </h2>
        <p style={{ ...insightsSubtitleStyle(), margin: 0 }}>
          {compact
            ? "Patterns from your check-ins."
            : "Patterns from your check-ins — helpful context, not a medical diagnosis."}
        </p>
      </header>
      <SymptomInsightsContent
        data={data}
        embedded
        showPhaseBreakdown={!compact}
      />
    </section>
  );
}
