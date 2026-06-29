"use client";

import type { SymptomKey } from "../../../types";
import type { SymptomInsightsData } from "../../../lib/symptomInsights";
import { AppCard } from "../../ui/primitives";
import { insightsColors, insightsSans } from "../theme";
import { SymptomLoggingSummaryCard } from "./SymptomLoggingSummaryCard";
import { SymptomPhaseBreakdown } from "./SymptomPhaseBreakdown";
import { TopLoggedSymptoms } from "./TopLoggedSymptoms";

interface SymptomInsightsContentProps {
  data: SymptomInsightsData;
  showPhaseBreakdown?: boolean;
  embedded?: boolean;
  variant?: "all" | "symptoms" | "cycle";
  excludeSymptomKeys?: SymptomKey[];
}

export function SymptomInsightsContent({
  data,
  showPhaseBreakdown = true,
  embedded = false,
  variant = "all",
  excludeSymptomKeys = [],
}: SymptomInsightsContentProps) {
  if (data.totalCheckInDays === 0) {
    const emptyState = (
      <p
        style={{
          margin: 0,
          fontSize: "0.8125rem",
          lineHeight: 1.45,
          color: insightsColors.textSecondary,
          fontFamily: insightsSans,
          fontStyle: "italic",
        }}
      >
        Log a few check-ins to see cycle patterns.
      </p>
    );

    if (embedded) {
      return emptyState;
    }

    return (
      <AppCard variant="soft" padding="16px">
        {emptyState}
      </AppCard>
    );
  }

  const showSymptoms = variant === "all" || variant === "symptoms";
  const showCycle =
    (variant === "all" || variant === "cycle") && showPhaseBreakdown;

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {showSymptoms ? (
        <>
          <TopLoggedSymptoms
            symptoms={data.topSymptoms}
            totalCheckInDays={data.totalCheckInDays}
            excludeSymptomKeys={excludeSymptomKeys}
            embedded
            hideHeader={variant !== "all"}
          />
          {variant === "all" || variant === "symptoms" ? (
            <SymptomLoggingSummaryCard summary={data.loggingSummary} embedded />
          ) : null}
        </>
      ) : null}
      {showCycle ? (
        <SymptomPhaseBreakdown
          breakdown={data.phaseBreakdown}
          hasEnoughData={data.hasEnoughData}
          embedded
          hideHeader={variant !== "all"}
        />
      ) : null}
    </div>
  );

  if (embedded) {
    return content;
  }

  return content;
}
