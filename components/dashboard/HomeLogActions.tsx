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
const HOME_SECTION_GAP = 18;
const INLINE_BUTTON_HEIGHT = 47;
const INLINE_BLOCK_MAX_HEIGHT = 120;

function useShowFloatingFab(scrollAnchorRef: RefObject<HTMLDivElement | null>) {
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    function evaluate() {
      const anchor = scrollAnchorRef.current;
      if (!anchor) {
        return;
      }

      const anchorRect = anchor.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const anchorPastThird = anchorRect.bottom < viewportHeight / 3;

      const inlineBlockBottom =
        anchorRect.bottom + HOME_SECTION_GAP + INLINE_BUTTON_HEIGHT;
      const inlineMostlyScrolledAway = inlineBlockBottom < viewportHeight * 0.28;

      setShowFloating(anchorPastThird || inlineMostlyScrolledAway);
    }

    window.addEventListener("scroll", evaluate, { passive: true });
    window.addEventListener("resize", evaluate);
    evaluate();

    return () => {
      window.removeEventListener("scroll", evaluate);
      window.removeEventListener("resize", evaluate);
    };
  }, [scrollAnchorRef]);

  return showFloating;
}

interface HomeLogActionsProps {
  scrollAnchorRef: RefObject<HTMLDivElement | null>;
  showFoodLogPrompts?: boolean;
}

export function HomeLogActions({
  scrollAnchorRef,
  showFoodLogPrompts = true,
}: HomeLogActionsProps) {
  const centerButtonRef = useRef<HTMLButtonElement>(null);
  const showFloating = useShowFloatingFab(scrollAnchorRef);
  const quickAdd = useQuickAdd({ includeMeal: showFoodLogPrompts });
  const { close } = quickAdd;

  useEffect(() => {
    close();
  }, [showFloating, close]);

  const inlineHidden = showFloating;
  const buttonLabel = showFoodLogPrompts ? "Log meal" : "Quick log";

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
            includeMeal={showFoodLogPrompts}
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
          {buttonLabel}
        </button>
      </div>

      <QuickAddFab
        visible={showFloating}
        open={quickAdd.open}
        onToggle={quickAdd.toggle}
        onNavigate={quickAdd.handleNavigate}
        onClose={quickAdd.close}
        menuId={quickAdd.menuId}
        includeMeal={showFoodLogPrompts}
      />
    </>
  );
}
