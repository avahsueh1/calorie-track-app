"use client";

import { useAppState } from "./AppStateProvider";

export function useProgressJournal() {
  const {
    progressJournal,
    progressJournalByDate,
    upsertProgressJournal,
    removeProgressJournal,
  } = useAppState();

  return {
    progressJournal,
    progressJournalByDate,
    upsertProgressJournal,
    removeProgressJournal,
  };
}
