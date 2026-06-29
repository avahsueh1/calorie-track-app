import type { SymptomKey } from "../../../types";
import type {
  HealthPatternReport,
  ReportInsightCard,
} from "../../../lib/reportAnalytics";
import { formatNaturalList } from "./reportFormatHelpers";

export const PATTERN_SUMMARY_LIMIT = 3;

export function getFeaturedSymptomKeys(
  insights: ReportInsightCard[],
): Set<SymptomKey> {
  const keys = new Set<SymptomKey>();
  for (const insight of insights.slice(0, PATTERN_SUMMARY_LIMIT)) {
    if (insight.id.startsWith("top-symptom-")) {
      keys.add(insight.id.slice("top-symptom-".length) as SymptomKey);
    }
  }
  return keys;
}

export function isActivityFeaturedInSummary(
  insights: ReportInsightCard[],
): boolean {
  return insights
    .slice(0, PATTERN_SUMMARY_LIMIT)
    .some((insight) => insight.id === "top-activity");
}

export function buildSymptomSectionPreview(
  report: HealthPatternReport,
): string {
  const { topSymptoms, totalCheckInDays } = report.symptomInsights;
  if (totalCheckInDays === 0 || topSymptoms.length === 0) {
    return "No check-ins logged yet.";
  }

  const labels = topSymptoms.slice(0, 3).map((symptom) => symptom.label);
  return `${formatNaturalList(labels)} · ${totalCheckInDays} check-in${totalCheckInDays === 1 ? "" : "s"}`;
}

export function buildCycleSectionPreview(report: HealthPatternReport): string {
  if (!report.cyclePhaseSummary) {
    return "Cycle tracking is off.";
  }

  const withData = report.cyclePhaseSummary.filter(
    (phase) => phase.checkInDays > 0,
  );
  if (withData.length === 0) {
    return "No phase check-ins yet.";
  }

  const active = withData[0];
  const symptomLabels =
    report.symptomInsights.phaseBreakdown
      .find((phase) => phase.phaseKind === active.phaseKind)
      ?.symptoms.slice(0, 2)
      .map((symptom) => symptom.label.toLowerCase()) ?? [];

  if (symptomLabels.length > 0) {
    return `${active.friendlyTitle}: ${formatNaturalList(symptomLabels)}`;
  }

  return `${active.friendlyTitle} · ${active.checkInDays} check-in${active.checkInDays === 1 ? "" : "s"}`;
}

export function buildNutritionSectionPreview(
  report: HealthPatternReport,
): string {
  const summary = report.nutritionSummary;
  if (!summary) {
    return "No nutrition logs.";
  }

  return `${Math.round(summary.averageEaten).toLocaleString("en-US")} eaten · ${Math.round(summary.averageNet).toLocaleString("en-US")} net kcal/day`;
}

export function buildActivitySectionPreview(
  report: HealthPatternReport,
): string {
  const summary = report.activityWeightSummary;
  if (!summary) {
    return "No activity logs.";
  }

  const parts: string[] = [];
  if (summary.totalActivitySessions > 0) {
    parts.push(
      `${summary.totalActivitySessions} session${summary.totalActivitySessions === 1 ? "" : "s"}`,
    );
  }
  if (summary.mostCommonActivity) {
    parts.push(summary.mostCommonActivity);
  }
  if (summary.latestWeightLabel) {
    parts.push(summary.latestWeightLabel);
  }

  return parts.length > 0 ? parts.join(" · ") : "No activity logged yet.";
}
