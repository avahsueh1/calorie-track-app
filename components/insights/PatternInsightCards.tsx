import type { PatternInsightCardData } from "../../types/wellness";
import { spacing } from "../../lib/theme";
import { PatternInsightCard } from "./PatternInsightCard";

interface PatternInsightCardsProps {
  cards: PatternInsightCardData[];
  compact?: boolean;
}

export function PatternInsightCards({ cards, compact = false }: PatternInsightCardsProps) {
  if (cards.length === 1) {
    return <PatternInsightCard card={cards[0]} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? "8px" : spacing.block }}>
      {cards.map((card) => (
        <PatternInsightCard key={card.title} card={card} />
      ))}
    </div>
  );
}
