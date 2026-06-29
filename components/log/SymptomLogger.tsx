"use client";

import { useEffect, useState } from "react";
import type { DailyCheckIn, SymptomEntry, SymptomKey } from "../../types";
import {
  areDailyCheckInsEqual,
  cloneDailyCheckIn,
} from "../../lib/checkInHelpers";
import { CHECK_IN_SECTIONS } from "../../lib/symptomOptions";
import { getSectionIconStyle } from "../../lib/symptomIcons";
import { colors, sans, sectionTitleStyle } from "../dashboard/theme";
import { AppCard } from "../ui/AppCard";
import { ExpandableNoteCard } from "../ui/ExpandableNoteCard";
import { IconBubble } from "../ui/IconBubble";
import { PrimaryButton } from "../ui/primitives";
import { SymptomRow } from "./SymptomRow";
const SAVE_FEEDBACK_MS = 2000;

interface SymptomLoggerProps {
  saved: DailyCheckIn;
  onSave: (checkIn: DailyCheckIn) => void;
}

export function SymptomLogger({ saved, onSave }: SymptomLoggerProps) {
  const [draft, setDraft] = useState<DailyCheckIn>(() => cloneDailyCheckIn(saved));
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [editingKey, setEditingKey] = useState<SymptomKey | null>(null);

  useEffect(() => {
    setDraft(cloneDailyCheckIn(saved));
    setEditingKey(null);
  }, [saved]);

  const hasChanges = !areDailyCheckInsEqual(draft, saved);
  const canSave = hasChanges && !isSaving;

  function hasSymptomUnsavedChanges(
    key: SymptomKey,
    draftEntry?: SymptomEntry,
  ): boolean {
    if (!draftEntry?.selection) {
      return false;
    }

    const savedEntry = saved.symptoms[key];

    if (!savedEntry) {
      return true;
    }

    return (
      draftEntry.selection !== savedEntry.selection ||
      (draftEntry.note ?? "") !== (savedEntry.note ?? "")
    );
  }
  function markDirty() {
    setJustSaved(false);
  }

  function selectSymptom(key: SymptomKey) {
    setEditingKey(key);
  }

  function removeSymptom(key: SymptomKey) {
    setDraft((current) => {
      const next = cloneDailyCheckIn(current);
      delete next.symptoms[key];
      return next;
    });
    setEditingKey((current) => (current === key ? null : current));
    markDirty();
  }

  function updateSelection(key: SymptomKey, selection: string) {
    setDraft((current) => {
      const existing = current.symptoms[key];
      return {
        ...current,
        symptoms: {
          ...current.symptoms,
          [key]: {
            selection,
            ...(existing?.note ? { note: existing.note } : {}),
          },
        },
      };
    });
    markDirty();
  }

  function updateSymptomNote(key: SymptomKey, note: string) {
    setDraft((current) => {
      const entry = current.symptoms[key];
      if (!entry?.selection) {
        return current;
      }
      return {
        ...current,
        symptoms: {
          ...current.symptoms,
          [key]: { ...entry, note },
        },
      };
    });
    markDirty();
  }

  function finishSymptom(key: SymptomKey) {
    setDraft((current) => {
      const entry = current.symptoms[key];
      if (!entry?.selection) {
        const next = cloneDailyCheckIn(current);
        delete next.symptoms[key];
        return next;
      }

      const trimmed = entry.note?.trim();
      return {
        ...current,
        symptoms: {
          ...current.symptoms,
          [key]: trimmed
            ? { selection: entry.selection, note: trimmed }
            : { selection: entry.selection },
        },
      };
    });
    setEditingKey(null);
    markDirty();
  }

  function handleNotesChange(notes: string) {
    setDraft((current) => ({ ...current, notes }));
    markDirty();
  }

  function handleSave() {
    if (!canSave) {
      return;
    }

    setIsSaving(true);
    onSave(cloneDailyCheckIn(draft));

    window.setTimeout(() => {
      setIsSaving(false);
      setJustSaved(true);
      setEditingKey(null);
      window.setTimeout(() => setJustSaved(false), SAVE_FEEDBACK_MS);
    }, 300);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {CHECK_IN_SECTIONS.map((section) => {
        const sectionIcon = getSectionIconStyle(section.category);

        return (
          <AppCard key={section.category} variant="soft" padding="14px">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <IconBubble
                icon={sectionIcon.icon}
                backgroundColor={sectionIcon.backgroundColor}
                color={sectionIcon.color}
                size="sm"
              />
              <h3
                style={{
                  ...sectionTitleStyle(),
                  fontSize: "0.95rem",
                  margin: 0,
                }}
              >
                {section.title}
              </h3>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "8px",
              }}
            >
              {section.items.map((item) => {
                const entry = draft.symptoms[item.key];
                const isSelected = Boolean(entry?.selection);
                const isExpanded = editingKey === item.key;

                return (
                  <SymptomRow
                    key={item.key}
                    symptomKey={item.key}
                    label={item.label}
                    selected={isSelected}
                    expanded={isExpanded}
                    selection={entry?.selection}
                    note={entry?.note}
                    onSelect={() => selectSymptom(item.key)}
                    onExpand={() => setEditingKey(item.key)}
                    onRemove={() => removeSymptom(item.key)}
                    onSelectionChange={(selection) =>
                      updateSelection(item.key, selection)
                    }
                    onNoteChange={(note) => updateSymptomNote(item.key, note)}
                    onDone={() => finishSymptom(item.key)}
                    hasUnsavedChanges={hasSymptomUnsavedChanges(
                      item.key,
                      entry,
                    )}
                  />
                );
              })}
            </div>
          </AppCard>
        );
      })}

      <ExpandableNoteCard
        value={draft.notes ?? ""}
        onChange={handleNotesChange}
        textareaId="check-in-notes"
        subtitle="Optional — your personal thoughts about today"
        placeholder="How are you feeling overall? Anything you want to remember?"
        variant="compact"
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <PrimaryButton
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          style={{
            opacity: canSave ? 1 : 0.45,
            cursor: canSave ? "pointer" : "not-allowed",
          }}
        >
          {isSaving ? "Saving..." : "Save Check-In"}
        </PrimaryButton>
        {justSaved ? (
          <p
            style={{
              margin: 0,
              textAlign: "center",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: colors.sage,
              fontFamily: sans,
            }}
          >
            Check-in saved.
          </p>
        ) : null}
      </div>
    </div>
  );
}
