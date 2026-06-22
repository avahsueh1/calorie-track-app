import type { PatternInsightCardData } from "../../types/wellness";
import { AppCard } from "../ui/AppCard";
import {
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
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {cards.map((card) => (
        <AppCard
          key={card.title}
          shadow
          style={{ backgroundColor: accentBackground[card.accent] }}
        >
          <h3
            style={{
              ...insightsSectionTitleStyle(),
              fontSize: "0.85rem",
              marginBottom: "6px",
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
        </AppCard>
      ))}
    </div>
  );
}
