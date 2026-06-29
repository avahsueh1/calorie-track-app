"use client";

import { useMemo, useState } from "react";
import { useDailyLog } from "../providers/DailyLogProvider";
import { useProfile } from "../providers/AppStateProvider";
import type { ActivityIntensity } from "../../types/wellness";
import {
  LOG_ACTIVITY_OPTIONS,
  OTHER_INTENSITY_OPTIONS,
  estimateLogActivityCalories,
  mapOtherIntensityToStored,
  parseOptionalManualCalories,
  parsePositiveMinutes,
  presetStoredIntensity,
  resolveLogActivityDisplayName,
  resolveLogActivityMet,
  type LogActivityKind,
  type OtherActivityIntensity,
} from "../../lib/activityLog";
import {
  colors,
  formatNumber,
  sans,
  sectionTitleStyle,
} from "../dashboard/theme";
import { AppCard, DailyNote, PrimaryButton } from "../ui/primitives";
import {
  fieldLabel,
  inputStyle,
  logTabStackStyle,
  selectStyle,
} from "./shared";

const pillStyle = (active: boolean) => ({
  padding: "8px 10px",
  borderRadius: "999px",
  border: `1px solid ${active ? colors.terracotta : colors.border}`,
  backgroundColor: active ? colors.terracottaPale : colors.shell,
  color: active ? colors.terracotta : colors.muted,
  fontSize: "0.72rem",
  fontWeight: active ? 600 : 500,
  fontFamily: sans,
  cursor: "pointer",
  lineHeight: 1.25,
});

