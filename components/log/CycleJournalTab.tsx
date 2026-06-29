"use client";

import { useEffect, useMemo, useState } from "react";
import { BodyPatternCalendar } from "../insights/BodyPatternCalendar";
import { useCycleContext } from "../providers/AppStateProvider";
import { todayDateKey } from "../../lib/appStateHelpers";
import type { PeriodLog } from "../../types/wellness";
import { colors, sans, sectionTitleStyle } from "../dashboard/theme";
import { AppCard, DailyNote, PrimaryButton } from "../ui/primitives";
import { AddPeriodLogSheet } from "./AddPeriodLogSheet";
import { logTabStackStyle, textActionStyle } from "./shared";

function formatPeriodLogLabel(log: PeriodLog): string {
  const start = new Date(`${log.startDate}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (!log.endDate) {
    return `${start} · start logged`;
  }

  const end = new Date(`${log.endDate}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${start} – ${end}`;
}

export function CycleJournalTab() {
  const {
    cycleSettings,
    effectiveCycleSettings,
    periodLogs,
    addPeriodLog,
    updatePeriodLog,
    deletePeriodLog,
  } = useCycleContext();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<PeriodLog | null>(null);
  const [startDate, setStartDate] = useState(todayDateKey());
  const [endDate, setEndDate] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const initialMonth = useMemo(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }, []);

  const calendarRevisionKey = useMemo(
    () =>
      [
        effectiveCycleSettings.lastPeriodStart,
        effectiveCycleSettings.averageCycleLength,
        effectiveCycleSettings.averagePeriodLength,
        ...periodLogs.map(
          (log) => `${log.id}:${log.startDate}:${log.endDate ?? ""}:${log.flow ?? ""}`,
        ),
      ].join("|"),
    [effectiveCycleSettings, periodLogs],
  );

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = window.setTimeout(() => setSuccessMessage(""), 3000);
    return () => window.clearTimeout(timer);
  }, [successMessage]);

  function closeSheet() {
    setSheetOpen(false);
    setEditingLog(null);
    setStartDate("");
    setEndDate("");
  }

  function openAddSheet() {
    setEditingLog(null);
    if (!startDate) {
      setStartDate(todayDateKey());
    }
    setSheetOpen(true);
  }

  function openEditSheet(log: PeriodLog) {
    setEditingLog(log);
    setStartDate(log.startDate);
    setEndDate(log.endDate ?? "");
    setSheetOpen(true);
  }

  function handleDateSelect(dateKey: string) {
    if (!startDate || dateKey < startDate) {
      setStartDate(dateKey);
      setEndDate("");
      return;
    }

    if (dateKey === startDate) {
      setEndDate("");
      return;
    }

    setEndDate(dateKey);
  }

  function handleSavePeriod(entry: Omit<PeriodLog, "id">) {
    if (editingLog) {
      updatePeriodLog(editingLog.id, entry);
      setSuccessMessage("Period updated. Cycle predictions refreshed.");
    } else {
      addPeriodLog(entry);
      setSuccessMessage("Period logged. Cycle predictions updated.");
    }

    closeSheet();
  }

  function handleDeletePeriod() {
    if (!editingLog) {
      return;
    }

    deletePeriodLog(editingLog.id);
    setSuccessMessage("Period removed. Cycle predictions refreshed.");
    closeSheet();
  }

  if (!cycleSettings.cycleTrackingEnabled) {
    return (
      <AppCard padding="compact">
        <h2 style={{ ...sectionTitleStyle(), marginBottom: "8px" }}>
          Cycle Journal
        </h2>
        <DailyNote variant="empty" bodyStyle={{ fontSize: "0.78rem", lineHeight: 1.5 }}>
          Turn on cycle tracking in Profile to log periods and see cycle context
          here.
        </DailyNote>
      </AppCard>
    );
  }

  return (
    <div style={logTabStackStyle()}>
      <AppCard padding="compact">
        <h2 style={{ ...sectionTitleStyle(), marginBottom: "6px" }}>
          Cycle Journal
        </h2>
        <p
          style={{
            margin: "0 0 14px",
            fontSize: "0.78rem",
            lineHeight: 1.5,
            color: colors.muted,
            fontFamily: sans,
          }}
        >
          Log period dates to keep your cycle context up to date.
        </p>

        <PrimaryButton type="button" onClick={openAddSheet}>
          Add period
        </PrimaryButton>

        {successMessage ? (
          <DailyNote
            variant="summary"
            label=""
            style={{
              marginTop: "12px",
              backgroundColor: colors.sageLight,
            }}
            bodyStyle={{ color: colors.sage, fontSize: "0.75rem" }}
          >
            {successMessage}
          </DailyNote>
        ) : null}
      </AppCard>

      <BodyPatternCalendar
        key={calendarRevisionKey}
        mode="cycleLog"
        cycleSettings={effectiveCycleSettings}
        initialYear={initialMonth.year}
        initialMonth={initialMonth.month}
        showHeader={false}
        maxWidth="none"
        periodLogs={periodLogs}
        selectedStartDate={editingLog ? "" : startDate}
        selectedEndDate={editingLog ? "" : endDate}
        onDateSelect={handleDateSelect}
      />

      <AppCard padding="compact">
        <h2 style={{ ...sectionTitleStyle(), marginBottom: "14px" }}>
          Recent periods
        </h2>
        {periodLogs.length === 0 ? (
          <DailyNote variant="empty" bodyStyle={{ fontSize: "0.78rem", fontStyle: "italic" }}>
            No period entries yet. Tap a date on the calendar or use Add period.
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
            {periodLogs.map((log) => (
              <li key={log.id}>
                <AppCard variant="soft" padding="10px 12px">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                <div style={{ minWidth: 0 }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.84rem",
                      fontWeight: 600,
                      color: colors.text,
                      fontFamily: sans,
                    }}
                  >
                    {formatPeriodLogLabel(log)}
                  </span>
                  {log.flow ? (
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: "0.72rem",
                        color: colors.muted,
                        fontFamily: sans,
                        textTransform: "capitalize",
                      }}
                    >
                      {log.flow} flow
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => openEditSheet(log)}
                  style={{
                    ...textActionStyle(),
                    flexShrink: 0,
                    textDecoration: "none",
                    padding: "2px 0",
                  }}
                >
                  Edit
                </button>
                  </div>
                </AppCard>
              </li>
            ))}
          </ul>
        )}
      </AppCard>

      <AddPeriodLogSheet
        open={sheetOpen}
        editingLog={editingLog}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onClose={closeSheet}
        onSave={handleSavePeriod}
        onDelete={editingLog ? handleDeletePeriod : undefined}
      />
    </div>
  );
}
