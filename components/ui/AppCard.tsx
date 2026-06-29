import type { CSSProperties, ReactNode } from "react";
import { cardStyle, colors, layout } from "../../lib/theme";

export type AppCardPadding = "compact" | "standard" | "large";

const cardPaddingBySize: Record<AppCardPadding, string> = {
  compact: layout.cardPaddingCompact,
  standard: layout.cardPadding,
  large: layout.cardPaddingLarge,
};

export type AppCardVariant = "default" | "soft" | "callout";

const variantStyles: Record<AppCardVariant, CSSProperties> = {
  default: {},
  soft: {
    backgroundColor: colors.shell,
    borderColor: colors.border,
  },
  callout: {
    backgroundColor: colors.terracottaPale,
    borderColor: colors.terracottaLight,
  },
};

export function AppCard({
  children,
  variant = "default",
  style,
  padding = "standard",
  shadow = false,
}: {
  children: ReactNode;
  variant?: AppCardVariant;
  style?: CSSProperties;
  padding?: AppCardPadding | string | number;
  shadow?: boolean;
}) {
  const resolvedPadding =
    typeof padding === "string" && padding in cardPaddingBySize
      ? cardPaddingBySize[padding as AppCardPadding]
      : padding;

  return (
    <section
      style={{
        ...cardStyle(),
        padding: resolvedPadding ?? layout.cardPadding,
        boxShadow: shadow ? "0 2px 16px rgba(60, 43, 36, 0.04)" : undefined,
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </section>
  );
}
