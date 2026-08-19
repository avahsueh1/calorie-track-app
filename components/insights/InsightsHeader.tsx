"use client";

import Link from "next/link";
import {
  insightsColors,
  insightsNoteStyle,
  insightsSans,
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
    <header className="insights-page-header">
      <div className="insights-page-header-main">
        <h1 className="insights-page-title">Insights</h1>
        <p
          style={{
            ...insightsSubtitleStyle(),
            margin: "4px 0 0",
            fontSize: "0.82rem",
            color: insightsColors.text,
          }}
        >
          Your weekly health overview
        </p>
        {showCycleContext && cycleContextLabel ? (
          <p
            style={{
              margin: "4px 0 0",
              fontFamily: insightsSans,
              fontSize: "0.78rem",
              lineHeight: 1.4,
              color: insightsColors.terracotta,
            }}
          >
            {cycleContextLabel}
          </p>
        ) : null}
        <p style={{ ...insightsNoteStyle(), marginTop: "4px" }}>
          {loggedDaysCount < 3
            ? "Log more days to unlock stronger patterns."
            : `${loggedDaysCount} logged days in your local history.`}
        </p>
      </div>

      {showGenerateReport ? (
        <div className="insights-page-header-actions">
          <Link href={routes.healthReport} style={{ textDecoration: "none" }}>
            <OutlineButton type="button" style={{ width: "auto" }}>
              Generate Report
            </OutlineButton>
          </Link>
        </div>
      ) : null}
    </header>
  );
}
