import type { DailyCheckIn } from "../../types";
import { migrateLegacyDailyCheckIn } from "../../lib/checkInHelpers";
import type {
  BodyPatternActivityItem,
  BodyPatternCalendarDay,
  MacroSummary,
} from "../../types/wellness";
import { CHECK_IN_SCALE_WORDS } from "../../types/wellness";
import type { MacroTargets } from "../../types/profile";
import { buildMacroSummaryFromFoods } from "../../lib/calories";
import {
  getCalorieTargetStatus,
  type CalorieTargetStatus,
} from "../../lib/calorieTargetStatus";
import { routes } from "../../lib/routes";
import { macroColors } from "../../data/sampleDashboard";

export type PhaseKind =
  | "menstrual"
  | "follicular"
  | "ovulatory"
  | "luteal"
  | "none";

export const PHASE_THEME: Record<
  PhaseKind,
  {
    bg: string;
    accent: string;
    todayOutline: string;
    todayRing: string;
    shortLabel: string;
    legendLabel: string;
  }
> = {
  menstrual: {
    bg: "#FBEDEA",
    accent: "#8F4E43",
    todayOutline: "#E4B8AE",
    todayRing: "#F0D0C8",
    shortLabel: "Men",
    legendLabel: "Menstrual",
  },
  follicular: {
    bg: "#F8F1E8",
    accent: "#7B684E",
    todayOutline: "#DFCDB5",
    todayRing: "#EBDFCB",
    shortLabel: "Fol",
    legendLabel: "Follicular",
  },
  ovulatory: {
    bg: "#EEF4ED",
    accent: "#6F8E6D",
    todayOutline: "#C8DBC4",
    todayRing: "#D8E9D4",
    shortLabel: "Ovu",
    legendLabel: "Ovulatory",
  },
  luteal: {
    bg: "#FFF4DD",
    accent: "#8A6B35",
    todayOutline: "#EDD9A8",
    todayRing: "#F5E8C4",
    shortLabel: "Lut",
    legendLabel: "Luteal",
  },
  none: {
    bg: "#FFFDFB",
    accent: "#7D7068",
    todayOutline: "#DDD4CC",
    todayRing: "#EBE4DD",
    shortLabel: "",
    legendLabel: "",
  },
};

export const CALENDAR_COLORS = {
  pageBg: "#FBFAF7",
  card: "#FFFFFF",
  border: "#E6D7CB",
  blush: "#E8C2B6",
  text: "#3C2B24",
  secondary: "#7D7068",
  terracotta: "#B97663",
  terracottaDark: "#744336",
  sage: "#7E9A7C",
  snapshotBg: "#FFFDFB",
  white: "#FFFFFF",
  navBg: "#FFFDFB",
};

export const scaleWords = [...CHECK_IN_SCALE_WORDS];

export const SAMPLE_TARGET_CALORIES = 2000;

export function getPhaseKind(phase: string): PhaseKind {
  const normalized = phase.toLowerCase();
  if (normalized.includes("menstrual")) return "menstrual";
  if (normalized.includes("follicular")) return "follicular";
  if (normalized.includes("ovulatory")) return "ovulatory";
  if (normalized.includes("luteal")) return "luteal";
  return "none";
}

export function phaseAccent(phase: string): string {
  return PHASE_THEME[getPhaseKind(phase)].accent;
}

export function phaseTodayOutline(phase: string): string {
  return PHASE_THEME[getPhaseKind(phase)].todayOutline;
}

export function phaseTodayRing(phase: string): string {
  return PHASE_THEME[getPhaseKind(phase)].todayRing;
}

export const INSIGHTS_DAY_PATH_PREFIX = "/insights/day";

export function insightsDayPath(dateKey: string): string {
  return routes.insightDay(dateKey);
}

export function parseDateAtNoon(value: string): Date {
  return new Date(`${value}T12:00:00`);
}

