"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { sans } from "../../lib/theme";
import { IconBubble } from "./IconBubble";
import { StatusPill, type StatusTone } from "./StatusPill";

export type MetricRowLayout = "tile" | "list";

const TILE_BG = "#FFFDFC";
const TILE_BORDER = "#E8DDD3";
const TILE_RADIUS = "17px";
const TILE_PADDING = "14px";
const TILE_MIN_HEIGHT = "96px";

export function MetricRow({
  icon,
  label,
  note,
  value,
  tone,
  iconBackground,
  iconColor,
  layout = "tile",
  onPress,
  style,
}: {
  icon?: ReactNode;
  label: string;
  note?: string;
  value?: ReactNode;
  tone?: StatusTone;
  iconBackground?: string;
  iconColor?: string;
  layout?: MetricRowLayout;
  onPress?: () => void;
  style?: CSSProperties;
}) {
  const [pressed, setPressed] = useState(false);

  if (layout === "list") {
    return (
      <div
        style={{
          padding: "11px 12px",
          borderRadius: "14px",
          backgroundColor: "#F7EFE8",
          border: "1px solid #E6D7CB",
          ...style,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.84rem",
            fontWeight: 600,
            color: "#3A2E28",
            lineHeight: 1.3,
            fontFamily: sans,
          }}
        >
          {label}
        </p>
        {note ? (
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "#7D7068",
              lineHeight: 1.35,
              fontFamily: sans,
            }}
          >
            {note}
          </p>
        ) : null}
        {value ? (
          <div style={{ marginTop: note ? "4px" : 0 }}>{value}</div>
        ) : null}
      </div>
    );
  }

  const tileStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
    minHeight: TILE_MIN_HEIGHT,
    padding: TILE_PADDING,
    margin: 0,
    borderRadius: TILE_RADIUS,
    border: `1px solid ${TILE_BORDER}`,
    backgroundColor: pressed && onPress ? "#FBF7F4" : TILE_BG,
    boxShadow: "0 2px 8px rgba(60, 45, 35, 0.04)",
    cursor: onPress ? "pointer" : "default",
    textAlign: "left",
    fontFamily: sans,
    WebkitTapHighlightColor: "transparent",
    boxSizing: "border-box",
    ...style,
  };

  const content = (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "8px",
        }}
      >
        {iconBackground && iconColor ? (
          <IconBubble backgroundColor={iconBackground} color={iconColor} size="lg">
            {icon}
          </IconBubble>
        ) : null}
        {typeof value === "string" ? (
          <StatusPill value={value} tone={tone} variant="plain" />
        ) : (
          value
        )}
      </div>
      <p
        style={{
          margin: 0,
          fontSize: "0.6875rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#4A3D36",
          fontFamily: sans,
          lineHeight: 1.15,
        }}
      >
        {label}
      </p>
      {note ? (
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            color: "#544840",
            fontFamily: sans,
            lineHeight: 1.3,
            fontWeight: 400,
          }}
        >
          {note}
        </p>
      ) : null}
    </>
  );

  if (!onPress) {
    return <div style={tileStyle}>{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onPress}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      style={tileStyle}
    >
      {content}
    </button>
  );
}

export function MetricRowSectionIcon({
  icon: Icon,
  title,
  iconColor = "#7D7068",
}: {
  icon: LucideIcon;
  title: string;
  iconColor?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <Icon
        size={16}
        strokeWidth={1.75}
        aria-hidden
        style={{ opacity: 0.88, color: iconColor, flexShrink: 0 }}
      />
      <h2
        style={{
          margin: 0,
          fontSize: "0.92rem",
          fontWeight: 600,
          color: "#3A2E28",
          letterSpacing: "-0.01em",
          fontFamily: sans,
        }}
      >
        {title}
      </h2>
    </div>
  );
}
