"use client";

import type { CSSProperties } from "react";
import { useMemo } from "react";
import type { ProgressJournalEntry } from "../../types/wellness";
import type { UnitsPreference } from "../../types/profile";
import { formatWeightDisplay } from "../../lib/profileBody";
import {
  buildWeightChartPoints,
  buildWeightTrendSummary,
} from "../../lib/weightChart";
import {
  insightsCardStyle,
  insightsColors,
  insightsSans,
  insightsSectionTitleStyle,
  insightsSerif,
} from "./theme";

interface WeightTrendChartProps {
  entries: ProgressJournalEntry[];
  units: UnitsPreference;
  /** Renders inside a parent card without its own shell/title. */
  embedded?: boolean;
  showTitle?: boolean;
  /** Hide the Latest / Weigh-ins stat strip (shown elsewhere on full page). */
  showMetricStrip?: boolean;
  /** Hide the trend message paragraph (shown in hero on full page). */
  showTrendMessage?: boolean;
  /** Match progress journal page card rhythm. */
  density?: "default" | "page";
}

const CHART_WIDTH = 320;
const CHART_HEIGHT = 168;
const PADDING = { top: 12, right: 16, bottom: 30, left: 40 };

const CHART_COLORS = {
  lineDown: "#7D9B8A",
  lineUp: "#B97663",
  lineFlat: "#B89A6D",
  dot: "#744336",
  grid: "#EFE5DD",
  text: "#3C2B24",
  textSecondary: "#7D7068",
};

function scaleY(
  value: number,
  minY: number,
  maxY: number,
  innerHeight: number,
): number {
  const range = maxY - minY || 1;
  return PADDING.top + innerHeight - ((value - minY) / range) * innerHeight;
}

function scaleX(index: number, count: number, innerWidth: number): number {
  if (count <= 1) {
    return PADDING.left + innerWidth / 2;
  }
  return PADDING.left + (index / (count - 1)) * innerWidth;
}

