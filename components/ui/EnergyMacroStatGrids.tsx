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
import { colors, formatNumber, sans, serif } from "../../lib/theme";
import {
  StatTile,
  StatTileGrid,
  StatTileSectionLabel,
  calorieStatThemes,
  macroStatThemes,
  type StatTileSize,
  type StatTileVariant,
} from "./StatTile";

const MACRO_ICONS: Record<MacroColorKey, LucideIcon> = {
  protein: Beef,
  carbs: Wheat,
  fat: Droplet,
  fiber: Leaf,
};

const MACRO_TRACK_COLORS: Record<MacroColorKey, string> = {
  protein: "#EDE4DF",
  carbs: "#E3ECE3",
  fat: "#EBE5D8",
  fiber: "#DCE9E3",
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
  variant = "row",
  showLabel = true,
}: {
  summary: CalorieStatSummary;
  formatValue?: (value: number) => string;
  tileSize?: StatTileSize;
  variant?: StatTileVariant;
  showLabel?: boolean;
}) {
  const supporting = variant === "supporting";

  return (
    <>
      {showLabel ? (
        <StatTileSectionLabel quiet={supporting}>Calories</StatTileSectionLabel>
      ) : null}
      <StatTileGrid
        gap={supporting ? "8px" : "10px 12px"}
        supporting={supporting}
      >
        <StatTile
          size={tileSize}
          variant={variant}
          label="Eaten"
          value={formatValue(summary.eaten)}
          icon={Utensils}
          {...calorieStatThemes.eaten}
        />
        <StatTile
          size={tileSize}
          variant={variant}
          label="Burned"
          value={formatValue(summary.burned)}
          icon={Flame}
          {...calorieStatThemes.burned}
        />
        <StatTile
          size={tileSize}
          variant={variant}
          label="Target"
          value={formatValue(summary.target)}
          icon={Target}
          {...calorieStatThemes.target}
        />
        <StatTile
          size={tileSize}
          variant={variant}
          label="Left"
          value={formatValue(summary.remaining)}
          icon={CircleGauge}
          {...calorieStatThemes.left}
        />
      </StatTileGrid>
    </>
  );
}

function MacroStripItem({ macro }: { macro: MacroSummary }) {
  const theme = macroStatThemes[macro.colorKey];
  const Icon = MACRO_ICONS[macro.colorKey];
  const progress =
    macro.targetGrams > 0
      ? Math.min(macro.grams / macro.targetGrams, 1)
      : 0;

  return (
    <div
      className="macro-mini"
      style={{
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Icon
        className="macro-icon"
        size={24}
        strokeWidth={1.5}
        color={theme.iconColor}
        aria-hidden
        style={{
          width: "24px",
          height: "24px",
          marginBottom: "6px",
          opacity: 0.78,
        }}
      />
      <p
        className="macro-label"
        style={{
          margin: 0,
          fontSize: "13px",
          fontWeight: 500,
          color: "#5F514A",
          lineHeight: 1.2,
          fontFamily: sans,
        }}
      >
        {macro.label}
      </p>
      <p
        className="macro-value"
        style={{
          margin: "6px 0 0",
          lineHeight: 1.1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span
          style={{
            fontFamily: serif,
            fontSize: "20px",
            fontWeight: 500,
            color: colors.text,
            letterSpacing: "-0.02em",
          }}
        >
          {macro.grams}
        </span>
        <span
          style={{
            fontFamily: sans,
            fontSize: "13px",
            fontWeight: 400,
            color: "#6F625A",
          }}
        >
          {" "}
          / {macro.targetGrams}g
        </span>
      </p>
      <div
        className="macro-bar"
        aria-hidden
        style={{
          width: "100%",
          maxWidth: "78px",
          height: "4px",
          borderRadius: "999px",
          marginTop: "8px",
          backgroundColor: MACRO_TRACK_COLORS[macro.colorKey],
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            borderRadius: "999px",
            backgroundColor: theme.iconColor,
            opacity: 0.72,
            transition: "width 0.25s ease",
          }}
        />
      </div>
    </div>
  );
}

export function MacroStrip({
  macros,
  showLabel = true,
}: {
  macros: MacroSummary[];
  showLabel?: boolean;
}) {
  return (
    <div style={{ paddingBottom: "18px" }}>
      {showLabel ? <StatTileSectionLabel>Macros</StatTileSectionLabel> : null}
      <div
        className="macro-strip"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          columnGap: "20px",
          marginTop: showLabel ? 0 : undefined,
          width: "100%",
        }}
      >
        {macros.map((macro) => (
          <MacroStripItem key={macro.label} macro={macro} />
        ))}
      </div>
    </div>
  );
}

export function MacroStatGrid({
  macros,
  variant = "row",
}: {
  macros: MacroSummary[];
  variant?: StatTileVariant;
}) {
  const supporting = variant === "supporting";

  return (
    <>
      <StatTileSectionLabel quiet={supporting}>Macros</StatTileSectionLabel>
      <StatTileGrid gap="8px" supporting={supporting}>
        {macros.map((macro) => {
          const theme = macroStatThemes[macro.colorKey];
          const Icon = MACRO_ICONS[macro.colorKey];

          return (
            <StatTile
              key={macro.label}
              variant={variant}
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
