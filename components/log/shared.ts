import { colors, labelStyle, layout, sans, stackStyle } from "../../lib/theme";

export function fieldLabel(text: string) {
  return { ...labelStyle(), marginBottom: "6px", display: "block" as const };
}

export const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "10px 12px",
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.shell,
  color: colors.text,
  fontSize: "0.88rem",
  fontFamily: sans,
  outline: "none",
};

export const selectStyle = {
  ...inputStyle,
  appearance: "none" as const,
  cursor: "pointer",
};

export const textareaStyle = {
  ...inputStyle,
  minHeight: "72px",
  resize: "vertical" as const,
};

export function primaryButtonStyle() {
  return {
    width: "100%",
    padding: "11px 16px",
    borderRadius: "999px",
    border: `1px solid ${colors.terracotta}`,
    backgroundColor: colors.terracotta,
    color: colors.card,
    fontSize: "0.82rem",
    fontWeight: 600,
    fontFamily: sans,
    cursor: "pointer",
  };
}

export function secondaryButtonStyle() {
  return {
    width: "100%",
    padding: "11px 16px",
    borderRadius: "999px",
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.card,
    color: colors.text,
    fontSize: "0.82rem",
    fontWeight: 600,
    fontFamily: sans,
    cursor: "pointer",
  };
}

export function dangerButtonStyle() {
  return {
    width: "100%",
    padding: "11px 16px",
    borderRadius: "999px",
    border: `1px solid ${colors.terracottaLight}`,
    backgroundColor: colors.terracottaPale,
    color: colors.terracotta,
    fontSize: "0.82rem",
    fontWeight: 600,
    fontFamily: sans,
    cursor: "pointer",
  };
}

export function textActionStyle() {
  return {
    background: "none",
    border: "none",
    padding: 0,
    fontSize: "0.72rem",
    fontWeight: 600,
    color: colors.terracotta,
    fontFamily: sans,
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlineOffset: "2px",
  };
}

export function cardSectionStyle() {
  return {
    padding: layout.cardPaddingCompact,
  };
}

export function logTabStackStyle() {
  return stackStyle(layout.cardGap);
}
