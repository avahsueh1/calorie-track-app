"use client";

import type { LucideIcon } from "lucide-react";
import { IconBubble } from "../ui/IconBubble";
import { insightsColors, insightsSans } from "./theme";

export const PATTERN_INSIGHT_ICON_SIZE = 38 as const;
const PATTERN_INSIGHT_ICON_SIZE_COMPACT = 32 as const;

export interface PatternInsightIconStyle {
  icon: LucideIcon;
  backgroundColor: string;
  color: string;
}

export type PatternInsightCategory =
  | "Cycle pattern"
  | "Symptom trend"
  | "Nutrition trend"
  | "Activity trend";

const categoryLabelStyle = {
  margin: 0,
  fontFamily: insightsSans,
  fontSize: "0.6875rem",
  fontWeight: 600,
  letterSpacing: "0.04em",
  textTransform: "uppercase" as const,
  color: insightsColors.textSecondary,
  lineHeight: 1.2,
};

export function PatternInsightRow({
  iconStyle,
  category,
  headline,
  body,
  meta,
  variant = "card",
  size = "default",
}: {
  iconStyle: PatternInsightIconStyle;
  category?: PatternInsightCategory | string;
  headline: string;
  body?: string | null;
  meta?: string | null;
  variant?: "card" | "embedded";
  size?: "default" | "compact";
}) {
  const isCard = variant === "card";
  const isCompact = size === "compact";
  const iconSize = isCompact
    ? PATTERN_INSIGHT_ICON_SIZE_COMPACT
    : PATTERN_INSIGHT_ICON_SIZE;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: isCompact ? "10px" : "12px",
        padding: isCard
          ? isCompact
            ? "12px 14px"
            : "15px 16px"
          : 0,
        borderRadius: isCard ? (isCompact ? "16px" : "20px") : undefined,
        backgroundColor: isCard ? "#FFFDFB" : "transparent",
        border: isCard ? "1px solid #E6D7CB" : "none",
      }}
    >
      <IconBubble
        icon={iconStyle.icon}
        backgroundColor={iconStyle.backgroundColor}
        color={iconStyle.color}
        size={iconSize}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          flex: 1,
          minWidth: 0,
        }}
      >
        {category ? <p style={categoryLabelStyle}>{category}</p> : null}
        <p
          style={{
            margin: 0,
            fontFamily: insightsSans,
            fontSize: isCompact ? "0.875rem" : "0.9375rem",
            fontWeight: 600,
            lineHeight: 1.35,
            color: insightsColors.text,
          }}
        >
          {headline}
        </p>
        {body ? (
          <p
            style={{
              margin: 0,
              fontFamily: insightsSans,
              fontSize: "0.8125rem",
              lineHeight: 1.5,
              color: insightsColors.textSecondary,
            }}
          >
            {body}
          </p>
        ) : null}
        {meta ? (
          <p
            style={{
              margin: 0,
              fontFamily: insightsSans,
              fontSize: "0.75rem",
              lineHeight: 1.4,
              color: insightsColors.textSecondary,
            }}
          >
            {meta}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function ReportSectionHeader({
  title,
  helper,
}: {
  title: string;
  helper: string;
}) {
  return (
    <header style={{ marginBottom: "18px" }}>
      <h2 style={{ ...sectionTitleStyle(), margin: "0 0 6px" }}>{title}</h2>
      <p style={{ ...sectionHelperStyle(), margin: 0 }}>{helper}</p>
    </header>
  );
}

export function ReportSubsectionHeader({
  title,
  helper,
}: {
  title: string;
  helper: string;
}) {
  return (
    <header style={{ marginBottom: "14px" }}>
      <h3 style={{ ...subsectionTitleStyle(), margin: "0 0 6px" }}>{title}</h3>
      <p style={{ ...sectionHelperStyle(), margin: 0 }}>{helper}</p>
    </header>
  );
}

function sectionTitleStyle() {
  return {
    fontFamily: insightsSans,
    fontSize: "1rem",
    fontWeight: 600,
    color: insightsColors.text,
    letterSpacing: "-0.01em",
    lineHeight: 1.3,
  };
}

function subsectionTitleStyle() {
  return {
    fontFamily: insightsSans,
    fontSize: "0.9375rem",
    fontWeight: 600,
    color: insightsColors.text,
    letterSpacing: "-0.01em",
    lineHeight: 1.3,
  };
}

function sectionHelperStyle() {
  return {
    fontFamily: insightsSans,
    fontSize: "0.8125rem",
    lineHeight: 1.5,
    color: insightsColors.textSecondary,
  };
}
