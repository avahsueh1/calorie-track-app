"use client";

import type { CSSProperties, ReactNode } from "react";
import { BottomNav } from "../dashboard/BottomNav";
import { mainContentStyle, pageOuterStyle, shellStyle } from "../../lib/theme";

interface AppShellProps {
  children: ReactNode;
  mainStyle?: CSSProperties;
}

/** Centered mobile app frame: outer → shell → main → bottom nav. */
export function AppShell({ children, mainStyle }: AppShellProps) {
  return (
    <div style={pageOuterStyle()}>
      <div style={shellStyle()}>
        <main style={mainContentStyle(mainStyle)}>{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
