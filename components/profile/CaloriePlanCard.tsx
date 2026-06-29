"use client";

import { useMemo, useState } from "react";
import { Beef, Droplet, Target, Wheat } from "lucide-react";
import type { AppProfile, NutritionPlan } from "../../types/profile";
import { getGoalDirectionLabel } from "../../lib/goalOptions";
import {
  generateSuggestedNutritionPlan,
  suggestedToNutritionPlan,
} from "../../lib/nutritionPlan";
import { ensureCalorieCycling } from "../../lib/calorieCycling";
import { formatNumber } from "../../lib/theme";
import {
  AppButton,
  AppCard,
  StatTile,
  StatTileGrid,
  StatTileSectionLabel,
  StatusPill,
  calorieStatThemes,
  macroStatThemes,
} from "../ui/primitives";
import {
  profileFieldLabel,
  profileInputStyle,
} from "./shared";
import { WeeklyCaloriePatternPreviewCard } from "./WeeklyCaloriePatternPreviewCard";
import {
  profileCardStyle,
  profileColors,
  profileHelperStyle,
  profileSans,
  profileSectionTitleStyle,
} from "./theme";

interface CaloriePlanCardProps {
  profile: AppProfile;
  onNutritionPlanChange: (plan: NutritionPlan) => void;
}

