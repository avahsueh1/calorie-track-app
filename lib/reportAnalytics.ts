import type { DailyCheckIn, SymptomKey } from "../types";
import type { AppProfile } from "../types/profile";
import type {
  CycleSettings,
  DailyActivityEntry,
  DailyFoodEntry,
  PeriodLog,
  ProgressJournalEntry,
} from "../types/wellness";
import {
  hasCheckInContent,
  normalizeDailyCheckIn,
} from "./checkInHelpers";
import { todayDateKey } from "./appStateHelpers";
import { getCalorieTargetForProfileDate } from "./calorieCycling";
import { getCalorieTargetStatus } from "./calorieTargetStatus";
import type { ProgressJournalMap } from "./progressJournal";
import { hasProgressJournalContent } from "./progressJournal";
import { formatWeightDisplay, kgToLb } from "./profileBody";
import {
  getSymptomSentiment,
  isLifestyleSymptomKey,
} from "./symptomOptions";
import {
  buildSymptomInsightsData,
  PHASE_FRIENDLY_TITLES,
  type PhaseSymptomSummary,
  type SymptomInsightsData,
  type SymptomPhaseKind,
} from "./symptomInsights";

export const REPORT_DAY_COUNT = 30;
export const REPORT_MIN_LOGGED_DAYS = 3;

export interface ReportHeader {
  title: string;
  dateRangeLabel: string;
  loggedDaysUsed: number;
  startDateKey: string;
  endDateKey: string;
}

export interface ReportPhaseSymptomChip {
  key: SymptomKey;
  label: string;
  count: number;
  sentiment: "positive" | "negative";
}

export interface ReportPhaseMetric {
  phaseKind: SymptomPhaseKind;
  friendlyTitle: string;
  positiveSymptoms: ReportPhaseSymptomChip[];
  negativeSymptoms: ReportPhaseSymptomChip[];
  summarySentence: string | null;
  checkInDays: number;
}

export interface ReportSymptomTrendRow {
  key: SymptomKey;
  label: string;
  count: number;
  percent: number;
}

export interface ReportWeeklyNetPoint {
  label: string;
  averageNet: number;
  daysLogged: number;
}

export interface ReportNutritionSummary {
  averageEaten: number;
  averageBurned: number;
  averageNet: number;
  daysUnderTarget: number;
  daysNearTarget: number;
  daysOverTarget: number;
  daysWithFoodLog: number;
  weeklyNetTrend: ReportWeeklyNetPoint[];
}

export interface ReportActivityWeightSummary {
  totalActivitySessions: number;
  mostCommonActivity: string | null;
  averageWeeklyActivityCalories: number;
  latestWeightLabel: string | null;
  weightChangeLabel: string | null;
}

export interface ReportInsightCard {
  id: string;
  headline: string;
  explanation: string;
  detail: string;
  suggestion?: string;
}

export interface HealthPatternReport {
  header: ReportHeader;
  hasEnoughData: boolean;
  symptomInsights: SymptomInsightsData;
  cyclePhaseSummary: ReportPhaseMetric[] | null;
  symptomTrends: ReportSymptomTrendRow[];
  nutritionSummary: ReportNutritionSummary | null;
  activityWeightSummary: ReportActivityWeightSummary | null;
  localInsights: ReportInsightCard[];
}

export interface HealthPatternReportInput {
  referenceDate?: string;
  calorieTrackingEnabled: boolean;
  cycleTrackingEnabled: boolean;
  dailyCheckIns: Record<string, DailyCheckIn>;
  foodLogs: Record<string, DailyFoodEntry[]>;
  activityLogs: Record<string, DailyActivityEntry[]>;
  progressJournal: ProgressJournalMap;
  cycleSettings: CycleSettings;
  periodLogs?: PeriodLog[];
  profile?: AppProfile;
}

