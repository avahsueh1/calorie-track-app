import {
  calculateDailySummary,
  calculateTdee,
} from "../lib/calories";
import type {
  ActivityLogInput,
  FoodLogInput,
  UserProfile,
} from "../types";

const colors = {
  bg: "#0F0F0F",
  shell: "#18181B",
  card: "#1F1F23",
  sidebar: "#141416",
  text: "#FAFAFA",
  muted: "#A1A1AA",
  lime: "#A3E635",
  limeDim: "#3F6212",
  blue: "#3B82F6",
  border: "#27272A",
};

const sampleProfile: UserProfile = {
  age: 28,
  sex: "female",
  heightCm: 165,
  weightKg: 56,
  activityLevel: "moderate",
};

const sampleFoodLogs: FoodLogInput[] = [
  { caloriesPerServing: 520, servings: 1 },
  { caloriesPerServing: 450, servings: 2 },
];

const sampleActivityLogs: ActivityLogInput[] = [
  { metValue: 5, weightKg: 64, durationMinutes: 60 },
];

const tdee = calculateTdee(sampleProfile);
const summary = calculateDailySummary(sampleFoodLogs, sampleActivityLogs, tdee);

const sidebarItems = [
  { icon: "◉", label: "Home", active: true },
  { icon: "◎", label: "Log", active: false },
  { icon: "◐", label: "Stats", active: false },
  { icon: "○", label: "Goals", active: false },
];

const quickActions = [
  { icon: "+", label: "Log Food" },
  { icon: "↗", label: "Log Activity" },
  { icon: "≡", label: "History" },
  { icon: "◎", label: "Profile" },
];

