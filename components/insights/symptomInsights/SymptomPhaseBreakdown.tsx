"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { PhaseSymptomSummary } from "../../../lib/symptomInsights";
import { PHASE_THEME, type PhaseKind } from "../bodyPatternCalendarUtils";
import { getPhaseInsightIcon } from "../patternPhaseIcons";
import { IconBubble } from "../../ui/IconBubble";
import { ReportSubsectionHeader } from "../PatternInsightRow";
import { AppCard } from "../../ui/primitives";
import { routes } from "../../../lib/routes";
import { insightsColors, insightsSans } from "../theme";
import { PhaseTopLoggedCards } from "./PhaseTopLoggedCards";
import { buildPhaseMetricItems } from "./phaseInsightCopy";

interface SymptomPhaseBreakdownProps {
  breakdown: PhaseSymptomSummary[];
  hasEnoughData: boolean;
  embedded?: boolean;
  hideHeader?: boolean;
}

function PhaseStageCard({ group }: { group: PhaseSymptomSummary }) {
  const theme = PHASE_THEME[group.phaseKind as PhaseKind];
  const phaseKind = group.phaseKind as Exclude<PhaseKind, "none">;
  const phaseIcon = getPhaseInsightIcon(phaseKind);
  const hasCheckIns = group.checkInDays > 0;
  const hasMetrics = buildPhaseMetricItems(group, 5).length > 0;

  const cardStyle = {
    padding: "14px 16px",
    borderRadius: "18px",
    backgroundColor: theme.bg,
    border: `1px solid ${insightsColors.border}`,
  } as const;

  if (!hasCheckIns) {
    return (
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <IconBubble
            icon={phaseIcon.icon}
            backgroundColor={phaseIcon.backgroundColor}
            color={phaseIcon.color}
            size={32}
          />
          <p
            style={{
              margin: 0,
              fontFamily: insightsSans,
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: theme.accent,
            }}
          >
            {group.friendlyTitle}
          </p>
        </div>
        <p
          style={{
            margin: "8px 0 0",
            fontFamily: insightsSans,
            fontSize: "0.8125rem",
            color: insightsColors.textSecondary,
            fontStyle: "italic",
          }}
        >
          No check-ins yet
        </p>
      </div>
    );
  }

  const cardContent = (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          marginBottom: hasMetrics ? "12px" : 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <IconBubble
            icon={phaseIcon.icon}
            backgroundColor={phaseIcon.backgroundColor}
            color={phaseIcon.color}
            size={32}
          />
          <p
            style={{
              margin: 0,
              fontFamily: insightsSans,
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: theme.accent,
            }}
          >
            {group.friendlyTitle}
          </p>
        </div>
        <ChevronRight
          size={16}
          color={insightsColors.textSecondary}
          aria-hidden
          style={{ flexShrink: 0 }}
        />
      </div>

      {hasMetrics ? (
        <PhaseTopLoggedCards phase={group} limit={5} compact />
      ) : null}
    </>
  );

  return (
    <Link
      href={routes.cyclePhaseDetail(group.phaseKind)}
      aria-label={`View details for ${group.friendlyTitle}`}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        ...cardStyle,
        cursor: "pointer",
        transition: "transform 120ms ease, box-shadow 120ms ease",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.transform = "translateY(-1px)";
        event.currentTarget.style.boxShadow = "0 4px 14px rgba(74, 61, 54, 0.08)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "translateY(0)";
        event.currentTarget.style.boxShadow = "none";
      }}
    >
      {cardContent}
    </Link>
  );
}

export function SymptomPhaseBreakdown({
  breakdown,
  hasEnoughData,
  embedded = false,
  hideHeader = false,
}: SymptomPhaseBreakdownProps) {
  const content = (
    <>
      {hideHeader ? null : (
        <ReportSubsectionHeader
          title="Cycle phases"
          helper="How symptoms and energy vary across your cycle."
        />
      )}

      {!hasEnoughData ? (
        <p
          style={{
            margin: 0,
            fontSize: "0.8125rem",
            lineHeight: 1.45,
            color: insightsColors.textSecondary,
            fontFamily: insightsSans,
            fontStyle: "italic",
          }}
        >
          Log a few check-ins to see cycle patterns.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {breakdown.map((group) => (
            <PhaseStageCard key={group.phase} group={group} />
          ))}
        </div>
      )}
    </>
  );

  if (embedded) {
    return content;
  }

  return (
    <AppCard variant="soft" padding="16px">
      {content}
    </AppCard>
  );
}
