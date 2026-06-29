"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  resolveBodyPatternCalendarDay,
  sampleBodyPatternCalendarCopy,
} from "../../data/sampleInsights";
import {
  getPhaseInsightMessage,
  isDateInAnyPeriodLog,
  getPeriodFlowForDate,
  resolveCycleContextForDate,
} from "../../lib/appStateHelpers";
import type {
  BodyPatternCalendarDay,
  CycleSettings,
  PeriodFlow,
  PeriodLog,
} from "../../types/wellness";
import { BodyPatternDayHoverPreview } from "./BodyPatternDayHoverPreview";
import {
  buildMonthGrid,
  buildPhaseBandSegments,
  CALENDAR_COLORS,
  formatFullDate,
  formatMonthTitle,
  getPhaseKind,
  getTodayDateKey,
  insightsDayPath,
  NUTRITION_STATUS_COLORS,
  NUTRITION_STATUS_LABELS,
  phaseAccent,
  phaseTodayOutline,
  PHASE_THEME,
  resolveNutritionDayStatus,
  type NutritionDayStatus,
  type PhaseBandSegment,
} from "./bodyPatternCalendarUtils";
import { PhaseCellIcon } from "./PhaseCellIcon";
import { insightsLayout, insightsSans } from "./theme";
import { layout } from "../../lib/theme";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const LEGEND_PHASES = ["menstrual", "follicular", "ovulatory", "luteal"] as const;
const LEGEND_ICON_SIZE = 12;

const LEGEND_STYLES = {
  container: {
    marginTop: "14px",
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "8px 12px",
    padding: "12px 14px",
    borderRadius: "16px",
    backgroundColor: "#FAF7F2",
    border: "1px solid #E6DAD0",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "0.72rem",
    lineHeight: 1.2,
    color: "#5F5048",
    minWidth: 0,
  },
  swatch: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    border: "1px solid rgba(230, 218, 208, 0.9)",
    flexShrink: 0,
  },
} as const;

type CalendarBaseProps = {
  cycleSettings: CycleSettings;
  periodLogs?: PeriodLog[];
  initialYear: number;
  initialMonth: number;
  showHeader?: boolean;
  maxWidth?: string;
};

import type { DailyCheckIn } from "../../types";
import type { AppProfile, MacroTargets } from "../../types/profile";
import { getCalorieTargetForProfileDate } from "../../lib/calorieCycling";

export type InsightsCalendarVariant = "cycle" | "nutrition";

type InsightsCalendarProps = CalendarBaseProps & {
  mode: "insights";
  calendarVariant: InsightsCalendarVariant;
  entriesByDate: Record<string, BodyPatternCalendarDay>;
  dailyCheckIns?: Record<string, DailyCheckIn>;
  profile: AppProfile;
  macroTargets: MacroTargets;
};

type CycleLogCalendarProps = CalendarBaseProps & {
  mode: "cycleLog";
  selectedStartDate?: string;
  selectedEndDate?: string;
  onDateSelect?: (dateKey: string) => void;
};

export type BodyPatternCalendarProps = InsightsCalendarProps | CycleLogCalendarProps;

function calendarSizes(compact: boolean) {
  const gridGapPx = compact ? 8 : 12;
  const weekRowSpacing = compact ? 18 : 20;

  return compact
    ? {
        cellHeight: 46,
        pillHeight: 42,
        numberSize: "1rem",
        iconSize: 13,
        stackGap: 2,
        todaySize: 48,
        weekRowMargin: weekRowSpacing - gridGapPx,
      }
    : {
        cellHeight: 48,
        pillHeight: 44,
        numberSize: "1rem",
        iconSize: 13,
        stackGap: 2,
        todaySize: 50,
        weekRowMargin: weekRowSpacing - gridGapPx,
      };
}

function useCompactCells(containerRef: React.RefObject<HTMLElement | null>) {
  const [compact, setCompact] = useState(true);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const update = () => setCompact(node.clientWidth < 520);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [containerRef]);

  return compact;
}

function useCanHover() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return canHover;
}

function isDateInSelectionRange(
  dateKey: string,
  selectedStartDate?: string,
  selectedEndDate?: string,
): boolean {
  if (!selectedStartDate) {
    return false;
  }

  if (!selectedEndDate || selectedEndDate < selectedStartDate) {
    return dateKey === selectedStartDate;
  }

  return dateKey >= selectedStartDate && dateKey <= selectedEndDate;
}

