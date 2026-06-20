import { profileColors, profileHelperStyle, profileSerif } from "./theme";

export function ProfileHeader() {
  return (
    <header>
      <h1
        style={{
          margin: "0 0 6px",
          fontFamily: profileSerif,
          fontSize: "1.75rem",
          fontWeight: 400,
          color: profileColors.text,
          letterSpacing: "-0.02em",
        }}
      >
        Profile
      </h1>
      <p style={profileHelperStyle()}>
        Manage your body settings, goals, and preferences.
      </p>
    </header>
  );
}
