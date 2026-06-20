"use client";

import { useState } from "react";
import { cardStyle, colors, labelStyle, sans, sectionTitleStyle } from "../dashboard/theme";
import {
  cardSectionStyle,
  fieldLabel,
  inputStyle,
  primaryButtonStyle,
} from "./shared";
import type { WeightLogEntry } from "../../types/wellness";

interface WeightTabProps {
  entries: WeightLogEntry[];
  onSaveWeight: (entry: Omit<WeightLogEntry, "id" | "loggedAt" | "date">) => void;
}

export function WeightTab({ entries, onSaveWeight }: WeightTabProps) {
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(weight);
    if (!weight || Number.isNaN(value) || value <= 0) {
      setError("Enter a valid weight.");
      return;
    }
    setError("");
    onSaveWeight({ weight: value, note: note.trim() });
    setWeight("");
    setNote("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <section style={{ ...cardStyle(), ...cardSectionStyle() }}>
        <h2 style={{ ...sectionTitleStyle(), marginBottom: "14px" }}>
          Log weight
        </h2>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={fieldLabel("Weight (kg)")} htmlFor="weight-value">
              Weight (kg)
            </label>
            <input
              id="weight-value"
              type="number"
              min={0}
              step={0.1}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 56.2"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={fieldLabel("Note (optional)")} htmlFor="weight-note">
              Note (optional)
            </label>
            <input
              id="weight-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Morning, after breakfast"
              style={inputStyle}
            />
          </div>
          {error && (
            <p style={{ margin: 0, fontSize: "0.78rem", color: colors.terracotta, fontFamily: sans }}>
              {error}
            </p>
          )}
          <button type="submit" style={primaryButtonStyle()}>
            Save Weight
          </button>
        </form>
      </section>

      <section style={{ ...cardStyle(), ...cardSectionStyle() }}>
        <h2 style={{ ...sectionTitleStyle(), marginBottom: "14px" }}>
          Recent entries
        </h2>
        {entries.length === 0 ? (
          <p
            style={{
              margin: 0,
              fontSize: "0.78rem",
              color: colors.muted,
              fontFamily: sans,
              fontStyle: "italic",
            }}
          >
            No weight entries yet.
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
            {entries.map((entry) => (
              <li
                key={entry.id}
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
                    {entry.weight} kg
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: colors.muted,
                      fontFamily: sans,
                    }}
                  >
                    {entry.loggedAt}
                  </span>
                </div>
                {entry.note && (
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "0.72rem",
                      color: colors.muted,
                      fontFamily: sans,
                    }}
                  >
                    {entry.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
