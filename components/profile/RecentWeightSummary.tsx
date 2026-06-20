import { profileColors, profileSans, profileSerif } from "./theme";
import type { WeightLogEntry } from "../../types/wellness";

interface RecentWeightSummaryProps {
  entries: WeightLogEntry[];
}

export function RecentWeightSummary({ entries }: RecentWeightSummaryProps) {
  const recentEntries = entries.slice(0, 3);

  return (
    <section
      style={{
        backgroundColor: profileColors.card,
        borderRadius: "24px",
        border: `1px solid ${profileColors.border}`,
        padding: "18px",
      }}
    >
      <h2
        style={{
          margin: "0 0 10px",
          fontFamily: profileSerif,
          fontSize: "1.05rem",
          fontWeight: 400,
          color: profileColors.text,
        }}
      >
        Recent weight
      </h2>
      {recentEntries.length === 0 ? (
        <p
          style={{
            margin: 0,
            fontSize: "0.78rem",
            lineHeight: 1.5,
            color: profileColors.textSecondary,
            fontFamily: profileSans,
            fontStyle: "italic",
          }}
        >
          No weight entries yet. Log weight on the Log page.
        </p>
      ) : (
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {recentEntries.map((entry) => (
            <li
              key={entry.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                padding: "10px 12px",
                borderRadius: "12px",
                backgroundColor: profileColors.cardSoft,
                border: `1px solid ${profileColors.border}`,
              }}
            >
              <span
                style={{
                  fontSize: "0.84rem",
                  fontWeight: 600,
                  color: profileColors.text,
                  fontFamily: profileSans,
                }}
              >
                {entry.weight} kg
              </span>
              <span
                style={{
                  fontSize: "0.72rem",
                  color: profileColors.textSecondary,
                  fontFamily: profileSans,
                  textAlign: "right",
                }}
              >
                {entry.date}
                {entry.loggedAt ? ` · ${entry.loggedAt}` : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
