"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  resolveBodyPatternCalendarDay,
  sampleBodyPatternCalendarCopy,
} from "../../data/sampleInsights";
import type { BodyPatternCalendarDay } from "../../types/wellness";
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
  phaseAccent,
  phaseTodayOutline,
  PHASE_THEME,
  type PhaseBandSegment,
} from "./bodyPatternCalendarUtils";
import { PhaseCellIcon } from "./PhaseCellIcon";
import { insightsLayout, insightsSans } from "./theme";
interface BodyPatternCalendarProps {
  entriesByDate: Record<string, BodyPatternCalendarDay>;
  initialYear: number;
  initialMonth: number;
}
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const LEGEND_PHASES = ["menstrual", "follicular", "ovulatory", "luteal"] as const;

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

function DateCell({
  dayOfMonth,
  dateKey,
  phase,
  entry,
  isToday,
  compact,
  canHover,
  showHoverPreview,
  onHoverStart,
  onHoverEnd,
}: {
  dayOfMonth: number;
  dateKey: string;
  phase: string;
  entry: BodyPatternCalendarDay | null;
  isToday: boolean;
  compact: boolean;
  canHover: boolean;
  showHoverPreview: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const [lifted, setLifted] = useState(false);
  const kind = getPhaseKind(phase);
  const accent = phaseAccent(phase);
  const todayOutline = isToday ? phaseTodayOutline(phase) : undefined;
  const sizes = calendarSizes(compact);

  const cellBorder = todayOutline
    ? `2px solid ${todayOutline}`
    : "1px solid transparent";

  const cellShadow = lifted ? "0 2px 6px rgba(60, 43, 36, 0.04)" : "none";

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
          backgroundColor: "transparent",
          boxShadow: cellShadow,
          flexShrink: 0,
          transform: lifted ? "translateY(-1px)" : "none",
          transition: "box-shadow 0.15s ease, transform 0.15s ease, border-color 0.15s ease",
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
        {kind !== "none" ? (
          <PhaseCellIcon
            kind={kind}
            color={accent}
            size={sizes.iconSize}
            opacity={0.68}
          />
        ) : null}
      </Link>
      {showHoverPreview && entry ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "calc(100% + 8px)",
            transform: "translateX(-50%)",
            zIndex: 30,
          }}
        >
          <BodyPatternDayHoverPreview entry={entry} />
        </div>
      ) : null}    </div>
  );
}

function PhaseLegend() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "22px",
        marginTop: "16px",
        fontFamily: insightsSans,
      }}
    >
      {LEGEND_PHASES.map((kind) => {
        const theme = PHASE_THEME[kind];
        return (
          <span
            key={kind}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "1.0625rem",
              color: CALENDAR_COLORS.secondary,
            }}
          >
            <span
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                backgroundColor: theme.bg,
                border: `1px solid rgba(230, 215, 203, 0.35)`,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <PhaseCellIcon kind={kind} size={16} opacity={0.7} />
            </span>
            {theme.legendLabel}
          </span>
        );
      })}
    </div>
  );
}

export function BodyPatternCalendar({
  entriesByDate,
  initialYear,
  initialMonth,
}: BodyPatternCalendarProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const compact = useCompactCells(sectionRef);
  const canHover = useCanHover();
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState({
    year: initialYear,
    month: initialMonth,
  });
  const todayDateKey = getTodayDateKey();
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

  const bandSegments = useMemo(
    () =>
      buildPhaseBandSegments(monthCells, (dateKey) =>
        resolveBodyPatternCalendarDay(dateKey, entriesByDate).phase,
      ),
    [monthCells, entriesByDate],
  );

  function resolveDay(dateKey: string) {
    return resolveBodyPatternCalendarDay(dateKey, entriesByDate);
  }

  return (
    <section
      ref={sectionRef}
      style={{
        width: "100%",
        maxWidth: insightsLayout.shellMaxWidth,
        margin: "0 auto",
        padding: compact ? "18px" : "24px",
        borderRadius: "24px",
        backgroundColor: CALENDAR_COLORS.card,
        border: `1px solid ${CALENDAR_COLORS.border}`,
        boxShadow: "0 2px 20px rgba(60, 43, 36, 0.05)",
        boxSizing: "border-box",
        overflow: "visible",
      }}
    >
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
          Cycle Pattern Calendar
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
          {sampleBodyPatternCalendarCopy.subtitle} {sampleBodyPatternCalendarCopy.tapHint}        </p>
      </header>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <button
          type="button"
          aria-label="Previous month"
          onClick={() =>
            setCurrentMonth((c) => {
              const d = new Date(c.year, c.month - 1, 1);
              return { year: d.getFullYear(), month: d.getMonth() };
            })
          }
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "999px",
            border: `1px solid ${CALENDAR_COLORS.border}`,
            backgroundColor: CALENDAR_COLORS.navBg,
            color: CALENDAR_COLORS.text,
            fontSize: "1.1rem",
            cursor: "pointer",
            fontFamily: insightsSans,
            flexShrink: 0,
          }}
        >
          ‹
        </button>
        <p
          style={{
            margin: 0,
            flex: 1,
            textAlign: "center",
            fontSize: "1rem",
            fontWeight: 600,
            color: CALENDAR_COLORS.text,
            fontFamily: insightsSans,
          }}
        >
          {formatMonthTitle(currentMonth.year, currentMonth.month)}
        </p>
        <button
          type="button"
          aria-label="Next month"
          onClick={() =>
            setCurrentMonth((c) => {
              const d = new Date(c.year, c.month + 1, 1);
              return { year: d.getFullYear(), month: d.getMonth() };
            })
          }
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "999px",
            border: `1px solid ${CALENDAR_COLORS.border}`,
            backgroundColor: CALENDAR_COLORS.navBg,
            color: CALENDAR_COLORS.text,
            fontSize: "1.1rem",
            cursor: "pointer",
            fontFamily: insightsSans,
            flexShrink: 0,
          }}
        >
          ›
        </button>
      </div>

      <div
        style={{
          marginTop: "16px",
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
              marginBottom: rowIndex < weekRows.length - 1 ? `${sizes.weekRowMargin}px` : 0,
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

                const day = resolveDay(cell.dateKey);

                return (
                  <DateCell
                    key={cell.dateKey}
                    dayOfMonth={cell.dayOfMonth}
                    dateKey={day.dateKey}
                    phase={day.phase}
                    entry={day.entry}
                    isToday={cell.dateKey === todayDateKey}
                    compact={compact}
                    canHover={canHover}
                    showHoverPreview={
                      canHover && hoveredDate === cell.dateKey && day.entry !== null
                    }
                    onHoverStart={() => setHoveredDate(cell.dateKey)}
                    onHoverEnd={() => setHoveredDate(null)}
                  />
                );
              })}            </div>
            <PhaseBands
              segments={bandSegments}
              rowIndex={rowIndex}
              gridGap={gridGap}
              pillHeight={sizes.pillHeight}
            />
          </div>
        ))}
      </div>

      <PhaseLegend />
    </section>
  );
}