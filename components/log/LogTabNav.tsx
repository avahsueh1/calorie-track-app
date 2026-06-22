import { colors, sans } from "../dashboard/theme";

export type LogTab = "food" | "activity" | "check-in" | "weight";

export const LOG_TAB_HREF: Record<LogTab, string> = {
  food: "/log?tab=food",
  activity: "/log?tab=activity",
  "check-in": "/log?tab=check-in",
  weight: "/log?tab=weight",
};

export function parseLogTabParam(value: string | null): LogTab {
  if (
    value === "food" ||
    value === "activity" ||
    value === "check-in" ||
    value === "weight"
  ) {
    return value;
  }
  return "food";
}

const tabs: { id: LogTab; label: string }[] = [
  { id: "food", label: "Food" },
  { id: "activity", label: "Activity" },
  { id: "check-in", label: "Check-In" },
  { id: "weight", label: "Weight" },
];

interface LogTabNavProps {
  activeTab: LogTab;
  onTabChange: (tab: LogTab) => void;
}

export function LogTabNav({ activeTab, onTabChange }: LogTabNavProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "6px",
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
              padding: "8px 4px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: active ? colors.card : "transparent",
              color: active ? colors.text : colors.muted,
              fontSize: "0.72rem",
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
