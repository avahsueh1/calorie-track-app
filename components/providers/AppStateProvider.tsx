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
import {
  getDefaultDailyCheckIn,
  macroColors,
  macroTargets,
} from "../../data/sampleDashboard";
import {
  applyCycleSettingsToProfile,
  buildBodyPatternMetrics,
  buildCycleContextDisplay,
  buildPatternInsightCards,
  buildWeeklyNetDays,
  buildWeeklyTakeaway,
  countLoggedDays,
  extractCycleSettings,
  formatWeightLogTime,
  nextEntryId,
  todayDateKey,
  type AppState,
} from "../../lib/appStateHelpers";
import {
  buildDailySummaryDisplay,
  buildMacroSummaryFromFoods,
  calculateBmr,
  calculateTdee,
} from "../../lib/calories";
import {
  formatHeightDisplay,
  formatWeightDisplay,
  parseHeightToCm,
  parseWeightToKg,
  toUserProfile,
} from "../../lib/profileBody";
import type { DailyCheckIn, UserProfile } from "../../types";
import type { AppProfile } from "../../types/profile";
import type {
  BodyPatternMetric,
  CycleContextDisplay,
  CycleSettings,
  DailyActivityEntry,
  DailyFoodEntry,
  DailySummaryDisplay,
  MacroSummary,
  PatternInsightCardData,
  WeeklyNetDay,
  WeightLogEntry,
} from "../../types/wellness";

