export const insightsColors = {
  pageBg: "#FBFAF7",
  card: "#FFFFFF",
  cardSoft: "#FFFDFB",
  text: "#3C2B24",
  textSecondary: "#7D7068",
  label: "#9A8176",
  terracotta: "#B97663",
  sage: "#7E9A7C",
  gold: "#B89A6D",
  net: "#8F6F45",
  targetLine: "#CDBBAE",
  espresso: "#744336",
  lavender: "#8D7BB8",
  lavenderBg: "#ECE7F5",
  blue: "#7EA6C8",
  blueBg: "#EAF2FA",
  border: "#E6D7CB",
  grid: "#EFE5DD",
  beige: "#E6D7CB",
};

export const insightsLayout = {
  shellMaxWidth: "430px",
  pagePadding: "16px",
  cardGap: "14px",
  cardRadius: "24px",
  cardPadding: "18px",
};

export const insightsSerif =
  'Georgia, "Times New Roman", "Palatino Linotype", Palatino, serif';
export const insightsSans =
  "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

export function insightsPageOuterStyle() {
  return {
    minHeight: "100vh",
    backgroundColor: insightsColors.pageBg,
    display: "flex",
    justifyContent: "center",
    padding: "0 12px",
  };
}

export function insightsShellStyle() {
  return {
    width: "100%",
    maxWidth: insightsLayout.shellMaxWidth,
    minHeight: "100vh",
    backgroundColor: insightsColors.cardSoft,
    display: "flex",
    flexDirection: "column" as const,
    boxShadow: "0 0 48px rgba(60, 43, 36, 0.06)",
    borderLeft: `1px solid ${insightsColors.border}`,
    borderRight: `1px solid ${insightsColors.border}`,
  };
}

export function insightsMainStyle() {
  return {
    flex: 1,
    padding: insightsLayout.pagePadding,
    paddingBottom: "12px",
    display: "flex",
    flexDirection: "column" as const,
    gap: insightsLayout.cardGap,
  };
}

export function insightsCardStyle() {
  return {
    backgroundColor: insightsColors.card,
    borderRadius: insightsLayout.cardRadius,
    border: `1px solid ${insightsColors.border}`,
    boxShadow: "0 2px 16px rgba(60, 43, 36, 0.04)",
    padding: insightsLayout.cardPadding,
  };
}

export function insightsSectionTitleStyle() {
  return {
    margin: 0,
    fontSize: "0.92rem",
    fontWeight: 600,
    fontFamily: insightsSans,
    color: insightsColors.text,
    letterSpacing: "-0.01em",
  };
}

export function insightsSubtitleStyle() {
  return {
    margin: "6px 0 0",
    fontSize: "0.78rem",
    lineHeight: 1.45,
    color: insightsColors.textSecondary,
    fontFamily: insightsSans,
  };
}

export function insightsNoteStyle() {
  return {
    margin: 0,
    fontSize: "0.72rem",
    lineHeight: 1.45,
    color: insightsColors.textSecondary,
    fontFamily: insightsSans,
    fontStyle: "italic" as const,
  };
}
