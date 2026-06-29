import type { DailyCheckIn, SymptomKey } from "../types";
import type { CycleSettings, PeriodLog } from "../types/wellness";
import {
  countSelectedSymptoms,
  getSymptomLabel,
  hasCheckInContent,
} from "./checkInHelpers";
import {
  resolveCycleContextForDate,
  scoreToWellnessLabel,
  todayDateKey,
} from "./appStateHelpers";
import { selectionToMetricScore } from "./symptomOptions";

export const SYMPTOM_INSIGHTS_MIN_CHECK_IN_DAYS = 3;

export type SymptomPhaseKind =
  | "menstrual"
  | "follicular"
  | "ovulatory"
  | "luteal";

export const SYMPTOM_PHASE_KINDS: SymptomPhaseKind[] = [
  "menstrual",
  "follicular",
  "ovulatory",
  "luteal",
];

export function isSymptomPhaseKind(value: string): value is SymptomPhaseKind {
  return SYMPTOM_PHASE_KINDS.includes(value as SymptomPhaseKind);
}

export interface SymptomFrequencyRow {
  key: SymptomKey;
  label: string;
  count: number;
  percent: number;
}

export interface SymptomTrendPoint {
  dateKey: string;
  label: string;
  symptomCount: number;
}

export interface SymptomLoggingDay {
  dateKey: string;
  label: string;
  logged: boolean;
}

export interface SymptomLoggingSummary {
  daysLoggedLast30: number;
  summarySentence: string;
  detailSentence: string | null;
  recentDays: SymptomLoggingDay[];
}

export interface PhaseSymptomSummary {
  phase: string;
  phaseKind: SymptomPhaseKind;
  friendlyTitle: string;
  symptoms: { key: SymptomKey; label: string; count: number }[];
  checkInDays: number;
  summarySentence: string | null;
  patternSentence: string | null;
  symptomPills: string[];
  averageEnergyScore: number | null;
  averageEnergyLabel: string | null;
  averageMoodScore: number | null;
  averageMoodLabel: string | null;
  energyLogCount: number;
  moodLogCount: number;
}

export interface SymptomInsightsData {
  totalCheckInDays: number;
  hasEnoughData: boolean;
  topSymptoms: SymptomFrequencyRow[];
  loggingSummary: SymptomLoggingSummary;
  phaseBreakdown: PhaseSymptomSummary[];
  symptomCountByDate: Record<string, number>;
}

const PHASE_ORDER = [
  "Menstrual",
  "Follicular",
  "Ovulatory",
  "Luteal",
] as const;

export const PHASE_FRIENDLY_TITLES: Record<SymptomPhaseKind, string> = {
  menstrual: "During your period",
  follicular: "After your period",
  ovulatory: "Around ovulation",
  luteal: "Before your period",
};

const MIN_PATTERN_SCORES = 2;

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function shiftDateKey(dateKey: string, deltaDays: number): string {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + deltaDays);
  return toDateKey(date);
}

