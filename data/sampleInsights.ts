import type { DailyCheckIn } from "../types";
import type {
  BodyPatternCalendarDay,
  BodyPatternMetric,
  CravingLevel,
  CycleSettings,
  DailyActivityEntry,
  DailyFoodEntry,
  PatternInsightCardData,
  PeriodLog,
} from "../types/wellness";
import { getCyclePhaseForDate, resolveCycleContextForDate } from "../lib/appStateHelpers";

/** Copy strings for the weekly net calories chart UI. */
export const sampleWeeklyNetCopy = {
  tapHint: "Hover a day for a quick summary. Tap to pin details below.",
  netNote: "Net = eaten - burned.",
  footerMessage:
    "Daily changes are normal. Look for weekly patterns, not perfect days.",
};

/** Cycle settings for sample month data — mirrors defaultAppProfile cycle fields. */
export const sampleCycleSettings: CycleSettings = {
  cycleTrackingEnabled: true,
  lifeStage: "regular_cycle",
  lastPeriodStart: "2026-05-28",
  averageCycleLength: 28,
  averagePeriodLength: 5,
};

function getSampleCyclePhase(dateKey: string) {
  return getCyclePhaseForDate(dateKey, sampleCycleSettings);
}

function deriveSampleMacros(eaten: number) {
  return {
    protein: Math.max(0, Math.round((eaten * 0.28) / 4)),
    carbs: Math.max(0, Math.round((eaten * 0.42) / 4)),
    fat: Math.max(0, Math.round((eaten * 0.3) / 9)),
    fiber: Math.max(0, Math.round(eaten / 120)),
  };
}

function buildSampleEntry(
  dateKey: string,
  partial: Omit<BodyPatternCalendarDay, "dateKey" | "cycleDay" | "phase">,
): BodyPatternCalendarDay {
  const { cycleDay, phase } = getSampleCyclePhase(dateKey);
  const burned = partial.burned ?? 280 + (cycleDay % 5) * 20;
  const net = partial.netCalories ?? 1500;
  const eaten = partial.eaten ?? net + burned;
  const targetCalories = partial.targetCalories ?? 2000;
  const macros = deriveSampleMacros(eaten);

  return {
    dateKey,
    cycleDay,
    phase,
    ...partial,
    eaten,
    burned,
    targetCalories,
    netCalories: net,
    protein: partial.protein ?? macros.protein,
    carbs: partial.carbs ?? macros.carbs,
    fat: partial.fat ?? macros.fat,
    fiber: partial.fiber ?? macros.fiber,
    bloating: partial.bloating ?? "none",
    soreness: partial.soreness ?? "none",
  };
}

