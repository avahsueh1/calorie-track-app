"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { BottomNav } from "../../../components/dashboard/BottomNav";
import { BodyPatternDayDetail } from "../../../components/insights/BodyPatternDayDetail";
import {
  INSIGHTS_SELECTED_DATE_KEY,
  isValidDateKey,
} from "../../../components/insights/bodyPatternCalendarUtils";
import {
  insightsMainStyle,
  insightsPageOuterStyle,
  insightsSans,
  insightsShellStyle,
} from "../../../components/insights/theme";
import {
  getSampleBodyPatternEntry,
  sampleBodyPatternMonthEntries,
} from "../../../data/sampleInsights";

export default function InsightsDatePage() {
  const params = useParams();
  const router = useRouter();
  const dateParam = typeof params.date === "string" ? params.date : "";

  const entry = useMemo(() => {
    if (!isValidDateKey(dateParam)) {
      return null;
    }
    return (
      sampleBodyPatternMonthEntries[dateParam] ??
      getSampleBodyPatternEntry(dateParam)
    );
  }, [dateParam]);

  useEffect(() => {
    if (isValidDateKey(dateParam)) {
      sessionStorage.setItem(INSIGHTS_SELECTED_DATE_KEY, dateParam);
    }
  }, [dateParam]);

  if (!isValidDateKey(dateParam) || !entry) {
    return (
      <div style={insightsPageOuterStyle()}>
        <div style={insightsShellStyle()}>
          <main style={insightsMainStyle()}>
            <p
              style={{
                margin: 0,
                fontFamily: insightsSans,
                fontSize: "0.9rem",
                color: "#7D7068",
              }}
            >
              That date could not be found.
            </p>
            <button
              type="button"
              onClick={() => router.push("/insights")}
              style={{
                marginTop: "12px",
                padding: 0,
                border: "none",
                background: "transparent",
                fontFamily: insightsSans,
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#B97663",
                cursor: "pointer",
              }}
            >
              ← Back to Insights
            </button>
          </main>
          <BottomNav />
        </div>
      </div>
    );
  }

  return (
    <div style={insightsPageOuterStyle()}>
      <div style={insightsShellStyle()}>
        <main style={insightsMainStyle()}>
          <button
            type="button"
            onClick={() => router.push("/insights")}
            style={{
              alignSelf: "flex-start",
              padding: 0,
              border: "none",
              background: "transparent",
              fontFamily: insightsSans,
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#B97663",
              cursor: "pointer",
            }}
          >
            ← Back to Insights
          </button>

          <BodyPatternDayDetail entry={entry} />
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
