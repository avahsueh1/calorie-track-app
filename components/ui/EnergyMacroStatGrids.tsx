import {
  Beef,
  CircleGauge,
  Droplet,
  Flame,
  Leaf,
  Target,
  Utensils,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import type { MacroColorKey, MacroSummary } from "../../types/wellness";
import { formatNumber } from "../../lib/theme";
import {
  StatTile,
  StatTileGrid,
  StatTileSectionLabel,
  calorieStatThemes,
  macroStatThemes,
  type StatTileSize,
} from "./StatTile";

const MACRO_ICONS: Record<MacroColorKey, LucideIcon> = {
  protein: Beef,
  carbs: Wheat,
  fat: Droplet,
  fiber: Leaf,
};

export interface CalorieStatSummary {
  eaten: number;
  burned: number;
  target: number;
  remaining: number;
}

export function CalorieStatGrid({
  summary,
  formatValue = formatNumber,
  tileSize = "default",
}: {
  summary: CalorieStatSummary;
  formatValue?: (value: number) => string;
  tileSize?: StatTileSize;
}) {
  return (
    <>
      <StatTileSectionLabel>Calories</StatTileSectionLabel>
      <StatTileGrid gap="9px">
        <StatTile
          size={tileSize}
          label="Eaten"
          value={formatValue(summary.eaten)}
          icon={Utensils}
          {...calorieStatThemes.eaten}
        />
        <StatTile
          size={tileSize}
          label="Burned"
          value={formatValue(summary.burned)}
          icon={Flame}
          {...calorieStatThemes.burned}
        />
        <StatTile
          size={tileSize}
          label="Target"
          value={formatValue(summary.target)}
          icon={Target}
          {...calorieStatThemes.target}
        />
        <StatTile
          size={tileSize}
          label="Left"
          value={formatValue(summary.remaining)}
          icon={CircleGauge}
          {...calorieStatThemes.left}
        />
      </StatTileGrid>
    </>
  );
}

export function MacroStatGrid({ macros }: { macros: MacroSummary[] }) {
  return (
    <>
      <StatTileSectionLabel>Macros</StatTileSectionLabel>
      <StatTileGrid gap="8px">
        {macros.map((macro) => {
          const theme = macroStatThemes[macro.colorKey];
          const Icon = MACRO_ICONS[macro.colorKey];

          return (
            <StatTile
              key={macro.label}
              label={macro.label}
              value={`${macro.grams}g`}
              subValue={`/ ${macro.targetGrams}g`}
              icon={Icon}
              {...theme}
            />
          );
        })}
      </StatTileGrid>
    </>
  );
}
