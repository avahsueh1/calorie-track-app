"use client";

import type { PhaseSymptomSummary } from "../../../lib/symptomInsights";
import { PHASE_THEME, type PhaseKind } from "../bodyPatternCalendarUtils";
import { getPhaseInsightIcon } from "../patternPhaseIcons";
import { ReportSubsectionHeader } from "../PatternInsightRow";
import { IconBubble } from "../../ui/IconBubble";
import { AppCard } from "../../ui/primitives";
import {
  insightsColors,
  insightsSans,
  insightsSerif,
} from "../theme";
import { PhaseTopLoggedCards } from "./PhaseTopLoggedCards";
import { buildPhaseMetricItems } from "./phaseInsightCopy";

interface SymptomPhaseDetailViewProps {
  phase: PhaseSymptomSummary;
}

export function SymptomPhaseDetailView({ phase }: SymptomPhaseDetailViewProps) {
  const theme = PHASE_THEME[phase.phaseKind as PhaseKind];
  const phaseKind = phase.phaseKind as Exclude<PhaseKind, "none">;
  const phaseIcon = getPhaseInsightIcon(phaseKind);
  const metrics = buildPhaseMetricItems(phase, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <AppCard
        variant="soft"
        padding="18px"
        style={{
          backgroundColor: theme.bg,
          border: `1px solid ${insightsColors.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <IconBubble
            icon={phaseIcon.icon}
            backgroundColor={phaseIcon.backgroundColor}
            color={phaseIcon.color}
            size={38}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: "0 0 2px",
                fontFamily: insightsSans,
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: theme.accent,
              }}
            >
              {phase.phase}
            </p>
            <h1
              style={{
                margin: 0,
                fontFamily: insightsSerif,
                fontSize: "1.35rem",
                fontWeight: 400,
                color: insightsColors.text,
                letterSpacing: "-0.02em",
              }}
            >
              {phase.friendlyTitle}
            </h1>
          </div>
          <span
            style={{
              fontFamily: insightsSans,
              fontSize: "1.125rem",
              fontWeight: 700,
              color: theme.accent,
              flexShrink: 0,
            }}
          >
            {phase.checkInDays}d
          </span>
        </div>
      </AppCard>

      <AppCard variant="soft" padding="16px">
        <ReportSubsectionHeader
          title="What you log most"
          helper="Your top check-ins during this phase — energy, appetite, and more."
        />

        {metrics.length === 0 ? (
          <p
            style={{
              margin: 0,
              fontFamily: insightsSans,
              fontSize: "0.8125rem",
              color: insightsColors.textSecondary,
              fontStyle: "italic",
            }}
          >
            No symptoms logged during this phase yet.
          </p>
        ) : (
          <PhaseTopLoggedCards phase={phase} limit={5} />
        )}
      </AppCard>

      <p
        style={{
          margin: 0,
          fontFamily: insightsSans,
          fontSize: "0.75rem",
          lineHeight: 1.45,
          color: insightsColors.textSecondary,
        }}
      >
        Not a medical diagnosis — patterns from your check-ins only.
      </p>
    </div>
  );
}
