import type { CSSProperties } from "react";
import {
  cardStyle,
  colors,
  layout,
  mainContentStyle,
  pageOuterStyle,
  sans,
  sectionTitleStyle,
  serif,
  shellStyle,
  spacing,
} from "../../lib/theme";

export const insightsColors = {
  pageBg: colors.bg,
  card: colors.card,
  cardSoft: colors.shell,
  text: colors.text,
  textSecondary: colors.muted,
  label: colors.muted,
  terracotta: "#B97663",
  sage: colors.sage,
  gold: colors.paleGold,
  net: "#8F6F45",
  targetLine: "#CDBBAE",
  espresso: "#744336",
  lavender: "#8D7BB8",
  lavenderBg: colors.lavenderPale,
  blue: "#7EA6C8",
  blueBg: "#EAF2FA",
  border: colors.border,
  grid: "#EFE5DD",
  beige: "#E6D7CB",
};

export const insightsLayout = layout;
export const insightsSerif = serif;
export const insightsSans = sans;

export const insightsPageOuterStyle = pageOuterStyle;
export const insightsShellStyle = shellStyle;

export function insightsMainStyle(overrides?: CSSProperties): CSSProperties {
  return mainContentStyle(overrides);
}

export function insightsCardStyle(): CSSProperties {
  return cardStyle({
    boxShadow: "0 2px 16px rgba(60, 43, 36, 0.04)",
    padding: layout.cardPadding,
  });
}

export function insightsSectionTitleStyle(): CSSProperties {
  return { ...sectionTitleStyle(), fontSize: "0.92rem" };
}

export function insightsSubtitleStyle(): CSSProperties {
  return {
    margin: `${spacing.inline} 0 0`,
    fontSize: "0.78rem",
    lineHeight: 1.45,
    color: insightsColors.textSecondary,
    fontFamily: insightsSans,
  };
}

export function insightsNoteStyle(): CSSProperties {
  return {
    margin: 0,
    fontSize: "0.72rem",
    lineHeight: 1.45,
    color: insightsColors.textSecondary,
    fontFamily: insightsSans,
    fontStyle: "italic",
  };
}
