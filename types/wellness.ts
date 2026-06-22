import type { DailyCheckIn } from "./index";
import type { ProfileLifeStage } from "./profile";

export type { DailyCheckIn, CycleContext } from "./index";

export type ScaleRating = 1 | 2 | 3 | 4 | 5;
export type CravingLevel = "none" | "mild" | "strong";
export type SeverityLevel = CravingLevel;

export type CheckInScaleField = keyof Pick<
  DailyCheckIn,
  "mood" | "energy" | "hunger" | "sleepQuality" | "stress"
>;

export type CheckInSeverityField = "cravings" | "bloating" | "soreness";

export const CHECK_IN_SCALE_OPTIONS: ScaleRating[] = [1, 2, 3, 4, 5];

export const CHECK_IN_SEVERITY_OPTIONS: SeverityLevel[] = [
  "none",
  "mild",
  "strong",
];

export const CHECK_IN_SCALE_WORDS = [
  "Very low",
  "Low",
  "Moderate",
  "Good",
  "High",
] as const;

export const CHECK_IN_SCALE_FIELDS: {
  key: CheckInScaleField;
  label: string;
  summaryLabel: string;
}[] = [
  { key: "mood", label: "Mood", summaryLabel: "Mood" },
  { key: "energy", label: "Energy", summaryLabel: "Energy" },
  { key: "hunger", label: "Hunger", summaryLabel: "Hunger" },
  { key: "sleepQuality", label: "Sleep quality", summaryLabel: "Sleep" },
  { key: "stress", label: "Stress", summaryLabel: "Stress" },
];

export const CHECK_IN_SEVERITY_FIELDS: {
  key: CheckInSeverityField;
  label: string;
}[] = [
  { key: "cravings", label: "Cravings" },
  { key: "bloating", label: "Bloating" },
  { key: "soreness", label: "Soreness" },
];

export function formatSeverityLabel(value: SeverityLevel): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function cloneDailyCheckIn(value: DailyCheckIn): DailyCheckIn {
  return {
    ...value,
    notes: value.notes ?? "",
  };
}

export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";
export type ActivityIntensity = "Gentle" | "Moderate" | "High";

export interface DailyFoodEntry {
  id: string;
  name: string;
  meal: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface DailyActivityEntry {
  id: string;
  name: string;
  durationMinutes: number;
  caloriesBurned: number;
  intensity: ActivityIntensity;
}

export interface InteractiveCheckInState {
  mood: ScaleRating;
  energy: ScaleRating;
  hunger: ScaleRating;
  sleepQuality: ScaleRating;
  stress: ScaleRating;
  cravings: CravingLevel;
  bloating: CravingLevel;
  soreness: CravingLevel;
  notes?: string;
}

export interface WellnessUser {
  name: string;
  focusMessage: string;
}

export type MacroColorKey = "protein" | "carbs" | "fat" | "fiber";

export interface MacroSummary {
  label: string;
  grams: number;
  targetGrams: number;
  unit: "g";
  percent: number;
  color: string;
  colorKey: MacroColorKey;
}

export interface DailySummaryDisplay {
  eaten: number;
  burned: number;
  net: number;
  tdee: number;
  remaining: number;
  ringValue: number;
  ringTarget: number;
  ringPercent: number;
}

export interface DailyCheckInDisplay {
  mood: string;
  energy: string;
  hunger: string;
  cravings: string;
  sleep: string;
  stress: string;
}

export interface CycleContextDisplay {
  phaseLabel: string;
  cycleDay: number | null;
  cycleDayLabel: string;
  insightTitle: string;
  insightMessage: string;
}

export interface WeeklyEnergyDay {
  day: string;
  eaten: number;
  burned: number;
  net: number;
}

export interface WeeklyNetDay {
  day: string;
  dayFull: string;
  eaten: number;
  burned: number;
  net: number;
  mood: string;
  energy: string;
  hunger: string;
}

export interface WeightLogEntry {
  id: string;
  weight: number;
  note: string;
  loggedAt: string;
  date: string;
}

export interface CycleSettings {
  cycleTrackingEnabled: boolean;
  lifeStage: ProfileLifeStage;
  lastPeriodStart: string;
  averageCycleLength: number;
  averagePeriodLength: number;
}

export interface BodyPatternMetric {
  label: string;
  value: number;
  colorKey: "sage" | "terracotta" | "blue" | "gold";
}

export interface BodyPatternActivityItem {
  name: string;
  durationMinutes: number;
  calories: number;
  intensity?: ActivityIntensity;
}

export interface BodyPatternWeightSummary {
  value: string;
  unit: "lb" | "kg";
  note?: string;
}

/** One logged day in the Insights body pattern month calendar. */
export interface BodyPatternCalendarDay {
  dateKey: string;
  cycleDay: number;
  phase: string;
  checkInCompleted: boolean;
  mood: 1 | 2 | 3 | 4 | 5;
  energy: 1 | 2 | 3 | 4 | 5;
  hunger: 1 | 2 | 3 | 4 | 5;
  cravings: CravingLevel;
  sleepQuality: 1 | 2 | 3 | 4 | 5;
  stress: 1 | 2 | 3 | 4 | 5;
  bloating?: CravingLevel;
  soreness?: CravingLevel;
  netCalories?: number;
  eaten?: number;
  burned?: number;
  targetCalories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  activities?: BodyPatternActivityItem[];
  weight?: BodyPatternWeightSummary;
  notes?: string;
}

export interface PatternInsightCardData {
  title: string;
  message: string;
  accent: "cream" | "lavender" | "blue";
}
