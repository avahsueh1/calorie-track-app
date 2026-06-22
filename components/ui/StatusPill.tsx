import type { CSSProperties, ReactNode } from "react";
import { colors, sans } from "../../lib/theme";

export type StatusTone =
  | "neutral"
  | "terracotta"
  | "lavender"
  | "sage"
  | "good"
  | "moderate"
  | "mild"
  | "low"
  | "strong"
  | "notLogged";

export type StatusPillVariant = "filled" | "plain";

const toneStyles: Record<StatusTone, { filled: CSSProperties; plain: CSSProperties }> = {
  neutral: {
    filled: {
      color: colors.muted,
      backgroundColor: "#F5F0EB",
      border: `1px solid ${colors.border}`,
    },
    plain: { color: "#4A3D36" },
  },
  terracotta: {
    filled: {
      color: colors.terracotta,
      backgroundColor: colors.terracottaPale,
      border: `1px solid ${colors.terracottaLight}`,
    },
    plain: { color: colors.terracotta },
  },
  lavender: {
    filled: {
      color: "#6E6280",
      backgroundColor: colors.lavenderPale,
      border: "1px solid #DDD4E8",
    },
    plain: { color: "#6E6280" },
  },
  sage: {
    filled: {
      color: colors.sage,
      backgroundColor: colors.sageLight,
      border: `1px solid ${colors.sageLight}`,
    },
    plain: { color: colors.sage },
  },
  good: {
    filled: {
      color: "#5A7350",
      backgroundColor: "#DDEAD8",
      border: "1px solid #C8DCC2",
    },
    plain: { color: "#3D332E" },
  },
  moderate: {
    filled: {
      color: "#7A6A55",
      backgroundColor: "#F3E8D8",
      border: "1px solid #E6D7C5",
    },
    plain: { color: "#4A3D36" },
  },
  mild: {
    filled: {
      color: "#A86050",
      backgroundColor: "#F4DCD5",
      border: "1px solid #E8C9BC",
    },
    plain: { color: "#4A3D36" },
  },
  low: {
    filled: {
      color: "#6078A0",
      backgroundColor: "#DDE7F6",
      border: "1px solid #C8D4EA",
    },
    plain: { color: "#3D332E" },
  },
  strong: {
    filled: {
      color: "#9A4A3A",
      backgroundColor: "#F0D4CC",
      border: "1px solid #E0B5A8",
    },
    plain: { color: "#4A3D36" },
  },
  notLogged: {
    filled: {
      color: colors.muted,
      backgroundColor: "#F5F0EB",
      border: `1px solid ${colors.border}`,
    },
    plain: { color: colors.muted },
  },
};

export function resolveStatusTone(value: string): StatusTone {
  const normalized = value.trim().toLowerCase();

  if (normalized === "not logged" || normalized === "none") return "notLogged";
  if (normalized === "good" || normalized === "high") return "good";
  if (normalized === "moderate") return "moderate";
  if (normalized === "mild") return "mild";
  if (normalized === "low" || normalized === "very low") return "low";
  if (normalized === "strong") return "strong";

  return "neutral";
}

export function StatusPill({
  children,
  value,
  tone,
  variant = "filled",
  style,
}: {
  children?: ReactNode;
  value?: string;
  tone?: StatusTone;
  variant?: StatusPillVariant;
  style?: CSSProperties;
}) {
  const label = children ?? value ?? "";
  const resolvedTone = tone ?? resolveStatusTone(String(label));
  const toneStyle = toneStyles[resolvedTone][variant];

  if (variant === "plain") {
    return (
      <span
        style={{
          fontFamily: sans,
          fontSize: "0.875rem",
          fontWeight: 600,
          lineHeight: 1,
          whiteSpace: "nowrap",
          flexShrink: 0,
          ...toneStyle,
          ...style,
        }}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        minHeight: "28px",
        padding: "5px 10px",
        borderRadius: "999px",
        fontFamily: sans,
        fontSize: "0.68rem",
        fontWeight: 600,
        lineHeight: 1,
        whiteSpace: "nowrap",
        ...toneStyle,
        ...style,
      }}
    >
      {label}
    </span>
  );
}
