"use client";

import type { ActivityLevel, Sex } from "../../types";
import {
  BODY_FAT_RANGE_OPTIONS,
  bodyFatPctToRangeKey,
  bodyFatRangeKeyToPct,
  cmToFeetInches,
  type BodyFatRangeKey,
} from "../../lib/profileBody";
import { formatNumber } from "../dashboard/theme";
import {
  profileCardStyle,
  profileColors,
  profileHelperStyle,
  profileSans,
  profileSectionTitleStyle,
  profileSerif,
} from "./theme";
import {
  profileCardPadding,
  profileFieldLabel,
  profileInputStyle,
  profileInputSuffixGroupStyle,
  profileInputSuffixLabelStyle,
  profileInputWithSuffixStyle,
  profileSelectStyle,
  profileStatCardStyle,
} from "./shared";

const activityLabels: Record<ActivityLevel, string> = {
  sedentary: "Sedentary",
  light: "Light",
  moderate: "Moderate",
  active: "Active",
  very_active: "Very active",
};

const FEET_OPTIONS = [4, 5, 6, 7];
const INCHES_OPTIONS = Array.from({ length: 12 }, (_, index) => index);

interface BodyEnergyCardProps {
  age: number;
  sex: Sex;
  heightCm: number;
  weightLb: number;
  bodyFatPct?: number;
  activityLevel: ActivityLevel;
  bmr: number;
  tdee: number;
  onAgeChange: (value: number) => void;
  onSexChange: (value: Sex) => void;
  onHeightChange: (feet: number, inches: number) => void;
  onWeightLbChange: (value: number) => void;
  onBodyFatPctChange: (value: number | undefined) => void;
  onActivityLevelChange: (value: ActivityLevel) => void;
}

export function BodyEnergyCard({
  age,
  sex,
  heightCm,
  weightLb,
  bodyFatPct,
  activityLevel,
  bmr,
  tdee,
  onAgeChange,
  onSexChange,
  onHeightChange,
  onWeightLbChange,
  onBodyFatPctChange,
  onActivityLevelChange,
}: BodyEnergyCardProps) {
  const { feet, inches } = cmToFeetInches(heightCm);

  return (
    <section style={{ ...profileCardStyle(), ...profileCardPadding() }}>
      <h2 style={{ ...profileSectionTitleStyle(), marginBottom: "14px" }}>
        Body &amp; Energy Settings
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px",
          }}
        >
          <div>
            <label style={profileFieldLabel("Age")} htmlFor="profile-age">
              Age
            </label>
            <input
              id="profile-age"
              type="number"
              min={13}
              max={120}
              value={age}
              onChange={(e) => onAgeChange(Number(e.target.value) || age)}
              style={profileInputStyle}
            />
          </div>
          <div>
            <label style={profileFieldLabel("Sex")} htmlFor="profile-sex">
              Sex
            </label>
            <select
              id="profile-sex"
              value={sex}
              onChange={(e) => onSexChange(e.target.value as Sex)}
              style={profileSelectStyle}
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
        </div>

        <div>
          <label style={profileFieldLabel("Height")} htmlFor="profile-height-feet">
            Height
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px",
            }}
          >
            <select
              id="profile-height-feet"
              value={feet}
              onChange={(e) => onHeightChange(Number(e.target.value), inches)}
              style={profileSelectStyle}
              aria-label="Height feet"
            >
              {FEET_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value} ft
                </option>
              ))}
            </select>
            <select
              id="profile-height-inches"
              value={inches}
              onChange={(e) => onHeightChange(feet, Number(e.target.value))}
              style={profileSelectStyle}
              aria-label="Height inches"
            >
              {INCHES_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value} in
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={profileFieldLabel("Current weight")} htmlFor="profile-weight">
            Current weight
          </label>
          <div style={profileInputSuffixGroupStyle()}>
            <input
              id="profile-weight"
              type="number"
              min={50}
              max={500}
              value={weightLb}
              onChange={(e) => onWeightLbChange(Number(e.target.value) || weightLb)}
              style={profileInputWithSuffixStyle()}
            />
            <span style={profileInputSuffixLabelStyle()}>lb</span>
          </div>
        </div>

        <div>
          <label style={profileFieldLabel("Body fat")} htmlFor="profile-body-fat">
            Body fat range <span style={{ fontWeight: 400 }}>(optional)</span>
          </label>
          <select
            id="profile-body-fat"
            value={bodyFatPctToRangeKey(bodyFatPct)}
            onChange={(e) =>
              onBodyFatPctChange(bodyFatRangeKeyToPct(e.target.value as BodyFatRangeKey))
            }
            style={profileSelectStyle}
          >
            {BODY_FAT_RANGE_OPTIONS.map((option) => (
              <option key={option.value || "not-set"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p style={{ ...profileHelperStyle(), marginTop: "6px", fontSize: "0.72rem" }}>
            Choose the range that feels closest — an estimate is fine.
          </p>
        </div>

        <div>
          <label style={profileFieldLabel("Activity level")} htmlFor="profile-activity">
            Activity level
          </label>
          <select
            id="profile-activity"
            value={activityLevel}
            onChange={(e) => onActivityLevelChange(e.target.value as ActivityLevel)}
            style={profileSelectStyle}
          >
            {(Object.keys(activityLabels) as ActivityLevel[]).map((level) => (
              <option key={level} value={level}>
                {activityLabels[level]}
              </option>
            ))}
          </select>
          <p style={{ ...profileHelperStyle(), marginTop: "6px", fontSize: "0.72rem" }}>
            Used to estimate maintenance calories.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          paddingTop: "14px",
          borderTop: `1px solid ${profileColors.divider}`,
        }}
      >
        <div style={profileStatCardStyle("cream")}>
          <p style={{ ...profileFieldLabel("Estimated BMR"), marginBottom: "4px" }}>
            Estimated BMR
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: profileSerif,
              fontSize: "1.25rem",
              color: profileColors.text,
              lineHeight: 1.2,
            }}
          >
            {formatNumber(bmr)}
            <span
              style={{
                fontSize: "0.72rem",
                fontFamily: profileSans,
                color: profileColors.textSecondary,
                marginLeft: "3px",
              }}
            >
              kcal/day
            </span>
          </p>
        </div>
        <div style={profileStatCardStyle("sage")}>
          <p style={{ ...profileFieldLabel("Maintenance Calories"), marginBottom: "4px" }}>
            Maintenance Calories
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: profileSerif,
              fontSize: "1.25rem",
              color: profileColors.text,
              lineHeight: 1.2,
            }}
          >
            {formatNumber(tdee)}
            <span
              style={{
                fontSize: "0.72rem",
                fontFamily: profileSans,
                color: profileColors.textSecondary,
                marginLeft: "3px",
              }}
            >
              kcal/day
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
