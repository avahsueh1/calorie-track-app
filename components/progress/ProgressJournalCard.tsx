"use client";

import { useState, useEffect } from "react";
import type { ProgressJournalEntry } from "../../types/wellness";
import type { UnitsPreference } from "../../types/profile";
import type { ProgressJournalUpsert } from "../../lib/progressJournal";
import { todayDateKey } from "../../lib/appStateHelpers";
import { logTabStackStyle } from "../log/shared";
import { ProgressJournalEntryForm } from "./ProgressJournalEntryForm";
import { ProgressJournalPopulatedView } from "./ProgressJournalPopulatedView";
import { ProgressJournalFullView } from "./ProgressJournalFullView";
import { ProgressJournalInfoStrip } from "./ProgressJournalInfoStrip";
import { progressJournalPageStackStyle } from "./progressJournalUi";

interface ProgressJournalCardProps {
  journalByDate: Record<string, ProgressJournalEntry>;
  entries: ProgressJournalEntry[];
  units: UnitsPreference;
  onSave: (patch: ProgressJournalUpsert) => void;
  onRemove?: (date: string) => void;
  recentLimit?: number;
  /** Insights full page uses layered hero + secondary stats layout. */
  variant?: "log" | "insightsFull";
  initialEditDate?: string | null;
}

type FormMode = { open: false } | { open: true; date: string };

export function ProgressJournalCard({
  journalByDate,
  entries,
  units,
  onSave,
  recentLimit,
  variant = "log",
  initialEditDate,
}: ProgressJournalCardProps) {
  const hasEntries = entries.length > 0;
  const [formMode, setFormMode] = useState<FormMode>({ open: false });

  function openNewEntry() {
    setFormMode({ open: true, date: todayDateKey() });
  }

  function openEditEntry(date: string) {
    setFormMode({ open: true, date });
  }

  useEffect(() => {
    if (!initialEditDate || !hasEntries) {
      return;
    }

    const hasEntry = entries.some((entry) => entry.date === initialEditDate);
    if (hasEntry) {
      setFormMode({ open: true, date: initialEditDate });
    }
  }, [initialEditDate, hasEntries, entries]);

  function closeForm() {
    setFormMode({ open: false });
  }

  function handleSave(patch: ProgressJournalUpsert) {
    onSave(patch);
    closeForm();
  }

  if (!hasEntries) {
    return (
      <div
        style={
          variant === "insightsFull"
            ? progressJournalPageStackStyle()
            : logTabStackStyle()
        }
      >
        <ProgressJournalEntryForm
          journalByDate={journalByDate}
          units={units}
          title={variant === "insightsFull" ? "Add your first entry" : "Progress Journal"}
          onSave={handleSave}
        />
        {variant === "insightsFull" ? <ProgressJournalInfoStrip /> : null}
      </div>
    );
  }

  if (formMode.open) {
    const editingExisting = Boolean(journalByDate[formMode.date]);
    return (
      <div style={logTabStackStyle()}>
        <ProgressJournalEntryForm
          journalByDate={journalByDate}
          units={units}
          initialDate={formMode.date}
          title={editingExisting ? "Edit entry" : "Add entry"}
          onSave={handleSave}
          onCancel={closeForm}
        />
      </div>
    );
  }

  return (
    <div style={variant === "insightsFull" ? undefined : logTabStackStyle()}>
      {variant === "insightsFull" ? (
        <ProgressJournalFullView
          entries={entries}
          units={units}
          onAddEntry={openNewEntry}
          onEditEntry={openEditEntry}
        />
      ) : (
        <ProgressJournalPopulatedView
          entries={entries}
          units={units}
          onAddEntry={openNewEntry}
          onEditEntry={openEditEntry}
          recentLimit={recentLimit}
        />
      )}
    </div>
  );
}
