"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "../../../../components/ui/AppShell";
import { ProgressJournalPhotoGalleryGrid } from "../../../../components/progress/ProgressJournalPhotoGalleryGrid";
import { getPhotoEntries } from "../../../../lib/progressJournal";
import {
  insightsColors,
  insightsMainStyle,
  insightsSans,
  insightsSerif,
} from "../../../../components/insights/theme";
import { useTrackingPreferences } from "../../../../components/providers/AppStateProvider";
import { useProgressJournal } from "../../../../components/providers/useProgressJournal";
import { routes } from "../../../../lib/routes";

function BackToJournalLink() {
  return (
    <Link
      href={routes.progressJournal}
      style={{
        alignSelf: "flex-start",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 0",
        background: "transparent",
        fontFamily: insightsSans,
        fontSize: "0.8125rem",
        fontWeight: 500,
        color: insightsColors.textSecondary,
        textDecoration: "none",
        lineHeight: 1.3,
      }}
    >
      ← Back to Progress Journal
    </Link>
  );
}

export default function ProgressJournalPhotosPageContent() {
  const searchParams = useSearchParams();
  const focusDate = searchParams.get("focus") ?? undefined;
  const { calorieTrackingEnabled } = useTrackingPreferences();
  const { progressJournal } = useProgressJournal();

  const photos = useMemo(
    () => getPhotoEntries(progressJournal),
    [progressJournal],
  );

  if (!calorieTrackingEnabled) {
    return (
      <AppShell mainStyle={insightsMainStyle()}>
        <BackToJournalLink />
        <p
          style={{
            margin: 0,
            fontSize: "0.8125rem",
            lineHeight: 1.45,
            color: insightsColors.textSecondary,
            fontFamily: insightsSans,
          }}
        >
          Progress photos are available when nutrition tracking is on.
        </p>
      </AppShell>
    );
  }

  if (photos.length === 0) {
    return (
      <AppShell mainStyle={insightsMainStyle()}>
        <BackToJournalLink />
        <header>
          <h1
            style={{
              margin: "0 0 6px",
              fontFamily: insightsSerif,
              fontSize: "1.75rem",
              fontWeight: 400,
              color: insightsColors.text,
              letterSpacing: "-0.02em",
            }}
          >
            Photo gallery
          </h1>
        </header>
        <p
          style={{
            margin: 0,
            fontSize: "0.8125rem",
            lineHeight: 1.45,
            color: insightsColors.textSecondary,
            fontFamily: insightsSans,
          }}
        >
          No progress photos yet.{" "}
          <Link
            href={routes.progressJournal}
            style={{ color: insightsColors.terracotta }}
          >
            Add one in your journal
          </Link>
          .
        </p>
      </AppShell>
    );
  }

  return (
    <AppShell mainStyle={insightsMainStyle()}>
      <BackToJournalLink />

      <header>
        <h1
          style={{
            margin: "0 0 6px",
            fontFamily: insightsSerif,
            fontSize: "1.75rem",
            fontWeight: 400,
            color: insightsColors.text,
            letterSpacing: "-0.02em",
          }}
        >
          Photo gallery
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "0.8125rem",
            lineHeight: 1.45,
            color: insightsColors.textSecondary,
            fontFamily: insightsSans,
          }}
        >
          {photos.length} photo{photos.length === 1 ? "" : "s"} · Tap a photo
          to open that day&apos;s entry
        </p>
      </header>

      <ProgressJournalPhotoGalleryGrid
        entries={progressJournal}
        focusDate={focusDate}
        linkToEntry
      />
    </AppShell>
  );
}
