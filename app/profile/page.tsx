"use client";

import { useState } from "react";
import { AppShell } from "../../components/ui/AppShell";
import { ProfileSettingsModules } from "../../components/profile/ProfileSettingsModules";
import { PreferencesCard } from "../../components/profile/PreferencesCard";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileIdentityCard } from "../../components/profile/ProfileIdentityCard";
import { ProfileSavedStatus } from "../../components/profile/ProfileSavedStatus";
import { useProfileDraft } from "../../components/profile/useProfileDraft";
import { useProfile, useTrackingPreferences } from "../../components/providers/AppStateProvider";
import { TrackingPreferencesCard } from "../../components/profile/TrackingPreferencesCard";
import {
  profileColors,
  profileMainStyle,
  profileSans,
} from "../../components/profile/theme";
import { layout } from "../../lib/theme";
import { getProfileInitial } from "../../data/defaultProfile";

export default function ProfilePage() {
  const { profile, updateProfile } = useProfile();
  const { trackingPreferences, updateTrackingPreferences } = useTrackingPreferences();
  const [editingIdentity, setEditingIdentity] = useState(false);
  const { draftProfile, patchDraft, savedMessage } = useProfileDraft({
    profile,
    onSave: updateProfile,
  });

  const initials = getProfileInitial(draftProfile.name);

  function handleEditProfile() {
    setEditingIdentity((current) => !current);
  }

  return (
    <AppShell mainStyle={profileMainStyle()}>
      <ProfileHeader />

      {editingIdentity ? (
        <section
          style={{
            backgroundColor: profileColors.card,
            borderRadius: layout.cardRadius,
            border: `1px solid ${profileColors.border}`,
            padding: layout.cardPadding,
          }}
        >
          <p
            style={{
              margin: "0 0 12px",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: profileColors.text,
              fontFamily: profileSans,
            }}
          >
            Edit profile
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="text"
              value={draftProfile.name}
              onChange={(e) => patchDraft({ name: e.target.value })}
              aria-label="Name"
              style={{
                padding: "10px 12px",
                borderRadius: "12px",
                border: `1px solid ${profileColors.border}`,
                backgroundColor: profileColors.cream,
                fontFamily: profileSans,
                fontSize: "0.88rem",
              }}
            />
            <input
              type="email"
              value={draftProfile.email}
              onChange={(e) => patchDraft({ email: e.target.value })}
              aria-label="Email"
              style={{
                padding: "10px 12px",
                borderRadius: "12px",
                border: `1px solid ${profileColors.border}`,
                backgroundColor: profileColors.cream,
                fontFamily: profileSans,
                fontSize: "0.88rem",
              }}
            />
            <button
              type="button"
              onClick={() => setEditingIdentity(false)}
              style={{
                padding: "9px 16px",
                borderRadius: "999px",
                border: `1px solid ${profileColors.border}`,
                backgroundColor: profileColors.cardSoft,
                fontFamily: profileSans,
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Done
            </button>
          </div>
        </section>
      ) : (
        <ProfileIdentityCard
          name={draftProfile.name}
          email={draftProfile.email}
          initials={initials}
          onEditProfile={handleEditProfile}
        />
      )}

      <TrackingPreferencesCard
        preferences={trackingPreferences}
        onChange={updateTrackingPreferences}
      />

      <ProfileSettingsModules
        profile={draftProfile}
        calorieTrackingEnabled={trackingPreferences.calorieTrackingEnabled}
        cycleTrackingEnabled={trackingPreferences.cycleTrackingEnabled}
      />

      <PreferencesCard
        units={draftProfile.units}
        calorieDisplay={draftProfile.calorieDisplay}
        checkInReminder={draftProfile.checkInReminder}
        mealLogReminder={draftProfile.mealLogReminder}
        waterReminder={false}
        profileVisibility="private"
        onUnitsChange={(value) => patchDraft({ units: value })}
        onCalorieDisplayChange={(value) => patchDraft({ calorieDisplay: value })}
        onCheckInReminderChange={(enabled) =>
          patchDraft({ checkInReminder: enabled })
        }
        onMealLogReminderChange={(enabled) =>
          patchDraft({ mealLogReminder: enabled })
        }
        onWaterReminderChange={() => undefined}
      />

      <ProfileSavedStatus message={savedMessage} />
    </AppShell>
  );
}
