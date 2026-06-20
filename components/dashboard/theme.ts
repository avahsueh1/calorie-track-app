export const colors = {
  bg: "#FAF7F2",
  shell: "#FFFBF7",
  card: "#FFFDF9",
  terracotta: "#B86B52",
  terracottaLight: "#E8C9BC",
  terracottaPale: "#F5E8E2",
  sage: "#7D9B8A",
  sageLight: "#D4E4DA",
  blush: "#E8C4B8",
  lavender: "#C4B5D4",
  lavenderPale: "#EDE8F2",
  paleGold: "#E8D5B0",
  text: "#3D2B1F",
  muted: "#9A8B7E",
  border: "#E8DFD4",
  ringTrack: "#EDE6DC",
};

export const layout = {
  shellMaxWidth: "430px",
  pagePadding: "16px",
  cardGap: "14px",
  cardRadius: "24px",
  cardPadding: "18px",
};

export const serif =
  'Georgia, "Times New Roman", "Palatino Linotype", Palatino, serif';
export const sans = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function pageOuterStyle() {
  return {
    minHeight: "100vh",
    backgroundColor: colors.bg,
    display: "flex",
    justifyContent: "center",
    padding: "0 12px",
  };
}

export function shellStyle() {
  return {
    width: "100%",
    maxWidth: layout.shellMaxWidth,
    minHeight: "100vh",
    backgroundColor: colors.shell,
    display: "flex",
    flexDirection: "column" as const,
    boxShadow: "0 0 48px rgba(61, 43, 31, 0.08)",
    borderLeft: `1px solid ${colors.border}`,
    borderRight: `1px solid ${colors.border}`,
  };
}

export function mainContentStyle() {
  return {
    flex: 1,
    padding: layout.pagePadding,
    paddingBottom: "12px",
    display: "flex",
    flexDirection: "column" as const,
    gap: layout.cardGap,
  };
}

export function cardStyle() {
  return {
    backgroundColor: colors.card,
    borderRadius: layout.cardRadius,
    border: `1px solid ${colors.border}`,
    boxShadow: "0 2px 16px rgba(61, 43, 31, 0.05)",
  };
}

export function labelStyle() {
  return {
    margin: 0,
    fontSize: "0.68rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: colors.muted,
    fontFamily: sans,
  };
}

export function sectionTitleStyle() {
  return {
    margin: 0,
    fontSize: "0.88rem",
    fontWeight: 600,
    fontFamily: sans,
    color: colors.text,
    letterSpacing: "-0.01em",
  };
}