/** Sample month entries keyed by YYYY-MM-DD (local demo data only). */
export const sampleBodyPatternMonthEntries: Record<string, BodyPatternCalendarDay> =
  Object.fromEntries(
    [
      buildSampleEntry("2026-06-01", {
        checkInCompleted: true,
        mood: 3,
        energy: 3,
        hunger: 3,
        cravings: "none",
        sleepQuality: 3,
        stress: 2,
        netCalories: 1480,
      }),
      buildSampleEntry("2026-06-02", {
        checkInCompleted: true,
        mood: 4,
        energy: 3,
        hunger: 3,
        cravings: "mild",
        sleepQuality: 4,
        stress: 2,
        netCalories: 1520,
      }),
      buildSampleEntry("2026-06-04", {
        checkInCompleted: true,
        mood: 4,
        energy: 4,
        hunger: 3,
        cravings: "none",
        sleepQuality: 4,
        stress: 2,
        netCalories: 1610,
      }),
      buildSampleEntry("2026-06-06", {
        checkInCompleted: false,
        mood: 3,
        energy: 3,
        hunger: 3,
        cravings: "none",
        sleepQuality: 3,
        stress: 3,
        netCalories: 1390,
      }),
      buildSampleEntry("2026-06-08", {
        checkInCompleted: true,
        mood: 4,
        energy: 4,
        hunger: 3,
        cravings: "mild",
        sleepQuality: 3,
        stress: 2,
        netCalories: 1680,
        activities: [
          {
            name: "Morning yoga",
            durationMinutes: 25,
            calories: 95,
            intensity: "Gentle",
          },
        ],
      }),
      buildSampleEntry("2026-06-10", {
        checkInCompleted: true,
        mood: 4,
        energy: 3,
        hunger: 4,
        cravings: "mild",
        sleepQuality: 4,
        stress: 3,
        netCalories: 1720,
        activities: [
          {
            name: "Strength training",
            durationMinutes: 45,
            calories: 210,
            intensity: "Moderate",
          },
          {
            name: "Evening stretch",
            durationMinutes: 12,
            calories: 35,
            intensity: "Gentle",
          },
        ],
        weight: {
          value: "139.2",
          unit: "lb",
          note: "After workout",
        },
      }),
      buildSampleEntry("2026-06-12", {
        checkInCompleted: true,
        mood: 3,
        energy: 3,
        hunger: 4,
        cravings: "mild",
        sleepQuality: 3,
        stress: 3,
        netCalories: 1750,
      }),
      buildSampleEntry("2026-06-14", {
        checkInCompleted: true,
        mood: 3,
        energy: 2,
        hunger: 4,
        cravings: "strong",
        sleepQuality: 2,
        stress: 4,
        netCalories: 1580,
        weight: {
          value: "138.8",
          unit: "lb",
          note: "Morning check",
        },
      }),
      buildSampleEntry("2026-06-15", {
        checkInCompleted: true,
        mood: 3,
        energy: 3,
        hunger: 4,
        cravings: "mild",
        sleepQuality: 3,
        stress: 3,
        netCalories: 1760,
      }),
      buildSampleEntry("2026-06-16", {
        checkInCompleted: false,
        mood: 3,
        energy: 2,
        hunger: 3,
        cravings: "none",
        sleepQuality: 2,
        stress: 3,
        netCalories: 1240,
      }),
      buildSampleEntry("2026-06-17", {
        checkInCompleted: true,
        mood: 4,
        energy: 3,
        hunger: 3,
        cravings: "mild",
        sleepQuality: 4,
        stress: 2,
        netCalories: 1100,
        eaten: 1400,
        burned: 300,
        targetCalories: 2000,
        activities: [
          {
            name: "Neighborhood walk",
            durationMinutes: 32,
            calories: 145,
            intensity: "Gentle",
          },
        ],
        weight: {
          value: "138.4",
          unit: "lb",
          note: "Morning check",
        },
        notes: "",
      }),
      buildSampleEntry("2026-06-19", {
        checkInCompleted: true,
        mood: 3,
        energy: 3,
        hunger: 3,
        cravings: "strong",
        sleepQuality: 3,
        stress: 4,
        netCalories: 1330,
        eaten: 1650,
        burned: 320,
        targetCalories: 2000,
        activities: [
          {
            name: "Bike ride",
            durationMinutes: 40,
            calories: 280,
            intensity: "Moderate",
          },
        ],
        weight: {
          value: "138.6",
          unit: "lb",
        },
      }),
      buildSampleEntry("2026-06-22", {
        checkInCompleted: true,
        mood: 3,
        energy: 2,
        hunger: 4,
        cravings: "mild",
        sleepQuality: 3,
        stress: 3,
        netCalories: 1450,
      }),
      buildSampleEntry("2026-06-24", {
        checkInCompleted: true,
        mood: 4,
        energy: 3,
        hunger: 3,
        cravings: "none",
        sleepQuality: 4,
        stress: 2,
        netCalories: 1620,
      }),
      buildSampleEntry("2026-06-26", {
        checkInCompleted: true,
        mood: 3,
        energy: 3,
        hunger: 3,
        cravings: "mild",
        sleepQuality: 3,
        stress: 3,
        netCalories: 1540,
      }),
    ].map((entry) => [entry.dateKey, entry]),
  );

function createMinimalCalendarEntry(
  dateKey: string,
  partial: Pick<
    BodyPatternCalendarDay,
    "eaten" | "burned" | "netCalories" | "protein" | "carbs" | "fat" | "fiber"
  >,
): BodyPatternCalendarDay {
  return {
    dateKey,
    cycleDay: 0,
    phase: "",
    checkInCompleted: false,
    mood: 3,
    energy: 3,
    hunger: 3,
    cravings: "none" as CravingLevel,
    sleepQuality: 3,
    stress: 3,
    bloating: "none",
    soreness: "none",
    ...partial,
  };
}

/** Overlay real food/activity logs onto calendar entries for nutrition status. */
export function mergeAppLogsIntoCalendarEntries(
  entriesByDate: Record<string, BodyPatternCalendarDay>,
  foodLogs: Record<string, DailyFoodEntry[]>,
  activityLogs: Record<string, DailyActivityEntry[]>,
): Record<string, BodyPatternCalendarDay> {
  const merged = { ...entriesByDate };
  const dateKeys = new Set([
    ...Object.keys(foodLogs),
    ...Object.keys(activityLogs),
  ]);

  for (const dateKey of dateKeys) {
    const foods = foodLogs[dateKey] ?? [];
    const activities = activityLogs[dateKey] ?? [];
    const eaten = foods.reduce((sum, food) => sum + food.calories, 0);
    const burned = activities.reduce(
      (sum, activity) => sum + activity.caloriesBurned,
      0,
    );

    if (eaten === 0 && burned === 0) {
      continue;
    }

    const nutritionFields = {
      eaten,
      burned,
      netCalories: eaten - burned,
      protein: foods.reduce((sum, food) => sum + food.protein, 0),
      carbs: foods.reduce((sum, food) => sum + food.carbs, 0),
      fat: foods.reduce((sum, food) => sum + food.fat, 0),
      fiber: foods.reduce((sum, food) => sum + (food.fiber ?? 0), 0),
    };

    merged[dateKey] = merged[dateKey]
      ? { ...merged[dateKey], ...nutritionFields }
      : createMinimalCalendarEntry(dateKey, nutritionFields);
  }

  return merged;
}

