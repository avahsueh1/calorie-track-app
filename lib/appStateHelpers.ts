import type { DailyCheckIn } from "../types";
import type { AppProfile } from "../types/profile";
import type {
  BodyPatternMetric,
  CycleContextDisplay,
  CycleSettings,
  DailyActivityEntry,
  DailyFoodEntry,
  PatternInsightCardData,
  WeeklyNetDay,
  WeightLogEntry,
} from "../types/wellness";

export const APP_STATE_STORAGE_KEY = "calorie-track-app:app-state";
export const APP_STATE_VERSION = 1;

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

export function getCycleDay(
  lastPeriodStart: string,
  averageCycleLength: number,
): number {
  const start = parseDateAtNoon(lastPeriodStart);
  const today = parseDateAtNoon(todayDateKey());
  const diffDays = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0 || averageCycleLength <= 0) {
    return 1;
  }

  return (diffDays % averageCycleLength) + 1;
}

export function getPhaseLabel(
  cycleDay: number,
  averageCycleLength: number,
  averagePeriodLength: number,
): string {
  const menstrualEnd = Math.max(1, averagePeriodLength);
  const follicularEnd = Math.max(
    menstrualEnd + 1,
    Math.round(averageCycleLength * 0.46),
  );
  const ovulatoryEnd = Math.max(
    follicularEnd + 1,
    Math.round(averageCycleLength * 0.57),
  );

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

export function buildCycleContextDisplay(
  cycleSettings: CycleSettings,
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

  const cycleDay = getCycleDay(
    cycleSettings.lastPeriodStart,
    cycleSettings.averageCycleLength,
  );
  const phase = getPhaseLabel(
    cycleDay,
    cycleSettings.averageCycleLength,
    cycleSettings.averagePeriodLength,
  );

  return {
    phaseLabel: `${phase} phase`,
    cycleDay,
    cycleDayLabel: `Cycle day ${cycleDay}`,
    insightTitle: `${phase} phase insight`,
    insightMessage: phaseInsightMessages[phase],
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
): WeeklyNetDay[] {
  return getLastNDates(7).map((dateKey) => {
    const foods = foodLogs[dateKey] ?? [];
    const activities = activityLogs[dateKey] ?? [];
    const checkIn = dailyCheckIns[dateKey];
    const eaten = sumFoodCalories(foods);
    const burned = sumActivityCalories(activities);

    return {
      day: formatShortDay(dateKey),
      dayFull: formatFullDay(dateKey),
      eaten,
      burned,
      net: eaten - burned,
      mood: scoreToWellnessLabel(checkIn?.mood),
      energy: scoreToWellnessLabel(checkIn?.energy),
      hunger: scoreToWellnessLabel(checkIn?.hunger),
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
    const hasCheckIn = dailyCheckIns[dateKey] !== undefined;
    return hasFood || hasActivity || hasCheckIn;
  }).length;
}

export function buildBodyPatternMetrics(
  dailyCheckIns: Record<string, DailyCheckIn>,
): BodyPatternMetric[] {
  const recentDates = getLastNDates(7);
  const checkIns = recentDates
    .map((dateKey) => dailyCheckIns[dateKey])
    .filter((checkIn): checkIn is DailyCheckIn => checkIn !== undefined);

  if (checkIns.length === 0) {
    return [];
  }

  function averageScore(selector: (checkIn: DailyCheckIn) => number): number {
    const total = checkIns.reduce((sum, checkIn) => sum + selector(checkIn), 0);
    return Math.round((total / checkIns.length) * 10) / 10;
  }

  return [
    {
      label: "Mood",
      value: averageScore((checkIn) => checkIn.mood),
      colorKey: "sage",
    },
    {
      label: "Energy",
      value: averageScore((checkIn) => checkIn.energy),
      colorKey: "sage",
    },
    {
      label: "Hunger",
      value: averageScore((checkIn) => checkIn.hunger),
      colorKey: "terracotta",
    },
    {
      label: "Sleep",
      value: averageScore((checkIn) => checkIn.sleepQuality),
      colorKey: "blue",
    },
    {
      label: "Stress",
      value: averageScore((checkIn) => checkIn.stress),
      colorKey: "gold",
    },
  ];
}

export function buildWeeklyTakeaway(
  weeklyDays: WeeklyNetDay[],
  tdeeTarget: number,
): string {
  const daysWithNet = weeklyDays.filter((day) => day.eaten > 0 || day.burned > 0);
  if (daysWithNet.length === 0) {
    return "Log a few days to see how your net calories compare with your target.";
  }

  const belowTargetCount = daysWithNet.filter((day) => day.net < tdeeTarget).length;
  const aboveTargetCount = daysWithNet.filter((day) => day.net > tdeeTarget).length;

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
  checkInDaysCount: number,
): PatternInsightCardData[] {
  if (loggedDaysCount < 3) {
    return [
      {
        title: "Weekly patterns",
        message: "Log more days to unlock stronger patterns.",
        accent: "cream",
      },
      {
        title: "Energy & hunger",
        message:
          "Add food, activity, and check-ins across the week to compare how you felt.",
        accent: "lavender",
      },
      {
        title: "Cycle context",
        message:
          "Cycle-aware insights will deepen as more days are logged locally.",
        accent: "blue",
      },
    ];
  }

  return [
    {
      title: "Energy & hunger",
      message:
        checkInDaysCount >= 3
          ? "Check-in averages above reflect your logged week so far."
          : "Add a few more check-ins to compare energy and hunger with nourishment.",
      accent: "cream",
    },
    {
      title: "Sleep & cravings",
      message:
        loggedDaysCount >= 5
          ? "Your weekly logs are building a clearer picture of sleep and cravings."
          : "Keep logging this week to see sleep and craving patterns emerge.",
      accent: "lavender",
    },
    {
      title: "Cycle context",
      message:
        loggedDaysCount >= 7
          ? "You have a full week of local logs to review alongside your cycle phase."
          : "Log 7 days to compare trends across your cycle.",
      accent: "blue",
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

export function formatWeightLogTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export interface AppState {
  version: number;
  profile: AppProfile;
  foodLogs: Record<string, DailyFoodEntry[]>;
  activityLogs: Record<string, DailyActivityEntry[]>;
  dailyCheckIns: Record<string, DailyCheckIn>;
  weightLogs: WeightLogEntry[];
  cycleSettings: CycleSettings;
}
