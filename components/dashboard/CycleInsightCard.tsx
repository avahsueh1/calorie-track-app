import type { CycleContextDisplay } from "../../types/wellness";
import { InsightCallout } from "../ui/DailyNote";

interface CycleInsightCardProps {
  cycle: Pick<CycleContextDisplay, "insightTitle" | "insightMessage">;
}

export function CycleInsightCard({ cycle }: CycleInsightCardProps) {
  return (
    <InsightCallout title={cycle.insightTitle} icon="✿" tone="terracotta">
      {cycle.insightMessage}
    </InsightCallout>
  );
}
