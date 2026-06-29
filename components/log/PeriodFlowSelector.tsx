"use client";

import type { PeriodFlow } from "../../types/wellness";
import { FlowLevelDrop } from "../shared/PeriodFlowDrops";
import { colors, labelStyle, sans } from "../dashboard/theme";

const flowLevels: { value: PeriodFlow; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "medium", label: "Medium" },
  { value: "heavy", label: "Heavy" },
];

interface PeriodFlowSelectorProps {
  value: PeriodFlow | "";
  onChange: (value: PeriodFlow | "") => void;
}

export function PeriodFlowSelector({ value, onChange }: PeriodFlowSelectorProps) {
  return (
    <fieldset style={{ margin: 0, padding: 0, border: "none" }}>
      <legend style={{ ...labelStyle(), marginBottom: "8px" }}>
        Flow (optional)
      </legend>
      <div
        role="radiogroup"
        aria-label="Period flow"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "8px",
        }}
      >
        {flowLevels.map((level) => {
          const selected = value === level.value;

          return (
            <button
              key={level.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(selected ? "" : level.value)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                minHeight: "72px",
                padding: "10px 6px",
                borderRadius: "16px",
                border: selected
                  ? `2px solid ${colors.terracotta}`
                  : `1px solid ${colors.border}`,
                backgroundColor: selected ? colors.terracottaPale : colors.shell,
                cursor: "pointer",
                boxShadow: selected
                  ? "0 2px 8px rgba(184, 107, 82, 0.12)"
                  : "none",
                transition:
                  "border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease",
              }}
            >
              <FlowLevelDrop level={level.value} selected={selected} />
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: selected ? 600 : 500,
                  color: selected ? colors.terracotta : colors.muted,
                  fontFamily: sans,
                  lineHeight: 1.2,
                }}
              >
                {level.label}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
