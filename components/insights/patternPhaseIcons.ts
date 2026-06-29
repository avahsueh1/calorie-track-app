import type { LucideIcon } from "lucide-react";
import { Droplet, Leaf, Moon, Sun } from "lucide-react";
import type { PhaseKind } from "./bodyPatternCalendarUtils";
import type { PatternInsightIconStyle } from "./PatternInsightRow";

export const PHASE_INSIGHT_ICONS: Record<
  Exclude<PhaseKind, "none">,
  PatternInsightIconStyle
> = {
  menstrual: {
    icon: Droplet,
    backgroundColor: "#F4DCD5",
    color: "#A86050",
  },
  follicular: {
    icon: Leaf,
    backgroundColor: "#DDEAD8",
    color: "#5A7350",
  },
  ovulatory: {
    icon: Sun,
    backgroundColor: "#F7D7BE",
    color: "#B87A4A",
  },
  luteal: {
    icon: Moon,
    backgroundColor: "#E8E0F0",
    color: "#6E6280",
  },
};

export function getPhaseInsightIcon(
  phaseKind: Exclude<PhaseKind, "none">,
): PatternInsightIconStyle {
  return PHASE_INSIGHT_ICONS[phaseKind];
}