function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function shiftDateKey(dateKey: string, deltaDays: number): string {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + deltaDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getReportDateKeys(
  referenceDate: string,
  dayCount = REPORT_DAY_COUNT,
): string[] {
  const keys: string[] = [];
  for (let offset = dayCount - 1; offset >= 0; offset -= 1) {
    keys.push(shiftDateKey(referenceDate, -offset));
  }
  return keys;
}

function filterRecordsByDateKeys<T extends Record<string, unknown>>(
  records: T,
  dateKeys: Set<string>,
): T {
  return Object.fromEntries(
    Object.entries(records).filter(([dateKey]) => dateKeys.has(dateKey)),
  ) as T;
}

function sumFoodCalories(foods: DailyFoodEntry[]): number {
  return foods.reduce((total, food) => total + food.calories, 0);
}

function sumActivityCalories(activities: DailyActivityEntry[]): number {
  return activities.reduce(
    (total, activity) => total + activity.caloriesBurned,
    0,
  );
}

function averageNumbers(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }
  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.round((total / values.length) * 10) / 10;
}

function countLoggedDaysInRange(
  dateKeys: string[],
  dailyCheckIns: Record<string, DailyCheckIn>,
  foodLogs: Record<string, DailyFoodEntry[]>,
  activityLogs: Record<string, DailyActivityEntry[]>,
  progressJournal: ProgressJournalMap,
): number {
  return dateKeys.filter((dateKey) => {
    const hasFood = (foodLogs[dateKey] ?? []).length > 0;
    const hasActivity = (activityLogs[dateKey] ?? []).length > 0;
    const checkIn = dailyCheckIns[dateKey];
    const hasCheckIn =
      checkIn !== undefined &&
      hasCheckInContent(normalizeDailyCheckIn(checkIn));
    const hasProgress = hasProgressJournalContent(progressJournal[dateKey]);
    return hasFood || hasActivity || hasCheckIn || hasProgress;
  }).length;
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

function buildPhaseSymptomChips(phase: PhaseSymptomSummary): {
  positiveSymptoms: ReportPhaseSymptomChip[];
  negativeSymptoms: ReportPhaseSymptomChip[];
  summarySentence: string | null;
} {
  const filtered = phase.symptoms.filter(
    (symptom) => !isLifestyleSymptomKey(symptom.key),
  );

  const positiveSymptoms: ReportPhaseSymptomChip[] = [];
  const negativeSymptoms: ReportPhaseSymptomChip[] = [];

  for (const symptom of filtered) {
    const sentiment = getSymptomSentiment(symptom.key);
    const chip: ReportPhaseSymptomChip = {
      key: symptom.key,
      label: symptom.label,
      count: symptom.count,
      sentiment,
    };

    if (sentiment === "positive") {
      positiveSymptoms.push(chip);
    } else {
      negativeSymptoms.push(chip);
    }
  }

  const topLabels = filtered
    .slice(0, 3)
    .map((symptom) => symptom.label.toLowerCase());

  const summarySentence =
    topLabels.length > 0
      ? `You often log ${formatNaturalList(topLabels)} during this phase.`
      : null;

  return {
    positiveSymptoms: positiveSymptoms.slice(0, 3),
    negativeSymptoms: negativeSymptoms.slice(0, 4),
    summarySentence,
  };
}

function buildCyclePhaseSummary(
  phaseBreakdown: PhaseSymptomSummary[],
): ReportPhaseMetric[] {
  return phaseBreakdown.map((phase) => {
    const chips = buildPhaseSymptomChips(phase);

    return {
      phaseKind: phase.phaseKind,
      friendlyTitle: PHASE_FRIENDLY_TITLES[phase.phaseKind],
      positiveSymptoms: chips.positiveSymptoms,
      negativeSymptoms: chips.negativeSymptoms,
      summarySentence: chips.summarySentence,
      checkInDays: phase.checkInDays,
    };
  });
}

function buildNutritionSummary(
  dateKeys: string[],
  foodLogs: Record<string, DailyFoodEntry[]>,
  activityLogs: Record<string, DailyActivityEntry[]>,
  profile?: AppProfile,
): ReportNutritionSummary {
  const eatenValues: number[] = [];
  const burnedValues: number[] = [];
  const netValues: number[] = [];
  let daysUnderTarget = 0;
  let daysNearTarget = 0;
  let daysOverTarget = 0;

  for (const dateKey of dateKeys) {
    const eaten = sumFoodCalories(foodLogs[dateKey] ?? []);
    const burned = sumActivityCalories(activityLogs[dateKey] ?? []);
    const net = eaten - burned;

    if (eaten > 0 || burned > 0) {
      eatenValues.push(eaten);
      burnedValues.push(burned);
      netValues.push(net);
    }

    if (eaten <= 0 && burned <= 0) {
      continue;
    }

    const target = profile ? getCalorieTargetForProfileDate(profile, dateKey) : 0;
    if (target <= 0) {
      continue;
    }

    const status = getCalorieTargetStatus({
      eaten,
      burned,
      target,
      netCalories: net,
    });

    if (status === "under") {
      daysUnderTarget += 1;
    } else if (status === "near") {
      daysNearTarget += 1;
    } else if (status === "over") {
      daysOverTarget += 1;
    }
  }

  const weeklyNetTrend: ReportWeeklyNetPoint[] = [];
  for (let weekIndex = 0; weekIndex < 4; weekIndex += 1) {
    const weekKeys = dateKeys.slice(weekIndex * 7, weekIndex * 7 + 7);
    const weekNetValues = weekKeys
      .map((dateKey) => {
        const eaten = sumFoodCalories(foodLogs[dateKey] ?? []);
        const burned = sumActivityCalories(activityLogs[dateKey] ?? []);
        if (eaten <= 0 && burned <= 0) {
          return null;
        }
        return eaten - burned;
      })
      .filter((value): value is number => value !== null);

    weeklyNetTrend.push({
      label: `Week ${weekIndex + 1}`,
      averageNet: averageNumbers(weekNetValues) ?? 0,
      daysLogged: weekNetValues.length,
    });
  }

  return {
    averageEaten: averageNumbers(eatenValues) ?? 0,
    averageBurned: averageNumbers(burnedValues) ?? 0,
    averageNet: averageNumbers(netValues) ?? 0,
    daysUnderTarget,
    daysNearTarget,
    daysOverTarget,
    daysWithFoodLog: eatenValues.length,
    weeklyNetTrend,
  };
}

function buildActivityWeightSummary(
  dateKeys: string[],
  activityLogs: Record<string, DailyActivityEntry[]>,
  progressJournal: ProgressJournalMap,
  profile?: AppProfile,
): ReportActivityWeightSummary | null {
  const activityNames: string[] = [];
  let totalActivitySessions = 0;
  let totalActivityCalories = 0;

  for (const dateKey of dateKeys) {
    const activities = activityLogs[dateKey] ?? [];
    totalActivitySessions += activities.length;
    totalActivityCalories += sumActivityCalories(activities);
    for (const activity of activities) {
      activityNames.push(activity.name.trim() || "Activity");
    }
  }

  const weightEntries = dateKeys
    .map((dateKey) => progressJournal[dateKey])
    .filter(
      (entry): entry is ProgressJournalEntry =>
        entry !== undefined &&
        hasProgressJournalContent(entry) &&
        entry.weightKg != null &&
        entry.weightKg > 0,
    );

  const units = profile?.units ?? "imperial";
  let latestWeightLabel: string | null = null;
  let weightChangeLabel: string | null = null;

  if (weightEntries.length > 0) {
    const latest = weightEntries[weightEntries.length - 1];
    latestWeightLabel = formatWeightDisplay(latest.weightKg!, units);

    if (weightEntries.length >= 2) {
      const earliest = weightEntries[0];
      const deltaKg = latest.weightKg! - earliest.weightKg!;
      const roundedDelta =
        units === "imperial"
          ? Math.round(kgToLb(deltaKg) * 10) / 10
          : Math.round(deltaKg * 10) / 10;
      const unitLabel = units === "imperial" ? "lb" : "kg";
      const sign = roundedDelta > 0 ? "+" : "";
      weightChangeLabel = `${sign}${roundedDelta} ${unitLabel} over the report range`;
    }
  }

  const nameCounts = new Map<string, number>();
  for (const name of activityNames) {
    nameCounts.set(name, (nameCounts.get(name) ?? 0) + 1);
  }

  const mostCommonActivity =
    [...nameCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const hasActivityData = totalActivitySessions > 0;
  const hasWeightData = latestWeightLabel !== null;

  if (!hasActivityData && !hasWeightData) {
    return null;
  }

  return {
    totalActivitySessions,
    mostCommonActivity,
    averageWeeklyActivityCalories:
      Math.round(totalActivityCalories / (REPORT_DAY_COUNT / 7)),
    latestWeightLabel,
    weightChangeLabel,
  };
}

function formatCheckInDetail(count: number): string {
  return `Based on ${count} check-in${count === 1 ? "" : "s"}`;
}

function buildLocalInsights(
  report: Omit<HealthPatternReport, "localInsights">,
  checkInDaysInRange: number,
): ReportInsightCard[] {
  const insights: ReportInsightCard[] = [];

  if (checkInDaysInRange > 0) {
    insights.push({
      id: "check-in-coverage",
      headline: "Your check-ins are adding up",
      explanation: `You logged check-ins on ${checkInDaysInRange} of the last ${REPORT_DAY_COUNT} days.`,
      detail: "Based on your recent entries",
    });
  }

  const luteal = report.cyclePhaseSummary?.find(
    (phase) => phase.phaseKind === "luteal",
  );
  const menstrual = report.cyclePhaseSummary?.find(
    (phase) => phase.phaseKind === "menstrual",
  );

  if (
    luteal &&
    luteal.negativeSymptoms.some((symptom) => symptom.key === "cravings")
  ) {
    insights.push({
      id: "luteal-cravings",
      headline: "Cravings show up before your period",
      explanation:
        "You often log cravings in the days before your period.",
      detail: formatCheckInDetail(luteal.checkInDays),
      suggestion: "Planning filling snacks here may help.",
    });
  }

  if (
    menstrual?.negativeSymptoms.some((symptom) => symptom.key === "fatigue")
  ) {
    insights.push({
      id: "menstrual-fatigue",
      headline: "Fatigue tends to show up during your period",
      explanation: "You often log fatigue while on your period.",
      detail: formatCheckInDetail(menstrual.checkInDays),
      suggestion: "Extra rest on these days may help.",
    });
  }

  const moodSymptomKeys = new Set<SymptomKey>([
    "sadness",
    "anxiety",
    "stress",
    "irritability",
  ]);
  if (
    menstrual?.negativeSymptoms.some((symptom) =>
      moodSymptomKeys.has(symptom.key),
    )
  ) {
    insights.push({
      id: "menstrual-mood",
      headline: "Mood shifts may show up during your period",
      explanation:
        "You often log mood-related symptoms while on your period.",
      detail: formatCheckInDetail(menstrual.checkInDays),
      suggestion: "A little extra self-care here may help.",
    });
  }

  if (report.nutritionSummary && report.nutritionSummary.daysNearTarget > 0) {
    const days = report.nutritionSummary.daysNearTarget;
    insights.push({
      id: "nutrition-near-target",
      headline: "You're often near your calorie target",
      explanation: `Your logs suggest your net calories stayed near target on ${days} day${days === 1 ? "" : "s"} in this report.`,
      detail: `Based on ${report.nutritionSummary.daysWithFoodLog} day${report.nutritionSummary.daysWithFoodLog === 1 ? "" : "s"} with food logs`,
    });
  }

  const topSymptom = report.symptomTrends[0];
  if (topSymptom) {
    insights.push({
      id: `top-symptom-${topSymptom.key}`,
      headline: `${topSymptom.label} shows up most in your logs`,
      explanation: `You often log ${topSymptom.label.toLowerCase()} in your recent check-ins.`,
      detail: formatCheckInDetail(topSymptom.count),
    });
  }

  if (
    report.activityWeightSummary?.mostCommonActivity &&
    report.activityWeightSummary.totalActivitySessions > 0
  ) {
    const sessions = report.activityWeightSummary.totalActivitySessions;
    insights.push({
      id: "top-activity",
      headline: `${report.activityWeightSummary.mostCommonActivity} is your go-to movement`,
      explanation: `You logged ${report.activityWeightSummary.mostCommonActivity} most often in the last ${REPORT_DAY_COUNT} days.`,
      detail: `Based on ${sessions} activity log${sessions === 1 ? "" : "s"}`,
    });
  }

  const seenIds = new Set<string>();
  return insights
    .filter((insight) => {
      if (seenIds.has(insight.id)) {
        return false;
      }
      seenIds.add(insight.id);
      return true;
    })
    .slice(0, 6);
}

function countCheckInDaysInRange(
  dateKeys: string[],
  dailyCheckIns: Record<string, DailyCheckIn>,
): number {
  return dateKeys.filter((dateKey) => {
    const checkIn = dailyCheckIns[dateKey];
    return (
      checkIn !== undefined &&
      hasCheckInContent(normalizeDailyCheckIn(checkIn))
    );
  }).length;
}

export function buildHealthPatternReport(
  input: HealthPatternReportInput,
): HealthPatternReport {
  const referenceDate = input.referenceDate ?? todayDateKey();
  const dateKeys = getReportDateKeys(referenceDate);
  const dateKeySet = new Set(dateKeys);
  const periodLogs = input.periodLogs ?? [];

  const scopedCheckIns = filterRecordsByDateKeys(
    input.dailyCheckIns,
    dateKeySet,
  );
  const scopedFoodLogs = filterRecordsByDateKeys(input.foodLogs, dateKeySet);
  const scopedActivityLogs = filterRecordsByDateKeys(
    input.activityLogs,
    dateKeySet,
  );
  const scopedProgressJournal = filterRecordsByDateKeys(
    input.progressJournal,
    dateKeySet,
  );

  const loggedDaysUsed = countLoggedDaysInRange(
    dateKeys,
    scopedCheckIns,
    scopedFoodLogs,
    scopedActivityLogs,
    scopedProgressJournal,
  );

  const header: ReportHeader = {
    title: "Health Pattern Report",
    dateRangeLabel: `Last ${REPORT_DAY_COUNT} days`,
    loggedDaysUsed,
    startDateKey: dateKeys[0],
    endDateKey: dateKeys[dateKeys.length - 1],
  };

  const symptomData = buildSymptomInsightsData(
    scopedCheckIns,
    input.cycleSettings,
    periodLogs,
    referenceDate,
  );

  const symptomTrends: ReportSymptomTrendRow[] = symptomData.topSymptoms
    .filter((symptom) => !isLifestyleSymptomKey(symptom.key))
    .map((symptom) => ({
      key: symptom.key,
      label: symptom.label,
      count: symptom.count,
      percent: symptom.percent,
    }));

  const cyclePhaseSummary = input.cycleTrackingEnabled
    ? buildCyclePhaseSummary(symptomData.phaseBreakdown)
    : null;

  const nutritionSummary = input.calorieTrackingEnabled
    ? buildNutritionSummary(
        dateKeys,
        scopedFoodLogs,
        scopedActivityLogs,
        input.profile,
      )
    : null;

  const activityWeightSummary = buildActivityWeightSummary(
    dateKeys,
    scopedActivityLogs,
    scopedProgressJournal,
    input.profile,
  );

  const checkInDaysInRange = countCheckInDaysInRange(dateKeys, scopedCheckIns);

  const partialReport = {
    header,
    hasEnoughData: loggedDaysUsed >= REPORT_MIN_LOGGED_DAYS,
    symptomInsights: symptomData,
    cyclePhaseSummary,
    symptomTrends,
    nutritionSummary,
    activityWeightSummary,
  };

  return {
    ...partialReport,
    localInsights: buildLocalInsights(partialReport, checkInDaysInRange),
  };
}
