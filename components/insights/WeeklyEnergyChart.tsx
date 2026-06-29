"use client";

import { useState } from "react";
import {
  getCalorieTargetStatus,
  type CalorieTargetStatus,
} from "../../lib/calorieTargetStatus";
import type { WeeklyNetDay } from "../../types/wellness";
import {
  insightsCardStyle,
  insightsColors,
  insightsSans,
  insightsSerif,
  insightsSectionTitleStyle,
} from "./theme";
import { WeeklyDayHoverCallout } from "./WeeklyDayHoverCallout";

interface WeeklyEnergyChartProps {
  days: WeeklyNetDay[];
  tdeeTarget: number;
  targetRange: { min: number; max: number };
  takeaway: string;
  tapHint: string;
  netNote: string;
  footerMessage: string;
}

const CHART_WIDTH = 320;
const CHART_HEIGHT = 168;
const PADDING = { top: 10, right: 44, bottom: 28, left: 34 };

const CHART_COLORS = {
  nearTarget: "#7E9A7C",
  nearTargetHover: "#6E8A6C",
  underTarget: "#B89A6D",
  underTargetHover: "#A88A5D",
  overTarget: "#B97663",
  overTargetHover: "#A96855",
  selected: "#B97663",
  selectedHover: "#A96855",
  targetLine: "#D8C8BC",
  grid: "#EFE5DD",
  text: "#3C2B24",
  textSecondary: "#7D7068",
};

function formatKcal(value: number): string {
  return value.toLocaleString("en-US");
}

function scaleY(value: number, maxY: number, innerHeight: number): number {
  return PADDING.top + innerHeight - (value / maxY) * innerHeight;
}

function dayTarget(day: WeeklyNetDay, fallback: number): number {
  return day.target && day.target > 0 ? day.target : fallback;
}

function dayCalorieStatus(
  day: WeeklyNetDay,
  fallbackTarget: number,
): CalorieTargetStatus {
  return getCalorieTargetStatus({
    eaten: day.eaten,
    burned: day.burned,
    target: dayTarget(day, fallbackTarget),
    netCalories: day.net,
  });
}

function statusBarColorFromStatus(
  status: CalorieTargetStatus,
  hovered: boolean,
): string {
  if (status === "near") {
    return hovered ? CHART_COLORS.nearTargetHover : CHART_COLORS.nearTarget;
  }
  if (status === "under" || status === "noData") {
    return hovered ? CHART_COLORS.underTargetHover : CHART_COLORS.underTarget;
  }
  return hovered ? CHART_COLORS.overTargetHover : CHART_COLORS.overTarget;
}

function statusBarColorForDay(
  day: WeeklyNetDay,
  fallbackTarget: number,
  hovered: boolean,
): string {
  return statusBarColorFromStatus(
    dayCalorieStatus(day, fallbackTarget),
    hovered,
  );
}

function DayDetailCard({
  day,
  netNote,
}: {
  day: WeeklyNetDay;
  netNote: string;
}) {
  return (
    <div
      style={{
        marginTop: "12px",
        padding: "14px 14px 12px",
        borderRadius: "16px",
        backgroundColor: "#FFFDFB",
        border: `1px solid ${insightsColors.border}`,
      }}
    >
      <p
        style={{
          margin: "0 0 10px",
          fontFamily: insightsSerif,
          fontSize: "1.05rem",
          color: CHART_COLORS.text,
        }}
      >
        {day.dayFull}
      </p>
      <div
        style={{
          display: "grid",
          gap: "6px",
          fontFamily: insightsSans,
          fontSize: "0.84rem",
          color: CHART_COLORS.text,
          lineHeight: 1.45,
        }}
      >
        <p style={{ margin: 0 }}>Net: {formatKcal(day.net)} kcal</p>
        <p style={{ margin: 0 }}>Eaten: {formatKcal(day.eaten)} kcal</p>
        <p style={{ margin: 0 }}>Burned: {formatKcal(day.burned)} kcal</p>
      </div>
      <p
        style={{
          margin: "10px 0 0",
          fontSize: "0.72rem",
          lineHeight: 1.4,
          color: CHART_COLORS.textSecondary,
          fontFamily: insightsSans,
        }}
      >
        {netNote}
      </p>
    </div>
  );
}

