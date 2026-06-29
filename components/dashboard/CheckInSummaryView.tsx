"use client";

import type { ReactNode } from "react";
import type { DailyCheckIn } from "../../types";
import {
  countSelectedSymptoms,
  getSelectedSymptomsByCategory,
} from "../../lib/checkInHelpers";
import { selectionToStatusTone } from "../../lib/symptomOptions";
import { getSymptomIconStyle } from "../../lib/symptomIcons";
import { colors, sans, spacing } from "../../lib/theme";
import { IconBubble } from "../ui/IconBubble";
import { StatusPill } from "../ui/StatusPill";

const sectionLabelStyle = {
  margin: 0,
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.04em",
  textTransform: "uppercase" as const,
  color: colors.muted,
  fontFamily: sans,
};

const stackStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: spacing.block,
};

interface CheckInSummaryViewProps {
  saved: DailyCheckIn;
  onRowPress?: () => void;
  notesSection?: ReactNode;
  footerSection?: ReactNode;
}

export function CheckInSummaryView({
  saved,
  onRowPress,
  notesSection,
  footerSection,
}: CheckInSummaryViewProps) {
  const sections = getSelectedSymptomsByCategory(saved);
  const symptomCount = countSelectedSymptoms(saved);
  const hasNotes = Boolean(notesSection);
  const hasFooter = Boolean(footerSection);
  const hasSymptoms = symptomCount > 0;

  if (!hasNotes && !hasSymptoms && !hasFooter) {
    return null;
  }

  if (!hasSymptoms) {
    return (
      <div style={stackStyle}>
        {notesSection}
        {footerSection}
      </div>
    );
  }

  return (
    <div style={stackStyle}>
      {notesSection}

      {sections.map((section) => (
        <div
          key={section.category}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: spacing.block,
          }}
        >
          <p style={sectionLabelStyle}>{section.title}</p>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: spacing.block,
              width: "100%",
            }}
          >
            {section.items.map((item) => {
              const iconStyle = getSymptomIconStyle(item.key);
              return (
                <li key={item.key} style={{ width: "100%" }}>
                  <div
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      borderRadius: "12px",
                      border: `1px solid ${colors.border}`,
                      backgroundColor: colors.shell,
                      overflow: "hidden",
                    }}
                  >
                    <button
                      type="button"
                      onClick={onRowPress}
                      disabled={!onRowPress}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        gap: spacing.inline,
                        padding: "10px 12px",
                        border: "none",
                        background: "transparent",
                        cursor: onRowPress ? "pointer" : "default",
                        fontFamily: sans,
                        textAlign: "left",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: spacing.inline,
                          minWidth: 0,
                        }}
                      >
                        <IconBubble
                          icon={iconStyle.icon}
                          backgroundColor={iconStyle.backgroundColor}
                          color={iconStyle.color}
                          size="sm"
                        />
                        <span
                          style={{
                            fontSize: "0.84rem",
                            fontWeight: 500,
                            color: colors.text,
                          }}
                        >
                          {item.label}
                        </span>
                      </span>
                      <StatusPill
                        tone={selectionToStatusTone(item.selection)}
                        value={item.selectionLabel}
                      />
                    </button>
                    {item.note?.trim() ? (
                      <p
                        style={{
                          margin: 0,
                          padding: "0 12px 10px 50px",
                          fontSize: "0.78rem",
                          lineHeight: 1.45,
                          color: colors.muted,
                          fontFamily: sans,
                        }}
                      >
                        {item.note.trim()}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {footerSection}
    </div>
  );
}
