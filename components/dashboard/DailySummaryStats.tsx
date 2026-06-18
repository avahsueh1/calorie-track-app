import type { DailySummaryDisplay } from "../../types/wellness";
import { cardStyle, colors, formatNumber, labelStyle, sans, serif } from "./theme";

interface DailySummaryStatsProps {
  summary: Pick<DailySummaryDisplay, "eaten" | "burned" | "net" | "tdee">;
}

const statKeys = [
  { key: "eaten" as const, label: "Eaten" },
  { key: "burned" as const, label: "Burned" },
  { key: "net" as const, label: "Net" },
  { key: "tdee" as const, label: "TDEE" },
];

export function DailySummaryStats({ summary }: DailySummaryStatsProps) {
  return (
    <section>
      <h2
        style={{
          margin: "0 0 10px",
          fontSize: "0.88rem",
          fontWeight: 600,
          fontFamily: sans,
          color: colors.text,
        }}
      >
        Today&apos;s summary
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px",
        }}
      >
        {statKeys.map(({ key, label }) => (
          <article
            key={key}
            style={{
              ...cardStyle(),
              padding: "12px 14px",
            }}
          >
            <p style={{ ...labelStyle(), marginBottom: "5px" }}>{label}</p>
            <p
              style={{
                margin: 0,
                fontFamily: serif,
                fontSize: "1.25rem",
                fontWeight: 400,
                color: colors.text,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              {formatNumber(summary[key])}
              <span
                style={{
                  fontSize: "0.72rem",
                  fontFamily: sans,
                  color: colors.muted,
                  marginLeft: "3px",
                }}
              >
                kcal
              </span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
