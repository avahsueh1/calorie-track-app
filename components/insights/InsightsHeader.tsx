"use client";

import {
  insightsColors,
  insightsNoteStyle,
  insightsSerif,
  insightsSubtitleStyle,
} from "./theme";
import { useCycleContext } from "../providers/AppStateProvider";

interface InsightsHeaderProps {
  loggedDaysCount: number;
}

export function InsightsHeader({ loggedDaysCount }: InsightsHeaderProps) {
  const { cycleContext } = useCycleContext();
  const cycleContextLabel = [
    cycleContext.cycleDayLabel,
    cycleContext.phaseLabel,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <header>
      <h1
        style={{
          margin: "0 0 4px",
          fontFamily: insightsSerif,
          fontSize: "1.75rem",
          fontWeight: 400,
          color: insightsColors.text,
          letterSpacing: "-0.02em",
        }}
      >
        Insights
      </h1>
      <p style={insightsSubtitleStyle()}>This week</p>
      {cycleContextLabel ? (
        <p
          style={{
            ...insightsSubtitleStyle(),
            marginTop: "4px",
            color: insightsColors.terracotta,
          }}
        >
          {cycleContextLabel}
        </p>
      ) : null}
      <p style={{ ...insightsNoteStyle(), marginTop: "10px" }}>
        {loggedDaysCount < 3
          ? "Log more days to unlock stronger patterns."
          : `${loggedDaysCount} logged days in your local history.`}
      </p>
    </header>
  );
}
