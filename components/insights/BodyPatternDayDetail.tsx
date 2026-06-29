import Link from "next/link";
import {
  Footprints,
  Pencil,
  Scale,
  Sparkles,
} from "lucide-react";
import { routes } from "../../lib/routes";
import { CheckInSummaryView } from "../dashboard/CheckInSummaryView";
import { AppCard } from "../ui/AppCard";
import {
  CalorieStatGrid,
  MacroStatGrid,
} from "../ui/EnergyMacroStatGrids";
import { DailyNote } from "../ui/DailyNote";
import { MetricRow, MetricRowSectionIcon } from "../ui/MetricRow";
import { StatusPill } from "../ui/StatusPill";
import type { DailyCheckIn } from "../../types";
import {
  hasCheckInContent,
  normalizeDailyCheckIn,
} from "../../lib/checkInHelpers";
import type { MacroTargets } from "../../types/profile";
import type { BodyPatternCalendarDay } from "../../types/wellness";
import { insightsSans, insightsSerif } from "./theme";
import { DayNotesSection } from "./DayNotesSection";
import {
  CALENDAR_COLORS,
  formatActivityDetailLine,
  formatKcal,
  formatRecapDate,
  getPhaseKind,
  PHASE_THEME,
  resolveDayEnergyStats,
  resolveDayMacroSummary,
  resolveEmptyDayEnergyStats,
} from "./bodyPatternCalendarUtils";
import { PhaseCellIcon } from "./PhaseCellIcon";

interface BodyPatternDayDetailProps {
  dateKey: string;
  cycleDay: number;
  phase: string;
  entry: BodyPatternCalendarDay | null;
  storedCheckIn?: DailyCheckIn | null;
  calorieTarget: number;
  macroTargets: MacroTargets;
  showCalorieSummary?: boolean;
  showCycleContext?: boolean;
}

function resolveDayCheckIn(
  storedCheckIn: DailyCheckIn | null | undefined,
): DailyCheckIn | null {
  if (!storedCheckIn) {
    return null;
  }

  const stored = normalizeDailyCheckIn(storedCheckIn);
  return hasCheckInContent(stored) ? stored : null;
}

const ICON_OPACITY = 0.88;

const editDayButtonStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  width: "100%",
  height: "46px",
  padding: "0 20px",
  borderRadius: "999px",
  border: "none",
  backgroundColor: CALENDAR_COLORS.terracotta,
  color: CALENDAR_COLORS.white,
  fontSize: "0.875rem",
  fontWeight: 600,
  fontFamily: insightsSans,
  cursor: "pointer",
  textDecoration: "none",
  boxSizing: "border-box",
} as const;

function sectionTitleStyle() {
  return {
    margin: 0,
    fontSize: "0.92rem",
    fontWeight: 600,
    color: CALENDAR_COLORS.text,
    letterSpacing: "-0.01em",
  };
}

