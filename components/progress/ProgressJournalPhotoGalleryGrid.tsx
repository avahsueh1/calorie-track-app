"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import type { ProgressJournalEntry } from "../../types/wellness";
import {
  formatProgressJournalDateShort,
  getPhotoEntries,
} from "../../lib/progressJournal";
import { routes } from "../../lib/routes";
import {
  insightsColors,
  insightsSans,
} from "../insights/theme";
import { progressJournalLayout } from "./progressJournalUi";

interface ProgressJournalPhotoGalleryGridProps {
  entries: ProgressJournalEntry[];
  focusDate?: string;
  /** Link each tile to the journal entry editor. */
  linkToEntry?: boolean;
}

export function ProgressJournalPhotoGalleryTile({
  entry,
  asLink = false,
}: {
  entry: ProgressJournalEntry;
  asLink?: boolean;
}) {
  const tile = (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1",
        borderRadius: progressJournalLayout.statRadius,
        overflow: "hidden",
        border: `1px solid ${insightsColors.border}`,
        backgroundColor: insightsColors.cardSoft,
        boxShadow: "0 2px 12px rgba(60, 43, 36, 0.05)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={entry.photoDataUrl}
        alt={`Progress photo for ${entry.date}`}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <span
        style={{
          position: "absolute",
          top: "8px",
          left: "8px",
          padding: "4px 8px",
          borderRadius: "8px",
          backgroundColor: "rgba(39, 32, 24, 0.62)",
          color: "#FFFBF7",
          fontFamily: insightsSans,
          fontSize: "0.6875rem",
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: "0.01em",
          pointerEvents: "none",
        }}
      >
        {formatProgressJournalDateShort(entry.date)}
      </span>
    </div>
  );

  if (!asLink) {
    return tile;
  }

  return (
    <Link
      href={routes.progressJournalEdit(entry.date)}
      aria-label={`Open entry for ${formatProgressJournalDateShort(entry.date)}`}
      style={{
        display: "block",
        width: "100%",
        textDecoration: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {tile}
    </Link>
  );
}

export function ProgressJournalPhotoGalleryGrid({
  entries,
  focusDate,
  linkToEntry = true,
}: ProgressJournalPhotoGalleryGridProps) {
  const photos = useMemo(() => getPhotoEntries(entries), [entries]);
  const focusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!focusDate) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      focusRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [focusDate, photos.length]);

  if (photos.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: progressJournalLayout.sectionGap,
      }}
    >
      {photos.map((entry) => (
        <div
          key={entry.date}
          ref={entry.date === focusDate ? focusRef : undefined}
        >
          <ProgressJournalPhotoGalleryTile
            entry={entry}
            asLink={linkToEntry}
          />
        </div>
      ))}
    </div>
  );
}