function formatTrendLabel(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function phaseToKind(phase: string): SymptomPhaseKind | null {
  const normalized = phase.toLowerCase();
  if (normalized.includes("menstrual")) return "menstrual";
  if (normalized.includes("follicular")) return "follicular";
  if (normalized.includes("ovulatory")) return "ovulatory";
  if (normalized.includes("luteal")) return "luteal";
  return null;
}

const MOOD_PROXY_KEYS: SymptomKey[] = ["stress", "sadness", "anxiety"];

interface PhaseAccumulator {
  symptomCounts: Map<SymptomKey, number>;
  checkInDays: number;
  energyScores: number[];
  moodScores: number[];
}

function averageScores(scores: number[]): number | null {
  if (scores.length === 0) {
    return null;
  }
  const total = scores.reduce((sum, score) => sum + score, 0);
  return Math.round((total / scores.length) * 10) / 10;
}

function deriveMoodScore(checkIn: DailyCheckIn): number | null {
  const inverted: number[] = [];

  for (const key of MOOD_PROXY_KEYS) {
    const selection = checkIn.symptoms[key]?.selection;
    if (!selection) {
      continue;
    }
    const score = selectionToMetricScore(key, selection);
    if (score !== null) {
      inverted.push(6 - score);
    }
  }

  if (inverted.length > 0) {
    return averageScores(inverted);
  }

  const lowMotivation = checkIn.symptoms.lowMotivation?.selection;
  if (lowMotivation) {
    const score = selectionToMetricScore("lowMotivation", lowMotivation);
    if (score !== null) {
      return 6 - score;
    }
  }

  return null;
}

function formatNaturalList(items: string[]): string {
  if (items.length === 0) {
    return "";
  }
  if (items.length === 1) {
    return items[0];
  }
  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

type WellnessTrend = "lower" | "steady" | "higher";

function scoreToTrend(score: number): WellnessTrend {
  if (score <= 2) {
    return "lower";
  }
  if (score <= 3) {
    return "steady";
  }
  return "higher";
}

function buildEnergyPatternSentence(averageScore: number): string {
  const trend = scoreToTrend(averageScore);
  if (trend === "lower") {
    return "Your energy tends to be lower here.";
  }
  if (trend === "steady") {
    return "Your energy is usually steady here.";
  }
  return "Your energy is often higher here.";
}

function buildMoodPatternSentence(averageScore: number): string {
  const trend = scoreToTrend(averageScore);
  if (trend === "lower") {
    return "Your mood tends to be lower here.";
  }
  if (trend === "steady") {
    return "Your mood is usually steady here.";
  }
  return "Your mood is often higher here.";
}

function buildPhaseSummarySentence(
  symptoms: { label: string }[],
): string | null {
  const labels = symptoms
    .slice(0, 3)
    .map((symptom) => symptom.label.toLowerCase());

  if (labels.length === 0) {
    return null;
  }

  return `You often log ${formatNaturalList(labels)} during this phase.`;
}

function buildPhasePatternSentence(
  energyScores: number[],
  moodScores: number[],
): string | null {
  if (energyScores.length >= MIN_PATTERN_SCORES) {
    const averageEnergy = averageScores(energyScores);
    if (averageEnergy !== null) {
      return buildEnergyPatternSentence(averageEnergy);
    }
  }

  if (moodScores.length >= MIN_PATTERN_SCORES) {
    const averageMood = averageScores(moodScores);
    if (averageMood !== null) {
      return buildMoodPatternSentence(averageMood);
    }
  }

  return null;
}

function buildPhaseSymptomSummary(
  phase: (typeof PHASE_ORDER)[number],
  accumulator: PhaseAccumulator,
): PhaseSymptomSummary {
  const phaseKind = phaseToKind(phase)!;
  const symptoms = [...accumulator.symptomCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key, count]) => ({
      key,
      label: getSymptomLabel(key),
      count,
    }));

  const averageEnergyScore = averageScores(accumulator.energyScores);
  const averageMoodScore = averageScores(accumulator.moodScores);

  return {
    phase,
    phaseKind,
    friendlyTitle: PHASE_FRIENDLY_TITLES[phaseKind],
    symptoms,
    checkInDays: accumulator.checkInDays,
    summarySentence: buildPhaseSummarySentence(symptoms),
    patternSentence: buildPhasePatternSentence(
      accumulator.energyScores,
      accumulator.moodScores,
    ),
    symptomPills: symptoms.slice(0, 3).map((symptom) => symptom.label),
    averageEnergyScore,
    averageEnergyLabel:
      averageEnergyScore !== null
        ? scoreToWellnessLabel(averageEnergyScore)
        : null,
    averageMoodScore,
    averageMoodLabel:
      averageMoodScore !== null ? scoreToWellnessLabel(averageMoodScore) : null,
    energyLogCount: accumulator.energyScores.length,
    moodLogCount: accumulator.moodScores.length,
  };
}

function buildRecentStretchSentence(
  points: SymptomTrendPoint[],
): string | null {
  const loggedIndices = points
    .map((point, index) => (point.symptomCount > 0 ? index : -1))
    .filter((index) => index >= 0);

  if (loggedIndices.length === 0) {
    return null;
  }

  if (loggedIndices.length === 1) {
    return `Most recently on ${points[loggedIndices[0]].label}.`;
  }

  let runEnd = loggedIndices[loggedIndices.length - 1];
  let runStart = runEnd;

  for (let index = loggedIndices.length - 2; index >= 0; index -= 1) {
    if (loggedIndices[index] === runStart - 1) {
      runStart = loggedIndices[index];
    } else {
      break;
    }
  }

  const runLength = runEnd - runStart + 1;

  if (runLength >= 3) {
    if (runStart === runEnd) {
      return `Most of that was on ${points[runStart].label}.`;
    }
    return `Most of that was ${points[runStart].label}–${points[runEnd].label}.`;
  }

  return `Most recently on ${points[runEnd].label}.`;
}

