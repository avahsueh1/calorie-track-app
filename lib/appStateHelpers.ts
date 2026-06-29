import type { DailyCheckIn, SymptomKey } from "../types";
import {
  formatSymptomSelection,
  hasCheckInContent,
  normalizeDailyCheckIn,
  selectionToMetricScore,
} from "./checkInHelpers";
import type { AppProfile } from "../types/profile";
import type { TrackingPreferences } from "./trackingPreferences";
import {
  getDefaultTrackingPreferences,
  normalizeTrackingPreferences,
} from "./trackingPreferences";
import { getCalorieTargetForProfileDate } from "./calorieCycling";
import { getCalorieTargetStatus } from "./calorieTargetStatus";
import type {
  BodyPatternMetric,
  CycleContextDisplay,
  CycleSettings,
  DailyActivityEntry,
  DailyFoodEntry,
  PatternInsightCardData,
  PeriodLog,
  WeeklyNetDay,
  ProgressJournalEntry,
} from "../types/wellness";

export const APP_STATE_STORAGE_KEY = "calorie-track-app:app-state";
/** Bump when persisted AppState shape changes; add a migration in migrateAppStateToCurrent. */
export const APP_STATE_VERSION = 3;

const LEGACY_PROFILE_KEY = "calorie-track-app:profile";
const LEGACY_DAILY_LOG_KEY = "calorie-track-app:daily-log";
const LEGACY_CHECK_IN_KEY = "calorie-track-app:daily-check-in";

export function todayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function nextEntryId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function extractCycleSettings(profile: AppProfile): CycleSettings {
  return {
    cycleTrackingEnabled: profile.cycleTrackingEnabled,
    lifeStage: profile.lifeStage,
    lastPeriodStart: profile.lastPeriodStart,
    averageCycleLength: profile.averageCycleLength,
    averagePeriodLength: profile.averagePeriodLength,
  };
}

export function applyCycleSettingsToProfile(
  profile: AppProfile,
  cycleSettings: CycleSettings,
): AppProfile {
  return {
    ...profile,
    cycleTrackingEnabled: cycleSettings.cycleTrackingEnabled,
    lifeStage: cycleSettings.lifeStage,
    lastPeriodStart: cycleSettings.lastPeriodStart,
    averageCycleLength: cycleSettings.averageCycleLength,
    averagePeriodLength: cycleSettings.averagePeriodLength,
  };
}

function parseDateAtNoon(value: string): Date {
  return new Date(`${value}T12:00:00`);
}

