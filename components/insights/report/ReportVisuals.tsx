"use client";

import type { ReactNode } from "react";
import {
  Apple,
  CalendarDays,
  Circle,
  Dumbbell,
  Scale,
  Smile,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type { SymptomKey } from "../../../types";
import type {
  ReportInsightCard,
  ReportNutritionSummary,
  ReportPhaseMetric,
  ReportSymptomTrendRow,
  ReportWeeklyNetPoint,
} from "../../../lib/reportAnalytics";
import { REPORT_DAY_COUNT } from "../../../lib/reportAnalytics";
import {
  getSymptomIconStyle,
} from "../../../lib/symptomIcons";
import { IconBubble } from "../../ui/IconBubble";
import {
  PatternInsightRow,
  type PatternInsightIconStyle,
} from "../PatternInsightRow";
import { getPhaseInsightIcon } from "../patternPhaseIcons";
import { PHASE_THEME, type PhaseKind } from "../bodyPatternCalendarUtils";
import { insightsColors, insightsSans, insightsSerif } from "../theme";
import { resolveInsightCategory } from "./reportInsightMeta";

const REPORT_INSIGHT_FALLBACK: PatternInsightIconStyle = {
  icon: Circle,
  backgroundColor: "#F3EAF8",
  color: "#6E6280",
};

function resolveReportInsightIcon(insight: ReportInsightCard): PatternInsightIconStyle {
  if (insight.id.startsWith("top-symptom-")) {
    const key = insight.id.slice("top-symptom-".length) as SymptomKey;
    return getSymptomIconStyle(key);
  }

  switch (insight.id) {
    case "check-in-coverage":
      return {
        icon: CalendarDays,
        backgroundColor: "#F3EAF8",
        color: "#6E6280",
      };
    case "luteal-cravings":
      return getSymptomIconStyle("cravings");
    case "menstrual-fatigue":
      return getSymptomIconStyle("fatigue");
    case "menstrual-mood":
      return {
        icon: Smile,
        backgroundColor: "#F4DCD5",
        color: "#B86B52",
      };
    case "nutrition-near-target":
      return {
        icon: Apple,
        backgroundColor: "#E1EFD9",
        color: "#5E8A54",
      };
    case "top-activity":
      return {
        icon: Dumbbell,
        backgroundColor: "#DDEAD8",
        color: "#5A7350",
      };
    case "weight-change":
      return {
        icon: TrendingUp,
        backgroundColor: "#F7EFE8",
        color: "#B97663",
      };
    case "latest-weight":
      return {
        icon: Scale,
        backgroundColor: "#F3EAF8",
        color: "#6E6280",
      };
    default:
      return REPORT_INSIGHT_FALLBACK;
  }
}

export function CoverageRing({
  loggedDays,
  totalDays = REPORT_DAY_COUNT,
  size = 84,
}: {
  loggedDays: number;
  totalDays?: number;
  size?: number;
}) {
  const ratio = totalDays > 0 ? Math.min(1, loggedDays / totalDays) : 0;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - ratio);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`${loggedDays} of ${totalDays} days logged`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#EFE5DD"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={insightsColors.lavender}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2}
        y={size / 2 - 2}
        textAnchor="middle"
        fontSize="18"
        fontWeight="600"
        fill={insightsColors.text}
        fontFamily={insightsSans}
      >
        {loggedDays}
      </text>
      <text
        x={size / 2}
        y={size / 2 + 14}
        textAnchor="middle"
        fontSize="9"
        fill={insightsColors.textSecondary}
        fontFamily={insightsSans}
      >
        days
      </text>
    </svg>
  );
}

const PHASE_SHORT_LABELS: Record<string, string> = {
  menstrual: "Period",
  follicular: "After",
  ovulatory: "Ovulation",
  luteal: "Before",
};

