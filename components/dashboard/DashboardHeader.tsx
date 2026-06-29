import Link from "next/link";
import type { CycleContextDisplay, WellnessUser } from "../../types/wellness";
import { routes } from "../../lib/routes";
import { colors, sans, serif } from "./theme";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getTimeIcon(): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 18) return "☀";
  return "☾";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function pillStyle(accent?: "terracotta" | "lavender" | "neutral") {
  const variants = {
    terracotta: {
      color: colors.terracotta,
      backgroundColor: colors.terracottaPale,
      border: `1px solid ${colors.terracottaLight}`,
    },
    lavender: {
      color: "#6E6280",
      backgroundColor: colors.lavenderPale,
      border: `1px solid #DDD4E8`,
    },
    neutral: {
      color: colors.muted,
      backgroundColor: "#F5F0EB",
      border: `1px solid ${colors.border}`,
    },
  };

  const variant = variants[accent ?? "neutral"];

  return {
    display: "inline-flex" as const,
    alignItems: "center" as const,
    gap: "5px",
    fontSize: "0.68rem",
    fontWeight: 600,
    padding: "5px 10px",
    borderRadius: "999px",
    flexShrink: 0,
    whiteSpace: "nowrap" as const,
    fontFamily: sans,
    lineHeight: 1,
    ...variant,
  };
}

interface DashboardHeaderProps {
  user: WellnessUser;
  cycle: CycleContextDisplay;
  userInitial: string;
  showCycleContext?: boolean;
}

export function DashboardHeader({
  user,
  cycle,
  userInitial,
  showCycleContext = true,
}: DashboardHeaderProps) {
  return (
    <header style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.8rem",
              color: colors.muted,
              fontFamily: sans,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>{getGreeting()},</span>
            <span aria-hidden="true" style={{ fontSize: "0.72rem", opacity: 0.85 }}>
              {getTimeIcon()}
            </span>
          </p>
          <h1
            style={{
              margin: "3px 0 0",
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

        <Link
          href={routes.profile}
          aria-label="Go to profile"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(145deg, #F5E8E2 0%, #EDE4F0 100%)",
            border: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: serif,
            fontSize: "0.95rem",
            fontWeight: 500,
            color: colors.terracotta,
            flexShrink: 0,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
            textDecoration: "none",
            cursor: "pointer",
          }}
          className="dashboard-profile-avatar-link"
        >
          {userInitial}
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.76rem",
            color: colors.muted,
            fontFamily: sans,
          }}
        >
          {formatDate()}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {showCycleContext && cycle.cycleDayLabel ? (
            <span style={pillStyle("neutral")}>{cycle.cycleDayLabel}</span>
          ) : null}
          {showCycleContext && cycle.phaseLabel && cycle.phaseLabel !== "Cycle tracking off" ? (
            <span style={pillStyle("terracotta")}>
              <span aria-hidden="true">◐</span>
              {cycle.phaseLabel}
            </span>
          ) : null}
        </div>
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
