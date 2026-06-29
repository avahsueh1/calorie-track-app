import type {
  ProgressJournalEntry,
  ProgressPhoto,
  WeightLogEntry,
} from "../types/wellness";
import type { UnitsPreference } from "../types/profile";
import { formatWeightLogTime } from "./appStateHelpers";
import { formatWeightDisplay, kgToLb } from "./profileBody";

export type ProgressJournalMap = Record<string, ProgressJournalEntry>;

export type ProgressJournalUpsert = {
  date: string;
  weightKg?: number | null;
  photoDataUrl?: string | null;
  note?: string | null;
};

export function hasProgressJournalContent(
  entry: ProgressJournalEntry | undefined,
): boolean {
  if (!entry) {
    return false;
  }

  return (
    (entry.weightKg != null && entry.weightKg > 0) ||
    Boolean(entry.photoDataUrl) ||
    Boolean(entry.note?.trim())
  );
}

export function listProgressJournalEntries(
  journal: ProgressJournalMap,
): ProgressJournalEntry[] {
  return Object.values(journal)
    .filter(hasProgressJournalContent)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getProgressJournalEntry(
  journal: ProgressJournalMap,
  date: string,
): ProgressJournalEntry | undefined {
  const entry = journal[date];
  return hasProgressJournalContent(entry) ? entry : undefined;
}

export function upsertProgressJournalEntry(
  journal: ProgressJournalMap,
  patch: ProgressJournalUpsert,
): ProgressJournalMap {
  const date = patch.date.trim();
  if (!date) {
    return journal;
  }

  const existing = journal[date];
  const next: ProgressJournalEntry = {
    date,
    updatedAt: formatWeightLogTime(),
    weightKg:
      patch.weightKg === null
        ? undefined
        : patch.weightKg !== undefined
          ? patch.weightKg
          : existing?.weightKg,
    photoDataUrl:
      patch.photoDataUrl === null
        ? undefined
        : patch.photoDataUrl !== undefined
          ? patch.photoDataUrl
          : existing?.photoDataUrl,
    note:
      patch.note === null
        ? undefined
        : patch.note !== undefined
          ? patch.note.trim() || undefined
          : existing?.note,
  };

  if (!hasProgressJournalContent(next)) {
    const { [date]: _removed, ...rest } = journal;
    return rest;
  }

  return {
    ...journal,
    [date]: next,
  };
}

export function removeProgressJournalEntry(
  journal: ProgressJournalMap,
  date: string,
): ProgressJournalMap {
  const { [date]: _removed, ...rest } = journal;
  return rest;
}

export function migrateLegacyProgressData(
  weightLogs: WeightLogEntry[] = [],
  progressPhotos: ProgressPhoto[] = [],
): ProgressJournalMap {
  const journal: ProgressJournalMap = {};

  for (const log of weightLogs) {
    if (journal[log.date]) {
      continue;
    }

    journal[log.date] = {
      date: log.date,
      weightKg: log.weight,
      note: log.note?.trim() || undefined,
      updatedAt: log.loggedAt || log.date,
    };
  }

  for (const photo of progressPhotos) {
    const existing = journal[photo.date];
    journal[photo.date] = {
      date: photo.date,
      weightKg: existing?.weightKg,
      photoDataUrl: photo.dataUrl,
      note: photo.caption?.trim() || existing?.note,
      updatedAt: existing?.updatedAt || photo.date,
    };
  }

  return Object.fromEntries(
    Object.entries(journal).filter(([, entry]) => hasProgressJournalContent(entry)),
  );
}

export function normalizeProgressJournal(
  raw: ProgressJournalMap | null | undefined,
): ProgressJournalMap {
  if (!raw) {
    return {};
  }

  const normalized: ProgressJournalMap = {};

  for (const [dateKey, entry] of Object.entries(raw)) {
    if (!entry || typeof entry.date !== "string") {
      continue;
    }

    const date = entry.date || dateKey;
    const weightKg =
      entry.weightKg != null && Number(entry.weightKg) > 0
        ? Number(entry.weightKg)
        : undefined;

    const candidate: ProgressJournalEntry = {
      date,
      weightKg,
      photoDataUrl:
        typeof entry.photoDataUrl === "string" ? entry.photoDataUrl : undefined,
      note: entry.note?.trim() || undefined,
      updatedAt: entry.updatedAt || date,
    };

    if (hasProgressJournalContent(candidate)) {
      normalized[date] = candidate;
    }
  }

  return normalized;
}

export function truncateNotePreview(note: string, maxLength = 72): string {
  const trimmed = note.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

export function formatProgressJournalDate(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatProgressJournalDateShort(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getWeightEntries(
  entries: ProgressJournalEntry[],
): ProgressJournalEntry[] {
  return entries.filter(
    (entry) => entry.weightKg != null && entry.weightKg > 0,
  );
}

export function getPhotoEntries(
  entries: ProgressJournalEntry[],
): ProgressJournalEntry[] {
  return entries.filter((entry) => Boolean(entry.photoDataUrl));
}

export function getWeightDeltaKg(
  entry: ProgressJournalEntry,
  entriesSortedDesc: ProgressJournalEntry[],
): number | null {
  if (entry.weightKg == null || entry.weightKg <= 0) {
    return null;
  }

  const older = entriesSortedDesc.find(
    (candidate) =>
      candidate.date < entry.date &&
      candidate.weightKg != null &&
      candidate.weightKg > 0,
  );

  if (!older?.weightKg) {
    return null;
  }

  return Math.round((entry.weightKg - older.weightKg) * 10) / 10;
}

function formatDeltaDisplay(deltaKg: number, units: UnitsPreference): string {
  const abs = Math.abs(deltaKg);
  const sign = deltaKg > 0 ? "+" : deltaKg < 0 ? "−" : "";
  if (units === "metric") {
    return `${sign}${Math.round(abs * 10) / 10} kg`;
  }
  return `${sign}${Math.round(Math.abs(kgToLb(deltaKg)))} lb`;
}

export interface ProgressJournalStats {
  latestEntry: ProgressJournalEntry | null;
  currentWeightKg: number | null;
  currentWeightLabel: string | null;
  changeSinceLastKg: number | null;
  changeSinceLastLabel: string | null;
  changeDirection: "down" | "up" | "flat" | "none";
  totalPhotos: number;
  totalEntries: number;
}

export function buildProgressJournalStats(
  entries: ProgressJournalEntry[],
  units: UnitsPreference,
): ProgressJournalStats {
  const latestEntry = entries[0] ?? null;
  const weightEntries = getWeightEntries(entries);
  const latestWeightEntry = weightEntries[0] ?? null;
  const previousWeightEntry = weightEntries[1] ?? null;
  const currentWeightKg = latestWeightEntry?.weightKg ?? null;
  const changeSinceLastKg =
    latestWeightEntry && previousWeightEntry?.weightKg
      ? Math.round(
          (latestWeightEntry.weightKg! - previousWeightEntry.weightKg) * 10,
        ) / 10
      : null;

  let changeDirection: ProgressJournalStats["changeDirection"] = "none";
  if (changeSinceLastKg != null) {
    if (Math.abs(changeSinceLastKg) < 0.1) {
      changeDirection = "flat";
    } else if (changeSinceLastKg < 0) {
      changeDirection = "down";
    } else {
      changeDirection = "up";
    }
  }

  return {
    latestEntry,
    currentWeightKg,
    currentWeightLabel:
      currentWeightKg != null
        ? formatWeightDisplay(currentWeightKg, units)
        : null,
    changeSinceLastKg,
    changeSinceLastLabel:
      changeSinceLastKg != null
        ? formatDeltaDisplay(changeSinceLastKg, units)
        : null,
    changeDirection,
    totalPhotos: getPhotoEntries(entries).length,
    totalEntries: entries.length,
  };
}
