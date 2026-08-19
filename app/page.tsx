"use client";

import { useRef } from "react";
import { AppShell } from "../components/ui/AppShell";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { HomeLogActions } from "../components/dashboard/HomeLogActions";
import { NourishmentCard } from "../components/dashboard/NourishmentCard";
import { TodayCheckInCard } from "../components/dashboard/TodayCheckInCard";
import { CalorieStatGrid } from "../components/ui/EnergyMacroStatGrids";
import {
  useCycleContext,
  useDailyLog,
  useProfile,
  useTrackingPreferences,
} from "../components/providers/AppStateProvider";
import { getProfileFirstName, getProfileInitial } from "../data/defaultProfile";

export default function HomePage() {
  const { dailySummary, macros } = useDailyLog();
  const { profile, focusMessage } = useProfile();
  const { cycleContext } = useCycleContext();
  const { homeModules } = useTrackingPreferences();
  const mainContentRef = useRef<HTMLDivElement>(null);

  return (
    <AppShell>
      <div className="dashboard-home">
        <DashboardHeader
          user={{
            name: getProfileFirstName(profile.name),
            focusMessage,
          }}
          cycle={cycleContext}
          userInitial={getProfileInitial(profile.name)}
          showCycleContext={homeModules.showCycleHeader}
          actions={
            <HomeLogActions
              scrollAnchorRef={mainContentRef}
              showFoodLogPrompts={homeModules.showFoodLogPrompts}
              variant="header"
            />
          }
        />

        {homeModules.showCalorieCard ? (
          <section className="dashboard-stats-row">
            <CalorieStatGrid
              tileSize="default"
              variant="row"
              columns={4}
              showLabel={false}
              summary={{
                eaten: dailySummary.eaten,
                burned: dailySummary.burned,
                target: dailySummary.tdee,
                remaining: dailySummary.remaining,
              }}
            />
          </section>
        ) : null}

        <div ref={mainContentRef} className="dashboard-main">
          {homeModules.showCalorieCard ? (
            <NourishmentCard
              key={`nourishment-${dailySummary.eaten}-${dailySummary.burned}-${dailySummary.net}-${dailySummary.tdee}`}
              summary={dailySummary}
              macros={macros}
            />
          ) : null}
          <TodayCheckInCard />
        </div>
      </div>
    </AppShell>
  );
}
