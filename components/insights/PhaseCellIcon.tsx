import { Moon, Sparkles, Sun } from "lucide-react";
import type { PeriodFlow } from "../../types/wellness";
import { PeriodFlowDrops } from "../shared/PeriodFlowDrops";
import type { PhaseKind } from "./bodyPatternCalendarUtils";
import { PHASE_THEME } from "./bodyPatternCalendarUtils";

interface PhaseCellIconProps {
  kind: PhaseKind;
  color?: string;
  size?: number;
  opacity?: number;
  periodFlow?: PeriodFlow;
}

export function PhaseCellIcon({
  kind,
  color,
  size = 16,
  opacity = 0.72,
  periodFlow,
}: PhaseCellIconProps) {
  if (kind === "none") return null;

  const accent = color ?? PHASE_THEME[kind].accent;
  const iconProps = {
    size,
    strokeWidth: 1.75,
    "aria-hidden": true as const,
    style: { opacity, color: accent, flexShrink: 0 },
  };

  if (kind === "menstrual") {
    return (
      <PeriodFlowDrops
        flow={periodFlow}
        color={accent}
        size={Math.max(10, size - 1)}
        opacity={opacity}
      />
    );
  }
  if (kind === "follicular") return <Sparkles {...iconProps} />;
  if (kind === "ovulatory") return <Sun {...iconProps} />;
  return <Moon {...iconProps} />;
}
