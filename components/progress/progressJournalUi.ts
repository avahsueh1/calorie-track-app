"use client";

import type { CSSProperties } from "react";
import { colors, layout, sans, spacing } from "../../lib/theme";

/** Shared rhythm for Insights progress journal full page. */
export const progressJournalLayout = {
  sectionGap: layout.cardGap,
  groupGap: spacing.group,
  cardPadding: "18px",
  heroRadius: "22px",
  cardRadius: "22px",
  statRadius: "16px",
  noteRadius: "15px",
} as const;

export function progressJournalPageStackStyle(): CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: progressJournalLayout.sectionGap,
    width: "100%",
  };
}

export const PROGRESS_PHOTO_THUMB_SIZE = 44;

export function progressPhotoThumbStyle(
  size = PROGRESS_PHOTO_THUMB_SIZE,
): CSSProperties {
  return {
    width: `${size}px`,
    height: `${size}px`,
    flexShrink: 0,
    borderRadius: "10px",
    overflow: "hidden",
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.shell,
  };
}

export function progressNoPhotoLabelStyle(): CSSProperties {
  return {
    width: `${PROGRESS_PHOTO_THUMB_SIZE}px`,
    height: `${PROGRESS_PHOTO_THUMB_SIZE}px`,
    flexShrink: 0,
    borderRadius: "10px",
    border: `1px dashed ${colors.border}`,
    backgroundColor: "#FAF7F2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.58rem",
    fontWeight: 600,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    color: colors.muted,
    fontFamily: sans,
    textAlign: "center",
    lineHeight: 1.15,
    padding: "4px",
    boxSizing: "border-box",
  };
}
