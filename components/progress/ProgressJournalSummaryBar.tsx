"use client";

import { Camera, Scale, TrendingDown, TrendingUp } from "lucide-react";
import type { ProgressJournalStats } from "../../lib/progressJournal";
import { colors, sans } from "../../lib/theme";
import { AppCard } from "../ui/primitives";
import { IconBubble } from "../ui/IconBubble";
import { StatusPill } from "../ui/StatusPill";

interface ProgressJournalSummaryBarProps {
  stats: ProgressJournalStats;
}

export function ProgressJournalSummaryBar({ stats }: ProgressJournalSummaryBarProps) {
  const changeTone =
    stats.changeDirection === "down"
      ? "sage"
      : stats.changeDirection === "up"
        ? "terracotta"
        : "neutral";

  const ChangeIcon =
    stats.changeDirection === "down"
      ? TrendingDown
      : stats.changeDirection === "up"
        ? TrendingUp
        : Scale;

  return (
    <AppCard
      variant="soft"
      padding="compact"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "8px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "6px",
          }}
        >
          <IconBubble
            icon={Scale}
            backgroundColor="#E8F0EA"
            color={colors.sage}
            size="sm"
          />
        </div>
        <p
          style={{
            margin: "0 0 3px",
            fontSize: "0.58rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: colors.muted,
            fontFamily: sans,
          }}
        >
          Current
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "0.92rem",
            fontWeight: 600,
            color: colors.text,
            fontFamily: sans,
            lineHeight: 1.2,
          }}
        >
          {stats.currentWeightLabel ?? "—"}
        </p>
      </div>

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "6px",
          }}
        >
          <IconBubble
            icon={ChangeIcon}
            backgroundColor={
              stats.changeDirection === "down"
                ? "#E8F0EA"
                : stats.changeDirection === "up"
                  ? colors.terracottaPale
                  : "#F5F0EB"
            }
            color={
              stats.changeDirection === "down"
                ? colors.sage
                : stats.changeDirection === "up"
                  ? colors.terracotta
                  : colors.muted
            }
            size="sm"
          />
        </div>
        <p
          style={{
            margin: "0 0 3px",
            fontSize: "0.58rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: colors.muted,
            fontFamily: sans,
          }}
        >
          Since last
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {stats.changeSinceLastLabel ? (
            <StatusPill tone={changeTone} value={stats.changeSinceLastLabel} />
          ) : (
            <span
              style={{
                fontSize: "0.82rem",
                color: colors.muted,
                fontFamily: sans,
              }}
            >
              —
            </span>
          )}
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "6px",
          }}
        >
          <IconBubble
            icon={Camera}
            backgroundColor={colors.lavenderPale}
            color="#6E6280"
            size="sm"
          />
        </div>
        <p
          style={{
            margin: "0 0 3px",
            fontSize: "0.58rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: colors.muted,
            fontFamily: sans,
          }}
        >
          Photos
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "0.92rem",
            fontWeight: 600,
            color: colors.text,
            fontFamily: sans,
            lineHeight: 1.2,
          }}
        >
          {stats.totalPhotos}
        </p>
      </div>
    </AppCard>
  );
}
