import { colors, layout, sans } from "./theme";

const navItems = [
  { label: "Today", icon: "◷", active: true },
  { label: "Log", icon: "+", active: false },
  { label: "Insights", icon: "↗", active: false },
  { label: "Profile", icon: "○", active: false },
];

export function BottomNav() {
  return (
    <nav
      style={{
        flexShrink: 0,
        backgroundColor: colors.shell,
        borderTop: `1px solid ${colors.border}`,
        padding: "8px 12px calc(10px + env(safe-area-inset-bottom, 0px))",
      }}
      aria-label="Main navigation"
    >
      <div
        style={{
          maxWidth: layout.shellMaxWidth,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "2px",
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            disabled
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              padding: "6px 4px",
              border: "none",
              background: "transparent",
              cursor: "default",
              opacity: item.active ? 1 : 0.5,
              fontFamily: sans,
            }}
          >
            <span
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                backgroundColor: item.active ? colors.blush : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.95rem",
                color: colors.text,
              }}
              aria-hidden="true"
            >
              {item.icon}
            </span>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: item.active ? 600 : 500,
                color: item.active ? colors.text : colors.muted,
              }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
