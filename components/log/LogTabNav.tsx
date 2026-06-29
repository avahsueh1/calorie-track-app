"use client";

import { useMemo } from "react";
import type { TrackingPreferences } from "../../lib/trackingPreferences";
import { getVisibleLogTabs } from "../../lib/trackingPreferences";
import type { LogTab } from "../../lib/trackingPreferences";
import { routes } from "../../lib/routes";
import { colors, sans } from "../dashboard/theme";

export type { LogTab };

export const LOG_TAB_HREF: Record<LogTab, string> = {
  food: routes.logWithTab("food"),
  activity: routes.logWithTab("activity"),
  "check-in": routes.logWithTab("check-in"),
  "progress-journal": routes.logWithTab("progress-journal"),
  "cycle-journal": routes.logWithTab("cycle-journal"),
};

export function parseLogTabParam(value: string | null): LogTab {
  if (
    value === "food" ||
    value === "activity" ||
    value === "check-in" ||
    value === "progress-journal" ||
    value === "weight" ||
    value === "cycle-journal"
  ) {
    return value === "weight" ? "progress-journal" : value;
  }
  return "food";
}

const TAB_LABELS: Record<LogTab, string> = {
  food: "Food",
  activity: "Activity",
  "check-in": "Check-In",
  "progress-journal": "Progress Journal",
  "cycle-journal": "Cycle Journal",
};

interface LogTabNavProps {
  activeTab: LogTab;
  trackingPreferences: TrackingPreferences;
  onTabChange: (tab: LogTab) => void;
}

export function LogTabNav({
  activeTab,
  trackingPreferences,
  onTabChange,
}: LogTabNavProps) {
  const tabs = useMemo(
    () =>
      getVisibleLogTabs(trackingPreferences).map((id) => ({
        id,
        label: TAB_LABELS[id],
      })),
    [trackingPreferences],
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
        gap: "4px",
        padding: "4px",
        backgroundColor: colors.shell,
        borderRadius: "14px",
        border: `1px solid ${colors.border}`,
      }}
      role="tablist"
      aria-label="Log sections"
    >
      {tabs.map(({ id, label }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onTabChange(id)}
            style={{
              padding: "8px 2px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: active ? colors.card : "transparent",
              color: active ? colors.text : colors.muted,
              fontSize: "0.62rem",
              fontWeight: active ? 600 : 500,
              fontFamily: sans,
              cursor: "pointer",
              boxShadow: active ? "0 1px 4px rgba(61, 43, 31, 0.06)" : "none",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