interface AppStateContextValue {
  profile: AppProfile;
  userProfile: UserProfile;
  bmr: number;
  tdee: number;
  focusMessage: string;
  cycleSettings: CycleSettings;
  cycleContext: CycleContextDisplay;
  foods: DailyFoodEntry[];
  activities: DailyActivityEntry[];
  dailySummary: DailySummaryDisplay;
  macros: MacroSummary[];
  checkIn: DailyCheckIn;
  weightLogs: WeightLogEntry[];
  weeklyNetDays: WeeklyNetDay[];
  weeklyTakeaway: string;
  bodyPatternMetrics: BodyPatternMetric[];
  patternInsightCards: PatternInsightCardData[];
  loggedDaysCount: number;
  updateProfile: (updates: Partial<AppProfile>) => void;
  updateCycleSettings: (updates: Partial<CycleSettings>) => void;
  addFood: (entry: Omit<DailyFoodEntry, "id">) => void;
  updateFood: (id: string, entry: Omit<DailyFoodEntry, "id">) => void;
  deleteFood: (id: string) => void;
  addActivity: (entry: Omit<DailyActivityEntry, "id">) => void;
  updateActivity: (id: string, entry: Omit<DailyActivityEntry, "id">) => void;
  deleteActivity: (id: string) => void;
  updateCheckIn: (updates: Partial<DailyCheckIn>) => void;
  addWeightLog: (entry: Omit<WeightLogEntry, "id" | "loggedAt" | "date">) => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

function getTodayEntries<T>(logs: Record<string, T[]>): T[] {
  return logs[todayDateKey()] ?? [];
}

function getTodayCheckIn(
  dailyCheckIns: Record<string, DailyCheckIn>,
  fallback: DailyCheckIn,
): DailyCheckIn {
  return dailyCheckIns[todayDateKey()] ?? fallback;
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
      const nextProfile = { ...current.profile, ...updates };
      const units = updates.units ?? nextProfile.units;

      if (updates.heightCm !== undefined) {
        nextProfile.heightCm = Number(updates.heightCm) || current.profile.heightCm;
        nextProfile.heightDisplay = formatHeightDisplay(
          nextProfile.heightCm,
          nextProfile.units,
        );
      }

      if (updates.weightKg !== undefined) {
        nextProfile.weightKg = Number(updates.weightKg) || current.profile.weightKg;
        nextProfile.weightDisplay = formatWeightDisplay(
          nextProfile.weightKg,
          nextProfile.units,
        );
      }

      if (updates.weightDisplay !== undefined) {
        const parsed = parseWeightToKg(updates.weightDisplay, units);
        if (parsed !== null) {
          nextProfile.weightKg = parsed;
        }
      }

      if (updates.heightDisplay !== undefined) {
        const parsed = parseHeightToCm(updates.heightDisplay, units);
        if (parsed !== null) {
          nextProfile.heightCm = parsed;
          nextProfile.heightDisplay = formatHeightDisplay(
            nextProfile.heightCm,
            nextProfile.units,
          );
        }
      }

      if (updates.bodyFatPct !== undefined) {
        nextProfile.bodyFatPct = updates.bodyFatPct;
      }

      if (updates.units !== undefined && updates.units !== current.profile.units) {
        nextProfile.heightDisplay = formatHeightDisplay(
          nextProfile.heightCm,
          nextProfile.units,
        );
        nextProfile.weightDisplay = formatWeightDisplay(
          nextProfile.weightKg,
          nextProfile.units,
        );
      }

      if (updates.age !== undefined) {
        nextProfile.age = Number(updates.age) || current.profile.age;
      }

      const cycleSettings = extractCycleSettings(nextProfile);

      return {
        ...current,
        profile: applyCycleSettingsToProfile(nextProfile, cycleSettings),
        cycleSettings,
      };
    });
  }, []);

  const updateCycleSettings = useCallback((updates: Partial<CycleSettings>) => {
    setState((current) => {
      const cycleSettings = { ...current.cycleSettings, ...updates };
      return {
        ...current,
        cycleSettings,
        profile: applyCycleSettingsToProfile(current.profile, cycleSettings),
      };
    });
  }, []);

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
      const currentCheckIn = getTodayCheckIn(
        current.dailyCheckIns,
        getDefaultDailyCheckIn(),
      );

      return {
        ...current,
        dailyCheckIns: {
          ...current.dailyCheckIns,
          [today]: { ...currentCheckIn, ...updates, notes: updates.notes ?? currentCheckIn.notes ?? "" },
        },
      };
    });
  }, []);

  const addWeightLog = useCallback(
    (entry: Omit<WeightLogEntry, "id" | "loggedAt" | "date">) => {
      const today = todayDateKey();
      setState((current) => ({
        ...current,
        weightLogs: [
          {
            ...entry,
            id: nextEntryId(),
            loggedAt: formatWeightLogTime(),
            date: today,
          },
          ...current.weightLogs,
        ],
      }));
    },
    [],
  );

  const profile = state.profile;
  const cycleSettings = state.cycleSettings;
  const foods = getTodayEntries(state.foodLogs);
  const activities = getTodayEntries(state.activityLogs);
  const checkIn = getTodayCheckIn(state.dailyCheckIns, getDefaultDailyCheckIn());

  const userProfile = useMemo(
    () =>
      toUserProfile({
        age: profile.age,
        sex: profile.sex,
        heightCm: profile.heightCm,
        weightKg: profile.weightKg,
        bodyFatPct: profile.bodyFatPct,
        activityLevel: profile.activityLevel,
      }),
    [profile],
  );

  const bmr = useMemo(
    () =>
      Math.round(
        calculateBmr({
          age: profile.age,
          sex: profile.sex,
          heightCm: profile.heightCm,
          weightKg: profile.weightKg,
        }),
      ),
    [profile.age, profile.sex, profile.heightCm, profile.weightKg],
  );

  const tdee = useMemo(() => calculateTdee(userProfile), [userProfile]);
  const focusMessage = useMemo(
    () => getProfileFocusMessage(profile.goalDirection),
    [profile.goalDirection],
  );
  const cycleContext = useMemo(
    () => buildCycleContextDisplay(cycleSettings),
    [cycleSettings],
  );
  const dailySummary = useMemo(
    () => buildDailySummaryDisplay(foods, activities, tdee),
    [foods, activities, tdee],
  );
  const macros = useMemo(
    () => buildMacroSummaryFromFoods(foods, macroTargets, macroColors),
    [foods],
  );
  const weeklyNetDays = useMemo(
    () =>
      buildWeeklyNetDays(state.foodLogs, state.activityLogs, state.dailyCheckIns),
    [state.foodLogs, state.activityLogs, state.dailyCheckIns],
  );
  const weeklyTakeaway = useMemo(
    () => buildWeeklyTakeaway(weeklyNetDays, tdee),
    [weeklyNetDays, tdee],
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
    () => Object.keys(state.dailyCheckIns).length,
    [state.dailyCheckIns],
  );
  const patternInsightCards = useMemo(
    () => buildPatternInsightCards(loggedDaysCount, checkInDaysCount),
    [loggedDaysCount, checkInDaysCount],
  );

  const value = useMemo(
    () => ({
      profile,
      userProfile,
      bmr,
      tdee,
      focusMessage,
      cycleSettings,
      cycleContext,
      foods,
      activities,
      dailySummary,
      macros,
      checkIn,
      weightLogs: state.weightLogs,
      weeklyNetDays,
      weeklyTakeaway,
      bodyPatternMetrics,
      patternInsightCards,
      loggedDaysCount,
      updateProfile,
      updateCycleSettings,
      addFood,
      updateFood,
      deleteFood,
      addActivity,
      updateActivity,
      deleteActivity,
      updateCheckIn,
      addWeightLog,
    }),
    [
      profile,
      userProfile,
      bmr,
      tdee,
      focusMessage,
      cycleSettings,
      cycleContext,
      foods,
      activities,
      dailySummary,
      macros,
      checkIn,
      state.weightLogs,
      weeklyNetDays,
      weeklyTakeaway,
      bodyPatternMetrics,
      patternInsightCards,
      loggedDaysCount,
      updateProfile,
      updateCycleSettings,
      addFood,
      updateFood,
      deleteFood,
      addActivity,
      updateActivity,
      deleteActivity,
      updateCheckIn,
      addWeightLog,
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

export function useWeightLogs() {
  const { weightLogs, addWeightLog } = useAppState();
  return { weightLogs, addWeightLog };
}

export function useCycleContext() {
  const { cycleContext, cycleSettings, updateCycleSettings } = useAppState();
  return { cycleContext, cycleSettings, updateCycleSettings };
}

export function useInsightsData() {
  const {
    weeklyNetDays,
    weeklyTakeaway,
    bodyPatternMetrics,
    patternInsightCards,
    tdee,
    cycleContext,
    loggedDaysCount,
  } = useAppState();

  return {
    weeklyNetDays,
    weeklyTakeaway,
    bodyPatternMetrics,
    patternInsightCards,
    tdee,
    cycleContext,
    loggedDaysCount,
  };
}
