import {
  profileCardStyle,
  profileColors,
  profileSans,
  profileSectionLabelStyle,
} from "./theme";
import { layout } from "../../lib/theme";

export function profileFieldLabel(text: string) {
  return { ...profileSectionLabelStyle(), marginBottom: "6px", display: "block" as const };
}

export const profileInputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "10px 12px",
  borderRadius: "12px",
  border: `1px solid ${profileColors.border}`,
  backgroundColor: profileColors.cream,
  color: profileColors.text,
  fontSize: "0.88rem",
  fontFamily: profileSans,
  outline: "none",
};

export const profileSelectStyle = {
  ...profileInputStyle,
  appearance: "none" as const,
  cursor: "pointer",
};

export function profileCardPadding() {
  return { padding: layout.cardPadding };
}

export function profileSettingsModuleCardStyle() {
  return {
    ...profileCardStyle(),
    padding: "16px 18px",
  };
}

export function profileSettingsModuleHeaderStyle() {
  return {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    marginBottom: "14px",
  } as const;
}

export function profileSettingsModuleIconStyle(
  backgroundColor: string,
  color: string,
) {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    backgroundColor,
    color,
    flexShrink: 0,
  } as const;
}

export const profileSettingsModuleLinkButtonStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  padding: "11px 16px",
  borderRadius: "999px",
  border: `1px solid ${profileColors.terracotta}`,
  backgroundColor: profileColors.terracotta,
  color: "#FFF7F3",
  fontFamily: profileSans,
  fontSize: "0.8rem",
  fontWeight: 600,
  textDecoration: "none",
} as const;

export function profileInputSuffixGroupStyle() {
  return {
    display: "flex",
    alignItems: "stretch",
    width: "100%",
  };
}

export function profileInputWithSuffixStyle() {
  return {
    ...profileInputStyle,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: "none",
    flex: 1,
  };
}

export function profileInputSuffixLabelStyle() {
  return {
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    borderRadius: "0 12px 12px 0",
    border: `1px solid ${profileColors.border}`,
    borderLeft: "none",
    backgroundColor: profileColors.cream,
    color: profileColors.textSecondary,
    fontSize: "0.82rem",
    fontFamily: profileSans,
    whiteSpace: "nowrap" as const,
  };
}

export function profileRangeStyle() {
  return {
    width: "100%",
    height: "6px",
    margin: "10px 0 4px",
    accentColor: profileColors.terracotta,
    cursor: "pointer",
  };
}

export function profilePrimaryButtonStyle() {
  return {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "999px",
    border: `1px solid ${profileColors.terracotta}`,
    backgroundColor: profileColors.terracotta,
    color: profileColors.card,
    fontSize: "0.85rem",
    fontWeight: 600,
    fontFamily: profileSans,
    cursor: "pointer",
  };
}

export function profileSaveButtonStyle(disabled: boolean) {
  if (disabled) {
    return {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "999px",
      border: "1px solid #E6D7CB",
      backgroundColor: "#E6D7CB",
      color: "#7D7068",
      fontSize: "0.85rem",
      fontWeight: 600,
      fontFamily: profileSans,
      cursor: "not-allowed",
      opacity: 0.75,
    };
  }

  return profilePrimaryButtonStyle();
}

export function profileSecondaryButtonStyle() {
  return {
    padding: "9px 16px",
    borderRadius: "999px",
    border: `1px solid ${profileColors.blushBorder}`,
    backgroundColor: profileColors.blushBg,
    color: profileColors.terracottaDark,
    fontSize: "0.78rem",
    fontWeight: 600,
    fontFamily: profileSans,
    cursor: "pointer",
  };
}

export function profilePillStyle(active: boolean) {
  return {
    padding: "8px 12px",
    borderRadius: "999px",
    border: `1px solid ${active ? profileColors.terracotta : profileColors.border}`,
    backgroundColor: active ? profileColors.blushBg : profileColors.cardSoft,
    color: active ? profileColors.terracottaDark : profileColors.textSecondary,
    fontSize: "0.72rem",
    fontWeight: active ? 600 : 500,
    fontFamily: profileSans,
    cursor: "pointer",
    textAlign: "center" as const,
    lineHeight: 1.3,
  };
}

export function profileStatCardStyle(accent: "cream" | "sage" = "cream") {
  return {
    flex: 1,
    padding: "12px 14px",
    borderRadius: "14px",
    backgroundColor:
      accent === "sage" ? profileColors.sageBg : profileColors.cream,
    border: `1px solid ${profileColors.border}`,
  };
}
