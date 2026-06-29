"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { AppButton } from "../ui/primitives";
import {
  ProfileOptionGroup,
  type ProfileSelectableOption,
} from "./ProfileOptionGroup";
import { profileColors, profileSans, profileSectionLabelStyle } from "./theme";

interface ProfileCollapsibleOptionGroupProps<T extends string> {
  name: string;
  label: string;
  options: ProfileSelectableOption[];
  value: T;
  onChange: (value: T) => void;
}

function getSelectedSummary(
  options: ProfileSelectableOption[],
  value: string,
): { title: string; detail?: string } {
  const selected = options.find((option) => option.id === value);
  if (!selected) {
    return { title: "Choose an option" };
  }

  return {
    title: selected.label,
    detail: selected.subtitle ?? selected.description,
  };
}

export function ProfileCollapsibleOptionGroup<T extends string>({
  name,
  label,
  options,
  value,
  onChange,
}: ProfileCollapsibleOptionGroupProps<T>) {
  const [expanded, setExpanded] = useState(false);
  const summary = useMemo(
    () => getSelectedSummary(options, value),
    [options, value],
  );

  function handleSelect(nextValue: T) {
    onChange(nextValue);
  }

  return (
    <div style={{ marginBottom: "14px" }}>
      {label ? (
        <p style={{ ...profileSectionLabelStyle(), marginBottom: "8px" }}>{label}</p>
      ) : null}

      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-expanded={false}
          style={{
            width: "100%",
            textAlign: "left",
            padding: "12px 14px",
            borderRadius: "14px",
            border: `1px solid ${profileColors.terracotta}`,
            backgroundColor: profileColors.blushBg,
            cursor: "pointer",
            fontFamily: profileSans,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                display: "block",
                fontSize: "0.84rem",
                fontWeight: 600,
                color: profileColors.terracottaDark,
                lineHeight: 1.3,
              }}
            >
              {summary.title}
            </span>
            {summary.detail ? (
              <span
                style={{
                  display: "block",
                  marginTop: "3px",
                  fontSize: "0.72rem",
                  lineHeight: 1.4,
                  color: profileColors.textSecondary,
                }}
              >
                {summary.detail}
              </span>
            ) : null}
          </span>
          <ChevronDown
            size={18}
            color={profileColors.textSecondary}
            aria-hidden
            style={{ flexShrink: 0 }}
          />
        </button>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <ProfileOptionGroup
            name={name}
            label=""
            options={options}
            value={value}
            onChange={handleSelect}
          />
          <AppButton
            variant="secondary"
            onClick={() => setExpanded(false)}
            style={{ width: "100%" }}
          >
            Done
          </AppButton>
        </div>
      )}
    </div>
  );
}
