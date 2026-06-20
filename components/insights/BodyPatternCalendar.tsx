"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getSampleBodyPatternEntry } from "../../data/sampleInsights";
import type { BodyPatternCalendarDay } from "../../types/wellness";
import { BodyPatternDayHoverPreview } from "./BodyPatternDayHoverPreview";
import {
  CALENDAR_COLORS,
  formatFullDate,
  getTodayDateKey,
  INSIGHTS_SELECTED_DATE_KEY,
  PHASE_COLORS,
  phaseBackgroundColor,
  toDateKey,
} from "./bodyPatternCalendarUtils";
import {
  insightsCardStyle,
  insightsColors,
  insightsSans,
  insightsSectionTitleStyle,
  insightsSubtitleStyle,
} from "./theme";

interface BodyPatternCalendarProps {
  entriesByDate: Record<string, BodyPatternCalendarDay>;
  initialYear: number;
  initialMonth: number;
  initialSelectedDate: string;
  subtitle: string;
  tapHint: string;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface MonthCell {
  dateKey: string;
  dayOfMonth: number;
}

function formatMonthTitle(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function buildMonthGrid(year: number, month: number): (MonthCell | null)[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (MonthCell | null)[] = [];

  for (let index = 0; index < firstWeekday; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      dateKey: toDateKey(year, month, day),
      dayOfMonth: day,
    });
  }

  return cells;
}

function navButtonStyle() {
  return {
    width: "32px",
    height: "32px",
    borderRadius: "999px",
    border: `1px solid ${CALENDAR_COLORS.border}`,
    backgroundColor: CALENDAR_COLORS.cell,
    color: CALENDAR_COLORS.text,
    fontSize: "1rem",
    lineHeight: 1,
    cursor: "pointer",
    fontFamily: insightsSans,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };
}

function DateCell({
  dayOfMonth,
  entry,
  selected,
  isToday,
  canHover,
  showHoverPreview,
  onHoverStart,
  onHoverEnd,
  onSelect,
}: {
  dayOfMonth: number;
  entry: BodyPatternCalendarDay;
  selected: boolean;
  isToday: boolean;
  canHover: boolean;
  showHoverPreview: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onSelect: () => void;
}) {
  const phaseBg = phaseBackgroundColor(entry.phase);

  return (
    <div
      style={{ position: "relative", minWidth: 0 }}
      onMouseEnter={canHover ? onHoverStart : undefined}
      onMouseLeave={canHover ? onHoverEnd : undefined}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`${formatFullDate(entry.dateKey)}, cycle day ${entry.cycleDay}, ${entry.phase} phase`}
        aria-current={isToday ? "date" : undefined}
        style={{
          position: "relative",
          minWidth: 0,
          width: "100%",
          aspectRatio: "1 / 1",
          padding: "4px",
          border: selected
            ? `2px solid ${CALENDAR_COLORS.selectedBorder}`
            : `1px solid ${CALENDAR_COLORS.border}`,
          borderRadius: "12px",
          backgroundColor: phaseBg,
          boxShadow: selected
            ? "0 0 0 3px rgba(185, 118, 99, 0.12)"
            : "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: insightsSans,
          boxSizing: "border-box",
        }}
      >
        {isToday ? (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: CALENDAR_COLORS.sage,
            }}
          />
        ) : null}
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: selected || isToday ? 700 : 600,
            color: CALENDAR_COLORS.text,
            lineHeight: 1,
          }}
        >
          {dayOfMonth}
        </span>
      </button>

      {showHoverPreview ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "calc(100% + 6px)",
            transform: "translateX(-50%)",
            zIndex: 20,
          }}
        >
          <BodyPatternDayHoverPreview entry={entry} />
        </div>
      ) : null}
    </div>
  );
}

