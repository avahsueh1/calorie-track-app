"use client";

import { IconBubble } from "../../ui/IconBubble";
import type { PatternInsightCategory, PatternInsightIconStyle } from "../PatternInsightRow";
import { insightsColors, insightsSans } from "../theme";
import type { SymptomMetricItem } from "./phaseInsightCopy";

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

export interface SymptomMetricRowProps {
  label: string;
  headline: string;
  body: string;
  meta: string;
  category: PatternInsightCategory;
  percent: number;
  iconStyle: PatternInsightIconStyle;
  barColor: string;
  compact?: boolean;
}

export function SymptomMetricRow({
  headline,
  body,
  meta,
  category,
  percent,
  iconStyle,
  barColor,
  compact = false,
}: SymptomMetricRowProps) {
  const barWidth = Math.max(8, Math.min(100, percent));

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: compact ? "10px" : "12px",
        padding: compact ? "11px 12px" : "13px 14px",
        borderRadius: compact ? "16px" : "18px",
        backgroundColor: "#FFFDFB",
        border: "1px solid #E6D7CB",
      }}
    >
      <IconBubble
        icon={iconStyle.icon}
        backgroundColor={iconStyle.backgroundColor}
        color={iconStyle.color}
        size={compact ? 32 : 36}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ ...categoryLabelStyle, marginBottom: "4px" }}>{category}</p>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "10px",
            marginBottom: "4px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: insightsSans,
              fontSize: compact ? "0.8125rem" : "0.875rem",
              fontWeight: 600,
              lineHeight: 1.35,
              color: insightsColors.text,
            }}
          >
            {headline}
          </p>
          <span
            style={{
              fontFamily: insightsSans,
              fontSize: compact ? "0.9375rem" : "1rem",
              fontWeight: 700,
              color: barColor,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            {percent}%
          </span>
        </div>
        <p
          style={{
            margin: "0 0 8px",
            fontFamily: insightsSans,
            fontSize: "0.8125rem",
            lineHeight: 1.45,
            color: insightsColors.textSecondary,
          }}
        >
          {body}
        </p>
        <div
          style={{
            height: "7px",
            borderRadius: "999px",
            backgroundColor: "#EFE5DD",
            overflow: "hidden",
            marginBottom: "6px",
          }}
        >
          <div
            style={{
              width: `${barWidth}%`,
              height: "100%",
              borderRadius: "999px",
              backgroundColor: barColor,
              opacity: 0.88,
            }}
          />
        </div>
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
      </div>
    </div>
  );
}

export function SymptomMetricList({
  items,
  compact = false,
  gap = 8,
}: {
  items: SymptomMetricItem[];
  compact?: boolean;
  gap?: number;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: `${gap}px` }}>
      {items.map((item) => (
        <SymptomMetricRow
          key={item.id}
          label={item.label}
          headline={item.headline}
          body={item.body}
          meta={item.meta}
          category={item.category}
          percent={item.percent}
          iconStyle={item.iconStyle}
          barColor={item.barColor}
          compact={compact}
        />
      ))}
    </div>
  );
}
