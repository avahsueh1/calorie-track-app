import type { DailyCheckIn } from "../types";
import { getEmptyDailyCheckIn, normalizeDailyCheckIn } from "./checkInHelpers";

export function resolveDayNote(
  dateKey: string,
  dailyCheckIns: Record<string, DailyCheckIn>,
  legacyInsightsNotes: Record<string, string> = {},
  sampleNote?: string,
): string {
  const checkInNote = dailyCheckIns[dateKey]?.notes?.trim();
  if (checkInNote) {
    return checkInNote;
  }

  const legacyNote = legacyInsightsNotes[dateKey]?.trim();
  if (legacyNote) {
    return legacyNote;
  }

  return sampleNote?.trim() ?? "";
}

export function mergeLegacyInsightsNotesIntoCheckIns(
  dailyCheckIns: Record<string, DailyCheckIn>,
  legacyInsightsNotes: Record<string, string>,
): Record<string, DailyCheckIn> {
  const merged = { ...dailyCheckIns };

  for (const [dateKey, note] of Object.entries(legacyInsightsNotes)) {
    const trimmed = note?.trim();
    if (!trimmed) {
      continue;
    }

    const existing = merged[dateKey]
      ? normalizeDailyCheckIn(merged[dateKey])
      : getEmptyDailyCheckIn();

    if (!existing.notes?.trim()) {
      merged[dateKey] = {
        ...existing,
        notes: trimmed,
      };
    }
  }

  return merged;
}

export function dayNotePatch(notes: string): Pick<DailyCheckIn, "notes"> {
  return { notes };
}