function PlanNumberInput({
  label,
  value,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={profileFieldLabel(label)}>{label}</span>
      <div style={{ display: "flex", alignItems: "stretch" }}>
        <input
          type="number"
          min={0}
          value={value}
          onChange={(event) => onChange(Number(event.target.value) || 0)}
          style={{
            ...profileInputStyle,
            borderTopRightRadius: suffix ? 0 : profileInputStyle.borderRadius,
            borderBottomRightRadius: suffix ? 0 : profileInputStyle.borderRadius,
            borderRight: suffix ? "none" : profileInputStyle.border,
          }}
        />
        {suffix ? (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              borderRadius: "0 12px 12px 0",
              border: `1px solid ${profileColors.border}`,
              borderLeft: "none",
              backgroundColor: profileColors.cream,
              color: profileColors.textSecondary,
              fontSize: "0.78rem",
              whiteSpace: "nowrap",
            }}
          >
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

export function CaloriePlanCard({
  profile,
  onNutritionPlanChange,
}: CaloriePlanCardProps) {
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [editDraft, setEditDraft] = useState<NutritionPlan | null>(null);

  const suggested = useMemo(
    () =>
      generateSuggestedNutritionPlan({
        age: profile.age,
        sex: profile.sex,
        heightCm: profile.heightCm,
        weightKg: profile.weightKg,
        bodyFatPct: profile.bodyFatPct,
        activityLevel: profile.activityLevel,
        detailedActivityProfile: profile.detailedActivityProfile,
        goalDirection: profile.goalDirection,
        goalRate: profile.goalRate,
      }),
    [profile],
  );

  const plan = profile.nutritionPlan;
  const isManual = plan.source === "manual";

  function applySuggestedPlan() {
    onNutritionPlanChange(
      ensureCalorieCycling(suggestedToNutritionPlan(suggested), profile),
    );
    setIsEditingPlan(false);
    setEditDraft(null);
  }

  function startEditingPlan() {
    setEditDraft({
      ...plan,
      macros: { ...plan.macros },
    });
    setIsEditingPlan(true);
  }

  function finishEditingPlan() {
    if (!editDraft) {
      setIsEditingPlan(false);
      return;
    }

    onNutritionPlanChange(
      ensureCalorieCycling(
        {
          ...editDraft,
          source: "manual",
          goalRate: profile.goalRate,
        },
        profile,
      ),
    );
    setIsEditingPlan(false);
    setEditDraft(null);
  }

  function updateEditDraft(planUpdates: NutritionPlan) {
    setEditDraft(planUpdates);
  }

  return (
    <section
      style={{
        ...profileCardStyle(),
        padding: "28px 28px 30px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2 style={{ ...profileSectionTitleStyle(), marginBottom: "4px" }}>
            Calorie Plan
          </h2>
          <p
            style={{
              ...profileHelperStyle(),
              margin: 0,
              fontSize: "0.76rem",
            }}
          >
            Based on your profile — estimates only, not medical advice.
          </p>
        </div>
        <StatusPill
          tone={isManual ? "moderate" : "mild"}
          value={isManual ? "Custom plan" : "Formula plan"}
          style={{ flexShrink: 0 }}
        />
      </div>

      {isEditingPlan && editDraft ? (
        <AppCard variant="soft" padding="12px" style={{ marginBottom: "26px" }}>
          <p
            style={{
              margin: "0 0 10px",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: profileColors.textSecondary,
              fontFamily: profileSans,
            }}
          >
            Edit plan
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "8px",
            }}
          >
            <PlanNumberInput
              label="Calories"
              value={editDraft.calorieTarget}
              suffix="kcal/day"
              onChange={(calorieTarget) =>
                updateEditDraft({ ...editDraft, calorieTarget })
              }
            />
            <PlanNumberInput
              label="Protein"
              value={editDraft.macros.protein}
              suffix="g"
              onChange={(protein) =>
                updateEditDraft({
                  ...editDraft,
                  macros: { ...editDraft.macros, protein },
                })
              }
            />
            <PlanNumberInput
              label="Carbs"
              value={editDraft.macros.carbs}
              suffix="g"
              onChange={(carbs) =>
                updateEditDraft({
                  ...editDraft,
                  macros: { ...editDraft.macros, carbs },
                })
              }
            />
            <PlanNumberInput
              label="Fat"
              value={editDraft.macros.fat}
              suffix="g"
              onChange={(fat) =>
                updateEditDraft({
                  ...editDraft,
                  macros: { ...editDraft.macros, fat },
                })
              }
            />
            <PlanNumberInput
              label="Fiber"
              value={editDraft.macros.fiber}
              suffix="g"
              onChange={(fiber) =>
                updateEditDraft({
                  ...editDraft,
                  macros: { ...editDraft.macros, fiber },
                })
              }
            />
          </div>
        </AppCard>
      ) : (
        <>
          <StatTileGrid gap="8px" style={{ marginBottom: "26px" }}>
            <StatTile
              label="Goal"
              value={getGoalDirectionLabel(profile.goalDirection)}
              icon={Target}
              {...calorieStatThemes.eaten}
            />
            <StatTile
              label="Your target"
              value={formatNumber(plan.calorieTarget)}
              subValue="kcal/day"
              icon={Target}
              {...calorieStatThemes.burned}
            />
          </StatTileGrid>

          <div style={{ marginBottom: "26px" }}>
            <StatTileSectionLabel
              quiet
              style={{ margin: "0 0 12px" }}
            >
              Macro targets
            </StatTileSectionLabel>
            <StatTileGrid gap="12px">
              <StatTile
                label="Protein"
                value={plan.macros.protein}
                subValue="g"
                icon={Beef}
                size="compact"
                {...macroStatThemes.protein}
              />
              <StatTile
                label="Carbs"
                value={plan.macros.carbs}
                subValue="g"
                icon={Wheat}
                size="compact"
                {...macroStatThemes.carbs}
              />
              <StatTile
                label="Fat"
                value={plan.macros.fat}
                subValue="g"
                icon={Droplet}
                size="compact"
                {...macroStatThemes.fat}
              />
              <StatTile
                label="Fiber"
                value={plan.macros.fiber}
                subValue="g"
                icon={Wheat}
                size="compact"
                {...macroStatThemes.fiber}
              />
            </StatTileGrid>
          </div>
        </>
      )}

      <div style={{ marginBottom: "26px" }}>
        <WeeklyCaloriePatternPreviewCard plan={plan} />
      </div>

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
            display: "flex",
            gap: "12px",
            width: "100%",
          }}
        >
          {isEditingPlan ? (
            <AppButton
              variant="primary"
              onClick={finishEditingPlan}
              style={{ flex: 1, minWidth: 0 }}
            >
              Done
            </AppButton>
          ) : (
            <>
              <AppButton
                variant="primary"
                onClick={applySuggestedPlan}
                style={{ flex: 1, minWidth: 0 }}
              >
                Use formula plan
              </AppButton>
              <AppButton
                variant="secondary"
                onClick={startEditingPlan}
                style={{ flex: 1, minWidth: 0 }}
              >
                Edit plan
              </AppButton>
            </>
          )}
        </div>

        {isManual && !isEditingPlan ? (
          <AppButton variant="ghost" onClick={applySuggestedPlan} style={{ width: "100%" }}>
            Reset to formula
          </AppButton>
        ) : null}
      </div>

      <p
        style={{
          ...profileHelperStyle(),
          padding: "14px 16px",
          borderRadius: "12px",
          backgroundColor: profileColors.cream,
          border: `1px solid ${profileColors.divider}`,
          margin: 0,
          fontSize: "0.74rem",
        }}
      >
        Targets are clamped to safe minimums. Use Edit plan to customize calories
        and macros — your home screen and insights use the saved target.
      </p>
    </section>
  );
}
