"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "../../lib/routes";
import { colors, layout, sans } from "./theme";

const navItems: { label: string; icon: string; href: string }[] = [
  { label: "Today", icon: "◷", href: routes.home },
  { label: "Log", icon: "+", href: routes.log },
  { label: "Insights", icon: "↗", href: routes.insights },
  { label: "Profile", icon: "○", href: routes.profile },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        flexShrink: 0,
        backgroundColor: colors.shell,
        borderTop: `1px solid ${colors.border}`,
        padding: "8px 12px calc(10px + env(safe-area-inset-bottom, 0px))",
      }}
      aria-label="Main navigation"
    >
      <div
        style={{
          maxWidth: layout.shellMaxWidth,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "2px",
        }}
      >
        {navItems.map((item) => {
          const active =
            item.href !== null &&
            (item.href === routes.home
              ? pathname === routes.home
              : pathname.startsWith(item.href));

          const content = (
            <>
              <span
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  backgroundColor: active ? colors.blush : "transparent",
                  border: active ? `1px solid ${colors.border}` : "1px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.95rem",
                  color: colors.text,
                }}
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: active ? 600 : 500,
                  color: active ? colors.text : colors.muted,
                }}
              >
                {item.label}
              </span>
            </>
          );

          if (item.href) {
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "3px",
                  padding: "6px 4px",
                  textDecoration: "none",
                  fontFamily: sans,
                }}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={item.label}
              type="button"
              disabled
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                padding: "6px 4px",
                border: "none",
                background: "transparent",
                cursor: "default",
                opacity: 0.5,
                fontFamily: sans,
              }}
            >
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
