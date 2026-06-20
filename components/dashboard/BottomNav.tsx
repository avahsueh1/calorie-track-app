"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { colors, layout, sans } from "./theme";

const navItems = [
  { label: "Today", icon: "◷", href: "/" },
  { label: "Log", icon: "+", href: "/log" },
  { label: "Insights", icon: "↗", href: "/insights" },
  { label: "Profile", icon: "○", href: "/profile" },
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
            (item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href));

          const content = (
            <>
              <span
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  backgroundColor: active ? colors.blush : "transparent",
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
