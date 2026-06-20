"use client";

import { useState } from "react";
import { BottomNav } from "../../components/dashboard/BottomNav";
import {
  mainContentStyle,
  pageOuterStyle,
  shellStyle,
} from "../../components/dashboard/theme";
import {
  useCycleContext,
  useDailyLog,
  useWeightLogs,
} from "../../components/providers/AppStateProvider";
import { ActivityTab } from "../../components/log/ActivityTab";
import { CheckInTab } from "../../components/log/CheckInTab";
import { FoodTab } from "../../components/log/FoodTab";
import { LogHeaderSummary } from "../../components/log/LogHeaderSummary";
import { LogTabNav, type LogTab } from "../../components/log/LogTabNav";
import { WeightTab } from "../../components/log/WeightTab";

function formatDateLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function LogPage() {
  const [activeTab, setActiveTab] = useState<LogTab>("food");
  const { dailySummary } = useDailyLog();
  const { cycleContext } = useCycleContext();
  const { weightLogs, addWeightLog } = useWeightLogs();

  return (
    <div style={pageOuterStyle()}>
      <div style={shellStyle()}>
        <main style={mainContentStyle()}>
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
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