function PhaseLegend() {
  const items = [
    { label: "Menstrual", color: PHASE_COLORS.menstrual },
    { label: "Follicular", color: PHASE_COLORS.follicular },
    { label: "Ovulatory", color: PHASE_COLORS.ovulatory },
    { label: "Luteal", color: PHASE_COLORS.luteal },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px 12px",
        marginTop: "12px",
        fontSize: "0.62rem",
        color: CALENDAR_COLORS.secondary,
        fontFamily: insightsSans,
      }}
    >
      {items.map((item) => (
        <span
          key={item.label}
          style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
        >
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "4px",
              backgroundColor: item.color,
              border: `1px solid ${CALENDAR_COLORS.border}`,
              flexShrink: 0,
            }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

export function BodyPatternCalendar({
  entriesByDate,
  initialYear,
  initialMonth,
  initialSelectedDate,
  subtitle,
  tapHint,
}: BodyPatternCalendarProps) {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState({
    year: initialYear,
    month: initialMonth,
  });
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [canHover, setCanHover] = useState(false);
  const todayDateKey = getTodayDateKey();

  useEffect(() => {
    const stored = sessionStorage.getItem(INSIGHTS_SELECTED_DATE_KEY);
    if (stored) {
      setSelectedDate(stored);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const monthCells = useMemo(
    () => buildMonthGrid(currentMonth.year, currentMonth.month),
    [currentMonth.year, currentMonth.month],
  );

  function resolveEntry(dateKey: string): BodyPatternCalendarDay {
    return entriesByDate[dateKey] ?? getSampleBodyPatternEntry(dateKey);
  }

  function goToPreviousMonth() {
    setCurrentMonth((current) => {
      const date = new Date(current.year, current.month - 1, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  }

  function goToNextMonth() {
    setCurrentMonth((current) => {
      const date = new Date(current.year, current.month + 1, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  }

  function handleDateSelect(dateKey: string) {
    setSelectedDate(dateKey);
    sessionStorage.setItem(INSIGHTS_SELECTED_DATE_KEY, dateKey);
    router.push(`/insights/${dateKey}`);
  }

  return (
    <section
      style={{
        ...insightsCardStyle(),
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        overflow: "visible",
      }}
    >
      <h2 style={insightsSectionTitleStyle()}>Cycle Pattern Calendar</h2>
      <p style={insightsSubtitleStyle()}>{subtitle}</p>
      <p
        style={{
          margin: "8px 0 0",
          fontSize: "0.72rem",
          lineHeight: 1.4,
          color: insightsColors.textSecondary,
          fontFamily: insightsSans,
        }}
      >
        {tapHint}
      </p>

      <div
        style={{
          marginTop: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <button
          type="button"
          onClick={goToPreviousMonth}
          style={navButtonStyle()}
          aria-label="Previous month"
        >
          ‹
        </button>
        <p
          style={{
            margin: 0,
            flex: 1,
            textAlign: "center",
            fontSize: "0.95rem",
            fontWeight: 600,
            color: CALENDAR_COLORS.text,
            fontFamily: insightsSans,
          }}
        >
          {formatMonthTitle(currentMonth.year, currentMonth.month)}
        </p>
        <button
          type="button"
          onClick={goToNextMonth}
          style={navButtonStyle()}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div
        style={{
          marginTop: "12px",
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: "4px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            style={{
              textAlign: "center",
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: CALENDAR_COLORS.secondary,
              fontFamily: insightsSans,
              padding: "2px 0 4px",
            }}
          >
            {label}
          </div>
        ))}

        {monthCells.map((cell, index) =>
          cell ? (
            <DateCell
              key={cell.dateKey}
              dayOfMonth={cell.dayOfMonth}
              entry={resolveEntry(cell.dateKey)}
              selected={selectedDate === cell.dateKey}
              isToday={cell.dateKey === todayDateKey}
              canHover={canHover}
              showHoverPreview={canHover && hoveredDate === cell.dateKey}
              onHoverStart={() => setHoveredDate(cell.dateKey)}
              onHoverEnd={() => setHoveredDate(null)}
              onSelect={() => handleDateSelect(cell.dateKey)}
            />
          ) : (
            <div key={`blank-${index}`} aria-hidden="true" />
          ),
        )}
      </div>

      <PhaseLegend />
    </section>
  );
}
