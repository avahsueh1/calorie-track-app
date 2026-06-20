"use client";

import { useEffect, useState } from "react";
import { BottomNav } from "../../components/dashboard/BottomNav";
import { BodyEnergyCard } from "../../components/profile/BodyEnergyCard";
import { CycleLifeStageCard } from "../../components/profile/CycleLifeStageCard";
import { GoalsCard } from "../../components/profile/GoalsCard";
import { PreferencesCard } from "../../components/profile/PreferencesCard";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileIdentityCard } from "../../components/profile/ProfileIdentityCard";
import { RecentWeightSummary } from "../../components/profile/RecentWeightSummary";
import { useProfile, useWeightLogs } from "../../components/providers/AppStateProvider";
import { profilePrimaryButtonStyle } from "../../components/profile/shared";
import {
  profileColors,
  profileMainStyle,
  profilePageOuterStyle,
  profileSans,
  profileShellStyle,
} from "../../components/profile/theme";
import { feetInchesToCm, kgToLb, lbToKg } from "../../lib/profileBody";
import type { ActivityLevel, DailyTargetMode, Sex } from "../../types";
import type { GoalDirection, ProfileLifeStage } from "../../types/profile";

export default function ProfilePage() {
  const { profile, bmr, tdee, updateProfile } = useProfile();
  const { weightLogs } = useWeightLogs();
  const [editingIdentity, setEditingIdentity] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    if (!savedMessage) {
      return;
    }
    const timer = window.setTimeout(() => setSavedMessage(""), 2500);
    return () => window.clearTimeout(timer);
  }, [savedMessage]);

  function handleSave() {
    setSavedMessage("Saved");
    setEditingIdentity(false);
  }

  function handleEditProfile() {
    setEditingIdentity((current) => !current);
  }

  function handleHeightChange(feet: number, inches: number) {
    updateProfile({ heightCm: feetInchesToCm(feet, inches) });
  }

  function handleWeightLbChange(weightLb: number) {
    updateProfile({ weightKg: lbToKg(weightLb) });
  }

  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={profilePageOuterStyle()}>
      <div style={profileShellStyle()}>
        <main style={profileMainStyle()}>
          <ProfileHeader />

          {editingIdentity ? (
            <section
              style={{
                backgroundColor: profileColors.card,
                borderRadius: "24px",
                border: `1px solid ${profileColors.border}`,
                padding: "18px",
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
                  value={profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
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
                  value={profile.email}
                  onChange={(e) => updateProfile({ email: e.target.value })}
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
              name={profile.name}
              email={profile.email}
              initials={initials}
              onEditProfile={handleEditProfile}
            />
          )}

          <BodyEnergyCard
            age={profile.age}
            sex={profile.sex}
            heightCm={profile.heightCm}
            weightLb={kgToLb(profile.weightKg)}
            bodyFatPct={profile.bodyFatPct}
            activityLevel={profile.activityLevel}
            bmr={bmr}
            tdee={tdee}
            onAgeChange={(value) => updateProfile({ age: value })}
            onSexChange={(value: Sex) => updateProfile({ sex: value })}
            onHeightChange={handleHeightChange}
            onWeightLbChange={handleWeightLbChange}
            onBodyFatPctChange={(value) => updateProfile({ bodyFatPct: value })}
            onActivityLevelChange={(value: ActivityLevel) =>
              updateProfile({ activityLevel: value })
            }
          />

          <GoalsCard
            goalDirection={profile.goalDirection}
            dailyTargetMode={profile.dailyTargetMode}
            onGoalDirectionChange={(value: GoalDirection) =>
              updateProfile({ goalDirection: value })
            }
            onDailyTargetModeChange={(value: DailyTargetMode) =>
              updateProfile({ dailyTargetMode: value })
            }
          />

          <CycleLifeStageCard
            cycleTrackingEnabled={profile.cycleTrackingEnabled}
            lifeStage={profile.lifeStage}
            lastPeriodStart={profile.lastPeriodStart}
            averageCycleLength={String(profile.averageCycleLength)}
            averagePeriodLength={String(profile.averagePeriodLength)}
            onCycleTrackingChange={(enabled) =>
              updateProfile({ cycleTrackingEnabled: enabled })
            }
            onLifeStageChange={(value: ProfileLifeStage) =>
              updateProfile({ lifeStage: value })
            }
            onLastPeriodStartChange={(value) =>
              updateProfile({ lastPeriodStart: value })
            }
            onAverageCycleLengthChange={(value) =>
              updateProfile({ averageCycleLength: Number(value) || profile.averageCycleLength })
            }
            onAveragePeriodLengthChange={(value) =>
              updateProfile({ averagePeriodLength: Number(value) || profile.averagePeriodLength })
            }
          />

          <RecentWeightSummary entries={weightLogs} />

          <PreferencesCard
            units={profile.units}
            calorieDisplay={profile.calorieDisplay}
            checkInReminder={profile.checkInReminder}
            mealLogReminder={profile.mealLogReminder}
            waterReminder={false}
            profileVisibility="private"
            onUnitsChange={(value) => updateProfile({ units: value })}
            onCalorieDisplayChange={(value) => updateProfile({ calorieDisplay: value })}
            onCheckInReminderChange={(enabled) =>
              updateProfile({ checkInReminder: enabled })
            }
            onMealLogReminderChange={(enabled) =>
              updateProfile({ mealLogReminder: enabled })
            }
            onWaterReminderChange={() => undefined}
          />

          <div style={{ position: "relative" }}>
            <button type="button" style={profilePrimaryButtonStyle()} onClick={handleSave}>
              Save Changes
            </button>
            {savedMessage && (
              <p
                style={{
                  margin: "8px 0 0",
                  textAlign: "center",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: profileColors.sage,
                  fontFamily: profileSans,
                }}
                role="status"
              >
                {savedMessage}
              </p>
            )}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
