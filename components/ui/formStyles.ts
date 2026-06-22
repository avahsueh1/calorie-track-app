import { colors, labelStyle, layout, sans } from "../../lib/theme";

export function fieldLabel() {
  return { ...labelStyle(), marginBottom: "6px", display: "block" as const };
}

export const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  minHeight: layout.touchMinHeight,
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
    minHeight: layout.buttonMinHeight,
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
    minHeight: layout.buttonMinHeight,
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

export function cardSectionStyle() {
  return {
    backgroundColor: colors.shell,
    borderRadius: "14px",
    padding: "12px",
    border: `1px solid ${colors.border}`,
  };
}
