"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { QuickAddFab } from "./QuickAddFab";
import {
  INLINE_LOG_COLLAPSE,
  INLINE_LOG_EXPAND,
  INLINE_LOG_FADE_OUT,
  QuickAddMenu,
  useQuickAdd,
} from "./quickAddMenu";
import { sans } from "./theme";

const CENTER_BUTTON_COLOR = "#C58E7C";
const HOME_SECTION_GAP = 14;
const INLINE_BUTTON_HEIGHT = 47;
const INLINE_BLOCK_MAX_HEIGHT = 120;

function useShowFloatingFab(calorieCardRef: RefObject<HTMLElement | null>) {
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    function evaluate() {
      const card = calorieCardRef.current;
      if (!card) {
        return;
      }

      const cardRect = card.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const cardPastThird = cardRect.bottom < viewportHeight / 3;

      const inlineBlockBottom =
        cardRect.bottom + HOME_SECTION_GAP + INLINE_BUTTON_HEIGHT;
      const inlineMostlyScrolledAway = inlineBlockBottom < viewportHeight * 0.28;

      setShowFloating(cardPastThird || inlineMostlyScrolledAway);
    }

    window.addEventListener("scroll", evaluate, { passive: true });
    window.addEventListener("resize", evaluate);
    evaluate();

    return () => {
      window.removeEventListener("scroll", evaluate);
      window.removeEventListener("resize", evaluate);
    };
  }, [calorieCardRef]);

  return showFloating;
}

interface HomeLogActionsProps {
  calorieCardRef: RefObject<HTMLElement | null>;
}

export function HomeLogActions({ calorieCardRef }: HomeLogActionsProps) {
  const centerButtonRef = useRef<HTMLButtonElement>(null);
  const showFloating = useShowFloatingFab(calorieCardRef);
  const quickAdd = useQuickAdd();
  const { close } = quickAdd;

  useEffect(() => {
    close();
  }, [showFloating, close]);

  const inlineHidden = showFloating;

  return (
    <>
      <div
        aria-hidden={inlineHidden}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: 0,
          maxHeight: inlineHidden ? 0 : INLINE_BLOCK_MAX_HEIGHT,
          overflow: "hidden",
          opacity: inlineHidden ? 0 : 1,
          transform: inlineHidden ? "scale(0.94)" : "scale(1)",
          transition: inlineHidden
            ? `${INLINE_LOG_FADE_OUT}, ${INLINE_LOG_COLLAPSE}`
            : INLINE_LOG_EXPAND,
          pointerEvents: inlineHidden ? "none" : "auto",
        }}
      >
        {quickAdd.open && !inlineHidden ? (
          <QuickAddMenu
            menuId={quickAdd.menuId}
            onNavigate={quickAdd.handleNavigate}
            align="center"
          />
        ) : null}

        <button
          ref={centerButtonRef}
          type="button"
          aria-label="Open quick add menu"
          aria-expanded={quickAdd.open && !inlineHidden}
          aria-haspopup="menu"
          aria-controls={quickAdd.open && !inlineHidden ? quickAdd.menuId : undefined}
          onClick={quickAdd.toggle}
          tabIndex={inlineHidden ? -1 : 0}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            width: "190px",
            height: `${INLINE_BUTTON_HEIGHT}px`,
            flexShrink: 0,
            borderRadius: "999px",
            border: "1px solid rgba(255, 251, 247, 0.45)",
            backgroundColor: CENTER_BUTTON_COLOR,
            color: "#FFFBF7",
            fontFamily: sans,
            fontSize: "1rem",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            cursor: "pointer",
            boxShadow: "0 3px 10px rgba(150, 95, 70, 0.1)",
          }}
        >
          <span aria-hidden="true" style={{ fontSize: "1rem", lineHeight: 1 }}>
            +
          </span>
          Log meal
        </button>
      </div>

      <QuickAddFab
        visible={showFloating}
        open={quickAdd.open}
        onToggle={quickAdd.toggle}
        onNavigate={quickAdd.handleNavigate}
        onClose={quickAdd.close}
        menuId={quickAdd.menuId}
      />
    </>
  );
}
