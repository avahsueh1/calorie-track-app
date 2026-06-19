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
import { defaultDailyCheckIn } from "../../data/sampleDashboard";
import type { DailyCheckIn } from "../../types";

const STORAGE_KEY = "calorie-track-app:daily-check-in";

interface StoredDailyCheckIn {
  date: string;
  checkIn: DailyCheckIn;
}

function todayDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function normalizeCheckIn(value: DailyCheckIn): DailyCheckIn {
  return {
    ...value,
    notes: value.notes ?? "",
  };
}

function loadCheckInFromStorage(): DailyCheckIn {
  if (typeof window === "undefined") {
    return normalizeCheckIn(defaultDailyCheckIn);
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return normalizeCheckIn(defaultDailyCheckIn);
    }

    const parsed = JSON.parse(raw) as StoredDailyCheckIn;
    if (parsed.date !== todayDateKey() || !parsed.checkIn) {
      return normalizeCheckIn(defaultDailyCheckIn);
    }

    return normalizeCheckIn(parsed.checkIn);
  } catch {
    return normalizeCheckIn(defaultDailyCheckIn);
  }
}

function saveCheckInToStorage(checkIn: DailyCheckIn): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StoredDailyCheckIn = {
    date: todayDateKey(),
    checkIn: normalizeCheckIn(checkIn),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

interface CheckInContextValue {
  checkIn: DailyCheckIn;
  updateCheckIn: (updates: Partial<DailyCheckIn>) => void;
}

const CheckInContext = createContext<CheckInContextValue | null>(null);

export function CheckInProvider({ children }: { children: ReactNode }) {
  const [checkIn, setCheckIn] = useState<DailyCheckIn>(() =>
    normalizeCheckIn(defaultDailyCheckIn),
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCheckIn(loadCheckInFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveCheckInToStorage(checkIn);
    }
  }, [checkIn, hydrated]);

  const updateCheckIn = useCallback((updates: Partial<DailyCheckIn>) => {
    setCheckIn((current) => normalizeCheckIn({ ...current, ...updates }));
  }, []);

  const value = useMemo(
    () => ({ checkIn, updateCheckIn }),
    [checkIn, updateCheckIn],
  );

  return (
    <CheckInContext.Provider value={value}>{children}</CheckInContext.Provider>
  );
}

export function useCheckIn(): CheckInContextValue {
  const context = useContext(CheckInContext);
  if (!context) {
    throw new Error("useCheckIn must be used within CheckInProvider");
  }
  return context;
}
