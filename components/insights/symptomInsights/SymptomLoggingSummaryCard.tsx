"use client";

import type { SymptomLoggingSummary } from "../../../lib/symptomInsights";
import { AppCard } from "../../ui/primitives";
import { ReportSubsectionHeader } from "../PatternInsightRow";
import { insightsColors, insightsSans } from "../theme";

interface SymptomLoggingSummaryCardProps {
  summary: SymptomLoggingSummary;
  embedded?: boolean;
}

function formatDotLabel(label: string): string {
  const parts = label.split(" ");
  return parts[parts.length - 1] ?? label;
}

export function SymptomLoggingSummaryCard({
  summary,
  embedded = false,
}: SymptomLoggingSummaryCardProps) {
  const content = (
    <>
      <ReportSubsectionHeader
        title="Logging lately"
        helper="When you checked in over the last 30 days."
      />

      <p
        style={{
          margin: "0 0 6px",
          fontFamily: insightsSans,
          fontSize: "0.875rem",
          lineHeight: 1.5,
          color: insightsColors.text,
        }}
      >
        {summary.summarySentence}
      </p>

      {summary.detailSentence ? (
        <p
          style={{
            margin: "0 0 16px",
            fontFamily: insightsSans,
            fontSize: "0.8125rem",
            lineHeight: 1.5,
            color: insightsColors.textSecondary,
          }}
        >
          {summary.detailSentence}
        </p>
      ) : (
        <div style={{ marginBottom: "16px" }} />
      )}

      <div>
        <p
          style={{
            margin: "0 0 10px",
            fontFamily: insightsSans,
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
            color: insightsColors.textSecondary,
          }}
        >
          Last 14 days
        </p>
        <div
          role="img"
          aria-label={`Symptom check-ins over the last 14 days: ${summary.recentDays.filter((day) => day.logged).length} days logged`}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${summary.recentDays.length}, minmax(0, 1fr))`,
            gap: "6px",
          }}
        >
          {summary.recentDays.map((day) => (
            <div
              key={day.dateKey}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "5px",
                minWidth: 0,
              }}
            >
              <span
                title={`${day.label}${day.logged ? " — logged" : " — no log"}`}
                style={{
                  display: "block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "999px",
                  backgroundColor: day.logged
                    ? insightsColors.lavender
                    : "transparent",
                  border: day.logged
                    ? "none"
                    : `1.5px solid ${insightsColors.border}`,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: insightsSans,
                  fontSize: "0.625rem",
                  lineHeight: 1,
                  color: day.logged
                    ? insightsColors.text
                    : insightsColors.textSecondary,
                  fontWeight: day.logged ? 600 : 400,
                }}
              >
                {formatDotLabel(day.label)}
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "12px",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: insightsSans,
              fontSize: "0.75rem",
              color: insightsColors.textSecondary,
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                backgroundColor: insightsColors.lavender,
              }}
            />
            Logged
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: insightsSans,
              fontSize: "0.75rem",
              color: insightsColors.textSecondary,
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                border: `1.5px solid ${insightsColors.border}`,
              }}
            />
            No log
          </span>
        </div>
      </div>
    </>
  );

  if (embedded) {
    return content;
  }

  return (
    <AppCard variant="soft" padding="16px">
      {content}
    </AppCard>
  );
}
