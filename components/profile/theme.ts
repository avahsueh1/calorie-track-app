import type { CSSProperties } from "react";
import {
  cardStyle,
  colors,
  labelStyle,
  layout,
  mainContentStyle,
  pageOuterStyle,
  sans,
  sectionTitleStyle,
  serif,
  shellStyle,
} from "../../lib/theme";

export const profileColors = {
  pageBg: colors.bg,
  card: colors.card,
  cardSoft: colors.shell,
  cream: "#F7EFE8",
  text: colors.text,
  textSecondary: colors.muted,
  label: colors.muted,
  terracotta: "#B97663",
  terracottaDark: "#744336",
  blushBg: "#FFF7F3",
  blushBorder: "#E8C2B6",
  sage: colors.sage,
  sageBg: colors.sageLight,
  border: colors.border,
  divider: "#EFE5DD",
  gold: colors.paleGold,
  lavender: colors.lavenderPale,
  blue: "#EAF2FA",
};

export const profileLayout = layout;
export const profileSerif = serif;
export const profileSans = sans;

export const profilePageOuterStyle = pageOuterStyle;
export const profileShellStyle = shellStyle;

export function profileMainStyle(overrides?: CSSProperties): CSSProperties {
  return mainContentStyle(overrides);
}

export function profileCardStyle(): CSSProperties {
  return cardStyle({ boxShadow: "0 2px 16px rgba(60, 43, 36, 0.04)" });
}

export function profileSectionLabelStyle(): CSSProperties {
  return labelStyle();
}

export function profileSectionTitleStyle(): CSSProperties {
  return sectionTitleStyle();
}

export function profileHelperStyle(): CSSProperties {
  return {
    margin: 0,
    fontSize: "0.78rem",
    lineHeight: 1.5,
    color: profileColors.textSecondary,
    fontFamily: profileSans,
  };
}
