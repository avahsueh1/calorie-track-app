import { profileColors, profileSans } from "./theme";

export function ProfileSavedStatus({ message }: { message: string }) {
  if (!message) {
    return null;
  }

  return (
    <p
      style={{
        margin: 0,
        textAlign: "center",
        fontSize: "0.78rem",
        fontWeight: 600,
        color: profileColors.sage,
        fontFamily: profileSans,
      }}
      role="status"
      aria-live="polite"
    >
      {message}
    </p>
  );
}
