"use client";

import type { AppProfile, NutritionPlan, WeekdayKey } from "../../types/profile";
import {
  BOOST_PRESET_VALUES,
  WEEKDAY_KEYS,
  WEEKDAY_LABELS,
  WEEKEND_DAY_KEYS,
  ensureCalorieCycling,
  getWeekendBoostFromPreset,
} from "../../lib/calorieCycling";
import { formatNumber } from "../../lib/theme";
import { AppCard } from "../ui/primitives";
import { profileFieldLabel, profileInputStyle, profilePillStyle } from "./shared";
import {
  BOOST_OPTIONS,
  PLAN_TYPE_OPTIONS,
  WeeklyTargetBar,
  useWeeklyPatternSummary,
} from "./weeklyPatternShared";
import {
  profileColors,
  profileHelperStyle,
  profileSans,
  profileSectionLabelStyle,
  profileSectionTitleStyle,
} from "./theme";

interface WeeklyCaloriePatternSetupProps {
  profile: AppProfile;
  plan: NutritionPlan;
  onPlanChange: (plan: NutritionPlan) => void;
}

export function WeeklyCaloriePatternSetup({
  profile,
  plan,
  onPlanChange,
}: WeeklyCaloriePatternSetupProps) {
  const {
    enabled,
    cyclingType,
    highCalorieDays,
    dailyTargets,
    weeklyTotal,
    weeklyGoal,
    totalStatus,
    maxBarTarget,
  } = useWeeklyPatternSummary(profile, plan);

  const boostPreset = plan.weekendBoostPreset ?? "moderate";

  function updatePlan(updates: Partial<NutritionPlan>) {
    onPlanChange(
      ensureCalorieCycling(
        {
          ...plan,
          ...updates,
        },
        profile,
      ),
    );
  }

  function handleCyclingToggle(nextEnabled: boolean) {
    if (!nextEnabled) {
      updatePlan({
        calorieCyclingEnabled: false,
        calorieCyclingType: "same_daily",
      });
      return;
    }

    updatePlan({
      calorieCyclingEnabled: true,
      calorieCyclingType:
        cyclingType === "same_daily" ? "weekend_high" : cyclingType,
    });
  }

  function toggleHighDay(day: WeekdayKey) {
    const next = highCalorieDays.includes(day)
      ? highCalorieDays.filter((value) => value !== day)
      : [...highCalorieDays, day];
    updatePlan({ highCalorieDays: next });
  }

  function setCustomDayTarget(day: WeekdayKey, value: number) {
    updatePlan({
      calorieCyclingType: "custom",
      dailyTargets: {
        ...dailyTargets,
        [day]: value,
      },
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <AppCard variant="soft" padding="14px">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            marginBottom: "10px",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h3 style={{ ...profileSectionTitleStyle(), marginBottom: "4px" }}>
              Weekly calorie pattern
            </h3>
            <p style={{ ...profileHelperStyle(), margin: 0, fontSize: "0.74rem" }}>
              {enabled
                ? "Shift more calories to preferred days while keeping your weekly average."
                : "Use the same calorie target every day."}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label="Calorie cycling"
            onClick={() => handleCyclingToggle(!enabled)}
            style={{
              width: "48px",
              height: "28px",
              borderRadius: "999px",
              border: `1px solid ${profileColors.blushBorder}`,
              backgroundColor: enabled ? profileColors.sage : profileColors.cardSoft,
              padding: "3px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: enabled ? "flex-end" : "flex-start",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: profileColors.card,
                boxShadow: "0 1px 3px rgba(60, 43, 36, 0.12)",
              }}
            />
          </button>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "0.72rem",
            color: profileColors.textSecondary,
            fontFamily: profileSans,
          }}
        >
          {enabled ? "On" : "Off"}
        </p>
      </AppCard>

      {enabled ? (
        <>
      <AppCard variant="soft" padding="14px">
        <p style={{ ...profileSectionLabelStyle(), marginBottom: "8px" }}>
          Plan style
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {PLAN_TYPE_OPTIONS.map((option) => {
            const active = cyclingType === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  updatePlan({
                    calorieCyclingType: option.id,
                    calorieCyclingEnabled: option.id !== "same_daily",
                  })
                }
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  border: `1px solid ${
                    active ? profileColors.terracotta : profileColors.border
                  }`,
                  backgroundColor: active
                    ? profileColors.blushBg
                    : profileColors.cardSoft,
                  cursor: "pointer",
                  fontFamily: profileSans,
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: profileColors.text,
                  }}
                >
                  {option.label}
                </span>
                <span
                  style={{
                    display: "block",
                    marginTop: "3px",
                    fontSize: "0.72rem",
                    color: profileColors.textSecondary,
                  }}
                >
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </AppCard>

      {cyclingType === "weekend_high" ? (
        <AppCard variant="soft" padding="14px">
          <p style={{ ...profileSectionLabelStyle(), marginBottom: "8px" }}>
            High-calorie days
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {WEEKDAY_KEYS.map((day) => {
              const active = highCalorieDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleHighDay(day)}
                  style={{
                    ...profilePillStyle(active),
                    padding: "7px 11px",
                    fontSize: "0.72rem",
                  }}
                >
                  {WEEKDAY_LABELS[day].slice(0, 3)}
                </button>
              );
            })}
          </div>

          <p
            style={{
              ...profileSectionLabelStyle(),
              marginBottom: "8px",
              marginTop: "14px",
            }}
          >
            Difference on high days
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {BOOST_OPTIONS.map((option) => {
              const active = boostPreset === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    updatePlan({
                      weekendBoostPreset: option.id,
                      weekendBoost: getWeekendBoostFromPreset(
                        option.id,
                        plan.weekendBoost,
                      ),
                    })
                  }
                  style={{
                    ...profilePillStyle(active),
                    padding: "7px 11px",
                    fontSize: "0.72rem",
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {boostPreset === "custom" ? (
            <div style={{ marginTop: "10px" }}>
              <label style={{ display: "block" }}>
                <span style={profileFieldLabel("Custom boost")}>Custom boost</span>
                <input
                  type="number"
                  min={50}
                  step={5}
                  value={plan.weekendBoost ?? BOOST_PRESET_VALUES.moderate}
                  onChange={(event) =>
                    updatePlan({
                      weekendBoostPreset: "custom",
                      weekendBoost: Number(event.target.value) || 0,
                    })
                  }
                  style={profileInputStyle}
                />
              </label>
            </div>
          ) : null}
        </AppCard>
      ) : null}

      {cyclingType === "custom" ? (
        <AppCard variant="soft" padding="14px">
          <p style={{ ...profileSectionLabelStyle(), marginBottom: "8px" }}>
            Daily targets
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "8px",
            }}
          >
            {WEEKDAY_KEYS.map((day) => (
              <label key={day} style={{ display: "block" }}>
                <span style={profileFieldLabel(WEEKDAY_LABELS[day])}>
                  {WEEKDAY_LABELS[day]}
                </span>
                <input
                  type="number"
                  min={800}
                  step={5}
                  value={dailyTargets[day]}
                  onChange={(event) =>
                    setCustomDayTarget(day, Number(event.target.value) || 0)
                  }
                  style={profileInputStyle}
                />
              </label>
            ))}
          </div>
        </AppCard>
      ) : null}

      <AppCard variant="soft" padding="14px">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "8px",
            marginBottom: cyclingType !== "same_daily" ? "14px" : 0,
          }}
        >
          <div
            style={{
              padding: "10px 12px",
              borderRadius: "12px",
              backgroundColor: profileColors.cardSoft,
              border: `1px solid ${profileColors.border}`,
            }}
          >
            <p style={{ ...profileSectionLabelStyle(), marginBottom: "4px" }}>
              Weekly total
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.92rem",
                fontWeight: 600,
                color: profileColors.text,
                fontFamily: profileSans,
              }}
            >
              {formatNumber(weeklyTotal)} kcal
            </p>
          </div>
          <div
            style={{
              padding: "10px 12px",
              borderRadius: "12px",
              backgroundColor: profileColors.cardSoft,
              border: `1px solid ${profileColors.border}`,
            }}
          >
            <p style={{ ...profileSectionLabelStyle(), marginBottom: "4px" }}>
              Average / day
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.92rem",
                fontWeight: 600,
                color: profileColors.text,
                fontFamily: profileSans,
              }}
            >
              {formatNumber(plan.calorieTarget)} kcal
            </p>
          </div>
          <div
            style={{
              padding: "10px 12px",
              borderRadius: "12px",
              backgroundColor: profileColors.cardSoft,
              border: `1px solid ${profileColors.border}`,
            }}
          >
            <p style={{ ...profileSectionLabelStyle(), marginBottom: "4px" }}>
              Weekly status
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.92rem",
                fontWeight: 600,
                color:
                  totalStatus === "on_target"
                    ? profileColors.sage
                    : profileColors.terracottaDark,
                fontFamily: profileSans,
              }}
            >
              {totalStatus === "on_target"
                ? "On target"
                : totalStatus === "over"
                  ? "Over goal"
                  : "Under goal"}
            </p>
          </div>
        </div>

        {cyclingType !== "same_daily" ? (
          <div>
            <p style={{ ...profileSectionLabelStyle(), marginBottom: "8px" }}>
              Daily targets
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {WEEKDAY_KEYS.map((day) => (
                <WeeklyTargetBar
                  key={day}
                  day={day}
                  target={dailyTargets[day]}
                  maxTarget={maxBarTarget}
                  isHighDay={
                    cyclingType === "weekend_high"
                      ? highCalorieDays.includes(day)
                      : day === "saturday" || day === "sunday"
                  }
                />
              ))}
            </div>
          </div>
        ) : (
          <p style={{ ...profileHelperStyle(), margin: 0, fontSize: "0.74rem" }}>
            Using {formatNumber(plan.calorieTarget)} kcal every day (
            {formatNumber(weeklyGoal)} kcal / week).
          </p>
        )}
      </AppCard>
        </>
      ) : (
        <AppCard variant="soft" padding="14px">
          <p style={{ ...profileHelperStyle(), margin: 0, fontSize: "0.74rem" }}>
            Turn on calorie cycling to spread your weekly target across different
            days. Right now you are using {formatNumber(plan.calorieTarget)} kcal
            every day.
          </p>
        </AppCard>
      )}
    </div>
  );
}

export function buildFormulaWeeklyPattern(
  plan: NutritionPlan,
  profile: AppProfile,
): NutritionPlan {
  return ensureCalorieCycling(
    {
      ...plan,
      calorieCyclingEnabled: true,
      calorieCyclingType: "weekend_high",
      highCalorieDays: WEEKEND_DAY_KEYS,
      weekendBoostPreset: "moderate",
      weekendBoost: undefined,
    },
    profile,
  );
}
