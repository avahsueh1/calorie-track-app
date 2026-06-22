import type { CSSProperties } from "react";

/** Shared mobile app tokens — UI-agnostic, safe to reuse in React Native later. */
export const layout = {
  shellMaxWidth: "430px",
  pagePadding: "16px",
  cardGap: "14px",
  cardRadius: "24px",
  cardPadding: "18px",
  touchMinHeight: "44px",
  buttonMinHeight: "44px",
  navHeight: "72px",
} as const;

export const colors = {
  bg: "#FFFBF7",
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
  text: "#272018",
  muted: "#736055",
  border: "#EDE4DC",
  ringTrack: "#EDE6DC",
} as const;

export const spacing = {
  section: "18px",
  group: "8px",
  inline: "6px",
} as const;

export const serif =
  'Georgia, "Times New Roman", "Palatino Linotype", Palatino, serif';
export const sans = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function pageOuterStyle(): CSSProperties {
  return {
    minHeight: "100vh",
    width: "100%",
    backgroundColor: colors.bg,
    display: "flex",
    justifyContent: "center",
  };
}

export function shellStyle(): CSSProperties {
  return {
    width: "100%",
    maxWidth: layout.shellMaxWidth,
    minHeight: "100vh",
    backgroundColor: colors.shell,
    display: "flex",
    flexDirection: "column",
    position: "relative",
  };
}

export function mainContentStyle(overrides?: CSSProperties): CSSProperties {
  return {
    flex: 1,
    width: "100%",
    padding: `${layout.pagePadding} ${layout.pagePadding} 12px`,
    display: "flex",
    flexDirection: "column",
    gap: spacing.section,
    ...overrides,
  };
}

export function groupStackStyle(): CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: spacing.group,
  };
}

export function cardStyle(overrides?: CSSProperties): CSSProperties {
  return {
    backgroundColor: colors.card,
    borderRadius: layout.cardRadius,
    border: `1px solid ${colors.border}`,
    boxShadow: "none",
    ...overrides,
  };
}

export function labelStyle(): CSSProperties {
  return {
    margin: 0,
    fontSize: "0.68rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: colors.muted,
    fontFamily: sans,
  };
}

export function sectionTitleStyle(): CSSProperties {
  return {
    margin: 0,
    fontSize: "0.88rem",
    fontWeight: 600,
    fontFamily: sans,
    color: colors.text,
    letterSpacing: "-0.01em",
  };
}
