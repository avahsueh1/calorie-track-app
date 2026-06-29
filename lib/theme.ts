import type { CSSProperties } from "react";

/** Shared mobile app tokens — UI-agnostic, safe to reuse in React Native later. */
export const layout = {
  shellMaxWidth: "440px",
  pagePadding: "16px",
  cardGap: "18px",
  cardRadius: "24px",
  cardPadding: "20px",
  cardPaddingCompact: "16px",
  cardPaddingLarge: "24px",
  sectionHeaderGap: "12px",
  touchMinHeight: "44px",
  buttonMinHeight: "44px",
  navClearance: "18px",
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
  section: layout.cardGap,
  group: "10px",
  inline: "12px",
  /** Even rhythm between stacked blocks (notes, symptom groups, insights). */
  block: layout.cardGap,
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
    padding: `${layout.pagePadding} ${layout.pagePadding} ${layout.navClearance}`,
    display: "flex",
    flexDirection: "column",
    gap: layout.cardGap,
    ...overrides,
  };
}

export function appMainStyle(overrides?: CSSProperties): CSSProperties {
  return mainContentStyle(overrides);
}

export function stackStyle(gap: string = layout.cardGap): CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap,
  };
}

export function sectionHeaderSpacing(): CSSProperties {
  return { marginBottom: layout.sectionHeaderGap };
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
