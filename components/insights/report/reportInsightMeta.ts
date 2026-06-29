import type { ReportInsightCard } from "../../../lib/reportAnalytics";
import type { PatternInsightCategory } from "../PatternInsightRow";

export function resolveInsightCategory(
  insight: ReportInsightCard,
): PatternInsightCategory | undefined {
  if (
    insight.id === "luteal-cravings" ||
    insight.id === "menstrual-fatigue" ||
    insight.id === "menstrual-mood"
  ) {
    return "Cycle pattern";
  }

  if (insight.id.startsWith("top-symptom-") || insight.id === "check-in-coverage") {
    return "Symptom trend";
  }

  if (insight.id === "nutrition-near-target") {
    return "Nutrition trend";
  }

  if (insight.id === "top-activity") {
    return "Activity trend";
  }

  return undefined;
}

export function buildSymptomCardCopy(
  label: string,
  count: number,
  percent: number,
  totalCheckInDays: number,
  rank: number,
): { headline: string; body: string; meta: string } {
  const lowerLabel = label.toLowerCase();

  const headline =
    rank === 0
      ? `${label} shows up most in your logs`
      : `${label} comes up often in your logs`;

  const body =
    rank === 0
      ? `This shows up most — you logged it on ${count} of your ${totalCheckInDays} check-in days (${percent}%).`
      : `You often log ${lowerLabel} — on ${percent}% of your check-in days.`;

  const meta = `Based on ${count} check-in${count === 1 ? "" : "s"}`;

  return { headline, body, meta };
}
