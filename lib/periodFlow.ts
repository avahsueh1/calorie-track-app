import type { PeriodFlow } from "../types/wellness";

export type PeriodFlowFillLevel = "empty" | "half" | "full";

export function periodFlowFillLevel(flow?: PeriodFlow): PeriodFlowFillLevel {
  if (flow === "heavy") {
    return "full";
  }

  if (flow === "medium") {
    return "half";
  }

  return "empty";
}

export function periodFlowToFillLevel(flow: PeriodFlow): PeriodFlowFillLevel {
  return periodFlowFillLevel(flow);
}
