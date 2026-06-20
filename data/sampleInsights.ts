import type {
  BodyPatternCalendarDay,
  BodyPatternMetric,
  PatternInsightCardData,
} from "../types/wellness";

/** Copy strings for the weekly net calories chart UI. */
export const sampleWeeklyNetCopy = {
  tapHint: "Tap a day to see details.",
  netNote: "Net = eaten - burned.",
  footerMessage:
    "Daily changes are normal. Look for weekly patterns, not perfect days.",
};

const SAMPLE_CYCLE = {
  lastPeriodStart: "2026-05-28",
  cycleLength: 28,
  periodLength: 5,
};

function parseDateAtNoon(value: string): Date {
  return new Date(`${value}T12:00:00`);
}

function getCycleDay(dateKey: string): number {
  const start = parseDateAtNoon(SAMPLE_CYCLE.lastPeriodStart);
  const current = parseDateAtNoon(dateKey);
  const diffDays = Math.floor(
    (current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays < 0) {
    return 1;
  }
  return (diffDays % SAMPLE_CYCLE.cycleLength) + 1;
}

function getPhase(cycleDay: number): string {
  const { periodLength, cycleLength } = SAMPLE_CYCLE;
  const follicularEnd = Math.max(periodLength + 1, Math.round(cycleLength * 0.46));
  const ovulatoryEnd = Math.max(follicularEnd + 1, Math.round(cycleLength * 0.57));

  if (cycleDay <= periodLength) return "Menstrual";
  if (cycleDay <= follicularEnd) return "Follicular";
  if (cycleDay <= ovulatoryEnd) return "Ovulatory";
  return "Luteal";
}

function buildSampleEntry(
  dateKey: string,
  partial: Omit<BodyPatternCalendarDay, "dateKey" | "cycleDay" | "phase">,
): BodyPatternCalendarDay {
  const cycleDay = getCycleDay(dateKey);
  const burned = partial.burned ?? 280 + (cycleDay % 5) * 20;
  const net = partial.netCalories ?? 1500;
  const eaten = partial.eaten ?? net + burned;
  const targetCalories = partial.targetCalories ?? 2000;

  return {
    dateKey,
    cycleDay,
    phase: getPhase(cycleDay),
    ...partial,
    eaten,
    burned,
    targetCalories,
    netCalories: net,
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

export function getSampleBodyPatternEntry(dateKey: string): BodyPatternCalendarDay {
  return (
    sampleBodyPatternMonthEntries[dateKey] ??
    buildSampleEntry(dateKey, {
      checkInCompleted: false,
      mood: 3,
      energy: 3,
      hunger: 3,
      cravings: "none",
      sleepQuality: 3,
      stress: 3,
    })
  );
}

export const sampleBodyPatternCalendarDefaults = {
  initialYear: 2026,
  initialMonth: 5,
  initialSelectedDate: "2026-06-17",
};

export const sampleBodyPatternCalendarCopy = {
  subtitle: "See how your check-ins line up with your cycle.",
  tapHint: "Hover a date for a quick preview. Tap to open the full day snapshot.",
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