export function WeeklyEnergyChart({
  days,
  tdeeTarget,
  targetRange,
  takeaway,
  tapHint,
  netNote,
  footerMessage,
}: WeeklyEnergyChartProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const maxY = 2400;
  const gridSteps = [0, 800, 1600, 2400];
  const baselineY = scaleY(0, maxY, innerHeight);

  const avgNet = Math.round(
    days.reduce((sum, day) => sum + day.net, 0) / days.length,
  );
  const avgTarget = Math.round(
    days.reduce((sum, day) => sum + dayTarget(day, tdeeTarget), 0) /
      days.length,
  );
  const daysNearTarget = days.filter(
    (day) => dayCalorieStatus(day, tdeeTarget) === "near",
  ).length;

  const targetY = scaleY(avgTarget, maxY, innerHeight);
  const slotWidth = innerWidth / days.length;
  const barWidth = Math.min(28, slotWidth * 0.58);
  const highlightedIndex = hoveredIndex ?? selectedIndex;
  const selectedDay =
    selectedIndex === null ? null : days[selectedIndex] ?? null;
  const hoveredDay =
    hoveredIndex === null ? null : days[hoveredIndex] ?? null;

  const summaryItems = [
    { label: "Avg net", value: `${formatKcal(avgNet)} kcal` },
    { label: "Avg target", value: `${formatKcal(avgTarget)} kcal` },
    {
      label: "Near target",
      value: `${daysNearTarget} / ${days.length} days`,
    },
  ];

  function handleBarSelect(index: number) {
    setSelectedIndex((current) => (current === index ? null : index));
  }

  function getBarFill(index: number): string {
    const isHighlighted = highlightedIndex === index;
    const isHovered = hoveredIndex === index;

    if (isHighlighted && selectedIndex === index) {
      return isHovered ? CHART_COLORS.selectedHover : CHART_COLORS.selected;
    }

    return statusBarColorForDay(days[index], tdeeTarget, isHighlighted);
  }

  function getCalloutPosition(index: number, net: number) {
    const slotX = PADDING.left + index * slotWidth;
    const centerX = slotX + slotWidth / 2;
    const barTopY = scaleY(Math.max(net, 0), maxY, innerHeight);
    const leftPercent = (centerX / CHART_WIDTH) * 100;
    const topPercent = (barTopY / CHART_HEIGHT) * 100;
    const edgeShift =
      index <= 1
        ? "translateX(0)"
        : index >= days.length - 2
          ? "translateX(-100%)"
          : "translateX(-50%)";

    return {
      left: `${leftPercent}%`,
      top: `${topPercent}%`,
      transform: `${edgeShift} translateY(calc(-100% - 8px))`,
    };
  }

  return (
    <section
      style={{
        ...insightsCardStyle(),
        padding: "14px 16px 12px",
      }}
    >
      <h2 style={insightsSectionTitleStyle()}>Weekly Net Calories</h2>

      <p
        style={{
          margin: "10px 0 0",
          fontFamily: insightsSerif,
          fontSize: "1.02rem",
          lineHeight: 1.45,
          color: CHART_COLORS.text,
        }}
      >
        {takeaway}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
          marginTop: "12px",
          padding: "10px 10px",
          borderRadius: "14px",
          backgroundColor: "#FFFDFB",
          border: `1px solid ${insightsColors.border}`,
        }}
      >
        {summaryItems.map((item) => (
          <div key={item.label} style={{ textAlign: "center" }}>
            <p
              style={{
                margin: "0 0 3px",
                fontSize: "0.6rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: CHART_COLORS.textSecondary,
                fontFamily: insightsSans,
                lineHeight: 1.25,
              }}
            >
              {item.label}
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: insightsSerif,
                fontSize: "0.92rem",
                color: CHART_COLORS.text,
                lineHeight: 1.15,
              }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <p
        style={{
          margin: "8px 0 0",
          fontSize: "0.72rem",
          lineHeight: 1.4,
          color: CHART_COLORS.textSecondary,
          fontFamily: insightsSans,
        }}
      >
        {tapHint}
      </p>

      <div style={{ marginTop: "8px" }}>
        <div style={{ position: "relative", overflow: "visible" }}>
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          width="100%"
          style={{ display: "block", minWidth: "280px" }}
          role="img"
          aria-label="Weekly net calories bar chart with target line"
        >
          {gridSteps.map((step) => {
            const y = scaleY(step, maxY, innerHeight);
            return (
              <g key={step}>
                <line
                  x1={PADDING.left}
                  y1={y}
                  x2={CHART_WIDTH - PADDING.right}
                  y2={y}
                  stroke={CHART_COLORS.grid}
                  strokeWidth={1}
                />
                <text
                  x={PADDING.left - 6}
                  y={y + 4}
                  textAnchor="end"
                  fill={CHART_COLORS.textSecondary}
                  fontSize={9}
                  fontFamily={insightsSans}
                >
                  {step === 0 ? "0" : `${step / 1000}k`}
                </text>
              </g>
            );
          })}

          <line
            x1={PADDING.left}
            y1={targetY}
            x2={CHART_WIDTH - PADDING.right}
            y2={targetY}
            stroke={CHART_COLORS.targetLine}
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
          <text
            x={CHART_WIDTH - PADDING.right + 2}
            y={targetY + 3}
            fill={CHART_COLORS.textSecondary}
            fontSize={9}
            fontFamily={insightsSans}
          >
            Target
          </text>

          {days.map((day, index) => {
            const slotX = PADDING.left + index * slotWidth;
            const x = slotX + (slotWidth - barWidth) / 2;
            const topY = scaleY(day.net, maxY, innerHeight);
            const height = baselineY - topY;
            const isHighlighted = highlightedIndex === index;

            return (
              <g key={day.day}>
                <rect
                  x={slotX}
                  y={PADDING.top}
                  width={slotWidth}
                  height={innerHeight}
                  fill="transparent"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleBarSelect(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onFocus={() => setHoveredIndex(index)}
                  onBlur={() => setHoveredIndex(null)}
                  aria-label={`${day.dayFull}, ${formatKcal(day.net)} net calories`}
                  role="button"
                  aria-pressed={selectedIndex === index}
                  tabIndex={0}
                />
                <rect
                  x={x}
                  y={topY}
                  width={barWidth}
                  height={height}
                  rx={4}
                  fill={getBarFill(index)}
                  style={{
                    cursor: "pointer",
                    pointerEvents: "none",
                  }}
                />
                <text
                  x={slotX + slotWidth / 2}
                  y={CHART_HEIGHT - 8}
                  textAnchor="middle"
                  fill={
                    isHighlighted
                      ? CHART_COLORS.text
                      : CHART_COLORS.textSecondary
                  }
                  fontSize={10}
                  fontFamily={insightsSans}
                  fontWeight={isHighlighted ? 600 : 400}
                  style={{ pointerEvents: "none" }}
                >
                  {day.day}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredDay ? (
          <div
            style={{
              position: "absolute",
              zIndex: 20,
              ...getCalloutPosition(hoveredIndex!, hoveredDay.net),
            }}
          >
            <WeeklyDayHoverCallout day={hoveredDay} />
          </div>
        ) : null}
        </div>
      </div>

      {selectedDay && hoveredIndex === null ? (
        <DayDetailCard day={selectedDay} netNote={netNote} />
      ) : null}

      <p
        style={{
          margin: "10px 0 0",
          fontSize: "0.78rem",
          lineHeight: 1.5,
          color: CHART_COLORS.textSecondary,
          fontFamily: insightsSans,
        }}
      >
        {footerMessage}
      </p>
    </section>
  );
}
