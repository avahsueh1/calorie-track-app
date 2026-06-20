import type { DailySummaryDisplay } from "../../types/wellness";
import {
  cardStyle,
  colors,
  formatNumber,
  labelStyle,
  sans,
  serif,
  sectionTitleStyle,
} from "../dashboard/theme";

interface LogHeaderSummaryProps {
  dateLabel: string;
  phaseLabel: string;
  cycleDayLabel: string;
  summary: Pick<DailySummaryDisplay, "eaten" | "burned" | "remaining">;
}

export function LogHeaderSummary({
  dateLabel,
  phaseLabel,
  cycleDayLabel,
  summary,
}: LogHeaderSummaryProps) {
  const stats = [
    { label: "Eaten", value: summary.eaten },
    { label: "Burned", value: summary.burned },
    { label: "Left", value: summary.remaining },
  ];
  return (
    <section style={{ ...cardStyle(), padding: "16px" }}>
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
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "0.68rem",
              fontWeight: 600,
              color: colors.terracotta,
              backgroundColor: colors.terracottaPale,
              padding: "6px 10px",
              borderRadius: "999px",
              border: `1px solid ${colors.terracottaLight}`,
              fontFamily: sans,
            }}
          >
            <span aria-hidden="true">☾</span>
            {phaseLabel}
          </span>
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
        </div>
      </div>

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
    </section>
  );
}
