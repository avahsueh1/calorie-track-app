"use client";

import type { DailySummaryDisplay, MacroSummary } from "../../types/wellness";
import { AppCard } from "../ui/AppCard";
import { CalorieStatGrid, MacroStrip } from "../ui/EnergyMacroStatGrids";
import { NourishmentRing } from "./NourishmentRing";
import { colors, formatNumber, sans } from "./theme";

interface NourishmentCardProps {
  summary: DailySummaryDisplay;
  macros: MacroSummary[];
}

export function NourishmentCard({ summary, macros }: NourishmentCardProps) {
  return (
    <AppCard
      padding="24px 20px 20px"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header>
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

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            marginBottom: "11px",
          }}
        >
          <NourishmentRing summary={summary} />
        </div>

        <div style={{ marginTop: "8px" }}>
          <MacroStrip macros={macros} showLabel={false} />
        </div>

        <div
          style={{
            borderTop: "1px solid #EEE5DC",
            paddingTop: "22px",
          }}
        >
          <CalorieStatGrid
            tileSize="hero"
            showLabel={false}
            summary={{
              eaten: summary.eaten,
              burned: summary.burned,
              target: summary.tdee,
              remaining: summary.remaining,
            }}
          />
        </div>
      </div>
    </AppCard>
  );
}
