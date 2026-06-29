"use client";

import type { ReportInsightCard } from "../../../lib/reportAnalytics";
import { CoverageRing } from "./ReportVisuals";
import { insightsColors, insightsSans, insightsSerif } from "../theme";

const HIGHLIGHT_LIMIT = 3;

interface ReportTopSummaryProps {
  title: string;
  dateRangeLabel: string;
  loggedDays: number;
  highlights: ReportInsightCard[];
}

export function ReportTopSummary({
  title,
  dateRangeLabel,
  loggedDays,
  highlights,
}: ReportTopSummaryProps) {
  const topHighlights = highlights.slice(0, HIGHLIGHT_LIMIT);

  return (
    <div
      style={{
        padding: "18px 20px",
        borderRadius: "18px",
        background: "linear-gradient(145deg, #FFF9F5 0%, #F3EAF8 55%, #EEF5EE 100%)",
        border: `1px solid ${insightsColors.border}`,
        boxShadow: "0 8px 24px rgba(74, 61, 54, 0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: topHighlights.length > 0 ? "14px" : 0,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              margin: "0 0 6px",
              fontFamily: insightsSerif,
              fontSize: "1.35rem",
              fontWeight: 400,
              color: insightsColors.text,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: "0 0 4px",
              fontFamily: insightsSans,
              fontSize: "0.8125rem",
              lineHeight: 1.45,
              color: insightsColors.textSecondary,
            }}
          >
            {dateRangeLabel}
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: insightsSans,
              fontSize: "0.8125rem",
              fontWeight: 600,
              lineHeight: 1.45,
              color: insightsColors.text,
            }}
          >
            {loggedDays} day{loggedDays === 1 ? "" : "s"} logged
          </p>
        </div>
        <div style={{ flexShrink: 0 }}>
          <CoverageRing loggedDays={loggedDays} size={72} />
        </div>
      </div>

      {topHighlights.length > 0 ? (
        <ul
          style={{
            margin: 0,
            padding: "12px 14px",
            listStyle: "none",
            borderRadius: "14px",
            backgroundColor: "rgba(255, 253, 251, 0.72)",
            border: `1px solid ${insightsColors.border}`,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {topHighlights.map((insight) => (
            <li
              key={insight.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                fontFamily: insightsSans,
                fontSize: "0.8125rem",
                lineHeight: 1.45,
                color: insightsColors.text,
              }}
            >
              <span
                aria-hidden
                style={{
                  marginTop: "6px",
                  width: "5px",
                  height: "5px",
                  borderRadius: "999px",
                  backgroundColor: insightsColors.lavender,
                  flexShrink: 0,
                }}
              />
              <span>{insight.headline}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
