import { useId } from "react";
import type { PeriodFlow } from "../../types/wellness";
import { periodFlowFillLevel, type PeriodFlowFillLevel } from "../../lib/periodFlow";
import { colors } from "../dashboard/theme";

const DROP_PATH =
  "M6 1.2C6 1.2 2.4 6.4 2.4 9.3a3.6 3.6 0 0 0 7.2 0C9.6 6.4 6 1.2 6 1.2z";

export function BloodDrop({
  fillLevel = "empty",
  fillColor,
  strokeColor,
  size = 11,
}: {
  fillLevel?: PeriodFlowFillLevel;
  fillColor: string;
  strokeColor?: string;
  size?: number;
}) {
  const clipId = useId();
  const stroke = strokeColor ?? fillColor;

  return (
    <svg
      width={size}
      height={size * 1.22}
      viewBox="0 0 12 14"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      {fillLevel === "half" ? (
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="7.1" width="12" height="6.9" />
          </clipPath>
        </defs>
      ) : null}
      <path
        d={DROP_PATH}
        fill={fillLevel === "full" ? fillColor : "transparent"}
        stroke={stroke}
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      {fillLevel === "half" ? (
        <path
          d={DROP_PATH}
          fill={fillColor}
          stroke="none"
          clipPath={`url(#${clipId})`}
        />
      ) : null}
    </svg>
  );
}

interface PeriodFlowDropsProps {
  flow?: PeriodFlow;
  color?: string;
  size?: number;
  opacity?: number;
}

export function PeriodFlowDrops({
  flow,
  color = "#8F4E43",
  size = 13,
  opacity = 0.68,
}: PeriodFlowDropsProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        flexShrink: 0,
      }}
    >
      <BloodDrop
        fillLevel={periodFlowFillLevel(flow)}
        fillColor={color}
        strokeColor={color}
        size={size}
      />
    </span>
  );
}

export const periodFlowSelectorColors: Record<
  PeriodFlow,
  { fill: string; stroke: string }
> = {
  light: { fill: colors.terracottaPale, stroke: colors.terracottaLight },
  medium: { fill: colors.terracottaLight, stroke: colors.terracotta },
  heavy: { fill: colors.terracotta, stroke: colors.terracotta },
};

export function FlowLevelDrop({
  level,
  selected,
}: {
  level: PeriodFlow;
  selected: boolean;
}) {
  const palette = periodFlowSelectorColors[level];
  const fillColor = selected ? palette.fill : colors.terracottaLight;
  const strokeColor = selected ? palette.stroke : colors.terracottaLight;
  const fillLevel = selected ? periodFlowFillLevel(level) : "empty";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "18px",
      }}
    >
      <BloodDrop
        fillLevel={fillLevel}
        fillColor={fillColor}
        strokeColor={strokeColor}
        size={12}
      />
    </span>
  );
}
