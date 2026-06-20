import type { BodyPatternCalendarDay } from "../../types/wellness";
import { insightsSans } from "./theme";
import {
  CALENDAR_COLORS,
  energyLabel,
  formatFullDate,
  formatKcal,
  moodLabel,
} from "./bodyPatternCalendarUtils";

interface BodyPatternDayHoverPreviewProps {
  entry: BodyPatternCalendarDay;
}

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
      <span style={{ color: CALENDAR_COLORS.secondary }}>{label}</span>
      <span style={{ color: CALENDAR_COLORS.text, fontWeight: 600, textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
}

export function BodyPatternDayHoverPreview({
  entry,
}: BodyPatternDayHoverPreviewProps) {
  return (
    <div
      role="tooltip"
      style={{
        width: "max-content",
        maxWidth: "210px",
        padding: "10px 12px",
        borderRadius: "14px",
        backgroundColor: CALENDAR_COLORS.card,
        border: `1px solid ${CALENDAR_COLORS.border}`,
        boxShadow: "0 8px 24px rgba(60, 43, 36, 0.12)",
        pointerEvents: "none",
      }}
    >
      <p
        style={{
          margin: "0 0 2px",
          fontSize: "0.72rem",
          fontWeight: 600,
          color: CALENDAR_COLORS.text,
          fontFamily: insightsSans,
          lineHeight: 1.3,
        }}
      >
        {formatFullDate(entry.dateKey)}
      </p>
      <p
        style={{
          margin: "0 0 8px",
          fontSize: "0.62rem",
          color: CALENDAR_COLORS.secondary,
          fontFamily: insightsSans,
        }}
      >
        Cycle day {entry.cycleDay} · {entry.phase}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <PreviewRow label="Mood" value={moodLabel(entry)} />
        <PreviewRow label="Energy" value={energyLabel(entry)} />
        {entry.netCalories !== undefined ? (
          <PreviewRow
            label="Net calories"
            value={`${formatKcal(entry.netCalories)} kcal`}
          />
        ) : null}
      </div>
    </div>
  );
}
