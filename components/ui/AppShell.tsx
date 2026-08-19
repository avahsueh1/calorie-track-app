"use client";

import type { CSSProperties, ReactNode } from "react";
import { SidebarNav } from "../dashboard/SidebarNav";
import { mainContentStyle } from "../../lib/theme";

interface AppShellProps {
  children: ReactNode;
  mainStyle?: CSSProperties;
}

/** Web app shell: fixed sidebar + scrollable main content area. */
export function AppShell({ children, mainStyle }: AppShellProps) {
  return (
    <div className="app-shell">
      <SidebarNav />
      <div className="app-content">
        <main className="app-main" style={mainContentStyle(mainStyle)}>
          {children}
        </main>
      </div>
    </div>
  );
}
