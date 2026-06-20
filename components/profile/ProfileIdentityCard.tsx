"use client";

import {
  profileCardStyle,
  profileColors,
  profileSans,
  profileSerif,
} from "./theme";
import { profileCardPadding, profileSecondaryButtonStyle } from "./shared";

interface ProfileIdentityCardProps {
  name: string;
  email: string;
  initials: string;
  onEditProfile: () => void;
}

export function ProfileIdentityCard({
  name,
  email,
  initials,
  onEditProfile,
}: ProfileIdentityCardProps) {
  return (
    <section style={{ ...profileCardStyle(), ...profileCardPadding() }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            backgroundColor: profileColors.lavender,
            border: `2px solid ${profileColors.blushBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: profileSerif,
            fontSize: "1.35rem",
            color: profileColors.terracottaDark,
            letterSpacing: "0.04em",
          }}
          aria-hidden="true"
        >
          {initials}
        </div>

        <div>
          <h2
            style={{
              margin: "0 0 4px",
              fontFamily: profileSerif,
              fontSize: "1.35rem",
              fontWeight: 400,
              color: profileColors.text,
              letterSpacing: "-0.02em",
            }}
          >
            {name}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "0.82rem",
              color: profileColors.textSecondary,
              fontFamily: profileSans,
            }}
          >
            {email}
          </p>
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "0.68rem",
            fontWeight: 600,
            color: profileColors.sage,
            backgroundColor: profileColors.sageBg,
            padding: "5px 12px",
            borderRadius: "999px",
            fontFamily: profileSans,
          }}
        >
          Private
        </span>

        <button type="button" style={profileSecondaryButtonStyle()} onClick={onEditProfile}>
          Edit Profile
        </button>
      </div>
    </section>
  );
}