export function WeightTrendChart({
  entries,
  units,
  embedded = false,
  showTitle = true,
  showMetricStrip = true,
  showTrendMessage = true,
  density = "default",
}: WeightTrendChartProps) {
  const points = useMemo(() => buildWeightChartPoints(entries), [entries]);
  const trend = useMemo(
    () => buildWeightTrendSummary(points, units),
    [points, units],
  );

  const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const shellStyle = embedded
    ? { padding: 0, margin: 0, border: "none", background: "transparent", boxShadow: "none" }
    : density === "page"
      ? {
          ...insightsCardStyle(),
          padding: "18px",
          borderRadius: "22px",
        }
      : {
          ...insightsCardStyle(),
          padding: "14px 16px 12px",
        };

  const titleStyle: CSSProperties = {
    ...insightsSectionTitleStyle(),
    margin: density === "page" ? "0 0 10px" : undefined,
  };

  if (points.length === 0) {
    return (
      <div style={shellStyle}>
        {!embedded && showTitle ? (
          <h2 style={titleStyle}>Weight trend</h2>
        ) : null}
        <p
          style={{
            margin: embedded ? 0 : "10px 0 0",
            fontSize: "0.84rem",
            lineHeight: 1.5,
            color: insightsColors.textSecondary,
            fontFamily: insightsSans,
            fontStyle: "italic",
          }}
        >
          Log your weight to see a trend line here.
        </p>
      </div>
    );
  }

  const weights = points.map((point) => point.weightKg);
  const rawMin = Math.min(...weights);
  const rawMax = Math.max(...weights);
  const padding = Math.max(0.5, (rawMax - rawMin) * 0.15 || 1);
  const minY = rawMin - padding;
  const maxY = rawMax + padding;

  const lineColor =
    trend.direction === "down"
      ? CHART_COLORS.lineDown
      : trend.direction === "up"
        ? CHART_COLORS.lineUp
        : CHART_COLORS.lineFlat;

  const polylinePoints = points
    .map((point, index) => {
      const x = scaleX(index, points.length, innerWidth);
      const y = scaleY(point.weightKg, minY, maxY, innerHeight);
      return `${x},${y}`;
    })
    .join(" ");

  const latestWeight = formatWeightDisplay(
    points[points.length - 1].weightKg,
    units,
  );

  const yLabels = [maxY, (maxY + minY) / 2, minY].map((value) => ({
    value,
    label:
      units === "metric"
        ? `${Math.round(value * 10) / 10}`
        : `${Math.round(value / 0.453592)}`,
  }));

  const xLabelIndices =
    points.length <= 3
      ? points.map((_, index) => index)
      : [0, Math.floor((points.length - 1) / 2), points.length - 1];

  return (
    <div style={shellStyle}>
      {!embedded && showTitle ? (
        <h2 style={titleStyle}>Weight trend</h2>
      ) : null}

      {showTrendMessage ? (
        <p
          style={{
            margin: embedded ? "0 0 10px" : "10px 0 0",
            fontFamily: insightsSerif,
            fontSize: embedded ? "0.88rem" : "1.02rem",
            lineHeight: 1.45,
            color: CHART_COLORS.text,
          }}
        >
          {trend.message}
        </p>
      ) : null}

      {showMetricStrip ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "8px",
            marginTop: showTrendMessage ? "12px" : embedded ? "0" : "10px",
            padding: "10px",
            borderRadius: "14px",
            backgroundColor: "#FFFDFB",
            border: `1px solid ${insightsColors.border}`,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                margin: "0 0 3px",
                fontSize: "0.6rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: CHART_COLORS.textSecondary,
                fontFamily: insightsSans,
              }}
            >
              Latest
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: insightsSerif,
                fontSize: "0.92rem",
                color: CHART_COLORS.text,
              }}
            >
              {latestWeight}
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                margin: "0 0 3px",
                fontSize: "0.6rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: CHART_COLORS.textSecondary,
                fontFamily: insightsSans,
              }}
            >
              Weigh-ins
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: insightsSerif,
                fontSize: "0.92rem",
                color: CHART_COLORS.text,
              }}
            >
              {trend.pointCount}
            </p>
          </div>
        </div>
      ) : null}

      <div
        style={{
          marginTop:
            showMetricStrip || showTrendMessage
              ? density === "page"
                ? "0"
                : "10px"
              : embedded
                ? "0"
                : density === "page"
                  ? "0"
                  : "10px",
        }}
      >
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          width="100%"
          style={{ display: "block", minWidth: "280px" }}
          role="img"
          aria-label="Weight trend line chart"
        >
          {[0, 0.5, 1].map((step) => {
            const y =
              PADDING.top + innerHeight - step * innerHeight;
            return (
              <line
                key={step}
                x1={PADDING.left}
                x2={CHART_WIDTH - PADDING.right}
                y1={y}
                y2={y}
                stroke={CHART_COLORS.grid}
                strokeWidth={1}
              />
            );
          })}

          {yLabels.map((item) => {
            const y = scaleY(item.value, minY, maxY, innerHeight);
            return (
              <text
                key={item.value}
                x={PADDING.left - 6}
                y={y + 4}
                textAnchor="end"
                fontSize="9"
                fill={CHART_COLORS.textSecondary}
                fontFamily={insightsSans}
              >
                {item.label}
              </text>
            );
          })}

          {points.length > 1 ? (
            <polyline
              points={polylinePoints}
              fill="none"
              stroke={lineColor}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {points.map((point, index) => {
            const x = scaleX(index, points.length, innerWidth);
            const y = scaleY(point.weightKg, minY, maxY, innerHeight);
            return (
              <circle
                key={point.date}
                cx={x}
                cy={y}
                r={4.5}
                fill={CHART_COLORS.dot}
                stroke="#FFFDFB"
                strokeWidth={2}
              />
            );
          })}

          {xLabelIndices.map((index) => {
            const x = scaleX(index, points.length, innerWidth);
            return (
              <text
                key={points[index].date}
                x={x}
                y={CHART_HEIGHT - 8}
                textAnchor="middle"
                fontSize="9"
                fill={CHART_COLORS.textSecondary}
                fontFamily={insightsSans}
              >
                {points[index].label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
