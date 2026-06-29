"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { resolveInsightsDayNote } from "../../data/sampleInsights";
import { useInsightsData } from "../providers/AppStateProvider";
import type { BodyPatternCalendarDay } from "../../types/wellness";
import { ExpandableNoteCard } from "../ui/ExpandableNoteCard";

interface DayNotesSectionProps {
  dateKey: string;
  entry: BodyPatternCalendarDay | null;
  style?: CSSProperties;
  subtitle?: string;
  placeholder?: string;
  variant?: "compact" | "reminder";
}

export function DayNotesSection({
  dateKey,
  entry,
  style,
  subtitle = "Optional — your personal thoughts about this day",
  placeholder = "How did this day feel? Anything you want to remember?",
  variant = "reminder",
}: DayNotesSectionProps) {
  const { dailyCheckIns, insightsDayNotes, updateInsightsDayNote } =
    useInsightsData();
  const savedNote = resolveInsightsDayNote(
    dateKey,
    entry,
    insightsDayNotes,
    dailyCheckIns,
  );

  const [draft, setDraft] = useState(savedNote);

  useEffect(() => {
    setDraft(savedNote);
  }, [savedNote]);

  function handleChange(value: string) {
    setDraft(value);
    updateInsightsDayNote(dateKey, value);
  }

  return (
    <div style={{ width: "100%", ...style }}>
      <ExpandableNoteCard
        value={draft}
        onChange={handleChange}
        textareaId={`day-note-${dateKey}`}
        titleWhenEmpty="Add a personal note"
        titleWhenFilled="Personal note"
        subtitle={subtitle}
        placeholder={placeholder}
        variant={variant}
      />
    </div>
  );
}
