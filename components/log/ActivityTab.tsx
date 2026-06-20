"use client";

import { useState } from "react";
import { useDailyLog } from "../providers/DailyLogProvider";
import type { ActivityIntensity } from "../../types/wellness";
import { cardStyle, colors, formatNumber, labelStyle, sans, sectionTitleStyle } from "../dashboard/theme";
import {
  cardSectionStyle,
  fieldLabel,
  inputStyle,
  primaryButtonStyle,
  selectStyle,
} from "./shared";

const intensities: ActivityIntensity[] = ["Gentle", "Moderate", "High"];

export function ActivityTab() {
  const { activities, addActivity } = useDailyLog();
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [intensity, setIntensity] = useState<ActivityIntensity>("Moderate");
  const [error, setError] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    const burned = Number(caloriesBurned);
    if (!trimmed) {
      setError("Enter an activity name.");
      return;
    }
    if (!caloriesBurned || Number.isNaN(burned) || burned <= 0) {
      setError("Enter valid calories burned.");
      return;
    }
    setError("");
    addActivity({
      name: trimmed,
      durationMinutes: Number(duration) || 0,
      caloriesBurned: burned,
      intensity,
    });
    setName("");
    setDuration("");
    setCaloriesBurned("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <section style={{ ...cardStyle(), ...cardSectionStyle() }}>
        <h2 style={{ ...sectionTitleStyle(), marginBottom: "14px" }}>
          Add activity
        </h2>
        <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={fieldLabel("Activity name")} htmlFor="activity-name">
              Activity name
            </label>
            <input
              id="activity-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning walk"
              style={inputStyle}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px",
            }}
          >
            <div>
              <label style={fieldLabel("Duration (min)")} htmlFor="activity-duration">
                Duration (min)
              </label>
              <input
                id="activity-duration"
                type="number"
                min={0}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Optional"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={fieldLabel("Calories burned")} htmlFor="activity-calories">
                Calories burned
              </label>
              <input
                id="activity-calories"
                type="number"
                min={0}
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
                placeholder="kcal"
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label style={fieldLabel("Intensity")} htmlFor="activity-intensity">
              Intensity
            </label>
            <select
              id="activity-intensity"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value as ActivityIntensity)}
              style={selectStyle}
            >
              {intensities.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <p style={{ margin: 0, fontSize: "0.78rem", color: colors.terracotta, fontFamily: sans }}>
              {error}
            </p>
          )}
          <button type="submit" style={primaryButtonStyle()}>
            Add Activity
          </button>
        </form>
      </section>

      <section style={{ ...cardStyle(), ...cardSectionStyle() }}>
        <h2 style={{ ...sectionTitleStyle(), marginBottom: "14px" }}>
          Today&apos;s activity
        </h2>
        {activities.length === 0 ? (
          <p
            style={{
              margin: 0,
              fontSize: "0.78rem",
              color: colors.muted,
              fontFamily: sans,
              fontStyle: "italic",
            }}
          >
            No activity logged yet.
          </p>
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
              <li
                key={item.id}
                style={{
                  backgroundColor: colors.shell,
                  borderRadius: "12px",
                  padding: "10px 12px",
                  border: `1px solid ${colors.border}`,
                }}
              >
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
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
