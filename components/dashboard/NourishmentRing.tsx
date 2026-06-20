"use client";

import type { DailySummaryDisplay } from "../../types/wellness";
import { colors, formatNumber, labelStyle, sans, serif } from "./theme";

interface NourishmentRingProps {
  summary: Pick<
    DailySummaryDisplay,
    "ringValue" | "ringTarget" | "remaining" | "ringPercent"
  >;
}

const RING_SIZE = 196;
const RING_INNER = 158;

export function NourishmentRing({ summary }: NourishmentRingProps) {
  const clamped = Math.min(Math.max(summary.ringPercent, 0), 100);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "4px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: `${RING_SIZE}px`,
          height: `${RING_SIZE}px`,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: `conic-gradient(${colors.terracotta} ${clamped}%, ${colors.ringTrack} ${clamped}%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-hidden="true"
        >
          <div
            style={{
              width: `${RING_INNER}px`,
              height: `${RING_INNER}px`,
              borderRadius: "50%",
              backgroundColor: colors.card,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "12px",
            }}
          >
            <p style={{ ...labelStyle(), marginBottom: "5px" }}>Nourishment</p>
            <p
              style={{
                margin: 0,
                fontFamily: serif,
                fontSize: "2.1rem",
                fontWeight: 400,
                color: colors.text,
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {formatNumber(summary.ringValue)}
            </p>
            <p
              style={{
                margin: "5px 0 8px",
                fontSize: "0.78rem",
                color: colors.muted,
                fontFamily: sans,
              }}
            >
              of {formatNumber(summary.ringTarget)} kcal
            </p>
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: colors.terracotta,
                backgroundColor: colors.terracottaPale,
                padding: "4px 10px",
                borderRadius: "999px",
                fontFamily: sans,
              }}
            >
              {formatNumber(summary.remaining)} kcal left
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
