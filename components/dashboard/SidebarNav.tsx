"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "../../lib/routes";
import { colors, layout, sans, serif } from "./theme";

const navItems: { label: string; icon: string; href: string }[] = [
  { label: "Today", icon: "◷", href: routes.home },
  { label: "Log", icon: "+", href: routes.log },
  { label: "Insights", icon: "↗", href: routes.insights },
  { label: "Profile", icon: "○", href: routes.profile },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside
      className="app-sidebar"
      style={{
        flexShrink: 0,
        width: layout.sidebarWidth,
        backgroundColor: colors.card,
        borderRight: `1px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        padding: "28px 16px",
      }}
      aria-label="Main navigation"
    >
      <div style={{ padding: "0 12px 28px" }}>
        <p
          style={{
            margin: 0,
            fontFamily: serif,
            fontSize: "1.35rem",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: colors.text,
            lineHeight: 1.2,
          }}
        >
          Nourish
        </p>
        <p
          style={{
            margin: "4px 0 0",
            fontFamily: sans,
            fontSize: "0.72rem",
            fontWeight: 500,
            color: colors.muted,
            letterSpacing: "0.04em",
          }}
        >
          Calorie & wellness tracker
        </p>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {navItems.map((item) => {
          const active =
            item.href !== null &&
            (item.href === routes.home
              ? pathname === routes.home
              : pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={active ? "sidebar-nav-link is-active" : "sidebar-nav-link"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "11px 14px",
                borderRadius: "14px",
                textDecoration: "none",
                fontFamily: sans,
                backgroundColor: active ? colors.terracottaPale : "transparent",
                border: active ? `1px solid ${colors.terracottaLight}` : "1px solid transparent",
                color: active ? colors.text : colors.muted,
                transition: "background-color 150ms ease, border-color 150ms ease",
              }}
            >
              <span
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  backgroundColor: active ? colors.blush : colors.bg,
                  border: `1px solid ${active ? colors.border : "transparent"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span
                style={{
                  fontSize: "0.88rem",
                  fontWeight: active ? 600 : 500,
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
