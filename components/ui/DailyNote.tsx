import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { colors, sans } from "../../lib/theme";

export type DailyNoteVariant = "summary" | "note" | "empty" | "savedNotes";

const variantStyles: Record<
  DailyNoteVariant,
  { container: CSSProperties; label: CSSProperties; body: CSSProperties }
> = {
  summary: {
    container: {
      margin: "0 0 12px",
      padding: "10px 14px",
      borderRadius: "12px",
      backgroundColor: "#F5EEE8",
    },
    label: {
      margin: "0 0 4px",
      fontSize: "0.625rem",
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "#4A3D36",
      fontFamily: sans,
      lineHeight: 1.15,
    },
    body: {
      margin: 0,
      fontSize: "0.8125rem",
      lineHeight: 1.4,
      color: "#3A302B",
      fontFamily: sans,
    },
  },
  note: {
    container: {
      margin: 0,
      padding: 0,
      borderRadius: 0,
      backgroundColor: "transparent",
    },
    label: {
      margin: 0,
      fontSize: "0.92rem",
      fontWeight: 600,
      letterSpacing: "-0.01em",
      textTransform: "none",
      color: colors.text,
      fontFamily: sans,
      lineHeight: 1.25,
    },
    body: {
      margin: "10px 0 0",
      fontSize: "0.84rem",
      lineHeight: 1.55,
      color: colors.text,
      fontFamily: sans,
    },
  },
  empty: {
    container: {
      margin: 0,
      padding: 0,
      borderRadius: 0,
      backgroundColor: "transparent",
    },
    label: {
      display: "none",
    },
    body: {
      margin: 0,
      fontSize: "0.84rem",
      lineHeight: 1.55,
      color: colors.muted,
      fontFamily: sans,
    },
  },
  savedNotes: {
    container: {
      marginTop: "16px",
      marginBottom: 0,
      padding: "17px",
      borderRadius: "19px",
      backgroundColor: "#F4EEE9",
      border: "1px solid #E3D5CC",
    },
    label: {
      margin: "0 0 8px",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "#8B6F62",
      fontFamily: sans,
      lineHeight: 1.15,
    },
    body: {
      margin: 0,
      fontSize: "16px",
      lineHeight: 1.45,
      color: "#2F2925",
      fontFamily: sans,
      fontWeight: 400,
    },
  },
};

export function DailyNote({
  children,
  label,
  icon: Icon,
  variant = "summary",
  style,
  bodyStyle,
}: {
  children: ReactNode;
  label?: string;
  icon?: LucideIcon;
  variant?: DailyNoteVariant;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
}) {
  const styles = variantStyles[variant];
  const resolvedLabel =
    label ??
    (variant === "summary"
      ? "Daily note"
      : variant === "note" || variant === "savedNotes"
        ? "Notes"
        : undefined);

  return (
    <div style={{ ...styles.container, ...style }}>
      {resolvedLabel && variant !== "empty" ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: variant === "summary" ? undefined : 0,
          }}
        >
          {Icon ? (
            <Icon
              size={16}
              strokeWidth={1.75}
              aria-hidden
              style={{ opacity: 0.88, color: colors.muted, flexShrink: 0 }}
            />
          ) : null}
          <p style={styles.label}>{resolvedLabel}</p>
        </div>
      ) : null}
      <p style={{ ...styles.body, ...bodyStyle }}>{children}</p>
    </div>
  );
}

export function InsightCallout({
  children,
  title,
  icon,
  tone = "terracotta",
  style,
}: {
  children: ReactNode;
  title: string;
  icon?: ReactNode;
  tone?: "terracotta" | "lavender";
  style?: CSSProperties;
}) {
  const toneStyles =
    tone === "lavender"
      ? {
          backgroundColor: colors.lavenderPale,
          borderColor: `${colors.lavender}55`,
        }
      : {
          backgroundColor: colors.terracottaPale,
          borderColor: colors.terracottaLight,
        };

  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "24px",
        border: `1px solid ${toneStyles.borderColor}`,
        backgroundColor: toneStyles.backgroundColor,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: icon ? "8px" : undefined,
          marginBottom: "8px",
        }}
      >
        {icon ? (
          <span style={{ fontSize: "0.95rem", lineHeight: 1 }} aria-hidden>
            {icon}
          </span>
        ) : null}
        <h2
          style={{
            margin: 0,
            fontSize: "0.88rem",
            fontWeight: 600,
            fontFamily: sans,
            color: colors.text,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
      </div>
      <p
        style={{
          margin: 0,
          fontSize: "0.82rem",
          lineHeight: 1.55,
          color: tone === "lavender" ? colors.muted : colors.text,
          fontFamily: sans,
        }}
      >
        {children}
      </p>
    </div>
  );
}