export function PhaseOverviewChart({
  phases,
}: {
  phases: ReportPhaseMetric[];
}) {
  const maxCheckIns = Math.max(1, ...phases.map((phase) => phase.checkInDays));

  return (
    <div
      role="img"
      aria-label="Check-ins logged per cycle phase"
      style={{
        marginBottom: "20px",
        padding: "16px 18px 14px",
        borderRadius: "14px",
        backgroundColor: "#FFFBF8",
        border: `1px solid ${insightsColors.border}`,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "12px",
          alignItems: "end",
          minHeight: "96px",
        }}
      >
        {phases.map((phase) => {
          const theme = PHASE_THEME[phase.phaseKind as PhaseKind];
          const barHeight = Math.max(
            12,
            Math.round((phase.checkInDays / maxCheckIns) * 56),
          );

          return (
            <div
              key={phase.phaseKind}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: "100%",
                  minWidth: "36px",
                  maxWidth: "56px",
                  height: `${barHeight}px`,
                  borderRadius: "10px 10px 4px 4px",
                  backgroundColor:
                    phase.checkInDays > 0 ? theme.accent : "#E8DDD3",
                  opacity: phase.checkInDays > 0 ? 0.9 : 0.45,
                }}
              />
              <span
                style={{
                  fontFamily: insightsSans,
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  color: theme.accent,
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {phase.checkInDays}
              </span>
              <span
                style={{
                  fontFamily: insightsSans,
                  fontSize: "0.625rem",
                  color: theme.accent,
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                {PHASE_SHORT_LABELS[phase.phaseKind] ?? phase.friendlyTitle}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SymptomTrendChart({
  symptoms,
  maxCount,
  renderIcon,
}: {
  symptoms: ReportSymptomTrendRow[];
  maxCount: number;
  renderIcon: (symptom: ReportSymptomTrendRow) => ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {symptoms.map((symptom, index) => {
        const widthPercent = Math.max(
          10,
          Math.round((symptom.count / maxCount) * 100),
        );

        return (
          <div
            key={symptom.key}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              padding: "12px 14px",
              borderRadius: "14px",
              backgroundColor: "#FFFBF8",
              border: `1px solid ${insightsColors.border}`,
            }}
          >
            <span
              style={{
                width: "24px",
                paddingTop: "6px",
                fontFamily: insightsSans,
                fontSize: "0.75rem",
                fontWeight: 700,
                color: insightsColors.textSecondary,
                textAlign: "center",
                flexShrink: 0,
              }}
            >
              {index + 1}
            </span>
            <div style={{ paddingTop: "2px", flexShrink: 0 }}>
              {renderIcon(symptom)}
            </div>
            <div style={{ flex: 1, minWidth: 0, paddingTop: "1px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    fontFamily: insightsSans,
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    lineHeight: 1.35,
                    color: insightsColors.text,
                  }}
                >
                  {symptom.label}
                </span>
                <span
                  style={{
                    fontFamily: insightsSans,
                    fontSize: "0.75rem",
                    lineHeight: 1.35,
                    color: insightsColors.textSecondary,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {symptom.count}× · {symptom.percent}%
                </span>
              </div>
              <div
                style={{
                  height: "8px",
                  borderRadius: "999px",
                  backgroundColor: "#EFE5DD",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${widthPercent}%`,
                    height: "100%",
                    borderRadius: "999px",
                    background: `linear-gradient(90deg, ${insightsColors.lavender} 0%, #B8A8D8 100%)`,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function TargetDaysChart({
  summary,
}: {
  summary: ReportNutritionSummary;
}) {
  const total =
    summary.daysUnderTarget +
    summary.daysNearTarget +
    summary.daysOverTarget;

  if (total === 0) {
    return (
      <p
        style={{
          margin: 0,
          fontFamily: insightsSans,
          fontSize: "0.8125rem",
          color: insightsColors.textSecondary,
          fontStyle: "italic",
        }}
      >
        No calorie logs in this period yet.
      </p>
    );
  }

  const segments = [
    {
      key: "under",
      count: summary.daysUnderTarget,
      color: "#6078A0",
      label: "Under",
    },
    {
      key: "near",
      count: summary.daysNearTarget,
      color: "#7E9A7C",
      label: "Near",
    },
    {
      key: "over",
      count: summary.daysOverTarget,
      color: "#B97663",
      label: "Over",
    },
  ].filter((segment) => segment.count > 0);

  return (
    <div>
      <div
        role="img"
        aria-label={`Target days: ${summary.daysUnderTarget} under, ${summary.daysNearTarget} near, ${summary.daysOverTarget} over`}
        style={{
          display: "flex",
          height: "14px",
          borderRadius: "999px",
          overflow: "hidden",
          marginBottom: "12px",
          border: `1px solid ${insightsColors.border}`,
        }}
      >
        {segments.map((segment) => (
          <div
            key={segment.key}
            style={{
              width: `${(segment.count / total) * 100}%`,
              backgroundColor: segment.color,
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
        {segments.map((segment) => (
          <span
            key={segment.key}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: insightsSans,
              fontSize: "0.75rem",
              color: insightsColors.textSecondary,
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                backgroundColor: segment.color,
              }}
            />
            {segment.label}: {segment.count}
          </span>
        ))}
      </div>
    </div>
  );
}

export function WeeklyNetChart({
  weeks,
}: {
  weeks: ReportWeeklyNetPoint[];
}) {
  const maxAbs = Math.max(
    1,
    ...weeks.map((week) => Math.abs(week.averageNet)),
  );
  const chartHeight = 120;
  const barWidth = 44;
  const gap = 14;
  const width = weeks.length * barWidth + (weeks.length - 1) * gap + 24;

  return (
    <svg
      viewBox={`0 0 ${width} ${chartHeight + 28}`}
      width="100%"
      style={{ display: "block", minWidth: "260px" }}
      role="img"
      aria-label="Weekly average net calories"
    >
      {weeks.map((week, index) => {
        const barHeight =
          week.daysLogged > 0
            ? Math.max(8, (Math.abs(week.averageNet) / maxAbs) * 88)
            : 4;
        const x = 12 + index * (barWidth + gap);
        const y = chartHeight - barHeight;
        const isPositive = week.averageNet >= 0;

        return (
          <g key={week.label}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={6}
              fill={isPositive ? "#7E9A7C" : "#B89A6D"}
              opacity={week.daysLogged > 0 ? 0.92 : 0.25}
            />
            <text
              x={x + barWidth / 2}
              y={y - 6}
              textAnchor="middle"
              fontSize="9"
              fontFamily={insightsSans}
              fill={insightsColors.textSecondary}
            >
              {week.daysLogged > 0
                ? `${Math.round(week.averageNet).toLocaleString("en-US")}`
                : ""}
            </text>
            <text
              x={x + barWidth / 2}
              y={chartHeight + 18}
              textAnchor="middle"
              fontSize="9"
              fontFamily={insightsSans}
              fill={insightsColors.textSecondary}
            >
              {week.label.replace("Week ", "W")}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function ReportInsightCardView({
  insight,
  compact = false,
}: {
  insight: ReportInsightCard;
  compact?: boolean;
}) {
  const iconStyle = resolveReportInsightIcon(insight);

  return (
    <PatternInsightRow
      iconStyle={iconStyle}
      category={compact ? undefined : resolveInsightCategory(insight)}
      headline={insight.headline}
      body={insight.explanation}
      meta={insight.detail}
      size={compact ? "compact" : "default"}
    />
  );
}

export function PhaseSummaryCard({ phase }: { phase: ReportPhaseMetric }) {
  const phaseKind = phase.phaseKind as Exclude<PhaseKind, "none">;
  const iconStyle = getPhaseInsightIcon(phaseKind);
  const body =
    phase.summarySentence ??
    (phase.checkInDays > 0
      ? "Your logs suggest more check-ins here will sharpen this picture."
      : null);

  return (
    <PatternInsightRow
      iconStyle={iconStyle}
      category="Cycle pattern"
      headline={phase.friendlyTitle}
      body={body}
      meta={`Based on ${phase.checkInDays} check-in${phase.checkInDays === 1 ? "" : "s"}`}
    />
  );
}

export function InsightSparkleRow({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        padding: "12px 14px",
        borderRadius: "14px",
        background: "linear-gradient(135deg, #F7EFE8 0%, #F3EAF8 100%)",
        border: `1px solid ${insightsColors.border}`,
      }}
    >
      <IconBubble
        icon={Sparkles}
        backgroundColor="#F3EAF8"
        color={insightsColors.lavender}
        size="sm"
      />
      <p
        style={{
          margin: 0,
          fontFamily: insightsSans,
          fontSize: "0.8125rem",
          lineHeight: 1.5,
          color: insightsColors.text,
        }}
      >
        {children}
      </p>
    </div>
  );
}

export function ReportHeroCard({
  title,
  dateRangeLabel,
  loggedDays,
}: {
  title: string;
  dateRangeLabel: string;
  loggedDays: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
        padding: "22px 24px",
        borderRadius: "18px",
        background: "linear-gradient(145deg, #FFF9F5 0%, #F3EAF8 55%, #EEF5EE 100%)",
        border: `1px solid ${insightsColors.border}`,
        boxShadow: "0 8px 24px rgba(74, 61, 54, 0.06)",
      }}
    >
      <div style={{ flex: 1, minWidth: 0, paddingRight: "4px" }}>
        <h1
          style={{
            margin: "0 0 8px",
            fontFamily: insightsSerif,
            fontSize: "1.5rem",
            fontWeight: 400,
            color: insightsColors.text,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            margin: "0 0 6px",
            fontFamily: insightsSans,
            fontSize: "0.8125rem",
            lineHeight: 1.45,
            color: insightsColors.textSecondary,
          }}
        >
          {dateRangeLabel}
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: insightsSans,
            fontSize: "0.75rem",
            lineHeight: 1.45,
            color: insightsColors.textSecondary,
          }}
        >
          Coverage across your logs
        </p>
      </div>
      <div style={{ flexShrink: 0, paddingLeft: "4px" }}>
        <CoverageRing loggedDays={loggedDays} />
      </div>
    </div>
  );
}
