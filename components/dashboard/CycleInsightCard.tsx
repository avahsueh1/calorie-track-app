import type { CycleContextDisplay } from "../../types/wellness";
import { cardStyle, colors, sans, sectionTitleStyle } from "./theme";

interface CycleInsightCardProps {
  cycle: Pick<CycleContextDisplay, "insightTitle" | "insightMessage">;
}

export function CycleInsightCard({ cycle }: CycleInsightCardProps) {
  return (
    <section
      style={{
        ...cardStyle(),
        padding: "16px",
        backgroundColor: colors.terracottaPale,
        borderColor: colors.terracottaLight,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <span style={{ fontSize: "0.95rem", lineHeight: 1 }} aria-hidden="true">
          ✿
        </span>
        <h2 style={sectionTitleStyle()}>{cycle.insightTitle}</h2>
      </div>
      <p
        style={{
          margin: 0,
          fontSize: "0.82rem",
          lineHeight: 1.55,
          color: colors.text,
          fontFamily: sans,
        }}
      >
        {cycle.insightMessage}
      </p>
    </section>
  );
}