function daysBetween(startDateKey: string, endDateKey: string): number {
  const start = parseDateAtNoon(startDateKey);
  const end = parseDateAtNoon(endDateKey);
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

const MIN_CYCLE_LENGTH = 21;
const MAX_CYCLE_LENGTH = 45;
const MIN_CYCLE_GAP_DAYS = 21;
const MIN_RECENT_CYCLE_GAP_DAYS = 14;
const MIN_PERIOD_LENGTH = 2;
const MAX_PERIOD_LENGTH = 10;
const OVULATORY_WINDOW_DAYS = 3;
const MIN_LUTEAL_DAYS = 10;
const RECENT_PERIOD_WINDOW_DAYS = 90;

function clampCycleLength(days: number, fallback = 28): number {
  if (!Number.isFinite(days) || days <= 0) {
    return clampCycleLength(fallback, 28);
  }
  return Math.min(
    MAX_CYCLE_LENGTH,
    Math.max(MIN_CYCLE_LENGTH, Math.round(days)),
  );
}

function clampPeriodLength(days: number, cycleLength: number, fallback = 5): number {
  const maxPeriod = Math.min(MAX_PERIOD_LENGTH, Math.floor(cycleLength * 0.4));
  if (!Number.isFinite(days) || days <= 0) {
    return Math.min(maxPeriod, Math.max(MIN_PERIOD_LENGTH, fallback));
  }
  return Math.min(maxPeriod, Math.max(MIN_PERIOD_LENGTH, Math.round(days)));
}

/** Ensures derived cycle settings always use safe, predictable lengths. */
export function normalizeCycleSettings(cycleSettings: CycleSettings): CycleSettings {
  const averageCycleLength = clampCycleLength(cycleSettings.averageCycleLength);
  return {
    ...cycleSettings,
    averageCycleLength,
    averagePeriodLength: clampPeriodLength(
      cycleSettings.averagePeriodLength,
      averageCycleLength,
    ),
  };
}

function addDaysToDateKey(dateKey: string, days: number): string {
  const date = parseDateAtNoon(dateKey);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function periodLogEndDate(log: PeriodLog): string {
  return log.endDate ?? log.startDate;
}

/** Merge overlapping or near-adjacent period logs from calendar experimentation. */
export function coalescePeriodLogs(periodLogs: PeriodLog[]): PeriodLog[] {
  if (periodLogs.length <= 1) {
    return periodLogs;
  }

  const sorted = [...periodLogs].sort((a, b) =>
    a.startDate.localeCompare(b.startDate),
  );
  const merged: PeriodLog[] = [];

  for (const log of sorted) {
    const previous = merged[merged.length - 1];
    if (!previous) {
      merged.push({ ...log });
      continue;
    }

    const previousEnd = periodLogEndDate(previous);
    const gap = daysBetween(previousEnd, log.startDate);
    const overlaps = log.startDate <= previousEnd || gap <= 3;

    if (overlaps) {
      previous.startDate =
        log.startDate < previous.startDate ? log.startDate : previous.startDate;
      const nextEnd =
        log.endDate && previous.endDate
          ? log.endDate > previous.endDate
            ? log.endDate
            : previous.endDate
          : log.endDate ?? previous.endDate;
      previous.endDate = nextEnd;
      previous.flow = log.flow ?? previous.flow;
    } else {
      merged.push({ ...log });
    }
  }

  return merged.sort((a, b) => b.startDate.localeCompare(a.startDate));
}

/**
 * Cycle anchor for a specific calendar date: the most recent logged period
 * start on or before that date, otherwise stepped back from the current anchor.
 */
export function getCycleAnchorForDate(
  dateKey: string,
  periodLogs: PeriodLog[],
  currentAnchor: string,
  cycleLength: number,
): string {
  const mostRecentStart = getMostRecentPeriodStart(periodLogs);
  if (mostRecentStart && dateKey >= mostRecentStart) {
    return mostRecentStart;
  }

  const priorStarts = [...new Set(periodLogs.map((log) => log.startDate))]
    .filter((start) => start <= dateKey)
    .sort((a, b) => b.localeCompare(a));

  if (priorStarts.length > 0) {
    return priorStarts[0];
  }

  if (dateKey >= currentAnchor) {
    return currentAnchor;
  }

  const daysBeforeCurrentAnchor = daysBetween(dateKey, currentAnchor);
  const cyclesBack = Math.max(
    1,
    Math.ceil(daysBeforeCurrentAnchor / cycleLength),
  );

  return addDaysToDateKey(currentAnchor, -cyclesBack * cycleLength);
}

/** Distinct cycle anchors — ignores duplicate starts within one cycle window. */
export function getCycleStartDates(periodLogs: PeriodLog[]): string[] {
  const sorted = [...periodLogs]
    .map((log) => log.startDate)
    .sort((a, b) => a.localeCompare(b));

  const anchors: string[] = [];
  for (const start of sorted) {
    const previous = anchors[anchors.length - 1];
    if (!previous || daysBetween(previous, start) >= MIN_CYCLE_GAP_DAYS) {
      anchors.push(start);
    }
  }

  return anchors;
}

export function getMostRecentPeriodStart(periodLogs: PeriodLog[]): string | null {
  if (periodLogs.length === 0) {
    return null;
  }

  return [...periodLogs].sort((a, b) => b.startDate.localeCompare(a.startDate))[0]
    .startDate;
}

export function getMostRecentPeriodLog(periodLogs: PeriodLog[]): PeriodLog | null {
  if (periodLogs.length === 0) {
    return null;
  }

  return [...periodLogs].sort((a, b) => b.startDate.localeCompare(a.startDate))[0];
}

/** Period start or end falls within the recent window (default last 90 days). */
export function isRecentPeriodLog(
  log: PeriodLog,
  referenceDate: string = todayDateKey(),
): boolean {
  const windowStart = addDaysToDateKey(referenceDate, -RECENT_PERIOD_WINDOW_DAYS);
  const effectiveEnd = log.endDate ?? referenceDate;

  if (effectiveEnd < windowStart) {
    return false;
  }

  return log.startDate <= referenceDate;
}

function getLoggedPeriodDuration(log: PeriodLog, referenceDate: string): number | null {
  if (log.endDate) {
    return daysBetween(log.startDate, log.endDate) + 1;
  }

  if (log.startDate > referenceDate) {
    return null;
  }

  return daysBetween(log.startDate, referenceDate) + 1;
}

/** Use the logged duration for a recent anchor when projecting phases after it ends. */
export function getMenstrualLengthForAnchor(
  anchorStart: string,
  periodLogs: PeriodLog[],
  averagePeriodLength: number,
  averageCycleLength: number,
  referenceDate: string = todayDateKey(),
): number {
  const anchorLog = periodLogs.find((log) => log.startDate === anchorStart);
  if (!anchorLog || !isRecentPeriodLog(anchorLog, referenceDate)) {
    return clampPeriodLength(averagePeriodLength, averageCycleLength);
  }

  const loggedDuration = getLoggedPeriodDuration(anchorLog, referenceDate);
  if (
    loggedDuration !== null &&
    loggedDuration >= MIN_PERIOD_LENGTH &&
    loggedDuration <= MAX_PERIOD_LENGTH
  ) {
    return clampPeriodLength(loggedDuration, averageCycleLength);
  }

  return clampPeriodLength(averagePeriodLength, averageCycleLength);
}

export function calculateAverageCycleLength(
  periodLogs: PeriodLog[],
  fallback: number,
  referenceDate: string = todayDateKey(),
): number {
  const anchors = getCycleStartDates(periodLogs);
  const gaps: number[] = [];

  for (let index = 1; index < anchors.length; index += 1) {
    const gap = daysBetween(anchors[index - 1], anchors[index]);
    if (gap >= MIN_CYCLE_GAP_DAYS && gap <= MAX_CYCLE_LENGTH) {
      gaps.push(gap);
    }
  }

  const sortedStarts = [...new Set(periodLogs.map((log) => log.startDate))].sort(
    (a, b) => a.localeCompare(b),
  );
  if (sortedStarts.length >= 2) {
    const latestStart = sortedStarts[sortedStarts.length - 1];
    const previousStart = sortedStarts[sortedStarts.length - 2];
    const recentGap = daysBetween(previousStart, latestStart);
    const latestLog = periodLogs.find((log) => log.startDate === latestStart);

    if (
      latestLog &&
      isRecentPeriodLog(latestLog, referenceDate) &&
      recentGap >= MIN_RECENT_CYCLE_GAP_DAYS &&
      recentGap <= MAX_CYCLE_LENGTH &&
      !gaps.includes(recentGap)
    ) {
      gaps.push(recentGap);
    }
  }

  if (gaps.length === 0) {
    return clampCycleLength(fallback);
  }

  return clampCycleLength(
    gaps.reduce((total, gap) => total + gap, 0) / gaps.length,
  );
}

export function calculateAveragePeriodLength(
  periodLogs: PeriodLog[],
  fallback: number,
  cycleLength = clampCycleLength(fallback),
  referenceDate: string = todayDateKey(),
): number {
  const durations: number[] = [];

  for (const log of periodLogs) {
    const duration = getLoggedPeriodDuration(log, referenceDate);
    if (
      duration !== null &&
      duration >= MIN_PERIOD_LENGTH &&
      duration <= MAX_PERIOD_LENGTH
    ) {
      durations.push(duration);
    }
  }

  if (durations.length === 0) {
    return clampPeriodLength(fallback, cycleLength);
  }

  return clampPeriodLength(
    durations.reduce((total, duration) => total + duration, 0) /
      durations.length,
    cycleLength,
  );
}

export function isDateInPeriodLog(
  dateKey: string,
  log: PeriodLog,
  referenceDate: string = todayDateKey(),
): boolean {
  if (dateKey < log.startDate) {
    return false;
  }

  const effectiveEnd = log.endDate ?? referenceDate;
  return dateKey <= effectiveEnd;
}

export function isDateInAnyPeriodLog(
  dateKey: string,
  periodLogs: PeriodLog[],
): boolean {
  return periodLogs.some((log) => isDateInPeriodLog(dateKey, log));
}

export function findCoveringPeriodLog(
  dateKey: string,
  periodLogs: PeriodLog[],
): PeriodLog | undefined {
  return periodLogs.find((log) => isDateInPeriodLog(dateKey, log));
}

export function getPeriodFlowForDate(
  dateKey: string,
  periodLogs: PeriodLog[],
): PeriodLog["flow"] | undefined {
  return findCoveringPeriodLog(dateKey, periodLogs)?.flow;
}

export function buildCycleSettingsFromPeriodLogs(
  profileCycleSettings: CycleSettings,
  periodLogs: PeriodLog[],
  referenceDate: string = todayDateKey(),
): CycleSettings {
  if (periodLogs.length === 0) {
    return normalizeCycleSettings(profileCycleSettings);
  }

  const mostRecentLog = getMostRecentPeriodLog(periodLogs);
  const mostRecentStart = mostRecentLog?.startDate ?? null;
  const averageCycleLength = calculateAverageCycleLength(
    periodLogs,
    profileCycleSettings.averageCycleLength,
    referenceDate,
  );

  let averagePeriodLength = calculateAveragePeriodLength(
    periodLogs,
    profileCycleSettings.averagePeriodLength,
    averageCycleLength,
    referenceDate,
  );

  if (mostRecentLog && isRecentPeriodLog(mostRecentLog, referenceDate)) {
    const recentDuration = getLoggedPeriodDuration(mostRecentLog, referenceDate);
    if (
      recentDuration !== null &&
      recentDuration >= MIN_PERIOD_LENGTH &&
      recentDuration <= MAX_PERIOD_LENGTH
    ) {
      averagePeriodLength = clampPeriodLength(recentDuration, averageCycleLength);
    }
  }

  return normalizeCycleSettings({
    ...profileCycleSettings,
    lastPeriodStart:
      mostRecentStart ?? profileCycleSettings.lastPeriodStart,
    averageCycleLength,
    averagePeriodLength,
  });
}

/**
 * Cycle day for a calendar date from the active period anchor for that date.
 * Uses absolute YYYY-MM-DD dates only — never weekday or grid position.
 */
export function getCycleDayForDate(
  dateKey: string,
  cycleAnchor: string,
  averageCycleLength: number,
  periodLogs: PeriodLog[] = [],
): number {
  const cycleLength = clampCycleLength(averageCycleLength);
  const anchor = getCycleAnchorForDate(
    dateKey,
    periodLogs,
    cycleAnchor,
    cycleLength,
  );
  const daysSinceAnchor = daysBetween(anchor, dateKey);

  if (daysSinceAnchor < 0) {
    return 1;
  }

  return (daysSinceAnchor % cycleLength) + 1;
}

export function getCycleDay(
  lastPeriodStart: string,
  averageCycleLength: number,
  periodLogs: PeriodLog[] = [],
): number {
  return getCycleDayForDate(
    todayDateKey(),
    lastPeriodStart,
    averageCycleLength,
    periodLogs,
  );
}

export function getCyclePhaseForDate(
  dateKey: string,
  cycleSettings: CycleSettings,
  periodLogs: PeriodLog[] = [],
): { cycleDay: number; phase: string } {
  return resolveCycleContextForDate(dateKey, cycleSettings, periodLogs);
}

/** Single source of truth for cycle day + phase on any calendar date. */
export function resolveCycleContextForDate(
  dateKey: string,
  cycleSettings: CycleSettings,
  periodLogs: PeriodLog[] = [],
): { cycleDay: number; phase: string } {
  if (!cycleSettings.cycleTrackingEnabled) {
    return { cycleDay: 0, phase: "" };
  }

  const normalized = normalizeCycleSettings(cycleSettings);
  const coveringLog = findCoveringPeriodLog(dateKey, periodLogs);

  if (coveringLog) {
    return {
      cycleDay: daysBetween(coveringLog.startDate, dateKey) + 1,
      phase: "Menstrual",
    };
  }

  const cycleLength = clampCycleLength(normalized.averageCycleLength);
  const anchor = getCycleAnchorForDate(
    dateKey,
    periodLogs,
    normalized.lastPeriodStart,
    cycleLength,
  );
  const cycleDay = getCycleDayForDate(
    dateKey,
    normalized.lastPeriodStart,
    normalized.averageCycleLength,
    periodLogs,
  );
  const menstrualLength = getMenstrualLengthForAnchor(
    anchor,
    periodLogs,
    normalized.averagePeriodLength,
    normalized.averageCycleLength,
    dateKey,
  );

  const phase = getPhaseLabel(
    cycleDay,
    normalized.averageCycleLength,
    normalized.averagePeriodLength,
    menstrualLength,
  );

  return { cycleDay, phase };
}

export function getPhaseLabel(
  cycleDay: number,
  averageCycleLength: number,
  averagePeriodLength: number,
  menstrualLengthOverride?: number,
): string {
  const cycleLength = clampCycleLength(averageCycleLength);
  const periodLength =
    menstrualLengthOverride !== undefined
      ? clampPeriodLength(menstrualLengthOverride, cycleLength)
      : clampPeriodLength(averagePeriodLength, cycleLength);

  const menstrualEnd = periodLength;
  const lutealDays = Math.min(
    14,
    Math.max(MIN_LUTEAL_DAYS, Math.round(cycleLength * 0.5) - 2),
  );
  const ovulatoryEnd = cycleLength - lutealDays;
  const ovulatoryStart = Math.max(
    menstrualEnd + 1,
    ovulatoryEnd - OVULATORY_WINDOW_DAYS + 1,
  );
  const follicularEnd = Math.max(menstrualEnd, ovulatoryStart - 1);

  if (cycleDay <= menstrualEnd) {
    return "Menstrual";
  }
  if (cycleDay <= follicularEnd) {
    return "Follicular";
  }
  if (cycleDay <= ovulatoryEnd) {
    return "Ovulatory";
  }
  return "Luteal";
}

const phaseInsightMessages: Record<string, string> = {
  Menstrual:
    "Rest and gentle nourishment can feel supportive here. Listen to what your body asks for.",
  Follicular:
    "Energy often rises in this phase. A steady rhythm with meals can feel grounding.",
  Ovulatory:
    "You may feel more social or energetic. Use this as awareness, not a prescription.",
  Luteal:
    "Energy and hunger can trend higher here. Use this as awareness, not a prescription.",
};

const phaseEnergyMessages: Record<string, string> = {
  Menstrual:
    "Hunger and energy can dip here. Gentler meals and rest may feel better than pushing hard.",
  Follicular:
    "Energy often builds in this phase. Steady meals can help you ride the rise without spikes.",
  Ovulatory:
    "You may feel more energetic here. Notice hunger cues and fuel steadily through the day.",
  Luteal:
    "Appetite and energy can shift upward here. Regular nourishment may help you feel steadier.",
};

const phaseSleepMessages: Record<string, string> = {
  Menstrual:
    "Sleep may feel lighter or more interrupted. Extra wind-down time can feel supportive.",
  Follicular:
    "Sleep often stabilizes as energy returns. Keep a calm evening rhythm when you can.",
  Ovulatory:
    "Sleep quality is often steady here. Watch for late-evening stimulation if you feel wired.",
  Luteal:
    "Sleep and cravings can shift in this phase. A consistent bedtime may feel grounding.",
};

function appendLoggingHint(message: string, hint: string): string {
  return `${message} ${hint}`;
}

export function getPhaseInsightMessage(phase: string): string {
  return phaseInsightMessages[phase] ?? phaseInsightMessages.Follicular;
}

export function getPhaseEnergyInsightMessage(phase: string): string {
  return phaseEnergyMessages[phase] ?? phaseEnergyMessages.Follicular;
}

export function getPhaseSleepInsightMessage(phase: string): string {
  return phaseSleepMessages[phase] ?? phaseSleepMessages.Follicular;
}

export function buildCycleContextDisplay(
  cycleSettings: CycleSettings,
  periodLogs: PeriodLog[] = [],
): CycleContextDisplay {
  if (!cycleSettings.cycleTrackingEnabled) {
    return {
      phaseLabel: "Cycle tracking off",
      cycleDay: null,
      cycleDayLabel: "",
      insightTitle: "Cycle awareness",
      insightMessage:
        "Turn on cycle tracking in Profile to see phase-aware context here.",
    };
  }

  const normalized = normalizeCycleSettings(cycleSettings);
  const today = todayDateKey();
  const { cycleDay, phase } = resolveCycleContextForDate(
    today,
    normalized,
    periodLogs,
  );

  return {
    phaseLabel: `${phase} phase`,
    cycleDay,
    cycleDayLabel: `Cycle day ${cycleDay}`,
    insightTitle: `${phase} phase insight`,
    insightMessage: getPhaseInsightMessage(phase),
  };
}

export function scoreToWellnessLabel(score?: number): string {
  if (!score) {
    return "Not logged";
  }
  if (score <= 2) {
    return "Low";
  }
  if (score === 3) {
    return "Moderate";
  }
  if (score === 4) {
    return "Good";
  }
  return "High";
}

function getLastNDates(count: number): string[] {
  const dates: string[] = [];
  const cursor = parseDateAtNoon(todayDateKey());

  for (let index = count - 1; index >= 0; index -= 1) {
    const date = new Date(cursor);
    date.setDate(cursor.getDate() - index);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    dates.push(`${year}-${month}-${day}`);
  }

  return dates;
}

function formatShortDay(dateKey: string): string {
  return parseDateAtNoon(dateKey).toLocaleDateString("en-US", {
    weekday: "short",
  });
}

function formatFullDay(dateKey: string): string {
  return parseDateAtNoon(dateKey).toLocaleDateString("en-US", {
    weekday: "long",
  });
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

export function buildWeeklyNetDays(
  foodLogs: Record<string, DailyFoodEntry[]>,
  activityLogs: Record<string, DailyActivityEntry[]>,
  dailyCheckIns: Record<string, DailyCheckIn>,
  profile?: AppProfile,
): WeeklyNetDay[] {
  return getLastNDates(7).map((dateKey) => {
    const foods = foodLogs[dateKey] ?? [];
    const activities = activityLogs[dateKey] ?? [];
    const checkIn = dailyCheckIns[dateKey]
      ? normalizeDailyCheckIn(dailyCheckIns[dateKey])
      : undefined;
    const eaten = sumFoodCalories(foods);
    const burned = sumActivityCalories(activities);
    const target = profile
      ? getCalorieTargetForProfileDate(profile, dateKey)
      : 0;

    const moodEntry =
      checkIn?.symptoms.stress ?? checkIn?.symptoms.sadness ?? checkIn?.symptoms.anxiety;
    const energyEntry = checkIn?.symptoms.energy;
    const hungerEntry = checkIn?.symptoms.appetite;

    return {
      day: formatShortDay(dateKey),
      dayFull: formatFullDay(dateKey),
      dateKey,
      eaten,
      burned,
      net: eaten - burned,
      target,
      mood: moodEntry
        ? formatSymptomSelection("stress", moodEntry.selection)
        : "Not logged",
      energy: energyEntry
        ? formatSymptomSelection("energy", energyEntry.selection)
        : "Not logged",
      hunger: hungerEntry
        ? formatSymptomSelection("appetite", hungerEntry.selection)
        : "Not logged",
    };
  });
}

export function countLoggedDays(
  foodLogs: Record<string, DailyFoodEntry[]>,
  activityLogs: Record<string, DailyActivityEntry[]>,
  dailyCheckIns: Record<string, DailyCheckIn>,
): number {
  const dateKeys = new Set([
    ...Object.keys(foodLogs),
    ...Object.keys(activityLogs),
    ...Object.keys(dailyCheckIns),
  ]);

  return [...dateKeys].filter((dateKey) => {
    const hasFood = (foodLogs[dateKey] ?? []).length > 0;
    const hasActivity = (activityLogs[dateKey] ?? []).length > 0;
    const checkIn = dailyCheckIns[dateKey];
    const hasCheckIn =
      checkIn !== undefined && hasCheckInContent(normalizeDailyCheckIn(checkIn));
    return hasFood || hasActivity || hasCheckIn;
  }).length;
}

export function buildBodyPatternMetrics(
  dailyCheckIns: Record<string, DailyCheckIn>,
): BodyPatternMetric[] {
  const recentDates = getLastNDates(7);
  const checkIns = recentDates
    .map((dateKey) => dailyCheckIns[dateKey])
    .filter((checkIn): checkIn is DailyCheckIn => checkIn !== undefined)
    .map((checkIn) => normalizeDailyCheckIn(checkIn));

  if (checkIns.length === 0) {
    return [];
  }

  function averageSymptomScore(key: SymptomKey): number | null {
    const scores = checkIns
      .map((checkIn) => checkIn.symptoms[key]?.selection)
      .filter((selection): selection is string => Boolean(selection))
      .map((selection) => selectionToMetricScore(key, selection))
      .filter((score): score is number => score !== null);

    if (scores.length === 0) {
      return null;
    }

    const total = scores.reduce((sum, score) => sum + score, 0);
    return Math.round((total / scores.length) * 10) / 10;
  }

  const metricDefs: {
    label: string;
    key: SymptomKey;
    colorKey: BodyPatternMetric["colorKey"];
  }[] = [
    { label: "Stress", key: "stress", colorKey: "gold" },
    { label: "Energy", key: "energy", colorKey: "sage" },
    { label: "Appetite", key: "appetite", colorKey: "terracotta" },
    { label: "Sleep", key: "sleepQuality", colorKey: "blue" },
    { label: "Anxiety", key: "anxiety", colorKey: "gold" },
  ];

  return metricDefs
    .map(({ label, key, colorKey }) => {
      const value = averageSymptomScore(key);
      if (value === null) {
        return null;
      }
      return { label, value, colorKey };
    })
    .filter((metric): metric is BodyPatternMetric => metric !== null);
}

export function buildWeeklyTakeaway(
  weeklyDays: WeeklyNetDay[],
  fallbackTarget: number,
): string {
  const daysWithNet = weeklyDays.filter((day) => day.eaten > 0 || day.burned > 0);
  if (daysWithNet.length === 0) {
    return "Log a few days to see how your net calories compare with your target.";
  }

  const statusForDay = (day: WeeklyNetDay) =>
    getCalorieTargetStatus({
      eaten: day.eaten,
      burned: day.burned,
      target: day.target || fallbackTarget,
      netCalories: day.net,
    });

  const belowTargetCount = daysWithNet.filter(
    (day) => statusForDay(day) === "under",
  ).length;
  const aboveTargetCount = daysWithNet.filter(
    (day) => statusForDay(day) === "over",
  ).length;
  const nearTargetCount = daysWithNet.filter(
    (day) => statusForDay(day) === "near",
  ).length;

  if (
    nearTargetCount >= belowTargetCount &&
    nearTargetCount >= aboveTargetCount
  ) {
    return "Your net calories stayed close to your target this week.";
  }
  if (belowTargetCount > aboveTargetCount) {
    return "You were below your target most days this week.";
  }
  if (aboveTargetCount > belowTargetCount) {
    return "You were above your target most days this week.";
  }
  return "Your net calories stayed close to your target this week.";
}

export function buildPatternInsightCards(
  loggedDaysCount: number,
  _checkInDaysCount: number,
  cycleSettings?: CycleSettings,
  periodLogs: PeriodLog[] = [],
  referenceDate: string = todayDateKey(),
): PatternInsightCardData[] {
  if (!cycleSettings?.cycleTrackingEnabled) {
    return [];
  }

  const cycleEnabled = cycleSettings.cycleTrackingEnabled;
  const normalized = cycleSettings
    ? normalizeCycleSettings(cycleSettings)
    : null;
  const { phase, cycleDay } =
    cycleEnabled && normalized
      ? resolveCycleContextForDate(referenceDate, normalized, periodLogs)
      : { phase: "", cycleDay: 0 };

  const cycleTitle =
    cycleEnabled && phase ? `${phase} phase insight` : "Cycle context";
  const cycleBase =
    cycleEnabled && phase
      ? getPhaseInsightMessage(phase)
      : "Turn on cycle tracking in Profile to see phase-aware context here.";

  const cycleMessage =
    !cycleEnabled
      ? cycleBase
      : loggedDaysCount >= 7
        ? appendLoggingHint(
            cycleBase,
            cycleDay
              ? `You are on cycle day ${cycleDay} for this view.`
              : "You have a full week of local logs to review alongside your cycle phase.",
          )
        : appendLoggingHint(
            cycleBase,
            cycleDay
              ? `Cycle day ${cycleDay} here — log 7 days to compare trends across your cycle.`
              : "Log 7 days to compare trends across your cycle.",
          );

  return [
    {
      title: cycleTitle,
      message: cycleMessage,
      accent: "blue",
      icon: cycleEnabled && phase ? "✿" : undefined,
    },
  ];
}

export function loadLegacyStorageSnapshot(): {
  profile?: AppProfile;
  foodLogs?: Record<string, DailyFoodEntry[]>;
  activityLogs?: Record<string, DailyActivityEntry[]>;
  dailyCheckIns?: Record<string, DailyCheckIn>;
} | null {
  if (typeof window === "undefined") {
    return null;
  }

  const snapshot: {
    profile?: AppProfile;
    foodLogs?: Record<string, DailyFoodEntry[]>;
    activityLogs?: Record<string, DailyActivityEntry[]>;
    dailyCheckIns?: Record<string, DailyCheckIn>;
  } = {};

  try {
    const profileRaw = localStorage.getItem(LEGACY_PROFILE_KEY);
    if (profileRaw) {
      snapshot.profile = JSON.parse(profileRaw) as AppProfile;
    }
  } catch {
    // ignore invalid legacy profile
  }

  try {
    const dailyLogRaw = localStorage.getItem(LEGACY_DAILY_LOG_KEY);
    if (dailyLogRaw) {
      const parsed = JSON.parse(dailyLogRaw) as {
        date: string;
        foods: DailyFoodEntry[];
        activities: DailyActivityEntry[];
      };
      if (parsed.date) {
        snapshot.foodLogs = { [parsed.date]: parsed.foods ?? [] };
        snapshot.activityLogs = { [parsed.date]: parsed.activities ?? [] };
      }
    }
  } catch {
    // ignore invalid legacy daily log
  }

  try {
    const checkInRaw = localStorage.getItem(LEGACY_CHECK_IN_KEY);
    if (checkInRaw) {
      const parsed = JSON.parse(checkInRaw) as {
        date: string;
        checkIn: DailyCheckIn;
      };
      if (parsed.date && parsed.checkIn) {
        snapshot.dailyCheckIns = { [parsed.date]: parsed.checkIn };
      }
    }
  } catch {
    // ignore invalid legacy check-in
  }

  if (
    !snapshot.profile &&
    !snapshot.foodLogs &&
    !snapshot.activityLogs &&
    !snapshot.dailyCheckIns
  ) {
    return null;
  }

  return snapshot;
}

export function applyTrackingPreferencesToState(
  state: Pick<AppState, "profile" | "cycleSettings" | "trackingPreferences">,
  trackingPreferences: TrackingPreferences,
): Pick<AppState, "trackingPreferences" | "cycleSettings" | "profile"> {
  const cycleSettings = {
    ...state.cycleSettings,
    cycleTrackingEnabled: trackingPreferences.cycleTrackingEnabled,
  };

  return {
    trackingPreferences,
    cycleSettings,
    profile: applyCycleSettingsToProfile(state.profile, cycleSettings),
  };
}

export function formatWeightLogTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export interface AppState {
  version: number;
  profile: AppProfile;
  trackingPreferences: TrackingPreferences;
  foodLogs: Record<string, DailyFoodEntry[]>;
  activityLogs: Record<string, DailyActivityEntry[]>;
  dailyCheckIns: Record<string, DailyCheckIn>;
  progressJournal: Record<string, ProgressJournalEntry>;
  periodLogs: PeriodLog[];
  cycleSettings: CycleSettings;
  /** Per-date note overrides for insights day detail (YYYY-MM-DD → note text). */
  insightsDayNotes: Record<string, string>;
}
