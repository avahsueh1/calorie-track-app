import type { CycleContextDisplay, WellnessUser } from "../../types/wellness";
import { colors, sans, serif } from "./theme";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

interface DashboardHeaderProps {
  user: WellnessUser;
  cycle: CycleContextDisplay;
}

export function DashboardHeader({ user, cycle }: DashboardHeaderProps) {
  return (
    <header style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.8rem",
              color: colors.muted,
              fontFamily: sans,
            }}
          >
            {getGreeting()},
          </p>
          <h1
            style={{
              margin: "4px 0 0",
              fontFamily: serif,
              fontSize: "1.75rem",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: colors.text,
            }}
          >
            {user.name}
          </h1>
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "0.7rem",
            fontWeight: 600,
            color: colors.terracotta,
            backgroundColor: colors.terracottaPale,
            padding: "7px 11px",
            borderRadius: "999px",
            border: `1px solid ${colors.terracottaLight}`,
            flexShrink: 0,
            whiteSpace: "nowrap",
            fontFamily: sans,
          }}
        >
          <span aria-hidden="true">☾</span>
          {cycle.phaseLabel}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.78rem",
            color: colors.muted,
            fontFamily: sans,
          }}
        >
          {formatDate()}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "0.75rem",
            color: colors.muted,
            fontFamily: sans,
            textAlign: "right",
          }}
        >
          {cycle.cycleDayLabel}
        </p>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: "0.78rem",
          color: colors.terracotta,
          fontStyle: "italic",
          fontFamily: sans,
        }}
      >
        {user.focusMessage}
      </p>
    </header>
  );
}
