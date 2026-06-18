import type { DailyCheckInDisplay } from "../../types/wellness";
import { cardStyle, colors, labelStyle, sans, sectionTitleStyle } from "./theme";

interface TodayCheckInCardProps {
  checkIn: DailyCheckInDisplay;
}

const fields: { key: keyof DailyCheckInDisplay; label: string }[] = [
  { key: "mood", label: "Mood" },
  { key: "energy", label: "Energy" },
  { key: "hunger", label: "Hunger" },
  { key: "cravings", label: "Cravings" },
  { key: "sleep", label: "Sleep" },
  { key: "stress", label: "Stress" },
];

export function TodayCheckInCard({ checkIn }: TodayCheckInCardProps) {
  return (
    <section style={{ ...cardStyle(), padding: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h2 style={sectionTitleStyle()}>Today&apos;s check-in</h2>
        <button
          type="button"
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            color: colors.terracotta,
            backgroundColor: colors.terracottaPale,
            padding: "5px 12px",
            borderRadius: "999px",
            border: `1px solid ${colors.terracottaLight}`,
            cursor: "default",
            fontFamily: sans,
          }}
        >
          Update
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px",
        }}
      >
        {fields.map(({ key, label }) => (
          <div
            key={key}
            style={{
              backgroundColor: colors.shell,
              borderRadius: "14px",
              padding: "10px 12px",
              border: `1px solid ${colors.border}`,
            }}
          >
            <p style={{ ...labelStyle(), marginBottom: "4px" }}>{label}</p>
            <p
              style={{
                margin: 0,
                fontSize: "0.8rem",
                fontWeight: 500,
                color: colors.text,
                lineHeight: 1.35,
                fontFamily: sans,
              }}
            >
              {checkIn[key]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
