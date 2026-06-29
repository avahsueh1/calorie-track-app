"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { AppShell } from "../../../../components/ui/AppShell";
import { SymptomPhaseDetailView } from "../../../../components/insights/symptomInsights/SymptomPhaseDetailView";
import {
  insightsColors,
  insightsMainStyle,
  insightsSans,
} from "../../../../components/insights/theme";
import { useInsightsData } from "../../../../components/providers/AppStateProvider";
import {
  buildSymptomInsightsData,
  isSymptomPhaseKind,
} from "../../../../lib/symptomInsights";
import { routes } from "../../../../lib/routes";

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

export default function CyclePhaseDetailPage() {
  const params = useParams();
  const phaseParam = typeof params.phase === "string" ? params.phase : "";
  const { dailyCheckIns, effectiveCycleSettings, periodLogs, cycleTrackingEnabled } =
    useInsightsData();

  const phase = useMemo(() => {
    if (!isSymptomPhaseKind(phaseParam)) {
      return null;
    }

    const data = buildSymptomInsightsData(
      dailyCheckIns,
      effectiveCycleSettings,
      periodLogs,
    );

    return data.phaseBreakdown.find((entry) => entry.phaseKind === phaseParam) ?? null;
  }, [phaseParam, dailyCheckIns, effectiveCycleSettings, periodLogs]);

  if (!cycleTrackingEnabled) {
    return (
      <AppShell mainStyle={insightsMainStyle()}>
        <BackToInsightsLink />
        <p
          style={{
            margin: "12px 0 0",
            fontFamily: insightsSans,
            fontSize: "0.875rem",
            color: insightsColors.textSecondary,
          }}
        >
          Cycle tracking is not enabled.
        </p>
      </AppShell>
    );
  }

  if (!phase) {
    return (
      <AppShell mainStyle={insightsMainStyle()}>
        <BackToInsightsLink />
        <p
          style={{
            margin: "12px 0 0",
            fontFamily: insightsSans,
            fontSize: "0.875rem",
            color: insightsColors.textSecondary,
          }}
        >
          Phase not found.
        </p>
      </AppShell>
    );
  }

  if (phase.checkInDays === 0) {
    return (
      <AppShell mainStyle={insightsMainStyle()}>
        <BackToInsightsLink />
        <p
          style={{
            margin: "12px 0 0",
            fontFamily: insightsSans,
            fontSize: "0.875rem",
            color: insightsColors.textSecondary,
            fontStyle: "italic",
          }}
        >
          No check-ins logged during this phase yet.
        </p>
      </AppShell>
    );
  }

  return (
    <AppShell mainStyle={insightsMainStyle()}>
      <BackToInsightsLink />
      <div style={{ marginTop: "14px" }}>
        <SymptomPhaseDetailView phase={phase} />
      </div>
    </AppShell>
  );
}
