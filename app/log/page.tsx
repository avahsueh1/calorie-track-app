"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "../../components/ui/AppShell";
import {
  useCycleContext,
  useDailyLog,
  useProfile,
  useTrackingPreferences,
} from "../../components/providers/AppStateProvider";
import { useProgressJournal } from "../../components/providers/useProgressJournal";
import { ActivityTab } from "../../components/log/ActivityTab";
import { CheckInTab } from "../../components/log/CheckInTab";
import { CycleJournalTab } from "../../components/log/CycleJournalTab";
import { FoodTab } from "../../components/log/FoodTab";
import { LogHeaderSummary } from "../../components/log/LogHeaderSummary";
import { LogTabNav } from "../../components/log/LogTabNav";
import { ProgressJournalCard } from "../../components/progress/ProgressJournalCard";
import { resolveLogTab } from "../../lib/trackingPreferences";
import type { LogTab } from "../../lib/trackingPreferences";

function formatDateLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function LogPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const {
    trackingPreferences,
    calorieTrackingEnabled,
    cycleTrackingEnabled,
  } = useTrackingPreferences();
  const [activeTab, setActiveTab] = useState<LogTab>(() =>
    resolveLogTab(tabParam, trackingPreferences),
  );
  const { dailySummary } = useDailyLog();
  const { cycleContext } = useCycleContext();
  const { profile } = useProfile();
  const {
    progressJournal,
    progressJournalByDate,
    upsertProgressJournal,
    removeProgressJournal,
  } = useProgressJournal();

  useEffect(() => {
    setActiveTab(resolveLogTab(tabParam, trackingPreferences));
  }, [tabParam, trackingPreferences]);

  return (
    <>
      <LogHeaderSummary
        dateLabel={formatDateLabel()}
        phaseLabel={cycleContext.phaseLabel}
        cycleDayLabel={cycleContext.cycleDayLabel}
        summary={dailySummary}
        showCalorieSummary={calorieTrackingEnabled}
        showCycleContext={cycleTrackingEnabled}
      />

      <LogTabNav
        activeTab={activeTab}
        trackingPreferences={trackingPreferences}
        onTabChange={setActiveTab}
      />

      {activeTab === "food" && calorieTrackingEnabled ? <FoodTab /> : null}
      {activeTab === "activity" && calorieTrackingEnabled ? <ActivityTab /> : null}
      {activeTab === "check-in" ? <CheckInTab /> : null}
      {activeTab === "progress-journal" && calorieTrackingEnabled ? (
        <ProgressJournalCard
          journalByDate={progressJournalByDate}
          entries={progressJournal}
          units={profile.units}
          onSave={upsertProgressJournal}
          onRemove={removeProgressJournal}
        />
      ) : null}
      {activeTab === "cycle-journal" && cycleTrackingEnabled ? (
        <CycleJournalTab />
      ) : null}
    </>
  );
}

export default function LogPage() {
  return (
    <AppShell>
      <Suspense fallback={null}>
        <LogPageContent />
      </Suspense>
    </AppShell>
  );
}
