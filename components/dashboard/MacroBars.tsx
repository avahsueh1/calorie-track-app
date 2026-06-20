import type { MacroSummary } from "../../types/wellness";
import { colors, labelStyle, sans } from "./theme";

interface MacroBarsProps {
  macros: MacroSummary[];
}

export function MacroBars({ macros }: MacroBarsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "10px",
        marginTop: "18px",
        paddingTop: "16px",
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      {macros.map((macro) => (
        <div key={macro.label} style={{ textAlign: "center" }}>
          <div
            style={{
              height: "5px",
              backgroundColor: colors.ringTrack,
              borderRadius: "999px",
              overflow: "hidden",
              marginBottom: "7px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${macro.percent}%`,
                backgroundColor: macro.color,
                borderRadius: "999px",
              }}
            />
          </div>
          <p style={{ ...labelStyle(), marginBottom: "3px" }}>{macro.label}</p>
          <p
            style={{
              margin: 0,
              fontSize: "0.82rem",
              fontWeight: 600,
              color: colors.text,
              fontFamily: sans,
            }}
          >
            {macro.grams}g
          </p>
        </div>
      ))}
    </div>
  );
}
