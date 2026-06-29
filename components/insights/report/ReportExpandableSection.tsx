"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { AppCard } from "../../ui/primitives";
import { insightsColors, insightsSans } from "../theme";

interface ReportExpandableSectionProps {
  title: string;
  preview: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function ReportExpandableSection({
  title,
  preview,
  children,
  defaultOpen = false,
}: ReportExpandableSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <AppCard variant="soft" padding="0" style={{ overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "14px 16px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontFamily: insightsSans,
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              display: "block",
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: insightsColors.text,
              lineHeight: 1.3,
            }}
          >
            {title}
          </span>
          {!open ? (
            <span
              style={{
                display: "block",
                marginTop: "4px",
                fontSize: "0.8125rem",
                lineHeight: 1.45,
                color: insightsColors.textSecondary,
              }}
            >
              {preview}
            </span>
          ) : null}
        </span>
        <ChevronDown
          size={18}
          color={insightsColors.textSecondary}
          aria-hidden
          style={{
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 150ms ease",
          }}
        />
      </button>

      {open ? (
        <div
          style={{
            padding: "0 16px 16px",
            borderTop: `1px solid ${insightsColors.border}`,
          }}
        >
          {children}
        </div>
      ) : null}
    </AppCard>
  );
}
