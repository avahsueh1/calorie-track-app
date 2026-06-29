"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getDefaultAppState,
  loadAppStateFromStorage,
  saveAppStateToStorage,
} from "../../data/defaultAppState";
import { getProfileFocusMessage } from "../../data/defaultProfile";
import { macroColors } from "../../data/sampleDashboard";
import {
  getEmptyDailyCheckIn,
  hasCheckInContent,
  normalizeDailyCheckIn,
} from "../../lib/checkInHelpers";
import {
  applyCycleSettingsToProfile,
  applyTrackingPreferencesToState,
  buildBodyPatternMetrics,
  buildCycleContextDisplay,
  buildCycleSettingsFromPeriodLogs,
  buildPatternInsightCards,
  buildWeeklyNetDays,
  buildWeeklyTakeaway,
  coalescePeriodLogs,
  countLoggedDays,
  extractCycleSettings,
  nextEntryId,
  todayDateKey,
  type AppState,
} from "../../lib/appStateHelpers";
import {
  buildDailySummaryDisplay,
  buildMacroSummaryFromFoods,
} from "../../lib/calories";
import {
  ensureNutritionPlan,
  getCalorieTargetRange,
} from "../../lib/nutritionPlan";
import {
  listProgressJournalEntries,
  removeProgressJournalEntry,
  upsertProgressJournalEntry,
  type ProgressJournalUpsert,
} from "../../lib/progressJournal";
import { applyProfilePatch } from "../../lib/profilePatch";
import {
  getHomeModules,
  isCalorieTrackingEnabled,
  isCycleTrackingEnabled,
  type TrackingPreferences,
} from "../../lib/trackingPreferences";
import {
  formatHeightDisplay,
  formatWeightDisplay,
  getProfileEnergyMetrics,
  parseHeightToCm,
  parseWeightToKg,
  sanitizeAppProfile,
} from "../../lib/profileBody";
import type { DailyCheckIn, UserProfile } from "../../types";
import type { AppProfile, MacroTargets } from "../../types/profile";
import type {
  BodyPatternMetric,
  CycleContextDisplay,
  CycleSettings,
  DailyActivityEntry,
  DailyFoodEntry,
  DailySummaryDisplay,
  MacroSummary,
  PatternInsightCardData,
  PeriodLog,
  WeeklyNetDay,
  ProgressJournalEntry,
} from "../../types/wellness";