function PhaseBands({
  segments,
  rowIndex,
  gridGap,
  pillHeight,
}: {
  segments: PhaseBandSegment[];
  rowIndex: number;
  gridGap: string;
  pillHeight: number;
}) {
  const rowSegments = segments.filter((segment) => segment.rowIndex === rowIndex);
  if (rowSegments.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
        gap: gridGap,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {rowSegments.map((segment) => (
        <div
          key={`${rowIndex}-${segment.colStart}-${segment.colEnd}-${segment.phase}`}
          style={{
            gridColumn: `${segment.colStart + 1} / ${segment.colEnd + 2}`,
            alignSelf: "center",
            height: `${pillHeight}px`,
            backgroundColor: PHASE_THEME[segment.phase].bg,
            borderRadius: "999px",
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
}

function NutritionDateCellContent({
  dayOfMonth,
  compact,
}: {
  dayOfMonth: number;
  compact: boolean;
}) {
  const sizes = calendarSizes(compact);

  return (
    <span
      style={{
        fontSize: sizes.numberSize,
        fontWeight: 600,
        color: CALENDAR_COLORS.text,
        lineHeight: 1,
      }}
    >
      {dayOfMonth}
    </span>
  );
}

function DateCellContent({
  dayOfMonth,
  phase,
  compact,
  periodFlow,
  showIcon,
}: {
  dayOfMonth: number;
  phase: string;
  compact: boolean;
  periodFlow?: PeriodFlow;
  showIcon: boolean;
}) {
  const kind = getPhaseKind(phase);
  const accent = phaseAccent(phase);
  const sizes = calendarSizes(compact);

  return (
    <>
      <span
        style={{
          fontSize: sizes.numberSize,
          fontWeight: 600,
          color: CALENDAR_COLORS.text,
          lineHeight: 1,
        }}
      >
        {dayOfMonth}
      </span>
      {showIcon && kind !== "none" ? (
        <PhaseCellIcon
          kind={kind}
          color={accent}
          size={sizes.iconSize}
          opacity={0.68}
          periodFlow={kind === "menstrual" ? periodFlow : undefined}
        />
      ) : (
        <span style={{ minHeight: `${sizes.iconSize}px` }} aria-hidden="true" />
      )}
    </>
  );
}

function InsightsDateCell({
  dayOfMonth,
  dateKey,
  phase,
  cycleDay,
  entry,
  isToday,
  compact,
  canHover,
  showHoverPreview,
  periodFlow,
  showIcon,
  calorieTarget,
  calendarVariant,
  nutritionStatus,
  onHoverStart,
  onHoverEnd,
}: {
  dayOfMonth: number;
  dateKey: string;
  phase: string;
  cycleDay: number;
  entry: BodyPatternCalendarDay | null;
  isToday: boolean;
  compact: boolean;
  canHover: boolean;
  showHoverPreview: boolean;
  periodFlow?: PeriodFlow;
  showIcon: boolean;
  calorieTarget: number;
  calendarVariant: InsightsCalendarVariant;
  nutritionStatus: NutritionDayStatus;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const [lifted, setLifted] = useState(false);
  const isNutrition = calendarVariant === "nutrition";
  const todayOutline = isToday
    ? isNutrition
      ? CALENDAR_COLORS.terracotta
      : phaseTodayOutline(phase)
    : undefined;
  const sizes = calendarSizes(compact);
  const netCalories =
    entry?.netCalories ??
    (entry ? (entry.eaten ?? 0) - (entry.burned ?? 0) : null);

  const cellBorder = todayOutline
    ? `2px solid ${todayOutline}`
    : isNutrition
      ? `1px solid ${CALENDAR_COLORS.border}`
      : "1px solid transparent";

  const cellBackground = isNutrition
    ? NUTRITION_STATUS_COLORS[nutritionStatus]
    : "transparent";

  const cellShadow = lifted
    ? "0 2px 6px rgba(60, 43, 36, 0.04)"
    : "none";

  const ariaLabel = isNutrition
    ? `${formatFullDate(dateKey)}, ${NUTRITION_STATUS_LABELS[nutritionStatus]}`
    : `${formatFullDate(dateKey)}, ${phase} phase`;

  return (
    <div
      style={{
        position: "relative",
        minWidth: 0,
        width: "100%",
        height: `${sizes.cellHeight}px`,
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Link
        href={insightsDayPath(dateKey)}
        onMouseEnter={() => {
          setLifted(true);
          if (canHover) onHoverStart();
        }}
        onMouseLeave={() => {
          setLifted(false);
          if (canHover) onHoverEnd();
        }}
        aria-current={isToday ? "date" : undefined}
        aria-label={ariaLabel}
        style={{
          position: "relative",
          zIndex: 1,
          width: isToday ? `${sizes.todaySize}px` : "100%",
          height: isToday ? `${sizes.todaySize}px` : "100%",
          minHeight: isToday ? undefined : `${sizes.cellHeight}px`,
          padding: isToday ? "0" : "0 2px",
          border: cellBorder,
          borderRadius: isToday ? "50%" : "20px",
          backgroundColor: cellBackground,
          boxShadow: cellShadow,
          flexShrink: 0,
          transform: lifted ? "translateY(-1px)" : "none",
          transition:
            "box-shadow 0.15s ease, transform 0.15s ease, border-color 0.15s ease",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: `${sizes.stackGap}px`,
          boxSizing: "border-box",
          fontFamily: insightsSans,
          overflow: "visible",
          textDecoration: "none",
        }}
      >
        {isNutrition ? (
          <NutritionDateCellContent
            dayOfMonth={dayOfMonth}
            compact={compact}
          />
        ) : (
          <DateCellContent
            dayOfMonth={dayOfMonth}
            phase={phase}
            compact={compact}
            periodFlow={periodFlow}
            showIcon={showIcon}
          />
        )}
      </Link>
      {showHoverPreview ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "calc(100% + 8px)",
            transform: "translateX(-50%)",
            zIndex: 30,
          }}
        >
          <BodyPatternDayHoverPreview
            dateKey={dateKey}
            variant={calendarVariant}
            cycleDay={cycleDay}
            phase={phase}
            nutritionStatus={nutritionStatus}
            netCalories={netCalories}
            calorieTarget={calorieTarget}
          />
        </div>
      ) : null}
    </div>
  );
}

function CycleLogDateCell({
  dayOfMonth,
  dateKey,
  phase,
  isToday,
  compact,
  isSelected,
  isLoggedPeriod,
  periodFlow,
  showIcon,
  onSelect,
}: {
  dayOfMonth: number;
  dateKey: string;
  phase: string;
  isToday: boolean;
  compact: boolean;
  isSelected: boolean;
  isLoggedPeriod: boolean;
  periodFlow?: PeriodFlow;
  showIcon: boolean;
  onSelect: () => void;
}) {
  const todayOutline = isToday ? phaseTodayOutline(phase) : undefined;
  const sizes = calendarSizes(compact);

  const cellBorder = isSelected
    ? `2px solid ${CALENDAR_COLORS.terracotta}`
    : todayOutline
      ? `2px solid ${todayOutline}`
      : "1px solid transparent";

  const cellShadow = "none";

  return (
    <div
      style={{
        position: "relative",
        minWidth: 0,
        width: "100%",
        height: `${sizes.cellHeight}px`,
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-current={isToday ? "date" : undefined}
        aria-pressed={isSelected}
        aria-label={`${formatFullDate(dateKey)}, ${phase} phase`}
        style={{
          position: "relative",
          zIndex: 1,
          width: isToday ? `${sizes.todaySize}px` : "100%",
          height: isToday ? `${sizes.todaySize}px` : "100%",
          minHeight: isToday ? undefined : `${sizes.cellHeight}px`,
          padding: isToday ? "0" : "0 2px",
          border: cellBorder,
          borderRadius: isToday ? "50%" : "20px",
          backgroundColor: isLoggedPeriod
            ? "rgba(185, 118, 99, 0.14)"
            : isSelected
              ? "rgba(185, 118, 99, 0.1)"
              : isToday
                ? "rgba(255, 253, 251, 0.92)"
                : "transparent",
          boxShadow: cellShadow,
          flexShrink: 0,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: `${sizes.stackGap}px`,
          boxSizing: "border-box",
          fontFamily: insightsSans,
          overflow: "visible",
        }}
      >
        <DateCellContent
          dayOfMonth={dayOfMonth}
          phase={phase}
          compact={compact}
          periodFlow={periodFlow}
          showIcon={showIcon}
        />
      </button>
    </div>
  );
}

function PhaseTimelineStrip({ currentPhase }: { currentPhase: string }) {
  const activeKind = getPhaseKind(currentPhase);

  return (
    <div
      aria-hidden="true"
      style={{
        marginTop: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "6px",
        fontFamily: insightsSans,
      }}
    >
      {LEGEND_PHASES.map((kind, index) => {
        const theme = PHASE_THEME[kind];
        const active = activeKind === kind;

        return (
          <span
            key={kind}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {index > 0 ? (
              <span
                style={{
                  color: "#D4C8BE",
                  fontSize: "0.55rem",
                  letterSpacing: "0.08em",
                }}
              >
                ━
              </span>
            ) : null}
            <span
              style={{
                fontSize: "0.62rem",
                fontWeight: active ? 600 : 500,
                letterSpacing: "0.02em",
                color: active ? theme.accent : CALENDAR_COLORS.secondary,
                opacity: active ? 1 : 0.62,
              }}
            >
              {theme.legendLabel}
            </span>
          </span>
        );
      })}
    </div>
  );
}

function CalendarInsightCard({
  cycleDay,
  phase,
  isToday,
}: {
  cycleDay: number;
  phase: string;
  isToday: boolean;
}) {
  return (
    <div
      style={{
        marginTop: "12px",
        padding: "14px 16px",
        borderRadius: "16px",
        backgroundColor: "#FAF3EA",
        border: "1px solid #E8DDD2",
        fontFamily: insightsSans,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.8rem",
          fontWeight: 600,
          color: CALENDAR_COLORS.text,
          lineHeight: 1.3,
        }}
      >
        {isToday ? "Today · " : ""}
        Day {cycleDay} · {phase} phase
      </p>
      <p
        style={{
          margin: "6px 0 0",
          fontSize: "0.76rem",
          lineHeight: 1.45,
          color: CALENDAR_COLORS.secondary,
        }}
      >
        {getPhaseInsightMessage(phase)}
      </p>
    </div>
  );
}

function NutritionLegend() {
  const items: NutritionDayStatus[] = ["under", "near", "over", "noData"];

  return (
    <div style={LEGEND_STYLES.container}>
      {items.map((status) => (
        <span key={status} style={LEGEND_STYLES.item}>
          <span
            aria-hidden="true"
            style={{
              ...LEGEND_STYLES.swatch,
              borderRadius: "4px",
              width: "10px",
              height: "10px",
              backgroundColor: NUTRITION_STATUS_COLORS[status],
              border: `1px solid ${CALENDAR_COLORS.border}`,
            }}
          />
          {NUTRITION_STATUS_LABELS[status]}
        </span>
      ))}
    </div>
  );
}

function PhaseLegend() {
  return (
    <div
      role="list"
      aria-label="Cycle phase legend"
      style={{
        ...LEGEND_STYLES.container,
        fontFamily: insightsSans,
      }}
    >
      {LEGEND_PHASES.map((kind) => {
        const theme = PHASE_THEME[kind];
        return (
          <span
            key={kind}
            role="listitem"
            style={LEGEND_STYLES.item}
          >
            <span
              aria-hidden="true"
              style={{
                ...LEGEND_STYLES.swatch,
                backgroundColor: theme.bg,
              }}
            />
            <PhaseCellIcon
              kind={kind}
              color={theme.accent}
              size={LEGEND_ICON_SIZE}
              opacity={0.7}
            />
            {theme.legendLabel}
          </span>
        );
      })}
    </div>
  );
}

export function BodyPatternCalendar(props: BodyPatternCalendarProps) {
  const {
    cycleSettings,
    periodLogs = [],
    initialYear,
    initialMonth,
    showHeader = true,
    maxWidth = insightsLayout.shellMaxWidth,
  } = props;

  const sectionRef = useRef<HTMLElement>(null);
  const compact = useCompactCells(sectionRef);
  const canHover = useCanHover();
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState({
    year: initialYear,
    month: initialMonth,
  });
  const todayDateKey = getTodayDateKey();
  const insightsProfile = props.mode === "insights" ? props.profile : null;
  const calendarVariant =
    props.mode === "insights" ? props.calendarVariant : "cycle";
  const isCycleCalendar = calendarVariant === "cycle";
  const gridGap = compact ? "8px" : "12px";
  const sizes = calendarSizes(compact);
  const monthCells = useMemo(
    () => buildMonthGrid(currentMonth.year, currentMonth.month),
    [currentMonth.year, currentMonth.month],
  );

  const weekRows = useMemo(() => {
    const rows: (typeof monthCells)[] = [];
    for (let index = 0; index < monthCells.length; index += 7) {
      rows.push(monthCells.slice(index, index + 7));
    }
    return rows;
  }, [monthCells]);

  const selectedStartDate =
    props.mode === "cycleLog" ? props.selectedStartDate : undefined;
  const selectedEndDate =
    props.mode === "cycleLog" ? props.selectedEndDate : undefined;

  const getPhaseForDate = useMemo(
    () => (dateKey: string) => {
      if (
        props.mode === "cycleLog" &&
        isDateInSelectionRange(dateKey, selectedStartDate, selectedEndDate)
      ) {
        return "Menstrual";
      }

      return resolveCycleContextForDate(dateKey, cycleSettings, periodLogs).phase;
    },
    [
      cycleSettings,
      periodLogs,
      props.mode,
      selectedStartDate,
      selectedEndDate,
    ],
  );

  const bandSegments = useMemo(
    () => buildPhaseBandSegments(monthCells, getPhaseForDate),
    [monthCells, getPhaseForDate],
  );

  const todayContext = useMemo(
    () => resolveCycleContextForDate(todayDateKey, cycleSettings, periodLogs),
    [cycleSettings, periodLogs, todayDateKey],
  );

  function resolveInsightsDay(dateKey: string) {
    if (props.mode !== "insights") {
      return null;
    }

    return resolveBodyPatternCalendarDay(
      dateKey,
      props.entriesByDate,
      {},
      cycleSettings,
      periodLogs,
      props.mode === "insights" ? props.dailyCheckIns ?? {} : {},
    );
  }

  const headerSubtitle =
    props.mode === "insights"
      ? isCycleCalendar
        ? `${sampleBodyPatternCalendarCopy.subtitle} ${sampleBodyPatternCalendarCopy.tapHint}`
        : `${sampleBodyPatternCalendarCopy.nutritionSubtitle} ${sampleBodyPatternCalendarCopy.nutritionTapHint}`
      : "Tap a date to choose period start or end.";

  const headerTitle =
    props.mode === "insights"
      ? isCycleCalendar
        ? "Cycle Pattern Calendar"
        : "Nutrition Pattern Calendar"
      : "Cycle calendar";

  return (
    <section
      ref={sectionRef}
      style={{
        width: "100%",
        maxWidth,
        margin: "0 auto",
        padding: compact ? layout.cardPaddingCompact : layout.cardPadding,
        borderRadius: "24px",
        backgroundColor: CALENDAR_COLORS.card,
        border: `1px solid ${CALENDAR_COLORS.border}`,
        boxShadow: "0 2px 20px rgba(60, 43, 36, 0.05)",
        boxSizing: "border-box",
        overflow: "visible",
      }}
    >
      {showHeader ? (
        <header>
          <h2
            style={{
              margin: 0,
              fontSize: "1.05rem",
              fontWeight: 600,
              color: CALENDAR_COLORS.text,
              fontFamily: insightsSans,
            }}
          >
            {headerTitle}
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: "0.82rem",
              lineHeight: 1.45,
              color: CALENDAR_COLORS.secondary,
              fontFamily: insightsSans,
            }}
          >
            {headerSubtitle}
          </p>
        </header>
      ) : null}

      <div
        style={{
          marginTop: showHeader ? "18px" : "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: compact ? "16px" : "20px",
        }}
      >
        <button
          type="button"
          aria-label="Previous month"
          onClick={() =>
            setCurrentMonth((current) => {
              const date = new Date(current.year, current.month - 1, 1);
              return { year: date.getFullYear(), month: date.getMonth() };
            })
          }
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "999px",
            border: `1px solid ${CALENDAR_COLORS.border}`,
            backgroundColor: "transparent",
            color: CALENDAR_COLORS.secondary,
            fontSize: "1.05rem",
            lineHeight: 1,
            cursor: "pointer",
            fontFamily: insightsSans,
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          ‹
        </button>
        <p
          style={{
            margin: 0,
            textAlign: "center",
            fontSize: compact ? "0.95rem" : "1rem",
            fontWeight: 600,
            color: CALENDAR_COLORS.text,
            fontFamily: insightsSans,
            letterSpacing: "-0.01em",
          }}
        >
          {formatMonthTitle(currentMonth.year, currentMonth.month)}
        </p>
        <button
          type="button"
          aria-label="Next month"
          onClick={() =>
            setCurrentMonth((current) => {
              const date = new Date(current.year, current.month + 1, 1);
              return { year: date.getFullYear(), month: date.getMonth() };
            })
          }
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "999px",
            border: `1px solid ${CALENDAR_COLORS.border}`,
            backgroundColor: "transparent",
            color: CALENDAR_COLORS.secondary,
            fontSize: "1.05rem",
            lineHeight: 1,
            cursor: "pointer",
            fontFamily: insightsSans,
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          ›
        </button>
      </div>

      {isCycleCalendar ? (
        <PhaseTimelineStrip currentPhase={todayContext.phase} />
      ) : null}

      <div
        style={{
          marginTop: "14px",
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: gridGap,
        }}
      >
        {WEEKDAYS.map((label) => (
          <div
            key={label}
            style={{
              textAlign: "center",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: CALENDAR_COLORS.secondary,
              fontFamily: insightsSans,
              paddingBottom: "4px",
            }}
          >
            {label}
          </div>
        ))}

        {weekRows.map((week, rowIndex) => (
          <div
            key={`week-${rowIndex}`}
            style={{
              gridColumn: "1 / -1",
              position: "relative",
              marginBottom:
                rowIndex < weekRows.length - 1 ? `${sizes.weekRowMargin}px` : 0,
            }}
          >
            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "grid",
                gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                gap: gridGap,
                minHeight: `${sizes.cellHeight}px`,
              }}
            >
              {week.map((cell, colIndex) => {
                if (!cell) {
                  return (
                    <div key={`blank-${rowIndex}-${colIndex}`} aria-hidden="true" />
                  );
                }

                const phase = getPhaseForDate(cell.dateKey);
                const periodFlow = getPeriodFlowForDate(cell.dateKey, periodLogs);
                const isLoggedPeriod = isDateInAnyPeriodLog(cell.dateKey, periodLogs);
                const displayPhase = isLoggedPeriod ? "Menstrual" : phase;
                const isToday = cell.dateKey === todayDateKey;
                const showIcon = isCycleCalendar;

                if (props.mode === "insights") {
                  const day = resolveInsightsDay(cell.dateKey);
                  if (!day) {
                    return null;
                  }

                  const calorieTarget =
                    insightsProfile
                      ? getCalorieTargetForProfileDate(
                          insightsProfile,
                          cell.dateKey,
                        )
                      : 0;
                  const nutritionStatus = resolveNutritionDayStatus(
                    day.entry,
                    calorieTarget,
                  );

                  return (
                    <InsightsDateCell
                      key={cell.dateKey}
                      dayOfMonth={cell.dayOfMonth}
                      dateKey={day.dateKey}
                      phase={isCycleCalendar ? displayPhase : ""}
                      cycleDay={isCycleCalendar ? day.cycleDay : 0}
                      entry={day.entry}
                      isToday={isToday}
                      compact={compact}
                      canHover={canHover}
                      showHoverPreview={
                        canHover && hoveredDate === cell.dateKey
                      }
                      periodFlow={isCycleCalendar ? periodFlow : undefined}
                      showIcon={showIcon}
                      calorieTarget={calorieTarget}
                      calendarVariant={calendarVariant}
                      nutritionStatus={nutritionStatus}
                      onHoverStart={() => setHoveredDate(cell.dateKey)}
                      onHoverEnd={() => setHoveredDate(null)}
                    />
                  );
                }

                const isSelected = isDateInSelectionRange(
                  cell.dateKey,
                  props.selectedStartDate,
                  props.selectedEndDate,
                );

                return (
                  <CycleLogDateCell
                    key={cell.dateKey}
                    dayOfMonth={cell.dayOfMonth}
                    dateKey={cell.dateKey}
                    phase={displayPhase}
                    isToday={isToday}
                    compact={compact}
                    isSelected={isSelected}
                    isLoggedPeriod={isLoggedPeriod}
                    periodFlow={periodFlow}
                    showIcon={showIcon}
                    onSelect={() => props.onDateSelect?.(cell.dateKey)}
                  />
                );
              })}
            </div>
            {isCycleCalendar ? (
            <PhaseBands
              segments={bandSegments}
              rowIndex={rowIndex}
              gridGap={gridGap}
              pillHeight={sizes.pillHeight}
            />
            ) : null}
          </div>
        ))}
      </div>

      {isCycleCalendar ? <PhaseLegend /> : <NutritionLegend />}

      {props.mode === "insights" && isCycleCalendar && todayContext.phase ? (
        <CalendarInsightCard
          cycleDay={todayContext.cycleDay}
          phase={todayContext.phase}
          isToday
        />
      ) : null}
    </section>
  );
}
