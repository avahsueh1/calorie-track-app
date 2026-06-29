"use client";

import { profileColors, profileSans, profileSectionLabelStyle } from "./theme";

export interface ProfileSelectableOption {
  id: string;
  label: string;
  subtitle?: string;
  description: string;
  examples?: string;
}

interface ProfileOptionGroupProps<T extends string> {
  name: string;
  label: string;
  options: ProfileSelectableOption[];
  value: T;
  onChange: (value: T) => void;
}

export function ProfileOptionGroup<T extends string>({
  name,
  label,
  options,
  value,
  onChange,
}: ProfileOptionGroupProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label || name}
      style={{ marginBottom: label ? "16px" : 0 }}
    >
      {label ? (
        <p style={{ ...profileSectionLabelStyle(), marginBottom: "8px" }}>{label}</p>
      ) : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {options.map((option) => {
          const isSelected = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              name={name}
              aria-checked={isSelected}
              onClick={() => onChange(option.id as T)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: "14px",
                border: `1px solid ${
                  isSelected ? profileColors.terracotta : profileColors.border
                }`,
                backgroundColor: isSelected
                  ? profileColors.blushBg
                  : profileColors.cardSoft,
                boxShadow: isSelected
                  ? "0 2px 8px rgba(185, 118, 99, 0.1)"
                  : "none",
                cursor: "pointer",
                fontFamily: profileSans,
                transition:
                  "border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease",
                display: "block",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  pointerEvents: "none",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: "16px",
                    height: "16px",
                    marginTop: "1px",
                    borderRadius: "50%",
                    border: `2px solid ${
                      isSelected ? profileColors.terracotta : profileColors.border
                    }`,
                    backgroundColor: isSelected
                      ? profileColors.terracotta
                      : "transparent",
                    flexShrink: 0,
                    boxShadow: isSelected
                      ? "inset 0 0 0 3px #FFF7F3"
                      : "none",
                  }}
                />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: isSelected
                        ? profileColors.terracottaDark
                        : profileColors.text,
                      lineHeight: 1.3,
                    }}
                  >
                    {option.label}
                  </span>
                  {option.subtitle ? (
                    <span
                      style={{
                        display: "block",
                        marginTop: "2px",
                        fontSize: "0.72rem",
                        fontWeight: 500,
                        color: profileColors.terracottaDark,
                        lineHeight: 1.35,
                      }}
                    >
                      {option.subtitle}
                    </span>
                  ) : null}
                  <span
                    style={{
                      display: "block",
                      marginTop: option.subtitle ? "6px" : "5px",
                      fontSize: "0.71rem",
                      lineHeight: 1.5,
                      color: profileColors.textSecondary,
                      fontWeight: 400,
                    }}
                  >
                    {option.description}
                  </span>
                  {option.examples ? (
                    <span
                      style={{
                        display: "block",
                        marginTop: "4px",
                        fontSize: "0.68rem",
                        lineHeight: 1.4,
                        color: profileColors.textSecondary,
                        fontStyle: "italic",
                      }}
                    >
                      e.g. {option.examples}
                    </span>
                  ) : null}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