export function ActivityTab() {
  const { activities, addActivity } = useDailyLog();
  const { profile } = useProfile();

  const [activityKind, setActivityKind] = useState<LogActivityKind>("walking");
  const [customName, setCustomName] = useState("");
  const [otherIntensity, setOtherIntensity] =
    useState<OtherActivityIntensity>("moderate");
  const [duration, setDuration] = useState("");
  const [useManualCalories, setUseManualCalories] = useState(false);
  const [manualCalories, setManualCalories] = useState("");
  const [error, setError] = useState("");

  const durationMinutes = parsePositiveMinutes(duration);
  const manualOverride = useManualCalories
    ? parseOptionalManualCalories(manualCalories)
    : undefined;

  const estimatedCalories = useMemo(() => {
    if (!durationMinutes || profile.weightKg <= 0) {
      return null;
    }

    return estimateLogActivityCalories({
      kind: activityKind,
      weightKg: profile.weightKg,
      durationMinutes,
      otherIntensity:
        activityKind === "other" ? otherIntensity : undefined,
      manualCalories: manualOverride,
    });
  }, [
    activityKind,
    durationMinutes,
    manualOverride,
    otherIntensity,
    profile.weightKg,
  ]);

  function resetForm() {
    setActivityKind("walking");
    setCustomName("");
    setOtherIntensity("moderate");
    setDuration("");
    setUseManualCalories(false);
    setManualCalories("");
    setError("");
  }

  function handleAdd(event: React.FormEvent) {
    event.preventDefault();

    const minutes = parsePositiveMinutes(duration);
    if (!minutes) {
      setError("Enter how long the activity lasted (in minutes).");
      return;
    }

    if (activityKind === "other" && !customName.trim()) {
      setError("Enter a name for your activity.");
      return;
    }

    if (useManualCalories) {
      const manual = parseOptionalManualCalories(manualCalories);
      if (!manual) {
        setError("Enter valid calories, or turn off manual override.");
        return;
      }
    }

    const caloriesBurned = estimateLogActivityCalories({
      kind: activityKind,
      weightKg: profile.weightKg,
      durationMinutes: minutes,
      otherIntensity: activityKind === "other" ? otherIntensity : undefined,
      manualCalories: useManualCalories
        ? parseOptionalManualCalories(manualCalories)
        : undefined,
    });

    if (caloriesBurned <= 0) {
      setError("Could not estimate calories — check duration and try again.");
      return;
    }

    const intensity: ActivityIntensity =
      activityKind === "other"
        ? mapOtherIntensityToStored(otherIntensity)
        : presetStoredIntensity(activityKind);

    setError("");
    addActivity({
      name: resolveLogActivityDisplayName(activityKind, customName),
      durationMinutes: minutes,
      caloriesBurned,
      intensity,
    });
    resetForm();
  }

  const previewMet =
    durationMinutes && !useManualCalories
      ? resolveLogActivityMet(
          activityKind,
          activityKind === "other" ? otherIntensity : undefined,
        )
      : null;

  return (
    <div style={logTabStackStyle()}>
      <AppCard padding="compact">
        <h2 style={{ ...sectionTitleStyle(), marginBottom: "14px" }}>
          Add activity
        </h2>
        <form
          onSubmit={handleAdd}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <div>
            <label style={fieldLabel("Activity type")} htmlFor="activity-type">
              Activity type
            </label>
            <select
              id="activity-type"
              value={activityKind}
              onChange={(event) =>
                setActivityKind(event.target.value as LogActivityKind)
              }
              style={selectStyle}
            >
              {LOG_ACTIVITY_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {activityKind === "other" ? (
            <>
              <div>
                <label
                  style={fieldLabel("Activity name")}
                  htmlFor="activity-custom-name"
                >
                  Activity name
                </label>
                <input
                  id="activity-custom-name"
                  type="text"
                  value={customName}
                  onChange={(event) => setCustomName(event.target.value)}
                  placeholder="e.g. Rock climbing, pickleball, gardening"
                  style={inputStyle}
                />
              </div>

              <fieldset style={{ margin: 0, padding: 0, border: "none" }}>
                <legend style={{ ...fieldLabel("Intensity"), marginBottom: "8px" }}>
                  Intensity
                </legend>
                <div
                  role="radiogroup"
                  aria-label="Activity intensity"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "8px",
                  }}
                >
                  {OTHER_INTENSITY_OPTIONS.map((option) => {
                    const selected = otherIntensity === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        style={pillStyle(selected)}
                        onClick={() => setOtherIntensity(option.id)}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </>
          ) : null}

          <div>
            <label style={fieldLabel("Duration")} htmlFor="activity-duration">
              Duration
            </label>
            <input
              id="activity-duration"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              placeholder="Minutes"
              style={inputStyle}
            />
          </div>

          {estimatedCalories != null && !useManualCalories ? (
            <AppCard
              variant="soft"
              padding="10px 12px"
              style={{ backgroundColor: colors.sageLight }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.72rem",
                  color: colors.muted,
                  fontFamily: sans,
                }}
              >
                Estimated calories
                {previewMet != null ? ` · ~${previewMet} MET` : ""}
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: colors.text,
                  fontFamily: sans,
                }}
              >
                {formatNumber(estimatedCalories)} kcal
              </p>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "0.68rem",
                  lineHeight: 1.4,
                  color: colors.muted,
                  fontFamily: sans,
                }}
              >
                Approximate — based on your weight and activity type.
              </p>
            </AppCard>
          ) : null}

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.78rem",
              color: colors.text,
              fontFamily: sans,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={useManualCalories}
              onChange={(event) => setUseManualCalories(event.target.checked)}
            />
            I know my calories burned
          </label>

          {useManualCalories ? (
            <div>
              <label
                style={fieldLabel("Calories burned")}
                htmlFor="activity-manual-calories"
              >
                Calories burned
              </label>
              <input
                id="activity-manual-calories"
                type="number"
                min={1}
                value={manualCalories}
                onChange={(event) => setManualCalories(event.target.value)}
                placeholder="kcal"
                style={inputStyle}
              />
            </div>
          ) : null}

          {error ? (
            <p
              style={{
                margin: 0,
                fontSize: "0.78rem",
                color: colors.terracotta,
                fontFamily: sans,
              }}
            >
              {error}
            </p>
          ) : null}

          <PrimaryButton type="submit">Add Activity</PrimaryButton>
        </form>
      </AppCard>

      <AppCard padding="compact">
        <h2 style={{ ...sectionTitleStyle(), marginBottom: "14px" }}>
          Today&apos;s activity
        </h2>
        {activities.length === 0 ? (
          <DailyNote variant="empty" bodyStyle={{ fontSize: "0.78rem", fontStyle: "italic" }}>
            No activity logged yet.
          </DailyNote>
        ) : (
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {activities.map((item) => (
              <li key={item.id}>
                <AppCard variant="soft" padding="10px 12px">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: colors.text,
                      fontFamily: sans,
                    }}
                  >
                    {item.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: colors.sage,
                      fontFamily: sans,
                      flexShrink: 0,
                    }}
                  >
                    {formatNumber(item.caloriesBurned)} kcal
                  </span>
                </div>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "0.72rem",
                    color: colors.muted,
                    fontFamily: sans,
                  }}
                >
                  {item.durationMinutes > 0
                    ? `${item.durationMinutes} min · ${item.intensity}`
                    : item.intensity}
                </p>
                </AppCard>
              </li>
            ))}
          </ul>
        )}
      </AppCard>
    </div>
  );
}
