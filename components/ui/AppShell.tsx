"use client";

import type { CSSProperties, ReactNode } from "react";
import { BottomNav } from "../dashboard/BottomNav";
import { layout, mainContentStyle, pageOuterStyle, shellStyle } from "../../lib/theme";

interface AppShellProps {
  children: ReactNode;
  mainStyle?: CSSProperties;
}

function shellMainPaddingBottom() {
  return `calc(${layout.navClearance} + env(safe-area-inset-bottom, 0px))`;
}

/** Centered mobile app frame: outer → shell → main → bottom nav. */
export function AppShell({ children, mainStyle }: AppShellProps) {
  return (
    <div style={pageOuterStyle()}>
      <div style={shellStyle()}>
        <main
          style={mainContentStyle({
            ...mainStyle,
            paddingBottom: shellMainPaddingBottom(),
          })}
        >
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
