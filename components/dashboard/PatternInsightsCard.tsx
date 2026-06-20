import { cardStyle, colors, sans, sectionTitleStyle } from "./theme";

interface PatternInsightsCardProps {
  message: string;
}

export function PatternInsightsCard({ message }: PatternInsightsCardProps) {
  return (
    <section
      style={{
        ...cardStyle(),
        padding: "16px",
        backgroundColor: colors.lavenderPale,
        borderColor: `${colors.lavender}55`,
      }}
    >
      <h2 style={{ ...sectionTitleStyle(), marginBottom: "8px" }}>
        Pattern insights
      </h2>
      <p
        style={{
          margin: 0,
          fontSize: "0.82rem",
          lineHeight: 1.55,
          color: colors.muted,
          fontFamily: sans,
        }}
      >
        {message}
      </p>
    </section>
  );
}
