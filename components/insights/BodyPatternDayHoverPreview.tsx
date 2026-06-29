import {
  CALENDAR_COLORS,
  formatFullDate,
  formatKcal,
  NUTRITION_STATUS_LABELS,
  type NutritionDayStatus,
} from "./bodyPatternCalendarUtils";
import { insightsSans } from "./theme";

interface BodyPatternDayHoverPreviewProps {
  dateKey: string;
  variant: "cycle" | "nutrition";
  cycleDay?: number;
  phase?: string;
  nutritionStatus?: NutritionDayStatus;
  netCalories?: number | null;
  calorieTarget?: number;
}

export function BodyPatternDayHoverPreview({
  dateKey,
  variant,
  cycleDay = 0,
  phase = "",
  nutritionStatus = "noData",
  netCalories = null,
  calorieTarget = 0,
}: BodyPatternDayHoverPreviewProps) {
  const nutritionDetail =
    nutritionStatus === "noData"
      ? "No food logged"
      : `${formatKcal(netCalories ?? 0)} kcal net · target ${formatKcal(calorieTarget)}`;

  return (
    <div
      role="tooltip"
      style={{
        width: "max-content",
        maxWidth: "220px",
        padding: "10px 12px",
        borderRadius: "14px",
        backgroundColor: CALENDAR_COLORS.card,
        border: `1px solid ${CALENDAR_COLORS.border}`,
        boxShadow: "0 8px 24px rgba(60, 43, 36, 0.12)",
        pointerEvents: "none",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.72rem",
          fontWeight: 600,
          color: CALENDAR_COLORS.text,
          fontFamily: insightsSans,
          lineHeight: 1.3,
        }}
      >
        {formatFullDate(dateKey)}
      </p>
      <p
        style={{
          margin: "4px 0 0",
          fontSize: "0.62rem",
          color: CALENDAR_COLORS.secondary,
          fontFamily: insightsSans,
          lineHeight: 1.4,
        }}
      >
        {variant === "cycle"
          ? `Cycle day ${cycleDay} · ${phase}`
          : `${NUTRITION_STATUS_LABELS[nutritionStatus]} · ${nutritionDetail}`}
      </p>
    </div>
  );
}
