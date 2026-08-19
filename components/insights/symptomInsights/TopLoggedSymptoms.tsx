"use client";

import type { SymptomFrequencyRow } from "../../../lib/symptomInsights";
import type { SymptomKey } from "../../../types";
import { AppCard } from "../../ui/primitives";
import { ReportSubsectionHeader } from "../PatternInsightRow";
import { insightsColors, insightsSans } from "../theme";
import { buildSymptomMetricItems } from "./phaseInsightCopy";
import { SymptomMetricRow } from "./SymptomMetricRow";

interface TopLoggedSymptomsProps {
  symptoms: SymptomFrequencyRow[];
  totalCheckInDays: number;
  embedded?: boolean;
  compact?: boolean;
  limit?: number;
  excludeSymptomKeys?: SymptomKey[];
  hideHeader?: boolean;
}

export function TopLoggedSymptoms({
  symptoms,
  totalCheckInDays,
  embedded = false,
  compact = false,
  limit = 5,
  excludeSymptomKeys = [],
  hideHeader = false,
}: TopLoggedSymptomsProps) {
  const filteredSymptoms = symptoms.filter(
    (symptom) => !excludeSymptomKeys.includes(symptom.key),
  );
  const items = buildSymptomMetricItems(filteredSymptoms, totalCheckInDays, limit);

  const content = (
    <>
      {hideHeader ? null : (
        <ReportSubsectionHeader
          title="Symptoms"
          helper="What you logged most often."
        />
      )}

      {items.length === 0 ? (
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
          {symptoms.length > 0 && excludeSymptomKeys.length > 0
            ? "Your top symptoms are already in the pattern summary above."
            : "No symptoms logged yet."}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: compact ? "6px" : "10px" }}>
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
              dense={compact}
            />
          ))}
        </div>
      )}
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
