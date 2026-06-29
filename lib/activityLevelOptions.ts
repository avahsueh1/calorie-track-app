import type { ActivityLevel } from "../types";

export interface ActivityLevelOption {
  id: ActivityLevel;
  label: string;
  subtitle: string;
  description: string;
  examples: string;
}

export const ACTIVITY_LEVEL_OPTIONS: ActivityLevelOption[] = [
  {
    id: "sedentary",
    label: "Sedentary",
    subtitle: "Little daily movement",
    description:
      "Most of the day is spent sitting — desk work, driving, or relaxing at home.",
    examples: "Office job, little planned exercise, mostly seated errands.",
  },
  {
    id: "light",
    label: "Lightly active",
    subtitle: "Some movement most days",
    description:
      "Light exercise or walking a few times per week, plus regular everyday movement.",
    examples: "1–2 walks, gentle yoga, or a job with occasional standing.",
  },
  {
    id: "moderate",
    label: "Moderately active",
    subtitle: "Regular exercise routine",
    description:
      "Moderate workouts or active days several times per week on top of daily life.",
    examples: "3–5 workouts, regular walks, or a somewhat active job.",
  },
  {
    id: "active",
    label: "Very active",
    subtitle: "Hard exercise most days",
    description:
      "Structured training most days, or a physically demanding lifestyle.",
    examples: "6–7 workouts, sports practice, or frequent lifting/cardio.",
  },
  {
    id: "very_active",
    label: "Extra active",
    subtitle: "High volume or physical labor",
    description:
      "Intense daily training, athletic prep, or heavy physical work plus exercise.",
    examples: "Twice-daily training, manual labor, or competitive athletics.",
  },
];

export function getActivityLevelOption(
  level: ActivityLevel,
): ActivityLevelOption {
  return (
    ACTIVITY_LEVEL_OPTIONS.find((option) => option.id === level) ??
    ACTIVITY_LEVEL_OPTIONS[2]
  );
}
