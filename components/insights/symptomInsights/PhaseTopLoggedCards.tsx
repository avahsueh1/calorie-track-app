"use client";

import type { PhaseSymptomSummary } from "../../../lib/symptomInsights";
import { buildPhaseMetricItems } from "./phaseInsightCopy";
import { SymptomMetricRow } from "./SymptomMetricRow";
interface PhaseTopLoggedCardsProps {
  phase: PhaseSymptomSummary;
  limit?: number;
  compact?: boolean;
}

export function PhaseTopLoggedCards({
  phase,
  limit = 5,
  compact = false,
}: PhaseTopLoggedCardsProps) {
  const items = buildPhaseMetricItems(phase, limit);

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: compact ? "8px" : "10px",
      }}
    >
      {items.map((item) => (
        <SymptomMetricRow
          key={item.id}
          label={item.label}
          headline={item.headline}
          body={item.body}
          meta={item.meta}
          category={item.category}
          percent={item.percent}
          iconStyle={item.iconStyle}
          barColor={item.barColor}
          compact={compact}
        />
      ))}
    </div>
  );
}