export function buildSymptomLoggingSummary(
  trendPoints: SymptomTrendPoint[],
): SymptomLoggingSummary {
  const daysLoggedLast30 = trendPoints.filter(
    (point) => point.symptomCount > 0,
  ).length;

  const summarySentence =
    daysLoggedLast30 === 1
      ? "You logged symptoms on 1 day in the last 30 days."
      : `You logged symptoms on ${daysLoggedLast30} days in the last 30 days.`;

  return {
    daysLoggedLast30,
    summarySentence,
    detailSentence: buildRecentStretchSentence(trendPoints),
    recentDays: trendPoints.slice(-14).map((point) => ({
      dateKey: point.dateKey,
      label: point.label,
      logged: point.symptomCount > 0,
    })),
  };
}

function emptyPhaseAccumulator(): PhaseAccumulator {
  return {
    symptomCounts: new Map(),
    checkInDays: 0,
    energyScores: [],
    moodScores: [],
  };
}
function getSymptomDays(
  dailyCheckIns: Record<string, DailyCheckIn>,
): { dateKey: string; checkIn: DailyCheckIn }[] {
  return Object.entries(dailyCheckIns)
    .filter(([, checkIn]) => countSelectedSymptoms(checkIn) > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, checkIn]) => ({ dateKey, checkIn }));
}

export function buildSymptomInsightsData(
  dailyCheckIns: Record<string, DailyCheckIn>,
  cycleSettings: CycleSettings,
  periodLogs: PeriodLog[] = [],
  referenceDate: string = todayDateKey(),
): SymptomInsightsData {
  const symptomDays = getSymptomDays(dailyCheckIns);
  const totalCheckInDays = symptomDays.length;
  const hasEnoughData = totalCheckInDays >= SYMPTOM_INSIGHTS_MIN_CHECK_IN_DAYS;

  const symptomCounts = new Map<SymptomKey, number>();
  const symptomCountByDate: Record<string, number> = {};
  const phaseAccumulators = new Map<string, PhaseAccumulator>();

  for (const { dateKey, checkIn } of symptomDays) {
    const count = countSelectedSymptoms(checkIn);
    symptomCountByDate[dateKey] = count;

    for (const key of Object.keys(checkIn.symptoms) as SymptomKey[]) {
      if (!checkIn.symptoms[key]) {
        continue;
      }
      symptomCounts.set(key, (symptomCounts.get(key) ?? 0) + 1);
    }

    const { phase } = resolveCycleContextForDate(
      dateKey,
      cycleSettings,
      periodLogs,
    );
    const phaseKind = phaseToKind(phase);
    if (!phaseKind) {
      continue;
    }

    if (!phaseAccumulators.has(phase)) {
      phaseAccumulators.set(phase, emptyPhaseAccumulator());
    }
    const accumulator = phaseAccumulators.get(phase)!;
    accumulator.checkInDays += 1;

    const energySelection = checkIn.symptoms.energy?.selection;
    if (energySelection) {
      const energyScore = selectionToMetricScore("energy", energySelection);
      if (energyScore !== null) {
        accumulator.energyScores.push(energyScore);
      }
    }

    const moodScore = deriveMoodScore(checkIn);
    if (moodScore !== null) {
      accumulator.moodScores.push(moodScore);
    }

    for (const key of Object.keys(checkIn.symptoms) as SymptomKey[]) {
      if (!checkIn.symptoms[key]) {
        continue;
      }
      accumulator.symptomCounts.set(
        key,
        (accumulator.symptomCounts.get(key) ?? 0) + 1,
      );
    }
  }

  const topSymptoms: SymptomFrequencyRow[] = [...symptomCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key, count]) => ({
      key,
      label: getSymptomLabel(key),
      count,
      percent:
        totalCheckInDays > 0
          ? Math.round((count / totalCheckInDays) * 100)
          : 0,
    }));

  const trendPoints: SymptomTrendPoint[] = [];
  for (let offset = 29; offset >= 0; offset -= 1) {
    const dateKey = shiftDateKey(referenceDate, -offset);
    trendPoints.push({
      dateKey,
      label: formatTrendLabel(dateKey),
      symptomCount: symptomCountByDate[dateKey] ?? 0,
    });
  }

  const loggingSummary = buildSymptomLoggingSummary(trendPoints);

  const phaseBreakdown: PhaseSymptomSummary[] = PHASE_ORDER.map((phase) =>
    buildPhaseSymptomSummary(
      phase,
      phaseAccumulators.get(phase) ?? emptyPhaseAccumulator(),
    ),
  );

  return {
    totalCheckInDays,
    hasEnoughData,
    topSymptoms,
    loggingSummary,
    phaseBreakdown,
    symptomCountByDate,
  };
}

export function hasAnySymptomCheckIns(
  dailyCheckIns: Record<string, DailyCheckIn>,
): boolean {
  return Object.values(dailyCheckIns).some(
    (checkIn) => hasCheckInContent(checkIn) && countSelectedSymptoms(checkIn) > 0,
  );
}
