"use client";

import { useMemo, useState } from "react";
import { BottomNav } from "../../components/dashboard/BottomNav";
import {
  mainContentStyle,
  pageOuterStyle,
  shellStyle,
} from "../../components/dashboard/theme";
import { ActivityTab, type ActivityEntry } from "../../components/log/ActivityTab";
import { CheckInTab } from "../../components/log/CheckInTab";
import { FoodTab, type FoodEntry } from "../../components/log/FoodTab";
import { LogHeaderSummary } from "../../components/log/LogHeaderSummary";
import { LogTabNav, type LogTab } from "../../components/log/LogTabNav";
import { WeightTab, type WeightEntry } from "../../components/log/WeightTab";

const DAILY_TARGET = 2000;

function formatDateLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatTimeLabel(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function nextId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function LogPage() {
  const [activeTab, setActiveTab] = useState<LogTab>("food");
  const [foods, setFoods] = useState<FoodEntry[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [weights, setWeights] = useState<WeightEntry[]>([]);

  const eaten = useMemo(
    () => foods.reduce((sum, f) => sum + f.calories, 0),
    [foods],
  );
  const burned = useMemo(
    () => activities.reduce((sum, a) => sum + a.caloriesBurned, 0),
    [activities],
  );
  const left = DAILY_TARGET - (eaten - burned);

  function handleAddFood(entry: Omit<FoodEntry, "id">) {
    setFoods((current) => [...current, { ...entry, id: nextId() }]);
  }

  function handleAddActivity(entry: Omit<ActivityEntry, "id">) {
    setActivities((current) => [...current, { ...entry, id: nextId() }]);
  }

  function handleSaveWeight(entry: Omit<WeightEntry, "id" | "loggedAt">) {
    setWeights((current) => [
      {
        ...entry,
        id: nextId(),
        loggedAt: formatTimeLabel(),
      },
      ...current,
    ]);
  }

  return (
    <div style={pageOuterStyle()}>
      <div style={shellStyle()}>
        <main style={mainContentStyle()}>
          <LogHeaderSummary
            dateLabel={formatDateLabel()}
            phaseLabel="Luteal phase"
            cycleDayLabel="Cycle day 18"
            eaten={eaten}
            burned={burned}
            left={left}
          />

          <LogTabNav activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "food" && (
            <FoodTab foods={foods} onAddFood={handleAddFood} />
          )}
          {activeTab === "activity" && (
            <ActivityTab
              activities={activities}
              onAddActivity={handleAddActivity}
            />
          )}
          {activeTab === "check-in" && <CheckInTab />}
          {activeTab === "weight" && (
            <WeightTab entries={weights} onSaveWeight={handleSaveWeight} />
          )}
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
