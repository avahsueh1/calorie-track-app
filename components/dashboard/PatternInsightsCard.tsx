import { InsightCallout } from "../ui/DailyNote";

interface PatternInsightsCardProps {
  message: string;
}

export function PatternInsightsCard({ message }: PatternInsightsCardProps) {
  return (
    <InsightCallout title="Pattern insights" tone="lavender">
      {message}
    </InsightCallout>
  );
}
