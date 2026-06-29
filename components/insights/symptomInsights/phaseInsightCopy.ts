import type { SymptomKey } from "../../../types";
import type { PhaseSymptomSummary } from "../../../lib/symptomInsights";
import { getSymptomIconStyle } from "../../../lib/symptomIcons";
import { Smile } from "lucide-react";
import type { PatternInsightCategory } from "../PatternInsightRow";
import type { PatternInsightIconStyle } from "../PatternInsightRow";
import { buildSymptomCardCopy } from "../report/reportInsightMeta";

export interface SymptomMetricItem {
  id: string;
  label: string;
  headline: string;
  body: string;
  meta: string;
  category: PatternInsightCategory;
  percent: number;
  count: number;
  iconStyle: PatternInsightIconStyle;
  barColor: string;
}

const MOOD_SYMPTOM_KEYS = new Set<SymptomKey>([
  "sadness",
  "anxiety",
  "stress",
  "irritability",
  "moodSwings",
  "depression",
]);

const MOOD_ICON_STYLE: PatternInsightIconStyle = {
  icon: Smile,
  backgroundColor: "#F4DCD5",
  color: "#B86B52",
};

function phasePercent(count: number, checkInDays: number): number {
  if (checkInDays <= 0) {
    return 0;
  }
  return Math.round((count / checkInDays) * 100);
}

function formatCheckInMeta(count: number): string {
  return `Based on ${count} check-in${count === 1 ? "" : "s"}`;
}

function energyHeadline(label: string, phaseTitle: string): string {
  const lower = label.toLowerCase();
  if (lower === "low") {
    return `Energy is often lower ${phaseTitle}`;
  }
  if (lower === "high" || lower === "good") {
    return `Energy is often higher ${phaseTitle}`;
  }
  return `Energy is usually steady ${phaseTitle}`;
}

function energyBody(label: string): string {
  const lower = label.toLowerCase();
  if (lower === "low") {
    return "Your logs suggest you often feel lower energy here.";
  }
  if (lower === "high" || lower === "good") {
    return "Your logs suggest you often feel more energy here.";
  }
  return "Your logs suggest your energy stays fairly steady here.";
}

function moodHeadline(label: string, phaseTitle: string): string {
  const lower = label.toLowerCase();
  if (lower === "low") {
    return `Mood is often lower ${phaseTitle}`;
  }
  if (lower === "high" || lower === "good") {
    return `Mood is often brighter ${phaseTitle}`;
  }
  return `Mood is usually steady ${phaseTitle}`;
}

function moodBody(label: string): string {
  const lower = label.toLowerCase();
  if (lower === "low") {
    return "Your logs suggest mood-related check-ins lean lower here.";
  }
  if (lower === "high" || lower === "good") {
    return "Your logs suggest mood-related check-ins lean positive here.";
  }
  return "Your logs suggest your mood stays fairly steady here.";
}

function phaseTitlePhrase(friendlyTitle: string): string {
  if (friendlyTitle === "During your period") {
    return "during your period";
  }
  if (friendlyTitle === "Before your period") {
    return "before your period";
  }
  if (friendlyTitle === "Around ovulation") {
    return "around ovulation";
  }
  if (friendlyTitle === "After your period") {
    return "after your period";
  }
  return "during this phase";
}

function symptomHeadlineForPhase(
  label: string,
  rank: number,
  phasePhrase: string,
): string {
  if (rank === 0) {
    return `${label} shows up most ${phasePhrase}`;
  }
  return `${label} comes up often ${phasePhrase}`;
}

function symptomBodyForPhase(
  label: string,
  percent: number,
  rank: number,
): string {
  const lowerLabel = label.toLowerCase();
  if (rank === 0) {
    return `This shows up most — on ${percent}% of your check-ins here.`;
  }
  return `You often log ${lowerLabel} — on ${percent}% of check-ins here.`;
}

export function buildPhaseMetricItems(
  phase: PhaseSymptomSummary,
  limit = 5,
): SymptomMetricItem[] {
  const items: SymptomMetricItem[] = [];
  const coveredKeys = new Set<string>();
  const phasePhrase = phaseTitlePhrase(phase.friendlyTitle);

  const hasMoodSymptom = phase.symptoms.some((symptom) =>
    MOOD_SYMPTOM_KEYS.has(symptom.key),
  );

  if (
    phase.energyLogCount >= 2 &&
    phase.averageEnergyLabel &&
    phase.averageEnergyLabel !== "Not logged"
  ) {
    const iconStyle = getSymptomIconStyle("energy");
    const percent = phasePercent(phase.energyLogCount, phase.checkInDays);
    items.push({
      id: "energy",
      label: "Energy",
      headline: energyHeadline(phase.averageEnergyLabel, phasePhrase),
      body: energyBody(phase.averageEnergyLabel),
      meta: formatCheckInMeta(phase.energyLogCount),
      category: "Cycle pattern",
      percent,
      count: phase.energyLogCount,
      iconStyle,
      barColor: iconStyle.color,
    });
    coveredKeys.add("energy");
  }

  if (
    phase.moodLogCount >= 2 &&
    phase.averageMoodLabel &&
    phase.averageMoodLabel !== "Not logged" &&
    !hasMoodSymptom
  ) {
    const percent = phasePercent(phase.moodLogCount, phase.checkInDays);
    items.push({
      id: "mood",
      label: "Mood",
      headline: moodHeadline(phase.averageMoodLabel, phasePhrase),
      body: moodBody(phase.averageMoodLabel),
      meta: formatCheckInMeta(phase.moodLogCount),
      category: "Cycle pattern",
      percent,
      count: phase.moodLogCount,
      iconStyle: MOOD_ICON_STYLE,
      barColor: MOOD_ICON_STYLE.color,
    });
  }

  let symptomRank = 0;
  for (const symptom of phase.symptoms) {
    if (items.length >= limit) {
      break;
    }
    if (coveredKeys.has(symptom.key)) {
      continue;
    }

    const iconStyle = getSymptomIconStyle(symptom.key);
    const percent = phasePercent(symptom.count, phase.checkInDays);
    const rank = symptomRank;
    symptomRank += 1;

    items.push({
      id: symptom.key,
      label: symptom.label,
      headline: symptomHeadlineForPhase(symptom.label, rank, phasePhrase),
      body: symptomBodyForPhase(symptom.label, percent, rank),
      meta: formatCheckInMeta(symptom.count),
      category: "Symptom trend",
      percent,
      count: symptom.count,
      iconStyle,
      barColor: iconStyle.color,
    });
  }

  return items.slice(0, limit);
}

export function buildSymptomMetricItems(
  symptoms: { key: SymptomKey; label: string; count: number; percent: number }[],
  totalCheckInDays: number,
  limit = 5,
): SymptomMetricItem[] {
  return symptoms.slice(0, limit).map((symptom, index) => {
    const iconStyle = getSymptomIconStyle(symptom.key);
    const copy = buildSymptomCardCopy(
      symptom.label,
      symptom.count,
      symptom.percent,
      totalCheckInDays,
      index,
    );

    return {
      id: symptom.key,
      label: symptom.label,
      headline: copy.headline,
      body: copy.body,
      meta: copy.meta,
      category: "Symptom trend",
      percent: symptom.percent,
      count: symptom.count,
      iconStyle,
      barColor: iconStyle.color,
    };
  });
}
