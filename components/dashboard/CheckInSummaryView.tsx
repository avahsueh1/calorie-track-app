"use client";

import type { DailyCheckIn } from "../../types";
import {
  CHECK_IN_SCALE_WORDS,
  formatSeverityLabel,
  type CheckInSeverityField,
  type CravingLevel,
  type ScaleRating,
} from "../../types/wellness";
import { buildCheckInSummarySentence } from "../../lib/checkInSummary";
import { DailyNote } from "../ui/DailyNote";
import { MetricRow } from "../ui/MetricRow";
import { resolveStatusTone } from "../ui/StatusPill";

export const checkInIconPalette = {
  mood: { bg: "#DDEAD8", color: "#5A7350" },
  energy: { bg: "#F7D7BE", color: "#B87A4A" },
  hunger: { bg: "#E1EFD9", color: "#5E8A54" },
  sleepQuality: { bg: "#DDEAF8", color: "#5A7A9A" },
  stress: { bg: "#DDE7F6", color: "#6078A0" },
  cravings: { bg: "#F4DCD5", color: "#A86050" },
  bloating: { bg: "#F3E8D8", color: "#9A8055" },
  soreness: { bg: "#E3EBDD", color: "#6B8570" },
} as const;

const TILE_GAP = "11px";
const scaleWords = [...CHECK_IN_SCALE_WORDS];

function formatScaleRatingValue(rating: ScaleRating): string {
  return `${rating}/5`;
}

function getRowIconStyle(
  key: keyof typeof checkInIconPalette,
): { iconBackground: string; iconColor: string } {
  const treatment = checkInIconPalette[key];
  return { iconBackground: treatment.bg, iconColor: treatment.color };
}

function scaleHelper(key: string, value: ScaleRating): string {
  const word = scaleWords[value - 1];
  const helpers: Record<string, Record<string, string>> = {
    mood: {
      "Very low": "Be gentle with yourself",
      Low: "Take things slowly",
      Moderate: "Feeling steady",
      Good: "Feeling steady",
      High: "Bright and uplifted",
    },
    energy: {
      "Very low": "Take it gently",
      Low: "Take it gently",
      Moderate: "Steady pace",
      Good: "Good momentum",
      High: "Strong reserves",
    },
    hunger: {
      "Very low": "Light appetite",
      Low: "Light appetite",
      Moderate: "Regular meals",
      Good: "Well fueled",
      High: "Fuel as needed",
    },
    sleepQuality: {
      "Very low": "Extra rest may help",
      Low: "Extra rest may help",
      Moderate: "Adequate rest",
      Good: "Rest helped",
      High: "Well rested",
    },
    stress: {
      "Very low": "Calm baseline",
      Low: "Calm baseline",
      Moderate: "Watch the pace",
      Good: "Manageable load",
      High: "Prioritize ease",
    },
  };
  return helpers[key]?.[word] ?? "Stay aware";
}

function severityHelper(field: CheckInSeverityField, value: CravingLevel): string {
  const helpers: Record<CheckInSeverityField, Record<CravingLevel, string>> = {
    cravings: {
      none: "Cravings quiet",
      mild: "Notice gently",
      strong: "Supportive snacks",
    },
    bloating: {
      none: "Feeling comfortable",
      mild: "Move gently",
      strong: "Extra care may help",
    },
    soreness: {
      none: "Recovered",
      mild: "Move gently today",
      strong: "Prioritize recovery",
    },
  };
  return helpers[field][value];
}

interface CheckInSummaryViewProps {
  saved: DailyCheckIn;
  onRowPress?: () => void;
}

export function CheckInSummaryView({ saved, onRowPress }: CheckInSummaryViewProps) {
  const metrics = [
    {
      icon: "✦",
      ...getRowIconStyle("mood"),
      key: "mood",
      label: "Mood",
      value: formatScaleRatingValue(saved.mood),
      helper: scaleHelper("mood", saved.mood),
      valueKind: "rating" as const,
    },
    {
      icon: "⚡",
      ...getRowIconStyle("energy"),
      key: "energy",
      label: "Energy",
      value: formatScaleRatingValue(saved.energy),
      helper: scaleHelper("energy", saved.energy),
      valueKind: "rating" as const,
    },
    {
      icon: "♡",
      ...getRowIconStyle("hunger"),
      key: "hunger",
      label: "Hunger",
      value: formatScaleRatingValue(saved.hunger),
      helper: scaleHelper("hunger", saved.hunger),
      valueKind: "rating" as const,
    },
    {
      icon: "☾",
      ...getRowIconStyle("sleepQuality"),
      key: "sleepQuality",
      label: "Sleep",
      value: formatScaleRatingValue(saved.sleepQuality),
      helper: scaleHelper("sleepQuality", saved.sleepQuality),
      valueKind: "rating" as const,
    },
    {
      icon: "〜",
      ...getRowIconStyle("stress"),
      key: "stress",
      label: "Stress",
      value: formatScaleRatingValue(saved.stress),
      helper: scaleHelper("stress", saved.stress),
      valueKind: "rating" as const,
    },
    {
      icon: "◎",
      ...getRowIconStyle("cravings"),
      key: "cravings",
      label: "Cravings",
      value: formatSeverityLabel(saved.cravings),
      helper: severityHelper("cravings", saved.cravings),
      valueKind: "severity" as const,
    },
    {
      icon: "◌",
      ...getRowIconStyle("bloating"),
      key: "bloating",
      label: "Bloating",
      value: formatSeverityLabel(saved.bloating),
      helper: severityHelper("bloating", saved.bloating),
      valueKind: "severity" as const,
    },
    {
      icon: "↯",
      ...getRowIconStyle("soreness"),
      key: "soreness",
      label: "Soreness",
      value: formatSeverityLabel(saved.soreness),
      helper: severityHelper("soreness", saved.soreness),
      valueKind: "severity" as const,
    },
  ];

  const notesPreview = saved.notes?.trim();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <DailyNote variant="summary">{buildCheckInSummarySentence(saved)}</DailyNote>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: TILE_GAP,
        }}
      >
        {metrics.map((metric) => (
          <MetricRow
            key={metric.key}
            icon={metric.icon}
            iconBackground={metric.iconBackground}
            iconColor={metric.iconColor}
            label={metric.label}
            note={metric.helper}
            value={metric.value}
            tone={
              metric.valueKind === "severity"
                ? resolveStatusTone(metric.value)
                : "good"
            }
            onPress={onRowPress}
          />
        ))}
      </div>

      {notesPreview ? (
        <DailyNote variant="savedNotes">{notesPreview}</DailyNote>
      ) : null}
    </div>
  );
}
