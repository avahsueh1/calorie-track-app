"use client";

import type { PatternInsightCardData } from "../../types/wellness";
import { PatternInsightCard } from "./PatternInsightCard";
import { insightsCardStyle } from "./theme";

interface InsightsPatternCardProps {
  card: PatternInsightCardData;
}

export function InsightsPatternCard({ card }: InsightsPatternCardProps) {
  return (
    <section
      className="insights-panel insights-bento-pattern"
      style={{
        ...insightsCardStyle(),
        padding: "14px 16px",
      }}
    >
      <PatternInsightCard card={card} />
    </section>
  );
}
