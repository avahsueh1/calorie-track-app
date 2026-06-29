import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import {
  colors,
  labelStyle,
  layout,
  sans,
  sectionTitleStyle,
} from "../../lib/theme";

export { AppCard } from "./AppCard";
export type { AppCardVariant } from "./AppCard";
export { IconBubble } from "./IconBubble";
export type { IconBubbleSize } from "./IconBubble";
export {
  StatTile,
  StatTileGrid,
  StatTileSectionLabel,
  calorieStatThemes,
  macroStatThemes,
  MetricStatCard,
  MetricStatGrid,
  MetricStatSectionLabel,
  MetricStatIconBubble,
} from "./StatTile";
export type {
  StatTileSize,
  StatTileTheme,
  MetricStatCardSize,
  MetricStatCardTheme,
} from "./StatTile";
export { StatusPill, resolveStatusTone } from "./StatusPill";
export type { StatusTone, StatusPillVariant } from "./StatusPill";
export { MetricRow, MetricRowSectionIcon } from "./MetricRow";
export type { MetricRowLayout } from "./MetricRow";
export { DailyNote, InsightCallout } from "./DailyNote";
export type { DailyNoteVariant } from "./DailyNote";

type ButtonVariant = "primary" | "secondary" | "ghost" | "pill";

const fullWidthButtonStyle: CSSProperties = { width: "100%" };

export function AppButton({
  children,
  variant = "primary",
  style,
  ...props
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  style?: CSSProperties;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants: Record<ButtonVariant, CSSProperties> = {
    primary: {
      backgroundColor: colors.terracotta,
      color: colors.card,
      border: `1px solid ${colors.terracotta}`,
    },
    secondary: {
      backgroundColor: colors.card,
      color: colors.text,
      border: `1px solid ${colors.border}`,
    },
    ghost: {
      backgroundColor: colors.terracottaPale,
      color: colors.terracotta,
      border: `1px solid ${colors.terracottaLight}`,
    },
    pill: {
      backgroundColor: "#D39A86",
      color: "#FFFBF7",
      border: "1px solid rgba(255, 251, 247, 0.45)",
      boxShadow: "0 8px 20px rgba(150, 95, 70, 0.16)",
    },
  };

  return (
    <button
      type="button"
      {...props}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        minHeight: layout.buttonMinHeight,
        padding: "0 16px",
        borderRadius: "999px",
        fontFamily: sans,
        fontSize: "0.88rem",
        fontWeight: 600,
        cursor: "pointer",
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  style,
  ...props
}: {
  children: ReactNode;
  style?: CSSProperties;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <AppButton variant="primary" style={{ ...fullWidthButtonStyle, ...style }} {...props} />
  );
}

export function OutlineButton({
  style,
  ...props
}: {
  children: ReactNode;
  style?: CSSProperties;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <AppButton variant="secondary" style={{ ...fullWidthButtonStyle, ...style }} {...props} />
  );
}

export function FormRow({
  label,
  children,
  htmlFor,
  style,
}: {
  label: string;
  children: ReactNode;
  htmlFor?: string;
  style?: CSSProperties;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", ...style }}>
      <label htmlFor={htmlFor} style={{ ...labelStyle(), textTransform: "none", letterSpacing: "0.02em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function ScreenTitle({
  children,
  subtitle,
}: {
  children: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <header>
      <h1 style={{ ...sectionTitleStyle(), fontSize: "1.1rem" }}>{children}</h1>
      {subtitle ? (
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "0.78rem",
            color: colors.muted,
            fontFamily: sans,
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
