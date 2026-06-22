"use client";

import { useRef } from "react";
import { AppShell } from "../components/ui/AppShell";
import { CycleInsightCard } from "../components/dashboard/CycleInsightCard";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { HomeLogActions } from "../components/dashboard/HomeLogActions";
import { NourishmentCard } from "../components/dashboard/NourishmentCard";
import { PatternInsightsCard } from "../components/dashboard/PatternInsightsCard";
import { TodayCheckInCard } from "../components/dashboard/TodayCheckInCard";
import { groupStackStyle } from "../components/dashboard/theme";
import {
  useCycleContext,
  useDailyLog,
  useInsightsData,
  useProfile,
} from "../components/providers/AppStateProvider";
import { getProfileFirstName, getProfileInitial } from "../data/defaultProfile";

export default function HomePage() {
  const { dailySummary, macros } = useDailyLog();
  const { profile, focusMessage } = useProfile();
  const { cycleContext } = useCycleContext();
  const { patternInsightCards } = useInsightsData();
  const calorieCardRef = useRef<HTMLElement>(null);
  const patternMessage =
    patternInsightCards.find((card) => card.title === "Cycle context")?.message ??
    "Log 7 days to compare mood, nourishment, and cycle context.";

  return (
    <AppShell
      mainStyle={{
        gap: "6px",
      }}
    >
      <DashboardHeader
        user={{
          name: getProfileFirstName(profile.name),
          focusMessage,
        }}
        cycle={cycleContext}
        userInitial={getProfileInitial(profile.name)}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <section ref={calorieCardRef}>
          <NourishmentCard
            key={`nourishment-${dailySummary.eaten}-${dailySummary.burned}-${dailySummary.net}-${dailySummary.tdee}`}
            summary={dailySummary}
            macros={macros}
          />
        </section>

        <HomeLogActions calorieCardRef={calorieCardRef} />

        <TodayCheckInCard />

        <div style={groupStackStyle()}>
          <CycleInsightCard cycle={cycleContext} />
          <PatternInsightsCard message={patternMessage} />
        </div>
      </div>
    </AppShell>
  );
}
