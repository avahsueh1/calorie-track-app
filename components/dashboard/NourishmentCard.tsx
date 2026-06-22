"use client";

import type { DailySummaryDisplay, MacroSummary } from "../../types/wellness";
import { AppCard } from "../ui/AppCard";
import { CalorieStatGrid, MacroStatGrid } from "../ui/EnergyMacroStatGrids";
import { NourishmentRing } from "./NourishmentRing";
import { colors, formatNumber, sans } from "./theme";

interface NourishmentCardProps {
  summary: DailySummaryDisplay;
  macros: MacroSummary[];
}

export function NourishmentCard({ summary, macros }: NourishmentCardProps) {
  return (
    <AppCard
      padding="23px 20px 16px"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>
        <header style={{ marginBottom: "20px" }}>
          <h2
            style={{
              margin: 0,
              fontFamily: sans,
              fontSize: "1.125rem",
              fontWeight: 600,
              color: colors.text,
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
            }}
          >
            Today&apos;s energy
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              fontFamily: sans,
              fontSize: "0.875rem",
              fontWeight: 400,
              color: colors.muted,
              lineHeight: 1.35,
            }}
          >
            {formatNumber(summary.remaining)} kcal left for today
          </p>
        </header>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <NourishmentRing summary={summary} />
        </div>

        <div style={{ marginTop: "10px" }}>
          <CalorieStatGrid
            tileSize="compact"
            summary={{
              eaten: summary.eaten,
              burned: summary.burned,
              target: summary.tdee,
              remaining: summary.remaining,
            }}
          />
        </div>

        <div style={{ marginTop: "16px" }}>
          <MacroStatGrid macros={macros} />
        </div>
      </div>
    </AppCard>
  );
}
