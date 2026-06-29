import type { LogTab } from "./trackingPreferences";

export const routes = {
  home: "/",
  log: "/log",
  insights: "/insights",
  progressJournal: "/insights/progress-journal",
  progressJournalPhotos: (focusDate?: string) =>
    focusDate
      ? `/insights/progress-journal/photos?focus=${encodeURIComponent(focusDate)}`
      : "/insights/progress-journal/photos",
  progressJournalEdit: (date: string) =>
    `/insights/progress-journal?edit=${encodeURIComponent(date)}`,
  profile: "/profile",
  calorieSettings: "/profile/calorie-settings",
  weeklyCaloriePattern: "/profile/calorie-settings/weekly-pattern",
  insightDay: (dateKey: string) => `/insights/day/${dateKey}`,
  healthReport: "/insights/report",
  cyclePhaseDetail: (phaseKind: string) => `/insights/cycle-phase/${phaseKind}`,
  logWithTab: (tab: LogTab) => `/log?tab=${tab}`,
} as const;
