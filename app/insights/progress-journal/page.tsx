"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "../../../components/ui/AppShell";
import { ProgressJournalCard } from "../../../components/progress/ProgressJournalCard";
import {
  insightsColors,
  insightsMainStyle,
  insightsSans,
  insightsSerif,
} from "../../../components/insights/theme";
import {
  useProfile,
  useTrackingPreferences,
} from "../../../components/providers/AppStateProvider";
import { useProgressJournal } from "../../../components/providers/useProgressJournal";
import { routes } from "../../../lib/routes";

function BackToInsightsLink() {
  return (
    <Link
      href={routes.insights}
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
      ← Back to Insights
    </Link>
  );
}

function ProgressJournalPageContent() {
  const searchParams = useSearchParams();
  const editDate = searchParams.get("edit");
  const { profile } = useProfile();
  const { calorieTrackingEnabled } = useTrackingPreferences();
  const {
    progressJournal,
    progressJournalByDate,
    upsertProgressJournal,
  } = useProgressJournal();

  if (!calorieTrackingEnabled) {
    return (
      <AppShell mainStyle={insightsMainStyle()}>
        <BackToInsightsLink />
        <p
          style={{
            margin: 0,
            fontSize: "0.78rem",
            lineHeight: 1.45,
            color: insightsColors.textSecondary,
            fontFamily: insightsSans,
          }}
        >
          Progress journal is available when nutrition tracking is on. Enable it
          under{" "}
          <Link href={routes.profile} style={{ color: insightsColors.terracotta }}>
            What would you like to track?
          </Link>{" "}
          on your profile.
        </p>
      </AppShell>
    );
  }

  return (
    <AppShell mainStyle={insightsMainStyle()}>
      <BackToInsightsLink />

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
          Progress Journal
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
          Weight, photos, and notes for the same day stay connected.
        </p>
      </header>

      <ProgressJournalCard
        journalByDate={progressJournalByDate}
        entries={progressJournal}
        units={profile.units}
        onSave={upsertProgressJournal}
        variant="insightsFull"
        initialEditDate={editDate}
      />
    </AppShell>
  );
}

export default function ProgressJournalPage() {
  return (
    <Suspense fallback={null}>
      <ProgressJournalPageContent />
    </Suspense>
  );
}
