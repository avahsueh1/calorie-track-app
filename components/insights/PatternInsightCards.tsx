import type { PatternInsightCardData } from "../../types/wellness";
import {
  insightsCardStyle,
  insightsColors,
  insightsSans,
  insightsSectionTitleStyle,
} from "./theme";

const accentBackground: Record<PatternInsightCardData["accent"], string> = {
  cream: "#F7EFE8",
  lavender: insightsColors.lavenderBg,
  blue: insightsColors.blueBg,
};

interface PatternInsightCardsProps {
  cards: PatternInsightCardData[];
}

export function PatternInsightCards({ cards }: PatternInsightCardsProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {cards.map((card) => (
        <article
          key={card.title}
          style={{
            ...insightsCardStyle(),
            backgroundColor: accentBackground[card.accent],
          }}
        >
          <h3
            style={{
              ...insightsSectionTitleStyle(),
              fontSize: "0.85rem",
              marginBottom: "8px",
            }}
          >
            {card.title}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "0.78rem",
              lineHeight: 1.5,
              color: insightsColors.textSecondary,
              fontFamily: insightsSans,
            }}
          >
            {card.message}
          </p>
        </article>
      ))}
    </div>
  );
}
