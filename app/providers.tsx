"use client";

import type { ReactNode } from "react";
import { AppStateProvider } from "../components/providers/AppStateProvider";

export function Providers({ children }: { children: ReactNode }) {
  return <AppStateProvider>{children}</AppStateProvider>;
}
