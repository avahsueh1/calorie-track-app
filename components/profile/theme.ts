export const profileColors = {
  pageBg: "#FBFAF7",
  card: "#FFFFFF",
  cardSoft: "#FFFDFB",
  cream: "#F7EFE8",
  text: "#3C2B24",
  textSecondary: "#7D7068",
  label: "#9A8176",
  terracotta: "#B97663",
  terracottaDark: "#744336",
  blushBg: "#FFF7F3",
  blushBorder: "#E8C2B6",
  sage: "#7E9A7C",
  sageBg: "#EEF4ED",
  border: "#E6D7CB",
  divider: "#EFE5DD",
  gold: "#B89A6D",
  lavender: "#ECE7F5",
  blue: "#EAF2FA",
};

export const profileLayout = {
  shellMaxWidth: "430px",
  pagePadding: "16px",
  cardGap: "14px",
  cardRadius: "24px",
  cardPadding: "18px",
};

export const profileSerif =
  'Georgia, "Times New Roman", "Palatino Linotype", Palatino, serif';
export const profileSans =
  "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

export function profilePageOuterStyle() {
  return {
    minHeight: "100vh",
    backgroundColor: profileColors.pageBg,
    display: "flex",
    justifyContent: "center",
    padding: "0 12px",
  };
}

export function profileShellStyle() {
  return {
    width: "100%",
    maxWidth: profileLayout.shellMaxWidth,
    minHeight: "100vh",
    backgroundColor: profileColors.cardSoft,
    display: "flex",
    flexDirection: "column" as const,
    boxShadow: "0 0 48px rgba(60, 43, 36, 0.06)",
    borderLeft: `1px solid ${profileColors.border}`,
    borderRight: `1px solid ${profileColors.border}`,
  };
}

export function profileMainStyle() {
  return {
    flex: 1,
    padding: profileLayout.pagePadding,
    paddingBottom: "12px",
    display: "flex",
    flexDirection: "column" as const,
    gap: profileLayout.cardGap,
  };
}

export function profileCardStyle() {
  return {
    backgroundColor: profileColors.card,
    borderRadius: profileLayout.cardRadius,
    border: `1px solid ${profileColors.border}`,
    boxShadow: "0 2px 16px rgba(60, 43, 36, 0.04)",
  };
}

export function profileSectionLabelStyle() {
  return {
    margin: 0,
    fontSize: "0.68rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: profileColors.label,
    fontFamily: profileSans,
  };
}

export function profileSectionTitleStyle() {
  return {
    margin: 0,
    fontSize: "0.88rem",
    fontWeight: 600,
    fontFamily: profileSans,
    color: profileColors.text,
    letterSpacing: "-0.01em",
  };
}

export function profileHelperStyle() {
  return {
    margin: 0,
    fontSize: "0.78rem",
    lineHeight: 1.5,
    color: profileColors.textSecondary,
    fontFamily: profileSans,
  };
}
