"use client";

import { ClipboardCheck, Droplets, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { routes } from "../../lib/routes";
import { LOG_TAB_HREF } from "../log/LogTabNav";
import { colors, sans } from "./theme";

export const QUICK_ADD_ITEMS = [
  {
    id: "meal",
    label: "Log meal",
    href: LOG_TAB_HREF.food,
    icon: Utensils,
    iconColor: "#9A6B58",
    iconBg: "#F5E8E2",
  },
  {
    id: "water",
    label: "Add water",
    href: routes.log,
    icon: Droplets,
    iconColor: "#5F8A9E",
    iconBg: "#E8F2F6",
  },
  {
    id: "check-in",
    label: "Update check-in",
    href: LOG_TAB_HREF["check-in"],
    icon: ClipboardCheck,
    iconColor: "#6E6280",
    iconBg: "#EDE8F2",
  },
] as const;

export function useQuickAdd(options?: { includeMeal?: boolean }) {
  const includeMeal = options?.includeMeal ?? true;
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  function handleNavigate(href: string) {
    close();
    router.push(href);
  }

  function toggle() {
    setOpen((value) => !value);
  }

  return { open, close, toggle, handleNavigate, menuId };
}

interface QuickAddMenuProps {
  menuId: string;
  onNavigate: (href: string) => void;
  align?: "center" | "end";
  includeMeal?: boolean;
}

export function QuickAddMenu({
  menuId,
  onNavigate,
  align = "end",
  includeMeal = true,
}: QuickAddMenuProps) {
  const items = includeMeal
    ? QUICK_ADD_ITEMS
    : QUICK_ADD_ITEMS.filter((item) => item.id !== "meal");

  return (
    <div
      id={menuId}
      role="menu"
      aria-label="Quick add"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-end",
        gap: "10px",
        marginBottom: align === "center" ? "10px" : 0,
        pointerEvents: "auto",
      }}
    >
      {items.map(({ id, label, href, icon: Icon, iconColor, iconBg }, index) => (
        <button
          key={id}
          type="button"
          role="menuitem"
          onClick={() => onNavigate(href)}
          className="quick-add-action"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            height: "38px",
            padding: "0 13px 0 9px",
            borderRadius: "999px",
            border: "1px solid #E6D7CB",
            backgroundColor: "#FFFDFB",
            boxShadow:
              "0 4px 16px rgba(61, 43, 31, 0.08), 0 1px 3px rgba(61, 43, 31, 0.05)",
            cursor: "pointer",
            fontFamily: sans,
            fontSize: "0.78rem",
            fontWeight: 500,
            color: colors.text,
            whiteSpace: "nowrap",
            animationDelay: `${index * 65}ms`,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "7px",
              backgroundColor: iconBg,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={13} strokeWidth={2} color={iconColor} />
          </span>
          {label}
        </button>
      ))}
    </div>
  );
}

export const QUICK_ADD_MOTION =
  "opacity 180ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 180ms ease";

export const QUICK_ADD_MOTION_SPRING =
  "opacity 320ms cubic-bezier(0.34, 1.4, 0.64, 1), transform 320ms cubic-bezier(0.34, 1.4, 0.64, 1), box-shadow 220ms ease";

export const INLINE_LOG_FADE_OUT =
  "opacity 140ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 140ms cubic-bezier(0.2, 0.8, 0.2, 1)";

export const INLINE_LOG_COLLAPSE =
  "max-height 200ms cubic-bezier(0.2, 0.8, 0.2, 1), margin 200ms cubic-bezier(0.2, 0.8, 0.2, 1)";

export const INLINE_LOG_EXPAND =
  "opacity 320ms cubic-bezier(0.34, 1.4, 0.64, 1), transform 320ms cubic-bezier(0.34, 1.4, 0.64, 1), max-height 200ms cubic-bezier(0.2, 0.8, 0.2, 1), margin 200ms cubic-bezier(0.2, 0.8, 0.2, 1)";

export const QUICK_ADD_FAB_FADE_IN =
  "opacity 180ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)";
