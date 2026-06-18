import { BottomNav } from "../components/dashboard/BottomNav";
import { CycleInsightCard } from "../components/dashboard/CycleInsightCard";
import { DailySummaryStats } from "../components/dashboard/DailySummaryStats";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { MacroBars } from "../components/dashboard/MacroBars";
import { NourishmentRing } from "../components/dashboard/NourishmentRing";
import { PatternInsightsCard } from "../components/dashboard/PatternInsightsCard";
import { TodayCheckInCard } from "../components/dashboard/TodayCheckInCard";
import {
  cardStyle,
  layout,
  mainContentStyle,
  pageOuterStyle,
  shellStyle,
} from "../components/dashboard/theme";
import {
  getSampleCheckIn,
  getSampleDailySummary,
  getSampleMacros,
  patternInsightsMessage,
  sampleCycleContext,
  sampleUser,
} from "../data/sampleDashboard";

export default function HomePage() {
  const sampleDailySummary = getSampleDailySummary();
  const sampleMacros = getSampleMacros();
  const sampleCheckIn = getSampleCheckIn();

  return (
    <div style={pageOuterStyle()}>
      <div style={shellStyle()}>
        <main style={mainContentStyle()}>
          <DashboardHeader user={sampleUser} cycle={sampleCycleContext} />

          <section
            style={{
              ...cardStyle(),
              padding: `${layout.cardPadding} 16px 20px`,
            }}
          >
            <NourishmentRing summary={sampleDailySummary} />
            <MacroBars macros={sampleMacros} />
          </section>

          <TodayCheckInCard checkIn={sampleCheckIn} />
          <DailySummaryStats summary={sampleDailySummary} />
          <CycleInsightCard cycle={sampleCycleContext} />
          <PatternInsightsCard message={patternInsightsMessage} />
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
