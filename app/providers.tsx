"use client";

import type { ReactNode } from "react";
import { CheckInProvider } from "../components/providers/CheckInProvider";

export function Providers({ children }: { children: ReactNode }) {
  return <CheckInProvider>{children}</CheckInProvider>;
}