const sparkHeights = [28, 42, 36, 50, 32, 44, 38];

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
    year: "numeric",
  });
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function MiniBars({
  heights,
  barColor,
}: {
  heights: number[];
  barColor: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "4px",
        height: "40px",
        marginBottom: "12px",
      }}
      aria-hidden="true"
    >
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${h}%`,
            backgroundColor: barColor,
            borderRadius: "3px",
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const budgetPercent = Math.round(
    (summary.totalFoodCalories / summary.tdee) * 100,
  );

  const summaryCards = [
    {
      label: "Calories Eaten",
      value: `${formatNumber(summary.totalFoodCalories)}`,
      unit: "kcal",
      detail: `of ${formatNumber(summary.tdee)} kcal budget`,
      accent: colors.lime,
      barColor: colors.lime,
    },
    {
      label: "Calories Burned",
      value: `${formatNumber(summary.totalActivityCalories)}`,
      unit: "kcal",
      detail: "From activity",
      accent: colors.muted,
      barColor: "#52525B",
    },
    {
      label: "Net After Exercise",
      value: `${formatNumber(summary.netCalories)}`,
      unit: "kcal",
      detail: "Food intake minus activity burn",
      accent: colors.muted,
      barColor: "#52525B",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colors.bg,
        padding: "20px 16px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: colors.text,
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          backgroundColor: colors.shell,
          borderRadius: "28px",
          border: `1px solid ${colors.border}`,
          display: "flex",
          overflow: "hidden",
          minHeight: "calc(100vh - 40px)",
        }}
      >
        {/* Decorative sidebar — visual only */}
        <aside
          style={{
            backgroundColor: colors.sidebar,
            borderRadius: "999px",
            margin: "20px 0 20px 20px",
            padding: "24px 12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "18px",
            flexShrink: 0,
            border: `1px solid ${colors.border}`,
          }}
          aria-hidden="true"
        >
          {sidebarItems.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  backgroundColor: item.active ? colors.lime : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.95rem",
                  color: item.active ? colors.bg : colors.muted,
                }}
              >
                {item.icon}
              </div>
              <span style={{ fontSize: "0.6rem", color: colors.muted }}>
                {item.label}
              </span>
            </div>
          ))}
        </aside>

        <main
          style={{
            flex: 1,
            padding: "24px 24px 24px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Header */}
          <header>
            <p
              style={{
                margin: 0,
                fontSize: "1.5rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              {getGreeting()}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: colors.muted }}>
              Calorie Tracker · {formatDate()}
            </p>
          </header>

          {/* Hero row: budget + TDEE */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            {/* Daily calorie budget */}
            <section
              style={{
                backgroundColor: colors.card,
                borderRadius: "20px",
                padding: "20px 22px",
                border: `1px solid ${colors.border}`,
                gridColumn: "span 1",
              }}
            >
              <MiniBars heights={sparkHeights} barColor={colors.limeDim} />
              <p
                style={{
                  margin: 0,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: colors.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Daily calorie budget
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "2rem",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                }}
              >
                {formatNumber(summary.remainingCalories)}{" "}
                <span style={{ color: colors.lime }}>kcal left</span>
              </p>
              <p style={{ margin: "6px 0 16px", fontSize: "0.8rem", color: colors.muted }}>
                {formatNumber(summary.totalFoodCalories)} /{" "}
                {formatNumber(summary.tdee)} kcal used
              </p>
              <div
                style={{
                  height: "8px",
                  backgroundColor: colors.limeDim,
                  borderRadius: "999px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${budgetPercent}%`,
                    backgroundColor: colors.lime,
                    borderRadius: "999px",
                  }}
                />
              </div>
            </section>

            {/* TDEE highlight panel */}
            <section
              style={{
                backgroundColor: colors.blue,
                borderRadius: "20px",
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.75)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                TDEE Target
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {formatNumber(summary.tdee)}
              </p>
              <p style={{ margin: "6px 0 0", fontSize: "0.85rem", color: "rgba(255,255,255,0.8)" }}>
                kcal / day
              </p>
            </section>
          </div>

          {/* Stat grid */}
          <section>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>
                Today&apos;s Summary
              </h2>
              <span
                style={{
                  backgroundColor: colors.card,
                  color: colors.lime,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  padding: "5px 12px",
                  borderRadius: "999px",
                  border: `1px solid ${colors.border}`,
                }}
              >
                Today
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
              }}
            >
              {summaryCards.map((card) => (
                <article
                  key={card.label}
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: "20px",
                    padding: "16px 18px",
                    border: `1px solid ${colors.border}`,
                    borderTop: `3px solid ${card.accent}`,
                  }}
                >
                  <MiniBars
                    heights={sparkHeights.slice(0, 5)}
                    barColor={card.barColor}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: colors.muted,
                    }}
                  >
                    {card.label}
                  </p>
                  <p
                    style={{
                      margin: "6px 0 0",
                      fontSize: "1.6rem",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                    }}
                  >
                    {card.value}{" "}
                    <span style={{ fontSize: "0.9rem", fontWeight: 600, color: colors.muted }}>
                      {card.unit}
                    </span>
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: colors.muted }}>
                    {card.detail}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Bottom row: Quick Actions + MVP Status */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            {/* Quick Actions */}
            <section
              style={{
                backgroundColor: colors.card,
                borderRadius: "20px",
                padding: "18px 20px",
                border: `1px solid ${colors.border}`,
              }}
            >
              <h2 style={{ margin: "0 0 14px", fontSize: "0.95rem", fontWeight: 700 }}>
                Quick Actions
              </h2>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                {quickActions.map((action) => (
                  <div
                    key={action.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      opacity: 0.5,
                      pointerEvents: "none",
                    }}
                  >
                    <button
                      type="button"
                      disabled
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "50%",
                        backgroundColor: colors.shell,
                        border: `1px solid ${colors.border}`,
                        fontSize: "1.1rem",
                        color: colors.lime,
                        cursor: "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {action.icon}
                    </button>
                    <span style={{ fontSize: "0.7rem", color: colors.muted, fontWeight: 500 }}>
                      {action.label}
                    </span>
                    <span style={{ fontSize: "0.6rem", color: colors.lime, fontWeight: 600 }}>
                      Soon
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* MVP Status */}
            <section
              style={{
                backgroundColor: "#1A2E05",
                borderRadius: "20px",
                padding: "18px 20px",
                border: `1px solid ${colors.limeDim}`,
                borderLeft: `4px solid ${colors.lime}`,
              }}
            >
              <h2 style={{ margin: "0 0 10px", fontSize: "0.95rem", fontWeight: 700 }}>
                MVP Status
              </h2>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "1.1rem",
                  color: colors.muted,
                  fontSize: "0.8rem",
                  lineHeight: 1.65,
                }}
              >
                <li>
                  <strong style={{ color: colors.text }}>Done:</strong> Runnable dashboard
                  shell
                </li>
                <li>
                  <strong style={{ color: colors.text }}>Next:</strong> Supabase setup, auth,
                  food &amp; activity logging
                </li>
                <li>
                  <strong style={{ color: colors.text }}>Future:</strong> AI recommendations
                  (not enabled)
                </li>
              </ul>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
