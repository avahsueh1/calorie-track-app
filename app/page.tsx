"use client";



import { useRef } from "react";

import { AppShell } from "../components/ui/AppShell";

import { DashboardHeader } from "../components/dashboard/DashboardHeader";

import { HomeLogActions } from "../components/dashboard/HomeLogActions";

import { NourishmentCard } from "../components/dashboard/NourishmentCard";

import { TodayCheckInCard } from "../components/dashboard/TodayCheckInCard";

import {

  useCycleContext,

  useDailyLog,

  useProfile,

  useTrackingPreferences,

} from "../components/providers/AppStateProvider";

import { getProfileFirstName, getProfileInitial } from "../data/defaultProfile";

import { spacing, stackStyle } from "../lib/theme";



export default function HomePage() {

  const { dailySummary, macros } = useDailyLog();

  const { profile, focusMessage } = useProfile();

  const { cycleContext } = useCycleContext();

  const { homeModules } = useTrackingPreferences();

  const calorieCardRef = useRef<HTMLDivElement>(null);

  const checkInGroupRef = useRef<HTMLDivElement>(null);



  return (

    <AppShell>

      <DashboardHeader

        user={{

          name: getProfileFirstName(profile.name),

          focusMessage,

        }}

        cycle={cycleContext}

        userInitial={getProfileInitial(profile.name)}

        showCycleContext={homeModules.showCycleHeader}

      />



      {homeModules.showCalorieCard ? (

        <section ref={calorieCardRef}>

          <NourishmentCard

            key={`nourishment-${dailySummary.eaten}-${dailySummary.burned}-${dailySummary.net}-${dailySummary.tdee}`}

            summary={dailySummary}

            macros={macros}

          />

        </section>

      ) : null}



      <div

        ref={checkInGroupRef}

        style={stackStyle(spacing.block)}

      >

        <HomeLogActions

          scrollAnchorRef={

            homeModules.showCalorieCard ? calorieCardRef : checkInGroupRef

          }

          showFoodLogPrompts={homeModules.showFoodLogPrompts}

        />

        <TodayCheckInCard />

      </div>

    </AppShell>

  );

}

