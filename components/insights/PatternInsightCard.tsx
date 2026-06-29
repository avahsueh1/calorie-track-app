import type { PatternInsightCardData } from "../../types/wellness";
import { InsightCallout } from "../ui/DailyNote";

const accentTone: Record<
  PatternInsightCardData["accent"],
  "cream" | "lavender" | "blue"
> = {
  cream: "cream",
  lavender: "lavender",
  blue: "blue",
};

interface PatternInsightCardProps {
  card: PatternInsightCardData;
}

export function PatternInsightCard({ card }: PatternInsightCardProps) {
  return (
    <InsightCallout
      title={card.title}
      icon={card.icon}
      tone={accentTone[card.accent]}
      variant="compact"
    >
      {card.message}
    </InsightCallout>
  );
}
