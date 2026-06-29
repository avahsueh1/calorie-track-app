import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { colors, sans, serif } from "../../lib/theme";
import { IconBubble } from "./IconBubble";

export type StatTileSize = "default" | "compact" | "hero";
export type StatTileVariant = "row" | "supporting";

export interface StatTileTheme {
  backgroundColor: string;
  bubbleBackground: string;
  iconColor: string;
  borderColor?: string;
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
    backgroundColor: "rgba(247, 237, 234, 0.5)",
    bubbleBackground: "rgba(255, 252, 250, 0.85)",
    iconColor: "#B86B52",
    borderColor: "rgba(230, 218, 208, 0.55)",
  },
  carbs: {
    backgroundColor: "rgba(238, 245, 238, 0.5)",
    bubbleBackground: "rgba(247, 251, 246, 0.85)",
    iconColor: "#7D9B8A",
    borderColor: "rgba(214, 228, 214, 0.55)",
  },
  fat: {
    backgroundColor: "rgba(248, 243, 230, 0.5)",
    bubbleBackground: "rgba(255, 249, 243, 0.85)",
    iconColor: "#9A8055",
    borderColor: "rgba(228, 218, 200, 0.55)",
  },
  fiber: {
    backgroundColor: "rgba(227, 240, 234, 0.48)",
    bubbleBackground: "rgba(240, 248, 242, 0.85)",
    iconColor: "#4D8B7A",
    borderColor: "rgba(200, 224, 214, 0.55)",
  },
} as const satisfies Record<string, StatTileTheme>;

type SizeConfig = {
  padding: string;
  borderRadius: string;
  minHeight?: string;
  maxHeight?: string;
  aspectRatio?: string;
  bubbleSize: "sm" | "md" | number;
  iconSize?: number;
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
    padding: "12px",
    borderRadius: "16px",
    minHeight: "66px",
    bubbleSize: "md",
    labelFontSize: "13px",
    labelFontWeight: 500,
    valueFontSize: "21px",
    valueFontWeight: 400,
    gap: "10px",
    labelMarginTop: "4px",
  },
  hero: {
    padding: "12px",
    borderRadius: "16px",
    minHeight: "66px",
    bubbleSize: 30,
    labelFontSize: "11px",
    labelFontWeight: 500,
    valueFontSize: "19px",
    valueFontWeight: 400,
    valueLetterSpacing: "-0.02em",
    gap: "10px",
    labelMarginTop: "3px",
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

const supportingCalorieSize: SizeConfig = {
  padding: "10px",
  borderRadius: "14px",
  minHeight: "68px",
  maxHeight: "76px",
  aspectRatio: "1.25 / 1",
  iconSize: 27,
  labelFontSize: "11px",
  labelFontWeight: 500,
  valueFontSize: "17px",
  valueFontWeight: 500,
  valueLetterSpacing: "-0.02em",
  gap: "6px",
  labelMarginTop: "2px",
  bubbleSize: "sm",
};

const supportingMacroSize: SizeConfig = {
  padding: "10px",
  borderRadius: "14px",
  minHeight: "58px",
  maxHeight: "66px",
  aspectRatio: "1.25 / 1",
  iconSize: 22,
  labelFontSize: "10px",
  labelFontWeight: 500,
  valueFontSize: "16px",
  valueFontWeight: 500,
  valueLetterSpacing: "-0.02em",
  subValueFontSize: "10px",
  gap: "4px",
  labelMarginTop: "1px",
  bubbleSize: "sm",
};

export function StatTileSectionLabel({
  children,
  quiet = false,
  style,
}: {
  children: ReactNode;
  quiet?: boolean;
  style?: CSSProperties;
}) {
  return (
    <p
      style={{
        margin: quiet ? "0 0 8px" : "0 0 10px",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#7A6A60",
        fontFamily: sans,
        textAlign: "left",
        ...style,
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
  supporting = false,
}: {
  children: ReactNode;
  style?: CSSProperties;
  gap?: string;
  supporting?: boolean;
}) {
  return (
    <div
      className={supporting ? "stat-grid" : undefined}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: supporting ? "8px" : gap,
        width: "100%",
        maxWidth: supporting ? "200px" : undefined,
        margin: supporting ? "0 auto" : undefined,
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
  borderColor,
  size = "default",
  variant = "row",
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
  borderColor?: string;
  size?: StatTileSize;
  variant?: StatTileVariant;
  style?: CSSProperties;
}) {
  const accent = accentColor ?? iconColor ?? colors.muted;
  const isSupporting = variant === "supporting";
  const sizing = isSupporting
    ? subValue
      ? supportingMacroSize
      : supportingCalorieSize
    : subValue
      ? macroSize
      : calorieSizes[size];
  const Icon = icon;
  const resolvedBorder =
    borderColor ?? "rgba(230, 218, 208, 0.45)";

  if (isSupporting) {
    return (
      <div
        className="stat-tile"
        style={{
          padding: sizing.padding,
          borderRadius: sizing.borderRadius,
          minHeight: sizing.minHeight,
          maxHeight: sizing.maxHeight,
          aspectRatio: sizing.aspectRatio,
          boxSizing: "border-box",
          backgroundColor,
          border: `1px solid ${resolvedBorder}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: sizing.gap,
          minWidth: 0,
          width: "100%",
          ...style,
        }}
      >
        <Icon
          size={sizing.iconSize ?? 24}
          strokeWidth={1.5}
          color={accent}
          aria-hidden
          style={{ opacity: 0.72, flexShrink: 0 }}
        />
        <div style={{ minWidth: 0 }}>
          <span
            style={{
              display: "block",
              fontSize: sizing.labelFontSize,
              fontWeight: sizing.labelFontWeight,
              color: colors.muted,
              lineHeight: 1.15,
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
              lineHeight: 1.1,
              fontFamily: serif,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: sizing.valueLetterSpacing ?? "normal",
            }}
          >
            {value}
            {subValue ? (
              <span
                style={{
                  display: "block",
                  marginTop: "1px",
                  fontSize: sizing.subValueFontSize ?? "10px",
                  fontWeight: 400,
                  fontFamily: sans,
                  color: colors.muted,
                  lineHeight: 1.2,
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

  return (
    <div
      style={{
        padding: sizing.padding,
        borderRadius: sizing.borderRadius,
        minHeight: sizing.minHeight,
        boxSizing: "border-box",
        backgroundColor,
        border: borderColor ? `1px solid ${borderColor}` : "none",
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
