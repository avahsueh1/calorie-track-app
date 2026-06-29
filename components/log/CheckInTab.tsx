"use client";

import { useCheckIn } from "../providers/CheckInProvider";
import type { DailyCheckIn } from "../../types";
import { colors, sans, sectionTitleStyle } from "../dashboard/theme";
import { AppCard } from "../ui/primitives";
import { SymptomLogger } from "./SymptomLogger";

export function CheckInTab() {
  const { checkIn, updateCheckIn } = useCheckIn();

  function handleSave(next: DailyCheckIn) {
    updateCheckIn({
      symptoms: next.symptoms,
      notes: next.notes ?? "",
    });
  }

  return (
    <AppCard padding="compact">
      <h2 style={{ ...sectionTitleStyle(), marginBottom: "6px" }}>Body check-in</h2>
      <p
        style={{
          margin: "0 0 14px",
          fontSize: "0.78rem",
          color: colors.muted,
          fontFamily: sans,
          lineHeight: 1.45,
        }}
      >
        Tap only what applies today. Severity is optional once selected.
      </p>

      <SymptomLogger saved={checkIn} onSave={handleSave} />
    </AppCard>
  );
}
