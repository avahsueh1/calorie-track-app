import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

const ICON_STROKE = 1.5;
const ICON_OPACITY = 0.88;

const sizeMap = {
  sm: 28,
  md: 34,
  lg: 38,
} as const;

export type IconBubbleSize = keyof typeof sizeMap | number;

function resolveSize(size: IconBubbleSize): number {
  return typeof size === "number" ? size : sizeMap[size];
}

export function IconBubble({
  icon: Icon,
  children,
  color,
  backgroundColor,
  size = "md",
  style,
}: {
  icon?: LucideIcon;
  children?: ReactNode;
  color: string;
  backgroundColor: string;
  size?: IconBubbleSize;
  style?: CSSProperties;
}) {
  const dimension = resolveSize(size);
  const iconSize = Math.round(dimension * 0.42);

  return (
    <span
      style={{
        width: dimension,
        height: dimension,
        borderRadius: "50%",
        backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color,
        fontSize: dimension >= 36 ? "0.85rem" : undefined,
        lineHeight: 1,
        ...style,
      }}
      aria-hidden
    >
      {Icon ? (
        <Icon
          size={iconSize}
          strokeWidth={ICON_STROKE}
          color={color}
          style={{ opacity: ICON_OPACITY }}
        />
      ) : (
        children
      )}
    </span>
  );
}
