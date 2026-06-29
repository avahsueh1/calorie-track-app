import type { DailySummaryDisplay } from "../../types/wellness";
import {
  colors,
  formatNumber,
  labelStyle,
  sans,
  serif,
  sectionTitleStyle,
} from "../dashboard/theme";
import { AppCard } from "../ui/AppCard";
import { StatusPill } from "../ui/StatusPill";

interface LogHeaderSummaryProps {
  dateLabel: string;
  phaseLabel: string;
  cycleDayLabel: string;
  summary: Pick<DailySummaryDisplay, "eaten" | "burned" | "remaining">;
  showCalorieSummary?: boolean;
  showCycleContext?: boolean;
}

export function LogHeaderSummary({
  dateLabel,
  phaseLabel,
  cycleDayLabel,
  summary,
  showCalorieSummary = true,
  showCycleContext = true,
}: LogHeaderSummaryProps) {
  const stats = [
    { label: "Eaten", value: summary.eaten },
    { label: "Burned", value: summary.burned },
    { label: "Left", value: summary.remaining },
  ];
  return (
    <AppCard padding="compact">
      <p
        style={{
          margin: "0 0 4px",
          fontSize: "0.78rem",
          color: colors.muted,
          fontFamily: sans,
        }}
      >
        {dateLabel}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
          marginBottom: "14px",
        }}
      >
        <h1
          style={{
            ...sectionTitleStyle(),
            fontFamily: serif,
            fontSize: "1.5rem",
            fontWeight: 400,
            letterSpacing: "-0.02em",
          }}
        >
          Log Today
        </h1>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          {showCycleContext && phaseLabel ? (
            <>
              <StatusPill tone="terracotta">
                <span aria-hidden="true">☾</span>
                {phaseLabel}
              </StatusPill>
              {cycleDayLabel ? (
                <p
                  style={{
                    margin: "5px 0 0",
                    fontSize: "0.72rem",
                    color: colors.muted,
                    fontFamily: sans,
                  }}
                >
                  {cycleDayLabel}
                </p>
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      {showCalorieSummary ? (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
          paddingTop: "14px",
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        {stats.map(({ label, value }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <p style={{ ...labelStyle(), marginBottom: "4px" }}>{label}</p>
            <p
              style={{
                margin: 0,
                fontFamily: serif,
                fontSize: "1.2rem",
                color: colors.text,
                lineHeight: 1.2,
              }}
            >
              {formatNumber(value)}
            </p>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: "0.65rem",
                color: colors.muted,
                fontFamily: sans,
              }}
            >
              kcal
            </p>
          </div>
        ))}
      </div>
      ) : null}
    </AppCard>
  );
}
