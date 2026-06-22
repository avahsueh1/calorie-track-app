"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "../../components/ui/AppShell";
import {
  useCycleContext,
  useDailyLog,
  useWeightLogs,
} from "../../components/providers/AppStateProvider";
import { ActivityTab } from "../../components/log/ActivityTab";
import { CheckInTab } from "../../components/log/CheckInTab";
import { FoodTab } from "../../components/log/FoodTab";
import { LogHeaderSummary } from "../../components/log/LogHeaderSummary";
import {
  LogTabNav,
  parseLogTabParam,
  type LogTab,
} from "../../components/log/LogTabNav";
import { WeightTab } from "../../components/log/WeightTab";

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
  const [activeTab, setActiveTab] = useState<LogTab>(() => parseLogTabParam(tabParam));
  const { dailySummary } = useDailyLog();
  const { cycleContext } = useCycleContext();
  const { weightLogs, addWeightLog } = useWeightLogs();

  useEffect(() => {
    setActiveTab(parseLogTabParam(tabParam));
  }, [tabParam]);

  return (
    <>
      <LogHeaderSummary
        dateLabel={formatDateLabel()}
        phaseLabel={cycleContext.phaseLabel}
        cycleDayLabel={cycleContext.cycleDayLabel}
        summary={dailySummary}
      />

      <LogTabNav activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "food" && <FoodTab />}
      {activeTab === "activity" && <ActivityTab />}
      {activeTab === "check-in" && <CheckInTab />}
      {activeTab === "weight" && (
        <WeightTab entries={weightLogs} onSaveWeight={addWeightLog} />
      )}
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
