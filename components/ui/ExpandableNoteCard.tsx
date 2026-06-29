"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ChevronDown } from "lucide-react";
import { NOTE_FIELD_ICON } from "../../lib/symptomIcons";
import { colors, labelStyle, sans } from "../../lib/theme";
import { AppCard } from "./AppCard";
import { IconBubble } from "./IconBubble";

const reminderContainerStyle: CSSProperties = {
  margin: 0,
  padding: "10px 14px",
  borderRadius: "12px",
  backgroundColor: "#F5EEE8",
  width: "100%",
  boxSizing: "border-box",
};

const reminderLabelStyle: CSSProperties = {
  margin: "0 0 4px",
  fontSize: "0.625rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#4A3D36",
  fontFamily: sans,
  lineHeight: 1.15,
};

const reminderTextareaStyle: CSSProperties = {
  display: "block",
  width: "100%",
  margin: 0,
  padding: 0,
  border: "none",
  background: "transparent",
  resize: "none",
  overflow: "hidden",
  fontSize: "0.8125rem",
  lineHeight: 1.4,
  color: "#3A302B",
  fontFamily: sans,
  outline: "none",
  minHeight: "1.4em",
  boxSizing: "border-box",
};

const textareaBaseStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 12px",
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.card,
  color: colors.text,
  fontSize: "0.8rem",
  fontFamily: sans,
  lineHeight: 1.5,
  resize: "vertical",
  outline: "none",
};

const compactBoxStyle: CSSProperties = {
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.shell,
  overflow: "hidden",
};

export interface ExpandableNoteCardProps {
  value: string;
  onChange: (value: string) => void;
  textareaId?: string;
  titleWhenEmpty?: string;
  titleWhenFilled?: string;
  subtitle?: string;
  placeholder?: string;
  defaultOpen?: boolean;
  /** reminder = matches Daily reminder box; compact = single-row; soft = full card; inline = nested */
  variant?: "soft" | "inline" | "compact" | "reminder";
  minHeight?: number;
}

function truncatePreview(text: string, maxLength = 28): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

function AutoResizeTextarea({
  id,
  value,
  onChange,
  placeholder,
  style,
  rows = 1,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style: CSSProperties;
  rows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      id={id}
      value={value}
      rows={rows}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      style={style}
    />
  );
}

export function ExpandableNoteCard({
  value,
  onChange,
  textareaId,
  titleWhenEmpty = "Add a personal note",
  titleWhenFilled = "Personal note",
  subtitle = "Optional — your personal thoughts",
  placeholder = "How are you feeling? Anything you want to remember?",
  defaultOpen = false,
  variant = "soft",
  minHeight = 96,
}: ExpandableNoteCardProps) {
  const hasNote = Boolean(value.trim());
  const [open, setOpen] = useState(defaultOpen);
  const title = hasNote ? titleWhenFilled : titleWhenEmpty;
  const isCompact = variant === "compact";

  if (variant === "reminder") {
    return (
      <div style={reminderContainerStyle}>
        <p style={reminderLabelStyle}>Personal note</p>
        <AutoResizeTextarea
          id={textareaId}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={reminderTextareaStyle}
        />
      </div>
    );
  }

  const toggleButton = (
    <button
      type="button"
      onClick={() => setOpen((current) => !current)}
      aria-expanded={open}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        width: "100%",
        padding: isCompact ? "10px 12px" : variant === "inline" ? "0" : "14px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontFamily: sans,
        textAlign: "left",
      }}
    >
      <IconBubble
        icon={NOTE_FIELD_ICON.icon}
        backgroundColor={NOTE_FIELD_ICON.backgroundColor}
        color={NOTE_FIELD_ICON.color}
        size="sm"
      />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontSize: isCompact ? "0.84rem" : variant === "inline" ? "0.78rem" : "0.9rem",
            fontWeight: isCompact ? 500 : 600,
            color: colors.text,
            lineHeight: 1.25,
          }}
        >
          {title}
        </span>
        {!isCompact ? (
          <span
            style={{
              display: "block",
              marginTop: "2px",
              fontSize: "0.72rem",
              color: colors.muted,
              fontWeight: 500,
            }}
          >
            {subtitle}
          </span>
        ) : null}
      </span>
      {isCompact && hasNote && !open ? (
        <span
          style={{
            fontSize: "0.76rem",
            color: colors.muted,
            fontWeight: 500,
            maxWidth: "42%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flexShrink: 1,
          }}
        >
          {truncatePreview(value)}
        </span>
      ) : null}
      <ChevronDown
        size={isCompact ? 16 : 18}
        strokeWidth={1.75}
        color={colors.muted}
        style={{
          flexShrink: 0,
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
        }}
      />
    </button>
  );

  const editor = open ? (
    <div
      style={{
        padding: isCompact
          ? "0 12px 12px"
          : variant === "inline"
            ? "10px 0 0"
            : "0 14px 14px",
      }}
    >
      <label htmlFor={textareaId} style={{ ...labelStyle(), display: "none" }}>
        Note
      </label>
      <textarea
        id={textareaId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={{
          ...textareaBaseStyle,
          minHeight: isCompact ? 72 : minHeight,
        }}
      />
    </div>
  ) : null;

  if (variant === "compact") {
    return (
      <div style={compactBoxStyle}>
        {toggleButton}
        {editor}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div style={{ marginTop: "12px" }}>
        {toggleButton}
        {editor}
      </div>
    );
  }

  return (
    <AppCard variant="soft" padding="0" style={{ overflow: "hidden" }}>
      {toggleButton}
      {editor}
    </AppCard>
  );
}