export interface BodyPatternCalendarDayView {
  dateKey: string;
  cycleDay: number;
  phase: string;
  entry: BodyPatternCalendarDay | null;
}

export function resolveBodyPatternCalendarDay(
  dateKey: string,
  entriesByDate: Record<string, BodyPatternCalendarDay> = sampleBodyPatternMonthEntries,
  noteOverrides: Record<string, string> = {},
  cycleSettings: CycleSettings = sampleCycleSettings,
  periodLogs: PeriodLog[] = [],
  dailyCheckIns: Record<string, DailyCheckIn> = {},
): BodyPatternCalendarDayView {
  const { cycleDay, phase } = resolveCycleContextForDate(
    dateKey,
    cycleSettings,
    periodLogs,
  );
  const baseEntry = entriesByDate[dateKey] ?? null;
  const entry = baseEntry
    ? {
        ...baseEntry,
        cycleDay,
        phase,
        notes: resolveInsightsDayNote(
          dateKey,
          baseEntry,
          noteOverrides,
          dailyCheckIns,
        ),
      }
    : null;

  return {
    dateKey,
    cycleDay,
    phase,
    entry,
  };
}

/** Resolved note for a date: check-in note wins, then legacy override, then sample. */
export function resolveInsightsDayNote(
  dateKey: string,
  entry: BodyPatternCalendarDay | null,
  noteOverrides: Record<string, string>,
  dailyCheckIns: Record<string, DailyCheckIn> = {},
): string {
  const checkInNote = dailyCheckIns[dateKey]?.notes?.trim();
  if (checkInNote) {
    return checkInNote;
  }

  if (dateKey in noteOverrides) {
    return noteOverrides[dateKey];
  }

  return entry?.notes ?? "";
}

export function mergeInsightsDayNotes(
  entriesByDate: Record<string, BodyPatternCalendarDay>,
  noteOverrides: Record<string, string>,
  dailyCheckIns: Record<string, DailyCheckIn> = {},
): Record<string, BodyPatternCalendarDay> {
  const merged = { ...entriesByDate };

  for (const dateKey of new Set([
    ...Object.keys(merged),
    ...Object.keys(noteOverrides),
    ...Object.keys(dailyCheckIns),
  ])) {
    const note = resolveInsightsDayNote(
      dateKey,
      merged[dateKey] ?? null,
      noteOverrides,
      dailyCheckIns,
    );
    if (merged[dateKey] && note) {
      merged[dateKey] = { ...merged[dateKey], notes: note };
    }
  }

  return merged;
}

export const sampleBodyPatternCalendarDefaults = {
  initialYear: 2026,
  initialMonth: 5,
};

export const sampleBodyPatternCalendarCopy = {
  subtitle: "See how your check-ins line up with your cycle.",
  tapHint: "Tap a date to view day details.",
  nutritionSubtitle: "See how your daily intake compares with your targets.",
  nutritionTapHint: "Tap a date to view day details.",
};

export const sampleBodyPatterns: BodyPatternMetric[] = [
  { label: "Mood", value: 3.6, colorKey: "sage" },
  { label: "Energy", value: 3.1, colorKey: "sage" },
  { label: "Hunger", value: 3.8, colorKey: "terracotta" },
  { label: "Sleep", value: 3.4, colorKey: "blue" },
  { label: "Stress", value: 2.7, colorKey: "gold" },
];

export const samplePatternCards: PatternInsightCardData[] = [
  {
    title: "Energy & hunger",
    message:
      "Sample averages only. Log more days to compare energy and hunger with your cycle phase.",
    accent: "cream",
  },
  {
    title: "Sleep & cravings",
    message:
      "This is a sample weekly view until enough real check-ins exist. Patterns will appear over time.",
    accent: "lavender",
  },
  {
    title: "Cycle context",
    message:
      "Log 30 days to compare trends across your cycle. No automated pattern claims yet.",
    accent: "blue",
  },
];
