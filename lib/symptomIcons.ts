import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BatteryLow,
  Brain,
  Cloud,
  CloudLightning,
  CloudRain,
  Cookie,
  Droplets,
  Dumbbell,
  Frown,
  Heart,
  Moon,
  NotebookPen,
  RefreshCw,
  ScanFace,
  Sparkles,
  TrendingDown,
  Utensils,
  Waves,
  Wind,
  Zap,
} from "lucide-react";
import type { SymptomKey } from "../types";
import type { SymptomCategory } from "./checkInHelpers";

export interface SymptomIconStyle {
  icon: LucideIcon;
  backgroundColor: string;
  color: string;
}

const SYMPTOM_ICONS: Record<SymptomKey, SymptomIconStyle> = {
  bloating: { icon: Wind, backgroundColor: "#F3E8D8", color: "#9A8055" },
  cramps: { icon: Waves, backgroundColor: "#F4DCD5", color: "#A86050" },
  breastSoreness: { icon: Heart, backgroundColor: "#F4DCD5", color: "#B86B52" },
  headache: { icon: Brain, backgroundColor: "#E8E0F0", color: "#6E6280" },
  acne: { icon: ScanFace, backgroundColor: "#F7D7BE", color: "#B87A4A" },
  backPain: { icon: Activity, backgroundColor: "#E3EBDD", color: "#6B8570" },
  nausea: { icon: Frown, backgroundColor: "#F3E8D8", color: "#8A7050" },
  discharge: { icon: Droplets, backgroundColor: "#DDEAF8", color: "#5A7A9A" },
  fatigue: { icon: BatteryLow, backgroundColor: "#E3EBDD", color: "#6B8570" },
  anxiety: { icon: CloudLightning, backgroundColor: "#E8E0F0", color: "#6E6280" },
  stress: { icon: Zap, backgroundColor: "#DDE7F6", color: "#6078A0" },
  sadness: { icon: CloudRain, backgroundColor: "#DDEAF8", color: "#5A7A9A" },
  depression: { icon: Cloud, backgroundColor: "#E8E0F0", color: "#6E6280" },
  irritability: { icon: Frown, backgroundColor: "#F4DCD5", color: "#A86050" },
  moodSwings: { icon: RefreshCw, backgroundColor: "#F7D7BE", color: "#B87A4A" },
  lowMotivation: { icon: TrendingDown, backgroundColor: "#F3E8D8", color: "#8A7050" },
  brainFog: { icon: Cloud, backgroundColor: "#E8E0F0", color: "#7A6A90" },
  energy: { icon: Zap, backgroundColor: "#F7D7BE", color: "#B87A4A" },
  sleepQuality: { icon: Moon, backgroundColor: "#DDEAF8", color: "#5A7A9A" },
  appetite: { icon: Utensils, backgroundColor: "#E1EFD9", color: "#5E8A54" },
  exercise: { icon: Dumbbell, backgroundColor: "#DDEAD8", color: "#5A7350" },
  cravings: { icon: Cookie, backgroundColor: "#F4DCD5", color: "#A86050" },
  hydration: { icon: Droplets, backgroundColor: "#DDEAF8", color: "#4D8B7A" },
};

const SECTION_ICONS: Record<SymptomCategory, SymptomIconStyle> = {
  physical: { icon: Heart, backgroundColor: "#F4DCD5", color: "#B86B52" },
  mental: { icon: Brain, backgroundColor: "#E8E0F0", color: "#6E6280" },
  lifestyle: { icon: Sparkles, backgroundColor: "#F7D7BE", color: "#B87A4A" },
};

export function getSymptomIconStyle(key: SymptomKey): SymptomIconStyle {
  return SYMPTOM_ICONS[key];
}

export function getSectionIconStyle(category: SymptomCategory): SymptomIconStyle {
  return SECTION_ICONS[category];
}

export const NOTE_FIELD_ICON: SymptomIconStyle = {
  icon: NotebookPen,
  backgroundColor: "#FAF7F2",
  color: "#744336",
};
