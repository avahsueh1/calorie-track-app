"use client";

import type { DailySummaryDisplay, MacroSummary } from "../../types/wellness";
import { AppCard } from "../ui/AppCard";
import { MacroStrip } from "../ui/EnergyMacroStatGrids";
import { NourishmentRing } from "./NourishmentRing";
import { colors, formatNumber, sans } from "./theme";

interface NourishmentCardProps {
  summary: DailySummaryDisplay;
  macros: MacroSummary[];
}

export function NourishmentCard({ summary, macros }: NourishmentCardProps) {
  return (
    <AppCard padding="24px">
      <header>
        <h2
          style={{
            margin: 0,
            fontFamily: sans,
            fontSize: "1rem",
            fontWeight: 600,
            color: colors.text,
            letterSpacing: "-0.01em",
          }}
        >
          Today&apos;s energy
        </h2>
        <p
          style={{
            margin: "4px 0 0",
            fontFamily: sans,
            fontSize: "0.8125rem",
            color: colors.muted,
          }}
        >
          {formatNumber(summary.remaining)} kcal remaining
        </p>
      </header>

      <div className="nourishment-body">
        <NourishmentRing summary={summary} />
        <MacroStrip macros={macros} showLabel={false} />
      </div>
    </AppCard>
  );
}
