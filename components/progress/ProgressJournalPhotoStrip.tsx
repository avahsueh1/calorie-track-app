"use client";

import type { ProgressJournalEntry } from "../../types/wellness";
import { formatProgressJournalDateShort, getPhotoEntries } from "../../lib/progressJournal";
import { colors, sans } from "../../lib/theme";
import { progressJournalLayout } from "./progressJournalUi";

interface ProgressJournalPhotoStripProps {
  entries: ProgressJournalEntry[];
  maxPhotos?: number;
  onOpenGallery?: (focusDate?: string) => void;
}

export function ProgressJournalPhotoStrip({
  entries,
  maxPhotos,
  onOpenGallery,
}: ProgressJournalPhotoStripProps) {
  const photos = getPhotoEntries(entries);
  const visiblePhotos = maxPhotos ? photos.slice(0, maxPhotos) : photos;

  if (visiblePhotos.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: progressJournalLayout.groupGap,
      }}
    >
      {visiblePhotos.map((entry) => {
        const tile = (
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "1",
              borderRadius: progressJournalLayout.statRadius,
              overflow: "hidden",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.shell,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.photoDataUrl}
              alt={`Progress photo ${entry.date}`}
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
                backgroundColor: "rgba(39, 32, 24, 0.58)",
                color: "#FFFBF7",
                fontFamily: sans,
                fontSize: "0.6875rem",
                fontWeight: 600,
                lineHeight: 1.2,
                pointerEvents: "none",
              }}
            >
              {formatProgressJournalDateShort(entry.date)}
            </span>
          </div>
        );

        if (!onOpenGallery) {
          return <div key={entry.date}>{tile}</div>;
        }

        return (
          <button
            key={entry.date}
            type="button"
            onClick={() => onOpenGallery(entry.date)}
            aria-label={`Open gallery for ${formatProgressJournalDateShort(entry.date)}`}
            style={{
              display: "block",
              width: "100%",
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {tile}
          </button>
        );
      })}
    </div>
  );
}