export function formatFullDate(dateKey: string): string {
  return parseDateAtNoon(dateKey).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRecapDate(dateKey: string): string {
  return parseDateAtNoon(dateKey).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function getTodayDateKey(): string {
  const now = new Date();
  return toDateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

export function isValidDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(parseDateAtNoon(value).getTime());
}

export function formatKcal(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatActivityDetailLine(activity: BodyPatternActivityItem): string {
  const parts = [
    `${activity.durationMinutes} min`,
    `${formatKcal(activity.calories)} kcal`,
  ];
  if (activity.intensity) {
    parts.push(activity.intensity);
  }
  return parts.join(" · ");
}

export function moodLabel(entry: BodyPatternCalendarDay): string {
  return scaleWords[entry.mood - 1];
}

export function energyLabel(entry: BodyPatternCalendarDay): string {
  return scaleWords[entry.energy - 1];
}

export interface DayEnergyStats {
  net: number;
  eaten: number;
  burned: number;
  target: number;
  remaining: number;
  status: CalorieTargetStatus;
}

export function resolveEmptyDayEnergyStats(
  calorieTarget: number = SAMPLE_TARGET_CALORIES,
): DayEnergyStats {
  return {
    net: 0,
    eaten: 0,
    burned: 0,
    target: calorieTarget,
    remaining: calorieTarget,
    status: getCalorieTargetStatus({ target: calorieTarget }),
  };
}

export function resolveDayEnergyStats(
  entry: BodyPatternCalendarDay,
  calorieTarget: number = SAMPLE_TARGET_CALORIES,
): DayEnergyStats {
  const target = calorieTarget;
  const burned = entry.burned ?? 0;
  const net = entry.netCalories ?? (entry.eaten ?? 0) - burned;
  const eaten = entry.eaten ?? (net || burned ? net + burned : 0);
  const remaining = target - net;
  const status = getCalorieTargetStatus({
    eaten,
    burned,
    target,
    netCalories: net,
  });
  return { net, eaten, burned, target, remaining, status };
}

export function resolveDayMacroSummary(
  entry: BodyPatternCalendarDay | null,
  macroTargets: MacroTargets = {
    protein: 98,
    carbs: 285,
    fat: 57,
    fiber: 25,
  },
): MacroSummary[] {
  if (!entry) {
    return buildMacroSummaryFromFoods([], macroTargets, macroColors);
  }

  return buildMacroSummaryFromFoods(
    [
      {
        protein: entry.protein ?? 0,
        carbs: entry.carbs ?? 0,
        fat: entry.fat ?? 0,
        fiber: entry.fiber ?? 0,
      },
    ],
    macroTargets,
    macroColors,
  );
}

export function bodyPatternEntryToDailyCheckIn(
  entry: BodyPatternCalendarDay,
): DailyCheckIn {
  return migrateLegacyDailyCheckIn({
    mood: entry.mood,
    energy: entry.energy,
    hunger: entry.hunger,
    sleepQuality: entry.sleepQuality,
    stress: entry.stress,
    cravings: entry.cravings,
    bloating: entry.bloating ?? "none",
    soreness: entry.soreness ?? "none",
    notes: entry.notes,
  });
}

export function buildMonthGrid(year: number, month: number) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: ({ dateKey: string; dayOfMonth: number } | null)[] = [];

  for (let index = 0; index < firstWeekday; index += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ dateKey: toDateKey(year, month, day), dayOfMonth: day });
  }
  return cells;
}

export interface MonthGridCell {
  dateKey: string;
  dayOfMonth: number;
}

export function chunkMonthGridIntoWeeks(
  cells: (MonthGridCell | null)[],
): (MonthGridCell | null)[][] {
  const weeks: (MonthGridCell | null)[][] = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }
  return weeks;
}

export interface PhaseBandSegment {
  rowIndex: number;
  colStart: number;
  colEnd: number;
  phase: PhaseKind;
}

export function buildPhaseBandSegments(
  cells: (MonthGridCell | null)[],
  getPhase: (dateKey: string) => string,
): PhaseBandSegment[] {
  const weeks = chunkMonthGridIntoWeeks(cells);
  const segments: PhaseBandSegment[] = [];

  weeks.forEach((week, rowIndex) => {
    let col = 0;
    while (col < week.length) {
      const cell = week[col];
      if (!cell) {
        col += 1;
        continue;
      }

      const phase = getPhaseKind(getPhase(cell.dateKey));
      if (phase === "none") {
        col += 1;
        continue;
      }

      let end = col;
      while (end + 1 < week.length) {
        const next = week[end + 1];
        if (!next || getPhaseKind(getPhase(next.dateKey)) !== phase) break;
        end += 1;
      }

      segments.push({ rowIndex, colStart: col, colEnd: end, phase });
      col = end + 1;
    }
  });

  return segments;
}

export function formatMonthTitle(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export type NutritionDayStatus = CalorieTargetStatus;

export const NUTRITION_STATUS_COLORS: Record<NutritionDayStatus, string> = {
  under: "#EEF4ED",
  near: "#F7EFE8",
  over: "#FFF7F3",
  noData: "#FFFDFB",
};

export const NUTRITION_STATUS_LABELS: Record<NutritionDayStatus, string> = {
  under: "Under target",
  near: "Near target",
  over: "Over target",
  noData: "No log",
};

export function resolveNutritionDayStatus(
  entry: BodyPatternCalendarDay | null,
  calorieTarget: number,
): NutritionDayStatus {
  if (!entry) {
    return getCalorieTargetStatus({ target: calorieTarget });
  }

  return getCalorieTargetStatus({
    eaten: entry.eaten,
    burned: entry.burned,
    target: calorieTarget,
    netCalories: entry.netCalories,
  });
}
