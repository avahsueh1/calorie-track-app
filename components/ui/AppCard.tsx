import type { CSSProperties, ReactNode } from "react";
import { cardStyle, colors, layout } from "../../lib/theme";

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
  padding,
  shadow = false,
}: {
  children: ReactNode;
  variant?: AppCardVariant;
  style?: CSSProperties;
  padding?: string | number;
  shadow?: boolean;
}) {
  return (
    <section
      style={{
        ...cardStyle(),
        padding: padding ?? layout.cardPadding,
        boxShadow: shadow ? "0 2px 16px rgba(60, 43, 36, 0.04)" : undefined,
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </section>
  );
}