interface AppStateContextValue {
  profile: AppProfile;
  trackingPreferences: TrackingPreferences;
  calorieTrackingEnabled: boolean;
  cycleTrackingEnabled: boolean;
  homeModules: ReturnType<typeof getHomeModules>;
  userProfile: UserProfile;
  bmr: number;
  /** Maintenance calories from activity level (before daily goal adjustment). */
  tdee: number;
  /** Saved calorie target from nutrition plan. */
  dailyCalorieTarget: number;
  /** Saved macro targets from nutrition plan. */
  macroTargets: MacroTargets;
  dailyTargetRange: { target: number; min: number; max: number };
  focusMessage: string;
  cycleSettings: CycleSettings;
  effectiveCycleSettings: CycleSettings;
  cycleContext: CycleContextDisplay;
  periodLogs: PeriodLog[];
  foodLogs: Record<string, DailyFoodEntry[]>;
  activityLogs: Record<string, DailyActivityEntry[]>;
  foods: DailyFoodEntry[];
  activities: DailyActivityEntry[];
  dailySummary: DailySummaryDisplay;
  macros: MacroSummary[];
  checkIn: DailyCheckIn;
  dailyCheckIns: Record<string, DailyCheckIn>;
  progressJournal: ProgressJournalEntry[];
  progressJournalByDate: Record<string, ProgressJournalEntry>;
  weeklyNetDays: WeeklyNetDay[];
  weeklyTakeaway: string;
  bodyPatternMetrics: BodyPatternMetric[];
  patternInsightCards: PatternInsightCardData[];
  loggedDaysCount: number;
  checkInDaysCount: number;
  insightsDayNotes: Record<string, string>;
  updateProfile: (updates: Partial<AppProfile>) => void;
  updateTrackingPreferences: (updates: Partial<TrackingPreferences>) => void;
  updateCycleSettings: (updates: Partial<CycleSettings>) => void;
  addPeriodLog: (entry: Omit<PeriodLog, "id">) => void;
  updatePeriodLog: (id: string, entry: Omit<PeriodLog, "id">) => void;
  deletePeriodLog: (id: string) => void;
  addFood: (entry: Omit<DailyFoodEntry, "id">) => void;
  updateFood: (id: string, entry: Omit<DailyFoodEntry, "id">) => void;
  deleteFood: (id: string) => void;
  addActivity: (entry: Omit<DailyActivityEntry, "id">) => void;
  updateActivity: (id: string, entry: Omit<DailyActivityEntry, "id">) => void;
  deleteActivity: (id: string) => void;
  updateCheckIn: (updates: Partial<DailyCheckIn>) => void;
  upsertProgressJournal: (patch: ProgressJournalUpsert) => void;
  removeProgressJournal: (date: string) => void;
  updateInsightsDayNote: (dateKey: string, notes: string) => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

function getTodayEntries<T>(logs: Record<string, T[]>): T[] {
  return logs[todayDateKey()] ?? [];
}

function getTodayCheckIn(
  dailyCheckIns: Record<string, DailyCheckIn>,
): DailyCheckIn {
  return normalizeDailyCheckIn(
    dailyCheckIns[todayDateKey()] ?? getEmptyDailyCheckIn(),
  );
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(getDefaultAppState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadAppStateFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveAppStateToStorage(state);
    }
  }, [state, hydrated]);

  const updateProfile = useCallback((updates: Partial<AppProfile>) => {
    setState((current) => {
      const normalizedUpdates: Partial<AppProfile> = { ...updates };
      const units = updates.units ?? current.profile.units;

      if (updates.heightCm !== undefined) {
        normalizedUpdates.heightCm =
          Number(updates.heightCm) || current.profile.heightCm;
      }

      if (updates.weightKg !== undefined) {
        normalizedUpdates.weightKg =
          Number(updates.weightKg) || current.profile.weightKg;
      }

      if (updates.age !== undefined) {
        normalizedUpdates.age = Number(updates.age) || current.profile.age;
      }

      let nextProfile = applyProfilePatch(current.profile, normalizedUpdates);

      if (updates.weightDisplay !== undefined) {
        const parsed = parseWeightToKg(updates.weightDisplay, units);
        if (parsed !== null) {
          nextProfile = applyProfilePatch(nextProfile, { weightKg: parsed });
        }
      }

      if (updates.heightDisplay !== undefined) {
        const parsed = parseHeightToCm(updates.heightDisplay, units);
        if (parsed !== null) {
          nextProfile = applyProfilePatch(nextProfile, { heightCm: parsed });
        }
      }

      const cycleSettings = extractCycleSettings(nextProfile);
      const sanitizedProfile = ensureNutritionPlan(
        sanitizeAppProfile(
          applyCycleSettingsToProfile(nextProfile, cycleSettings),
        ),
      );
      const trackingPreferences =
        updates.cycleTrackingEnabled !== undefined
          ? {
              ...current.trackingPreferences,
              cycleTrackingEnabled: updates.cycleTrackingEnabled,
            }
          : current.trackingPreferences;

      return {
        ...current,
        profile: sanitizedProfile,
        cycleSettings: {
          ...cycleSettings,
          cycleTrackingEnabled: trackingPreferences.cycleTrackingEnabled,
        },
        trackingPreferences,
      };
    });
  }, []);

  const updateTrackingPreferences = useCallback(
    (updates: Partial<TrackingPreferences>) => {
      setState((current) => {
        const trackingPreferences = {
          ...current.trackingPreferences,
          ...updates,
        };

        return {
          ...current,
          ...applyTrackingPreferencesToState(current, trackingPreferences),
        };
      });
    },
    [],
  );

  const updateCycleSettings = useCallback((updates: Partial<CycleSettings>) => {
    setState((current) => {
      const cycleSettings = { ...current.cycleSettings, ...updates };
      const trackingPreferences =
        updates.cycleTrackingEnabled !== undefined
          ? {
              ...current.trackingPreferences,
              cycleTrackingEnabled: updates.cycleTrackingEnabled,
            }
          : current.trackingPreferences;

      return {
        ...current,
        cycleSettings,
        trackingPreferences,
        profile: applyCycleSettingsToProfile(current.profile, cycleSettings),
      };
    });
  }, []);

  const syncPeriodLogs = useCallback(
    (periodLogs: PeriodLog[], cycleSettings: CycleSettings, profile: AppProfile) => {
      const nextCycleSettings = buildCycleSettingsFromPeriodLogs(
        cycleSettings,
        periodLogs,
      );

      return {
        periodLogs,
        cycleSettings: nextCycleSettings,
        profile: applyCycleSettingsToProfile(profile, nextCycleSettings),
      };
    },
    [],
  );

  const addPeriodLog = useCallback((entry: Omit<PeriodLog, "id">) => {
    setState((current) => {
      const existingIndex = current.periodLogs.findIndex(
        (log) => log.startDate === entry.startDate,
      );

      const nextLogs =
        existingIndex >= 0
          ? current.periodLogs.map((log, index) =>
              index === existingIndex ? { ...log, ...entry } : log,
            )
          : [{ ...entry, id: nextEntryId() }, ...current.periodLogs];

      const periodLogs = coalescePeriodLogs(nextLogs);

      return {
        ...current,
        ...syncPeriodLogs(periodLogs, current.cycleSettings, current.profile),
      };
    });
  }, [syncPeriodLogs]);

  const updatePeriodLog = useCallback(
    (id: string, entry: Omit<PeriodLog, "id">) => {
      setState((current) => {
        const nextLogs = current.periodLogs.map((log) =>
          log.id === id ? { ...log, ...entry } : log,
        );
        const periodLogs = coalescePeriodLogs(nextLogs);

        return {
          ...current,
          ...syncPeriodLogs(periodLogs, current.cycleSettings, current.profile),
        };
      });
    },
    [syncPeriodLogs],
  );

  const deletePeriodLog = useCallback(
    (id: string) => {
      setState((current) => {
        const periodLogs = coalescePeriodLogs(
          current.periodLogs.filter((log) => log.id !== id),
        );

        return {
          ...current,
          ...syncPeriodLogs(periodLogs, current.cycleSettings, current.profile),
        };
      });
    },
    [syncPeriodLogs],
  );

  const updateTodayFoods = useCallback(
    (updater: (foods: DailyFoodEntry[]) => DailyFoodEntry[]) => {
      const today = todayDateKey();
      setState((current) => ({
        ...current,
        foodLogs: {
          ...current.foodLogs,
          [today]: updater(getTodayEntries(current.foodLogs)),
        },
      }));
    },
    [],
  );

  const updateTodayActivities = useCallback(
    (updater: (activities: DailyActivityEntry[]) => DailyActivityEntry[]) => {
      const today = todayDateKey();
      setState((current) => ({
        ...current,
        activityLogs: {
          ...current.activityLogs,
          [today]: updater(getTodayEntries(current.activityLogs)),
        },
      }));
    },
    [],
  );

  const addFood = useCallback(
    (entry: Omit<DailyFoodEntry, "id">) => {
      updateTodayFoods((foods) => [...foods, { ...entry, id: nextEntryId() }]);
    },
    [updateTodayFoods],
  );

  const updateFood = useCallback(
    (id: string, entry: Omit<DailyFoodEntry, "id">) => {
      updateTodayFoods((foods) =>
        foods.map((food) => (food.id === id ? { ...entry, id } : food)),
      );
    },
    [updateTodayFoods],
  );

  const deleteFood = useCallback(
    (id: string) => {
      updateTodayFoods((foods) => foods.filter((food) => food.id !== id));
    },
    [updateTodayFoods],
  );

  const addActivity = useCallback(
    (entry: Omit<DailyActivityEntry, "id">) => {
      updateTodayActivities((activities) => [
        ...activities,
        { ...entry, id: nextEntryId() },
      ]);
    },
    [updateTodayActivities],
  );

  const updateActivity = useCallback(
    (id: string, entry: Omit<DailyActivityEntry, "id">) => {
      updateTodayActivities((activities) =>
        activities.map((activity) =>
          activity.id === id ? { ...entry, id } : activity,
        ),
      );
    },
    [updateTodayActivities],
  );

  const deleteActivity = useCallback(
    (id: string) => {
      updateTodayActivities((activities) =>
        activities.filter((activity) => activity.id !== id),
      );
    },
    [updateTodayActivities],
  );

  const updateCheckIn = useCallback((updates: Partial<DailyCheckIn>) => {
    const today = todayDateKey();
    setState((current) => {
      const currentCheckIn = getTodayCheckIn(current.dailyCheckIns);
      const next = normalizeDailyCheckIn({
        symptoms:
          updates.symptoms !== undefined
            ? updates.symptoms
            : currentCheckIn.symptoms,
        notes:
          updates.notes !== undefined ? updates.notes : currentCheckIn.notes,
      });

      return {
        ...current,
        dailyCheckIns: {
          ...current.dailyCheckIns,
          [today]: next,
        },
        insightsDayNotes: {
          ...current.insightsDayNotes,
          [today]: next.notes ?? "",
        },
      };
    });
  }, []);

  const upsertProgressJournal = useCallback((patch: ProgressJournalUpsert) => {
    setState((current) => ({
      ...current,
      progressJournal: upsertProgressJournalEntry(
        current.progressJournal ?? {},
        patch,
      ),
    }));
  }, []);

  const removeProgressJournal = useCallback((date: string) => {
    setState((current) => ({
      ...current,
      progressJournal: removeProgressJournalEntry(
        current.progressJournal ?? {},
        date,
      ),
    }));
  }, []);

  const updateInsightsDayNote = useCallback((dateKey: string, notes: string) => {
    setState((current) => {
      const existing = normalizeDailyCheckIn(
        current.dailyCheckIns[dateKey] ?? getEmptyDailyCheckIn(),
      );

      return {
        ...current,
        dailyCheckIns: {
          ...current.dailyCheckIns,
          [dateKey]: {
            ...existing,
            notes,
          },
        },
        insightsDayNotes: {
          ...current.insightsDayNotes,
          [dateKey]: notes,
        },
      };
    });
  }, []);

  const profile = state.profile;
  const trackingPreferences = state.trackingPreferences;
  const calorieTrackingEnabled = isCalorieTrackingEnabled(state);
  const cycleTrackingEnabled = isCycleTrackingEnabled(state);
  const homeModules = useMemo(
    () => getHomeModules(trackingPreferences),
    [trackingPreferences],
  );
  const cycleSettings = state.cycleSettings;
  const effectiveCycleSettings = useMemo(
    () => buildCycleSettingsFromPeriodLogs(cycleSettings, state.periodLogs),
    [cycleSettings, state.periodLogs],
  );
  const foods = getTodayEntries(state.foodLogs);
  const activities = getTodayEntries(state.activityLogs);
  const checkIn = getTodayCheckIn(state.dailyCheckIns);

  const energyMetrics = useMemo(
    () => getProfileEnergyMetrics(profile),
    [profile],
  );
  const userProfile = energyMetrics.userProfile;
  const bmr = useMemo(() => Math.round(energyMetrics.bmr), [energyMetrics.bmr]);
  const tdee = energyMetrics.maintenanceTdee;
  const dailyCalorieTarget = energyMetrics.dailyCalorieTarget;
  const macroTargets = energyMetrics.macroTargets;
  const dailyTargetRange = useMemo(
    () => getCalorieTargetRange(dailyCalorieTarget),
    [dailyCalorieTarget],
  );
  const focusMessage = useMemo(
    () => getProfileFocusMessage(profile.goalDirection),
    [profile.goalDirection],
  );
  const cycleContext = useMemo(
    () => buildCycleContextDisplay(effectiveCycleSettings, state.periodLogs),
    [effectiveCycleSettings, state.periodLogs],
  );
  const dailySummary = useMemo(
    () => buildDailySummaryDisplay(foods, activities, dailyCalorieTarget),
    [foods, activities, dailyCalorieTarget],
  );
  const macros = useMemo(
    () => buildMacroSummaryFromFoods(foods, macroTargets, macroColors),
    [foods, macroTargets],
  );
  const weeklyNetDays = useMemo(
    () =>
      buildWeeklyNetDays(
        state.foodLogs,
        state.activityLogs,
        state.dailyCheckIns,
        profile,
      ),
    [state.foodLogs, state.activityLogs, state.dailyCheckIns, profile],
  );
  const weeklyTakeaway = useMemo(
    () => buildWeeklyTakeaway(weeklyNetDays, dailyCalorieTarget),
    [weeklyNetDays, dailyCalorieTarget],
  );
  const bodyPatternMetrics = useMemo(
    () => buildBodyPatternMetrics(state.dailyCheckIns),
    [state.dailyCheckIns],
  );
  const loggedDaysCount = useMemo(
    () =>
      countLoggedDays(state.foodLogs, state.activityLogs, state.dailyCheckIns),
    [state.foodLogs, state.activityLogs, state.dailyCheckIns],
  );
  const checkInDaysCount = useMemo(
    () =>
      Object.values(state.dailyCheckIns).filter((checkIn) =>
        hasCheckInContent(normalizeDailyCheckIn(checkIn)),
      ).length,
    [state.dailyCheckIns],
  );
  const patternInsightCards = useMemo(
    () =>
      buildPatternInsightCards(
        loggedDaysCount,
        checkInDaysCount,
        effectiveCycleSettings,
        state.periodLogs,
      ),
    [
      loggedDaysCount,
      checkInDaysCount,
      effectiveCycleSettings,
      state.periodLogs,
    ],
  );
  const progressJournalEntries = useMemo(
    () => listProgressJournalEntries(state.progressJournal ?? {}),
    [state.progressJournal],
  );

  const value = useMemo(
    () => ({
      profile,
      trackingPreferences,
      calorieTrackingEnabled,
      cycleTrackingEnabled,
      homeModules,
      userProfile,
      bmr,
      tdee,
      dailyCalorieTarget,
      dailyTargetRange,
      macroTargets,
      focusMessage,
      cycleSettings,
      effectiveCycleSettings,
      cycleContext,
      periodLogs: state.periodLogs,
      foodLogs: state.foodLogs,
      activityLogs: state.activityLogs,
      foods,
      activities,
      dailySummary,
      macros,
      checkIn,
      dailyCheckIns: state.dailyCheckIns,
      progressJournal: progressJournalEntries,
      progressJournalByDate: state.progressJournal ?? {},
      weeklyNetDays,
      weeklyTakeaway,
      bodyPatternMetrics,
      patternInsightCards,
      loggedDaysCount,
      checkInDaysCount,
      insightsDayNotes: state.insightsDayNotes,
      updateProfile,
      updateTrackingPreferences,
      updateCycleSettings,
      addPeriodLog,
      updatePeriodLog,
      deletePeriodLog,
      addFood,
      updateFood,
      deleteFood,
      addActivity,
      updateActivity,
      deleteActivity,
      updateCheckIn,
      upsertProgressJournal,
      removeProgressJournal,
      updateInsightsDayNote,
    }),
    [
      profile,
      trackingPreferences,
      calorieTrackingEnabled,
      cycleTrackingEnabled,
      homeModules,
      userProfile,
      bmr,
      tdee,
      dailyCalorieTarget,
      dailyTargetRange,
      macroTargets,
      focusMessage,
      cycleSettings,
      effectiveCycleSettings,
      cycleContext,
      state.periodLogs,
      state.foodLogs,
      state.activityLogs,
      foods,
      activities,
      dailySummary,
      macros,
      checkIn,
      progressJournalEntries,
      state.progressJournal,
      state.insightsDayNotes,
      weeklyNetDays,
      weeklyTakeaway,
      bodyPatternMetrics,
      patternInsightCards,
      loggedDaysCount,
      checkInDaysCount,
      updateProfile,
      updateTrackingPreferences,
      updateCycleSettings,
      addPeriodLog,
      updatePeriodLog,
      deletePeriodLog,
      addFood,
      updateFood,
      deleteFood,
      addActivity,
      updateActivity,
      deleteActivity,
      updateCheckIn,
      upsertProgressJournal,
      removeProgressJournal,
      updateInsightsDayNote,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useAppState(): AppStateContextValue {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
}

export function useProfile() {
  const {
    profile,
    userProfile,
    bmr,
    tdee,
    focusMessage,
    updateProfile,
  } = useAppState();

  return {
    profile,
    userProfile,
    bmr,
    tdee,
    focusMessage,
    updateProfile,
  };
}

export function useTrackingPreferences() {
  const {
    trackingPreferences,
    calorieTrackingEnabled,
    cycleTrackingEnabled,
    homeModules,
    updateTrackingPreferences,
  } = useAppState();

  return {
    trackingPreferences,
    calorieTrackingEnabled,
    cycleTrackingEnabled,
    homeModules,
    updateTrackingPreferences,
  };
}

export function useDailyLog() {
  const {
    foods,
    activities,
    dailySummary,
    macros,
    addFood,
    updateFood,
    deleteFood,
    addActivity,
    updateActivity,
    deleteActivity,
  } = useAppState();

  return {
    foods,
    activities,
    dailySummary,
    macros,
    addFood,
    updateFood,
    deleteFood,
    addActivity,
    updateActivity,
    deleteActivity,
  };
}

export function useCheckIn() {
  const { checkIn, updateCheckIn } = useAppState();
  return { checkIn, updateCheckIn };
}

export function useCycleContext() {
  const {
    cycleContext,
    cycleSettings,
    effectiveCycleSettings,
    periodLogs,
    addPeriodLog,
    updatePeriodLog,
    deletePeriodLog,
    updateCycleSettings,
  } = useAppState();
  return {
    cycleContext,
    cycleSettings,
    effectiveCycleSettings,
    periodLogs,
    addPeriodLog,
    updatePeriodLog,
    deletePeriodLog,
    updateCycleSettings,
  };
}

export function useInsightsData() {
  const {
    profile,
    calorieTrackingEnabled,
    cycleTrackingEnabled,
    weeklyNetDays,
    weeklyTakeaway,
    bodyPatternMetrics,
    patternInsightCards,
    dailyCalorieTarget,
    dailyTargetRange,
    macroTargets,
    cycleContext,
    effectiveCycleSettings,
    loggedDaysCount,
    insightsDayNotes,
    periodLogs,
    foodLogs,
    activityLogs,
    checkInDaysCount,
    dailyCheckIns,
    progressJournal,
    progressJournalByDate,
    updateInsightsDayNote,
  } = useAppState();

  return {
    profile,
    calorieTrackingEnabled,
    cycleTrackingEnabled,
    weeklyNetDays,
    weeklyTakeaway,
    bodyPatternMetrics,
    patternInsightCards,
    dailyCalorieTarget,
    dailyTargetRange,
    macroTargets,
    cycleContext,
    effectiveCycleSettings,
    loggedDaysCount,
    checkInDaysCount,
    insightsDayNotes,
    periodLogs,
    foodLogs,
    activityLogs,
    dailyCheckIns,
    progressJournal,
    progressJournalByDate,
    updateInsightsDayNote,
  };
}
