"use client";

import { Plus } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  QUICK_ADD_FAB_FADE_IN,
  QUICK_ADD_MOTION,
  QuickAddMenu,
  useQuickAdd,
} from "./quickAddMenu";
import { layout } from "./theme";

const FAB_SIZE = 52;
const FAB_COLOR = "#C58E7C";

function useFabNearBottom() {
  const [nearBottom, setNearBottom] = useState(false);

  useEffect(() => {
    function evaluate() {
      const scrollBottom =
        document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      setNearBottom(scrollBottom <= 2);
    }

    window.addEventListener("scroll", evaluate, { passive: true });
    window.addEventListener("resize", evaluate);
    evaluate();

    return () => {
      window.removeEventListener("scroll", evaluate);
      window.removeEventListener("resize", evaluate);
    };
  }, []);

  return nearBottom;
}

interface QuickAddFabProps {
  visible?: boolean;
  open?: boolean;
  onToggle?: () => void;
  onNavigate?: (href: string) => void;
  onClose?: () => void;
  menuId?: string;
}

export function QuickAddFab({
  visible = true,
  open: controlledOpen,
  onToggle,
  onNavigate,
  onClose,
  menuId: controlledMenuId,
}: QuickAddFabProps) {
  const internal = useQuickAdd();
  const open = controlledOpen ?? internal.open;
  const menuId = controlledMenuId ?? internal.menuId;
  const toggle = onToggle ?? internal.toggle;
  const handleNavigate = onNavigate ?? internal.handleNavigate;
  const close = onClose ?? internal.close;

  const [tucked, setTucked] = useState(false);
  const [pressing, setPressing] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const scrollRaf = useRef<number | null>(null);
  const nearBottom = useFabNearBottom();

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (rootRef.current && !rootRef.current.contains(target)) {
        close();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [open, close]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function handleScroll() {
      if (scrollRaf.current !== null) {
        return;
      }

      scrollRaf.current = window.requestAnimationFrame(() => {
        scrollRaf.current = null;
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        if (currentY < 24) {
          setTucked(false);
        } else if (delta > 6) {
          setTucked(true);
        } else if (delta < -6) {
          setTucked(false);
        }

        lastScrollY.current = currentY;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollRaf.current !== null) {
        window.cancelAnimationFrame(scrollRaf.current);
      }
    };
  }, []);

  const handleFabClick = useCallback(() => {
    setPressing(true);
    window.setTimeout(() => {
      setPressing(false);
      toggle();
    }, 90);
  }, [toggle]);

  const hiddenNearBottom = nearBottom && visible;
  const displayOpacity = visible
    ? hiddenNearBottom
      ? 0
      : tucked
        ? 0.85
        : 1
    : 0;
  const displayScale = visible
    ? hiddenNearBottom
      ? 0.9
      : (tucked ? 0.88 : 1) * (pressing ? 0.94 : 1)
    : 0.88;
  const scrollOffset = hiddenNearBottom ? 8 : tucked ? 10 : 0;
  const fabInteractive = visible && !hiddenNearBottom;

  useEffect(() => {
    if (hiddenNearBottom && open) {
      close();
    }
  }, [hiddenNearBottom, open, close]);

  return (
    <div
      ref={rootRef}
      className={hiddenNearBottom ? "quick-add-fab is-near-bottom" : "quick-add-fab"}
      style={{
        position: "fixed",
        bottom: "calc(72px + 32px + env(safe-area-inset-bottom, 0px))",
        left: 0,
        right: 0,
        maxWidth: layout.shellMaxWidth,
        margin: "0 auto",
        paddingRight: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "10px",
        zIndex: 40,
        pointerEvents: "none",
        opacity: displayOpacity,
        transform: `translateY(${scrollOffset}px) scale(${displayScale})`,
        transition:
          visible && !tucked && !hiddenNearBottom
            ? QUICK_ADD_FAB_FADE_IN
            : QUICK_ADD_MOTION,
        transformOrigin: "bottom right",
      }}
    >
      {open && fabInteractive ? (
        <QuickAddMenu menuId={menuId} onNavigate={handleNavigate} align="end" />
      ) : null}

      <button
        type="button"
        className={
          open || tucked || pressing || !visible || hiddenNearBottom
            ? undefined
            : "quick-add-fab-breath"
        }
        aria-label={open ? "Close quick add menu" : "Open quick add menu"}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? menuId : undefined}
        aria-hidden={!fabInteractive}
        onPointerDown={() => setPressing(true)}
        onPointerUp={() => window.setTimeout(() => setPressing(false), 120)}
        onPointerLeave={() => setPressing(false)}
        onClick={handleFabClick}
        style={{
          pointerEvents: fabInteractive ? "auto" : "none",
          width: `${FAB_SIZE}px`,
          height: `${FAB_SIZE}px`,
          borderRadius: "50%",
          border: "1px solid rgba(255, 251, 247, 0.5)",
          backgroundColor: FAB_COLOR,
          color: "#FFFFFF",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: fabInteractive ? "pointer" : "default",
          boxShadow: open
            ? "0 6px 20px rgba(212, 154, 134, 0.32), 0 2px 5px rgba(39, 32, 24, 0.06)"
            : "0 5px 16px rgba(212, 154, 134, 0.26), 0 1px 4px rgba(39, 32, 24, 0.05)",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          <Plus size={22} strokeWidth={2.2} />
        </span>
      </button>

      <style jsx global>{`
        @keyframes quickAddActionRise {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.94);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes quickAddFabBreath {
          0%,
          21.5%,
          100% {
            transform: scale(1);
          }
          10.75% {
            transform: scale(1.03);
          }
        }

        .quick-add-action {
          animation: quickAddActionRise 260ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .quick-add-fab-breath {
          animation: quickAddFabBreath 6.5s ease-in-out infinite;
        }

        .quick-add-fab.is-near-bottom {
          opacity: 0;
          transform: scale(0.9) translateY(8px);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

export function BottomNavQuickAddFab() {
  return <QuickAddFab visible />;
}
