import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { colors, sans, serif } from "../../lib/theme";
import { IconBubble } from "./IconBubble";

export type StatTileSize = "default" | "compact";

export interface StatTileTheme {
  backgroundColor: string;
  bubbleBackground: string;
  iconColor: string;
}

export const calorieStatThemes = {
  eaten: {
    backgroundColor: "#F7EDEA",
    bubbleBackground: "#FFFCFA",
    iconColor: "#B97663",
  },
  burned: {
    backgroundColor: "#F3EEE8",
    bubbleBackground: "#FFF9F3",
    iconColor: "#B97663",
  },
  target: {
    backgroundColor: "#EEF5EE",
    bubbleBackground: "#F7FBF6",
    iconColor: "#6F8E6D",
  },
  left: {
    backgroundColor: "#EFEAF8",
    bubbleBackground: "#F6F3FA",
    iconColor: "#8D7BB8",
  },
} as const satisfies Record<string, StatTileTheme>;

export const macroStatThemes = {
  protein: {
    backgroundColor: "#F7EDEA",
    bubbleBackground: "#FFFCFA",
    iconColor: "#B86B52",
  },
  carbs: {
    backgroundColor: "#EEF5EE",
    bubbleBackground: "#F7FBF6",
    iconColor: "#7D9B8A",
  },
  fat: {
    backgroundColor: "#F8F3E6",
    bubbleBackground: "#FFF9F3",
    iconColor: "#9A8055",
  },
  fiber: {
    backgroundColor: "#E3F0EA",
    bubbleBackground: "#F0F8F2",
    iconColor: "#4D8B7A",
  },
} as const satisfies Record<string, StatTileTheme>;

type SizeConfig = {
  padding: string;
  borderRadius: string;
  minHeight?: string;
  bubbleSize: "sm" | "md" | number;
  labelFontSize: string;
  labelFontWeight: number;
  valueFontSize: string;
  valueFontWeight: number;
  valueLetterSpacing?: string;
  subValueFontSize?: string;
  gap: string;
  labelMarginTop: string;
};

const calorieSizes: Record<StatTileSize, SizeConfig> = {
  default: {
    padding: "12px",
    borderRadius: "16px",
    minHeight: "66px",
    bubbleSize: "md",
    labelFontSize: "13px",
    labelFontWeight: 500,
    valueFontSize: "21px",
    valueFontWeight: 400,
    valueLetterSpacing: "-0.03em",
    gap: "10px",
    labelMarginTop: "4px",
  },
  compact: {
    padding: "10px",
    borderRadius: "16px",
    minHeight: "60px",
    bubbleSize: 32,
    labelFontSize: "12px",
    labelFontWeight: 600,
    valueFontSize: "1.125rem",
    valueFontWeight: 400,
    gap: "8px",
    labelMarginTop: "2px",
  },
};

const macroSize: SizeConfig = {
  padding: "10px 10px",
  borderRadius: "14px",
  minHeight: "52px",
  bubbleSize: "sm",
  labelFontSize: "12px",
  labelFontWeight: 500,
  valueFontSize: "17px",
  valueFontWeight: 400,
  valueLetterSpacing: "-0.02em",
  subValueFontSize: "10px",
  gap: "8px",
  labelMarginTop: "2px",
};

export function StatTileSectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        margin: "0 0 8px",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#8B7668",
        fontFamily: sans,
      }}
    >
      {children}
    </p>
  );
}

export function StatTileGrid({
  children,
  style,
  gap = "9px",
}: {
  children: ReactNode;
  style?: CSSProperties;
  gap?: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap,
        width: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function StatTile({
  label,
  value,
  subValue,
  icon,
  backgroundColor,
  bubbleBackground,
  accentColor,
  iconColor,
  size = "default",
  style,
}: {
  label: string;
  value: ReactNode;
  subValue?: ReactNode;
  icon: LucideIcon;
  backgroundColor: string;
  bubbleBackground: string;
  accentColor?: string;
  iconColor?: string;
  size?: StatTileSize;
  style?: CSSProperties;
}) {
  const accent = accentColor ?? iconColor ?? colors.muted;
  const sizing = subValue ? macroSize : calorieSizes[size];

  return (
    <div
      style={{
        padding: sizing.padding,
        borderRadius: sizing.borderRadius,
        minHeight: sizing.minHeight,
        boxSizing: "border-box",
        backgroundColor,
        border: "none",
        display: "flex",
        alignItems: "center",
        gap: sizing.gap,
        minWidth: 0,
        ...style,
      }}
    >
      <IconBubble
        icon={icon}
        backgroundColor={bubbleBackground}
        color={accent}
        size={sizing.bubbleSize}
      />
      <div style={{ minWidth: 0, flex: 1 }}>
        <span
          style={{
            display: "block",
            fontSize: sizing.labelFontSize,
            fontWeight: sizing.labelFontWeight,
            color: colors.muted,
            lineHeight: 1.2,
            fontFamily: sans,
          }}
        >
          {label}
        </span>
        <span
          style={{
            display: "block",
            marginTop: sizing.labelMarginTop,
            fontSize: sizing.valueFontSize,
            fontWeight: sizing.valueFontWeight,
            color: colors.text,
            lineHeight: 1.15,
            fontFamily: serif,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: sizing.valueLetterSpacing ?? "normal",
          }}
        >
          {value}
          {subValue ? (
            <span
              style={{
                fontSize: sizing.subValueFontSize ?? "0.72rem",
                fontWeight: 400,
                fontFamily: sans,
                color: colors.muted,
                marginLeft: "2px",
              }}
            >
              {subValue}
            </span>
          ) : null}
        </span>
      </div>
    </div>
  );
}

// Backward-compatible aliases
export {
  StatTile as MetricStatCard,
  StatTileGrid as MetricStatGrid,
  StatTileSectionLabel as MetricStatSectionLabel,
};
export type { StatTileSize as MetricStatCardSize, StatTileTheme as MetricStatCardTheme };

/** @deprecated Use IconBubble */
export function MetricStatIconBubble({
  icon,
  bubbleBackground,
  iconColor,
  bubbleSize,
}: {
  icon: LucideIcon;
  bubbleBackground: string;
  iconColor: string;
  bubbleSize: number;
  iconSize?: number;
}) {
  return (
    <IconBubble
      icon={icon}
      backgroundColor={bubbleBackground}
      color={iconColor}
      size={bubbleSize}
    />
  );
}