export function BodyPatternDayDetail({
  dateKey,
  cycleDay,
  phase,
  entry,
  storedCheckIn,
  calorieTarget,
  macroTargets,
  showCalorieSummary = true,
  showCycleContext = true,
}: BodyPatternDayDetailProps) {
  const stats = entry
    ? resolveDayEnergyStats(entry, calorieTarget)
    : resolveEmptyDayEnergyStats(calorieTarget);
  const macros = resolveDayMacroSummary(entry, macroTargets);
  const phaseKind = getPhaseKind(phase);
  const phaseTheme = PHASE_THEME[phaseKind];
  const dayCheckIn = resolveDayCheckIn(storedCheckIn);

  const activities = entry?.activities ?? [];
  const hasActivities = activities.length > 0;
  const weight = entry?.weight;
  const hasWeight = weight != null && weight.value.trim().length > 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
      }}
    >
      <header>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Sparkles
            size={15}
            strokeWidth={1.75}
            aria-hidden
            style={{
              opacity: ICON_OPACITY,
              color: CALENDAR_COLORS.terracotta,
              flexShrink: 0,
            }}
          />
          <p
            style={{
              margin: 0,
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: CALENDAR_COLORS.secondary,
            }}
          >
            Daily Insight
          </p>
        </div>
        <h1
          style={{
            margin: "6px 0 0",
            fontSize: "1.2rem",
            fontWeight: 600,
            color: CALENDAR_COLORS.text,
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
          }}
        >
          {formatRecapDate(dateKey)}
        </h1>
        <div
          style={{
            marginTop: "10px",
            display: showCycleContext ? "flex" : "none",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {showCycleContext && phase ? (
            <>
              <StatusPill
            tone="neutral"
            style={{
              padding: "5px 11px",
              fontSize: "0.72rem",
              backgroundColor: phaseTheme.bg,
              border: `1px solid ${CALENDAR_COLORS.border}`,
              color: phaseTheme.accent,
              minHeight: "auto",
            }}
          >
            <PhaseCellIcon kind={phaseKind} size={14} opacity={ICON_OPACITY} />
            {phase} phase
          </StatusPill>
          <span
            style={{
              fontSize: "0.72rem",
              color: CALENDAR_COLORS.secondary,
            }}
          >
            Cycle day {cycleDay}
          </span>
            </>
          ) : null}
        </div>
      </header>

      <AppCard
        shadow
        padding="18px"
        style={{
          width: "100%",
          borderRadius: "22px",
          backgroundColor: CALENDAR_COLORS.white,
          borderColor: CALENDAR_COLORS.border,
          fontFamily: insightsSans,
          textAlign: showCalorieSummary ? "center" : "left",
          boxSizing: "border-box",
        }}
      >
        {showCalorieSummary ? (
          <>
        <p
          style={{
            margin: 0,
            fontFamily: insightsSerif,
            fontSize: "2.5rem",
            fontWeight: 400,
            color: CALENDAR_COLORS.text,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {formatKcal(stats.net)}
        </p>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: "0.78rem",
            fontWeight: 500,
            color: CALENDAR_COLORS.secondary,
          }}
        >
          kcal net
        </p>

        <div style={{ marginTop: "18px", textAlign: "left" }}>
          <CalorieStatGrid summary={stats} formatValue={formatKcal} />
        </div>

        <div style={{ marginTop: "14px", textAlign: "left" }}>
          <MacroStatGrid macros={macros} />
        </div>
          </>
        ) : null}

        <div
          style={{
            marginTop: showCalorieSummary ? "18px" : 0,
            paddingTop: showCalorieSummary ? "16px" : 0,
            borderTop: showCalorieSummary
              ? `1px solid ${CALENDAR_COLORS.border}`
              : "none",
            textAlign: "left",
          }}
        >
          <h2
            style={{
              ...sectionTitleStyle(),
              marginBottom: "12px",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: CALENDAR_COLORS.secondary,
            }}
          >
            Symptoms logged
          </h2>
          {dayCheckIn ? (
            <CheckInSummaryView saved={dayCheckIn} />
          ) : (
            <DailyNote variant="empty">No symptoms logged yet.</DailyNote>
          )}
        </div>
      </AppCard>

      <AppCard
        shadow
        padding="18px"
        style={{
          width: "100%",
          borderRadius: "22px",
          backgroundColor: CALENDAR_COLORS.white,
          borderColor: CALENDAR_COLORS.border,
          fontFamily: insightsSans,
          boxSizing: "border-box",
        }}
      >
        <MetricRowSectionIcon icon={Footprints} title="Activity" />
        {hasActivities ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "12px",
            }}
          >
            {activities.map((activity, index) => (
              <MetricRow
                key={`${activity.name}-${index}`}
                layout="list"
                label={activity.name}
                note={formatActivityDetailLine(activity)}
              />
            ))}
          </div>
        ) : (
          <DailyNote variant="empty" style={{ marginTop: "10px" }}>
            No activity logged yet.
          </DailyNote>
        )}
      </AppCard>

      <AppCard
        shadow
        padding="18px"
        style={{
          width: "100%",
          borderRadius: "22px",
          backgroundColor: CALENDAR_COLORS.white,
          borderColor: CALENDAR_COLORS.border,
          fontFamily: insightsSans,
          boxSizing: "border-box",
        }}
      >
        <MetricRowSectionIcon icon={Scale} title="Weight" />
        {hasWeight && weight ? (
          <div style={{ marginTop: "10px" }}>
            <p
              style={{
                margin: 0,
                fontFamily: insightsSerif,
                fontSize: "1.75rem",
                fontWeight: 400,
                color: CALENDAR_COLORS.text,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              {weight.value}{" "}
              <span
                style={{
                  fontFamily: insightsSans,
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: CALENDAR_COLORS.secondary,
                }}
              >
                {weight.unit}
              </span>
            </p>
            {weight.note?.trim() ? (
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "0.78rem",
                  lineHeight: 1.4,
                  color: CALENDAR_COLORS.secondary,
                }}
              >
                {weight.note.trim()}
              </p>
            ) : null}
          </div>
        ) : (
          <DailyNote variant="empty" style={{ marginTop: "10px" }}>
            No weight logged yet.
          </DailyNote>
        )}
      </AppCard>

      <DayNotesSection dateKey={dateKey} entry={entry} />

      <Link href={routes.log} style={editDayButtonStyle}>
        <Pencil size={16} strokeWidth={1.75} aria-hidden />
        Edit Day
      </Link>
    </div>
  );
}
