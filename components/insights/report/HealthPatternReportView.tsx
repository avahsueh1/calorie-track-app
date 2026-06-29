"use client";

import {
  Activity,
  Beef,
  Flame,
  Scale,
  Target,
} from "lucide-react";
import type { SymptomKey } from "../../../types";
import type { HealthPatternReport } from "../../../lib/reportAnalytics";
import {
  AppCard,
  DailyNote,
  StatTile,
  StatTileSectionLabel,
  calorieStatThemes,
} from "../../ui/primitives";
import { SymptomInsightsContent } from "../symptomInsights/SymptomInsightsContent";
import { ReportInsightCardView, WeeklyNetChart } from "./ReportVisuals";
import { ReportSectionHeader } from "../PatternInsightRow";
import { ReportExpandableSection } from "./ReportExpandableSection";
import { ReportTopSummary } from "./ReportTopSummary";
import {
  PATTERN_SUMMARY_LIMIT,
  buildActivitySectionPreview,
  buildCycleSectionPreview,
  buildNutritionSectionPreview,
  buildSymptomSectionPreview,
  getFeaturedSymptomKeys,
  isActivityFeaturedInSummary,
} from "./reportPreviewCopy";
import { insightsColors, insightsSans } from "../theme";

interface HealthPatternReportViewProps {
  report: HealthPatternReport;
}

function formatKcal(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

function PatternSummarySection({
  report,
}: {
  report: HealthPatternReport;
}) {
  const insights = report.localInsights.slice(0, PATTERN_SUMMARY_LIMIT);
  if (insights.length === 0) {
    return null;
  }

  return (
    <AppCard variant="soft" padding="20px">
      <ReportSectionHeader
        title="Pattern summary"
        helper="Your clearest patterns from recent logs."
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {insights.map((insight) => (
          <ReportInsightCardView key={insight.id} insight={insight} compact />
        ))}
      </div>
    </AppCard>
  );
}

function SymptomDetailsSection({
  report,
  excludeSymptomKeys,
}: {
  report: HealthPatternReport;
  excludeSymptomKeys: Set<SymptomKey>;
}) {
  return (
    <div style={{ paddingTop: "14px" }}>
      <SymptomInsightsContent
        data={report.symptomInsights}
        variant="symptoms"
        excludeSymptomKeys={[...excludeSymptomKeys]}
        embedded
      />
    </div>
  );
}

function CycleDetailsSection({ report }: { report: HealthPatternReport }) {
  return (
    <div style={{ paddingTop: "14px" }}>
      <SymptomInsightsContent
        data={report.symptomInsights}
        showPhaseBreakdown
        variant="cycle"
        embedded
      />
    </div>
  );
}

function NutritionDetailsSection({
  report,
}: {
  report: HealthPatternReport;
}) {
  const summary = report.nutritionSummary;
  if (!summary) {
    return null;
  }

  return (
    <div style={{ paddingTop: "14px" }}>
      <ReportSectionHeader
        title="Nutrition"
        helper="How your intake compares with your daily targets."
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <StatTile label="Avg eaten" value={formatKcal(summary.averageEaten)} subValue="kcal / day" icon={Beef} {...calorieStatThemes.eaten} size="compact" />
        <StatTile label="Avg burned" value={formatKcal(summary.averageBurned)} subValue="kcal / day" icon={Flame} {...calorieStatThemes.burned} size="compact" />
        <StatTile label="Avg net" value={formatKcal(summary.averageNet)} subValue="kcal / day" icon={Target} {...calorieStatThemes.target} size="compact" />
      </div>
      <StatTileSectionLabel style={{ margin: "18px 0 12px" }}>
        Weekly net trend
      </StatTileSectionLabel>
      <WeeklyNetChart weeks={summary.weeklyNetTrend} />
    </div>
  );
}

function ActivityDetailsSection({
  report,
  hideActivityHighlight,
}: {
  report: HealthPatternReport;
  hideActivityHighlight: boolean;
}) {
  const summary = report.activityWeightSummary;
  if (!summary) {
    return null;
  }

  return (
    <div style={{ paddingTop: "14px" }}>
      <ReportSectionHeader
        title="Activity & weight"
        helper="Movement patterns from your recent logs."
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px" }}>
        <StatTile label="Sessions" value={summary.totalActivitySessions} icon={Activity} backgroundColor="#EEF5EE" bubbleBackground="#F7FBF6" iconColor="#6F8E6D" size="compact" />
        <StatTile label="Weekly burn" value={formatKcal(summary.averageWeeklyActivityCalories)} subValue="kcal avg" icon={Flame} {...calorieStatThemes.burned} size="compact" />
      </div>
      {!hideActivityHighlight && summary.mostCommonActivity ? (
        <p
          style={{
            margin: "0 0 14px",
            fontFamily: insightsSans,
            fontSize: "0.8125rem",
            lineHeight: 1.45,
            color: insightsColors.textSecondary,
          }}
        >
          Most logged:{" "}
          <strong style={{ color: insightsColors.text }}>
            {summary.mostCommonActivity}
          </strong>
        </p>
      ) : null}
      {(summary.latestWeightLabel || summary.weightChangeLabel) && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {summary.latestWeightLabel ? (
            <StatTile label="Latest weight" value={summary.latestWeightLabel} icon={Scale} backgroundColor="#F3EAF8" bubbleBackground="#FAF7FD" iconColor={insightsColors.lavender} size="compact" />
          ) : null}
          {summary.weightChangeLabel ? (
            <StatTile label="Change" value={summary.weightChangeLabel.replace(" over the report range", "")} icon={Scale} backgroundColor="#F7EFE8" bubbleBackground="#FFFBF8" iconColor="#B97663" size="compact" />
          ) : null}
        </div>
      )}
    </div>
  );
}

