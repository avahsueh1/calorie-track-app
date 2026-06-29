"use client";

import { useRouter } from "next/navigation";
import { routes } from "../../lib/routes";
import { profileColors, profileSans } from "./theme";

type ProfileSettingsTab = "calorie" | "cycle";

const TABS: { id: ProfileSettingsTab; label: string; href: string }[] = [
  { id: "calorie", label: "Calorie plan", href: routes.calorieSettings },
  { id: "cycle", label: "Cycle & life stage", href: "/profile/cycle-settings" },
];

interface ProfileSettingsTabsProps {
  active: ProfileSettingsTab;
}

function tabStyle(active: boolean) {
  return {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 12px",
    borderRadius: "999px",
    border: `1px solid ${active ? profileColors.terracotta : profileColors.border}`,
    backgroundColor: active ? profileColors.blushBg : profileColors.cardSoft,
    color: active ? profileColors.terracottaDark : profileColors.textSecondary,
    fontFamily: profileSans,
    fontSize: "0.78rem",
    fontWeight: active ? 600 : 500,
    textAlign: "center" as const,
    lineHeight: 1.3,
    cursor: "pointer",
    boxSizing: "border-box" as const,
  };
}

export function ProfileSettingsTabs({ active }: ProfileSettingsTabsProps) {
  const router = useRouter();

  return (
    <nav aria-label="Plan and cycle settings" style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "4px",
          borderRadius: "999px",
          backgroundColor: profileColors.card,
          border: `1px solid ${profileColors.border}`,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-current={active === tab.id ? "page" : undefined}
            onClick={() => router.push(tab.href)}
            style={tabStyle(active === tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
