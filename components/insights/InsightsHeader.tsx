"use client";

import Link from "next/link";
import {
  insightsColors,
  insightsNoteStyle,
  insightsSerif,
  insightsSubtitleStyle,
} from "./theme";
import { useCycleContext } from "../providers/AppStateProvider";
import { routes } from "../../lib/routes";
import { OutlineButton } from "../ui/primitives";

interface InsightsHeaderProps {
  loggedDaysCount: number;
  showCycleContext?: boolean;
  showGenerateReport?: boolean;
}

export function InsightsHeader({
  loggedDaysCount,
  showCycleContext = true,
  showGenerateReport = true,
}: InsightsHeaderProps) {
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
      {showCycleContext && cycleContextLabel ? (
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
      {showGenerateReport ? (
        <Link
          href={routes.healthReport}
          style={{
            display: "block",
            marginTop: "14px",
            textDecoration: "none",
          }}
        >
          <OutlineButton type="button">Generate Report</OutlineButton>
        </Link>
      ) : null}
    </header>
  );
}
