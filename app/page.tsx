"use client";

import { BottomNav } from "../components/dashboard/BottomNav";
import { CycleInsightCard } from "../components/dashboard/CycleInsightCard";
import { DailySummaryStats } from "../components/dashboard/DailySummaryStats";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { NourishmentCard } from "../components/dashboard/NourishmentCard";
import { PatternInsightsCard } from "../components/dashboard/PatternInsightsCard";
import { TodayCheckInCard } from "../components/dashboard/TodayCheckInCard";
import {
  mainContentStyle,
  pageOuterStyle,
  shellStyle,
} from "../components/dashboard/theme";
import {
  useCycleContext,
  useDailyLog,
  useProfile,
} from "../components/providers/AppStateProvider";
import { getProfileFirstName } from "../data/defaultProfile";
import { patternInsightsMessage } from "../data/sampleDashboard";

export default function HomePage() {
  const { dailySummary, macros } = useDailyLog();
  const { profile, focusMessage } = useProfile();
  const { cycleContext } = useCycleContext();

  return (
    <div style={pageOuterStyle()}>
      <div style={shellStyle()}>
        <main style={mainContentStyle()}>
          <DashboardHeader
            user={{
              name: getProfileFirstName(profile.name),
              focusMessage,
            }}
            cycle={cycleContext}
          />

          <NourishmentCard
            key={`nourishment-${dailySummary.eaten}-${dailySummary.burned}-${dailySummary.net}-${dailySummary.tdee}`}
            summary={dailySummary}
            macros={macros}
          />

          <TodayCheckInCard />
          <DailySummaryStats summary={dailySummary} />
          <CycleInsightCard cycle={cycleContext} />
          <PatternInsightsCard message={patternInsightsMessage} />
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