export function HealthPatternReportView({ report }: HealthPatternReportViewProps) {
  const featuredSymptomKeys = getFeaturedSymptomKeys(report.localInsights);
  const hideActivityHighlight = isActivityFeaturedInSummary(report.localInsights);
  const showSymptomDetails = report.symptomInsights.totalCheckInDays > 0;
  const showCycleDetails =
    report.cyclePhaseSummary !== null && report.symptomInsights.hasEnoughData;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <ReportTopSummary
        title={report.header.title}
        dateRangeLabel={report.header.dateRangeLabel}
        loggedDays={report.header.loggedDaysUsed}
        highlights={report.localInsights}
      />

      <PatternSummarySection report={report} />

      {showSymptomDetails ? (
        <ReportExpandableSection
          title="Symptom details"
          preview={buildSymptomSectionPreview(report)}
        >
          <SymptomDetailsSection
            report={report}
            excludeSymptomKeys={featuredSymptomKeys}
          />
        </ReportExpandableSection>
      ) : null}

      {showCycleDetails ? (
        <ReportExpandableSection
          title="Cycle phase details"
          preview={buildCycleSectionPreview(report)}
        >
          <CycleDetailsSection report={report} />
        </ReportExpandableSection>
      ) : null}

      {report.nutritionSummary ? (
        <ReportExpandableSection
          title="Nutrition details"
          preview={buildNutritionSectionPreview(report)}
        >
          <NutritionDetailsSection report={report} />
        </ReportExpandableSection>
      ) : null}

      {report.activityWeightSummary ? (
        <ReportExpandableSection
          title="Activity & weight details"
          preview={buildActivitySectionPreview(report)}
        >
          <ActivityDetailsSection
            report={report}
            hideActivityHighlight={hideActivityHighlight}
          />
        </ReportExpandableSection>
      ) : null}

      {!report.hasEnoughData ? (
        <DailyNote variant="empty">
          Log a few more days to generate stronger patterns.
        </DailyNote>
      ) : null}

      <p
        style={{
          margin: 0,
          fontFamily: insightsSans,
          fontSize: "0.75rem",
          lineHeight: 1.45,
          color: insightsColors.textSecondary,
        }}
      >
        This report is generated locally from your saved logs. It is for personal
        context only and is not medical advice.
      </p>
    </div>
  );
}
