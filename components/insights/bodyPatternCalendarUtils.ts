import type { BodyPatternCalendarDay } from "../../types/wellness";
import { CHECK_IN_SCALE_WORDS } from "../../types/wellness";

export const PHASE_COLORS = {
  menstrual: "#FAD4D4",
  follicular: "#EEF4ED",
  ovulatory: "#F7E6D5",
  luteal: "#ECE7F5",
  none: "#FFFDFB",
};

export const CALENDAR_COLORS = {
  card: "#FFFFFF",
  cell: "#FFFDFB",
  selectedBg: "#FFF7F3",
  border: "#E6D7CB",
  selectedBorder: "#B97663",
  text: "#3C2B24",
  secondary: "#7D7068",
  blush: "#E8C2B6",
  terracotta: "#B97663",
  terracottaDark: "#744336",
  sage: "#7E9A7C",
  white: "#FFFFFF",
};

export const scaleWords = [...CHECK_IN_SCALE_WORDS];

export function phaseBackgroundColor(phase: string): string {
  const normalized = phase.toLowerCase();
  if (normalized.includes("menstrual")) return PHASE_COLORS.menstrual;
  if (normalized.includes("follicular")) return PHASE_COLORS.follicular;
  if (normalized.includes("ovulatory")) return PHASE_COLORS.ovulatory;
  if (normalized.includes("luteal")) return PHASE_COLORS.luteal;
  return PHASE_COLORS.none;
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

export function formatShortDate(dateKey: string): string {
  return parseDateAtNoon(dateKey).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function toDateKey(year: number, month: number, day: number): string {
  const monthLabel = String(month + 1).padStart(2, "0");
  const dayLabel = String(day).padStart(2, "0");
  return `${year}-${monthLabel}-${dayLabel}`;
}

export function getTodayDateKey(): string {
  const now = new Date();
  return toDateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

export function isValidDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const parsed = parseDateAtNoon(value);
  return !Number.isNaN(parsed.getTime());
}

export function formatKcal(value: number): string {
  return value.toLocaleString("en-US");
}

export function moodLabel(entry: BodyPatternCalendarDay): string {
  return scaleWords[entry.mood - 1];
}

export function energyLabel(entry: BodyPatternCalendarDay): string {
  return scaleWords[entry.energy - 1];
}

export const SAMPLE_TARGET_CALORIES = 2000;

export const INSIGHTS_SELECTED_DATE_KEY = "calorie-track-app:insights-selected-date";

export interface DayEnergyStats {
  net: number;
  eaten: number;
  burned: number;
  target: number;
}

export function resolveDayEnergyStats(
  entry: BodyPatternCalendarDay,
): DayEnergyStats {
  const target = entry.targetCalories ?? SAMPLE_TARGET_CALORIES;
  const burned = entry.burned ?? 280 + (entry.cycleDay % 5) * 20;
  const net = entry.netCalories ?? target - 500;
  const eaten = entry.eaten ?? net + burned;

  return { net, eaten, burned, target };
}
