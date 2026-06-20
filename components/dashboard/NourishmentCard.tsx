"use client";

import type { DailySummaryDisplay, MacroSummary } from "../../types/wellness";
import { MacroBars } from "./MacroBars";
import { NourishmentRing } from "./NourishmentRing";
import { cardStyle, layout } from "./theme";

interface NourishmentCardProps {
  summary: DailySummaryDisplay;
  macros: MacroSummary[];
}

export function NourishmentCard({ summary, macros }: NourishmentCardProps) {
  return (
    <section
      style={{
        ...cardStyle(),
        padding: `${layout.cardPadding} 16px 20px`,
      }}
    >
      <NourishmentRing summary={summary} />
      <MacroBars macros={macros} />
    </section>
  );
}
