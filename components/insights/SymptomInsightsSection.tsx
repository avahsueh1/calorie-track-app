"use client";

import { useMemo } from "react";
import type { DailyCheckIn } from "../../types";
import type { CycleSettings, PeriodLog } from "../../types/wellness";
import { buildSymptomInsightsData } from "../../lib/symptomInsights";
import {
  insightsCardStyle,
  insightsColors,
  insightsSerif,
  insightsSubtitleStyle,
} from "./theme";
import { SymptomInsightsContent } from "./symptomInsights/SymptomInsightsContent";

interface SymptomInsightsSectionProps {
  dailyCheckIns: Record<string, DailyCheckIn>;
  cycleSettings: CycleSettings;
  periodLogs: PeriodLog[];
}

export function SymptomInsightsSection({
  dailyCheckIns,
  cycleSettings,
  periodLogs,
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
    <section style={insightsCardStyle()}>
      <header style={{ marginBottom: "18px" }}>
        <h2
          style={{
            margin: "0 0 6px",
            fontFamily: insightsSerif,
            fontSize: "1.2rem",
            fontWeight: 400,
            color: insightsColors.text,
            letterSpacing: "-0.02em",
          }}
        >
          Symptom Insights
        </h2>
        <p style={{ ...insightsSubtitleStyle(), margin: 0 }}>
          Patterns from your check-ins — helpful context, not a medical
          diagnosis.
        </p>
      </header>
      <SymptomInsightsContent data={data} embedded />
    </section>
  );
}
