import type { ProgressJournalEntry } from "../types/wellness";
import { kgToLb } from "./profileBody";
import type { UnitsPreference } from "../types/profile";

export interface WeightChartPoint {
  date: string;
  weightKg: number;
  label: string;
}

export interface WeightTrendSummary {
  direction: "down" | "up" | "flat" | "none";
  deltaKg: number;
  deltaDisplay: string;
  message: string;
  pointCount: number;
}

function formatShortDate(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function displayDelta(deltaKg: number, units: UnitsPreference): string {
  const abs = Math.abs(deltaKg);
  if (units === "metric") {
    return `${Math.round(abs * 10) / 10} kg`;
  }
  return `${Math.round(Math.abs(kgToLb(deltaKg)))} lb`;
}

/** One point per day with a logged weight. */
export function buildWeightChartPoints(
  entries: ProgressJournalEntry[],
): WeightChartPoint[] {
  return entries
    .filter((entry) => entry.weightKg != null && entry.weightKg > 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((entry) => ({
      date: entry.date,
      weightKg: entry.weightKg!,
      label: formatShortDate(entry.date),
    }));
}

export function buildWeightTrendSummary(
  points: WeightChartPoint[],
  units: UnitsPreference,
): WeightTrendSummary {
  if (points.length < 2) {
    return {
      direction: "none",
      deltaKg: 0,
      deltaDisplay: "",
      message:
        points.length === 1
          ? "Log a few more weigh-ins to see your trend."
          : "Log your weight to start tracking your trend.",
      pointCount: points.length,
    };
  }

  const first = points[0].weightKg;
  const last = points[points.length - 1].weightKg;
  const deltaKg = Math.round((last - first) * 10) / 10;
  const deltaDisplay = displayDelta(deltaKg, units);

  if (Math.abs(deltaKg) < 0.1) {
    return {
      direction: "flat",
      deltaKg,
      deltaDisplay,
      message: "Your weight has held steady over this period.",
      pointCount: points.length,
    };
  }

  if (deltaKg < 0) {
    return {
      direction: "down",
      deltaKg,
      deltaDisplay,
      message: `Down ${deltaDisplay} since ${points[0].label}.`,
      pointCount: points.length,
    };
  }

  return {
    direction: "up",
    deltaKg,
    deltaDisplay,
    message: `Up ${deltaDisplay} since ${points[0].label}.`,
    pointCount: points.length,
  };
}
