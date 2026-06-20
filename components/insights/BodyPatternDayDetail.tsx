import Link from "next/link";
import type { BodyPatternCalendarDay } from "../../types/wellness";
import { formatSeverityLabel } from "../../types/wellness";
import { insightsSans } from "./theme";
import {
  CALENDAR_COLORS,
  energyLabel,
  formatFullDate,
  formatKcal,
  moodLabel,
  resolveDayEnergyStats,
  scaleWords,
} from "./bodyPatternCalendarUtils";

interface BodyPatternDayDetailProps {
  entry: BodyPatternCalendarDay;
}

function StatChip({ label }: { label: string }) {
  return (
    <span
      style={{
        flex: 1,
        minWidth: 0,
        padding: "8px 10px",
        borderRadius: "12px",
        backgroundColor: CALENDAR_COLORS.white,
        border: `1px solid ${CALENDAR_COLORS.border}`,
        fontSize: "0.72rem",
        fontWeight: 600,
        color: CALENDAR_COLORS.text,
        fontFamily: insightsSans,
        textAlign: "center",
        lineHeight: 1.35,
      }}
    >
      {label}
    </span>
  );
}

function CheckInChip({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: "14px",
        backgroundColor: CALENDAR_COLORS.white,
        border: `1px solid ${CALENDAR_COLORS.border}`,
        fontFamily: insightsSans,
      }}
    >
      <p
        style={{
          margin: "0 0 2px",
          fontSize: "0.62rem",
          fontWeight: 600,
          letterSpacing: "0.03em",
          textTransform: "uppercase",
          color: CALENDAR_COLORS.secondary,
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: "0.78rem",
          fontWeight: 600,
          color: CALENDAR_COLORS.text,
        }}
      >
        {value}
      </p>
    </div>
  );
}

export function BodyPatternDayDetail({ entry }: BodyPatternDayDetailProps) {
  const stats = resolveDayEnergyStats(entry);

  return (
    <article
      style={{
        padding: "20px",
        borderRadius: "24px",
        backgroundColor: "#FFF7F3",
        border: `1px solid ${CALENDAR_COLORS.blush}`,
        boxShadow: "0 4px 20px rgba(60, 43, 36, 0.06)",
        fontFamily: insightsSans,
      }}
    >
      <header>
        <h2
          style={{
            margin: "0 0 4px",
            fontSize: "1.05rem",
            fontWeight: 600,
            color: CALENDAR_COLORS.text,
            letterSpacing: "-0.01em",
          }}
        >
          {formatFullDate(entry.dateKey)}
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "0.78rem",
            color: CALENDAR_COLORS.secondary,
          }}
        >
          Cycle day {entry.cycleDay} · {entry.phase} phase
          {!entry.checkInCompleted ? " · Check-in not logged" : ""}
        </p>
      </header>

      <div style={{ marginTop: "18px" }}>
        <p
          style={{
            margin: 0,
            fontSize: "1.75rem",
            fontWeight: 600,
            color: CALENDAR_COLORS.text,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          {formatKcal(stats.net)} kcal net
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "14px",
        }}
      >
        <StatChip label={`${formatKcal(stats.eaten)} eaten`} />
        <StatChip label={`${formatKcal(stats.burned)} burned`} />
        <StatChip label={`${formatKcal(stats.target)} target`} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "8px",
          marginTop: "16px",
        }}
      >
        <CheckInChip label="Mood" value={moodLabel(entry)} />
        <CheckInChip label="Energy" value={energyLabel(entry)} />
        <CheckInChip label="Hunger" value={scaleWords[entry.hunger - 1]} />
        <CheckInChip
          label="Cravings"
          value={formatSeverityLabel(entry.cravings)}
        />
        <CheckInChip label="Sleep" value={scaleWords[entry.sleepQuality - 1]} />
        <CheckInChip label="Stress" value={scaleWords[entry.stress - 1]} />
      </div>

      <Link
        href="/log"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "18px",
          padding: "12px 16px",
          borderRadius: "999px",
          border: "none",
          backgroundColor: CALENDAR_COLORS.terracotta,
          color: CALENDAR_COLORS.white,
          fontSize: "0.82rem",
          fontWeight: 600,
          fontFamily: insightsSans,
          textDecoration: "none",
        }}
      >
        Edit Day
      </Link>
    </article>
  );
}
