import type { WeeklyNetDay } from "../../types/wellness";
import { insightsSans } from "./theme";

const CALLOUT_COLORS = {
  card: "#FFFDFB",
  border: "#E6DAD0",
  text: "#3C2B24",
  secondary: "#7D7068",
};

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "10px",
        fontSize: "0.68rem",
        lineHeight: 1.35,
        fontFamily: insightsSans,
      }}
    >
      <span style={{ color: CALLOUT_COLORS.secondary }}>{label}</span>
      <span
        style={{
          color: CALLOUT_COLORS.text,
          fontWeight: 600,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function formatKcal(value: number): string {
  return value.toLocaleString("en-US");
}

interface WeeklyDayHoverCalloutProps {
  day: WeeklyNetDay;
}

export function WeeklyDayHoverCallout({ day }: WeeklyDayHoverCalloutProps) {
  return (
    <div
      role="tooltip"
      style={{
        width: "max-content",
        maxWidth: "200px",
        padding: "10px 12px",
        borderRadius: "14px",
        backgroundColor: CALLOUT_COLORS.card,
        border: `1px solid ${CALLOUT_COLORS.border}`,
        boxShadow: "0 8px 24px rgba(60, 43, 36, 0.12)",
        pointerEvents: "none",
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          fontSize: "0.72rem",
          fontWeight: 600,
          color: CALLOUT_COLORS.text,
          fontFamily: insightsSans,
          lineHeight: 1.3,
        }}
      >
        {day.dayFull}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <PreviewRow label="Net" value={`${formatKcal(day.net)} kcal`} />
        <PreviewRow label="Eaten" value={`${formatKcal(day.eaten)} kcal`} />
        <PreviewRow label="Burned" value={`${formatKcal(day.burned)} kcal`} />
      </div>
    </div>
  );
}
