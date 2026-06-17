# Calorie Tracker — MVP Scope

## Positioning

A calorie tracker for women that helps connect **food, activity, weight, mood, energy, cravings, and cycle-related patterns** — so daily choices feel easier to understand in context, not judged in isolation.

The app supports awareness and pattern tracking. It does not diagnose, treat, or claim to fix hormonal or medical conditions.

## Goals

Build a simple, reliable calorie-tracking app that helps users log food and activity, view a daily calorie summary, and track progress against their energy needs — all without external paid APIs.

**MVP focus:** A working calorie tracker with food logging, activity logging, user profile, and daily calorie summary. Targets are set from profile data and standard formulas — not auto-adjusted from trends in the first release.

The lean differentiator layer (below) adds lightweight body and cycle context on top of that core — without turning the MVP into a medical or AI product.

## Lean Differentiator Layer

Small MVP additions that connect calories to how the body feels day to day. Wording throughout should emphasize **track patterns** and **support awareness**, not optimization or medical outcomes.

### 1. Daily Body Check-In

A simple daily form with:

- **energy:** 1–5
- **mood:** 1–5
- **hunger:** 1–5
- **cravings:** none / mild / strong
- **sleep quality:** 1–5
- **stress:** 1–5
- **bloating:** none / mild / strong
- **soreness:** none / mild / strong
- **notes:** optional

### 2. Cycle Context

In profile settings:

- **cycle tracking enabled:** yes / no
- **last period start date**
- **average cycle length**
- **average period length**
- **optional current life stage:** regular cycle / irregular cycle / perimenopause / menopause / prefer not to say

### 3. Simple Cycle-Aware Dashboard Label

No complex predictions. Just simple labels such as:

- Cycle day 18
- Estimated luteal phase
- Period expected in about 6 days
- Cycle tracking off

### 4. Flexible Daily Target Mode

Options:

- Maintain
- Gentle deficit
- Performance / energy
- Recovery day

For MVP, these mainly adjust **messaging and framing** on the dashboard — not complex calorie math or automatic target recalculation.

### 5. Basic Pattern Insight Placeholder

**Before enough data:**

- “Log at least 7 days to see body pattern insights.”

**After enough data:**

- Show simple averages only (e.g. average energy, mood, or hunger by cycle phase label) — not AI-generated recommendations.

## Non-goals (MVP)

- **No AI recommendations yet** — no meal suggestions, coaching, or personalized AI insights
- **No medical claims** — no language about fixing, optimizing, or balancing hormones; not medical advice
- **No complex cycle forecasting** — no ovulation prediction, fertility windows, or clinical-grade cycle modeling
- **No full menopause analytics yet** — life stage is optional context only, not a dedicated analytics module
- **No dynamic metabolic adaptation yet** — targets stay fixed from profile and formulas (see Future roadmap)
- **No restaurant database yet** — manual food logging and user-added entries only (see Future roadmap)
- **No barcode scanning yet**
- **No wearable integrations yet**
- Paid AI APIs (OpenAI, Anthropic, etc.)
- Photo-based food recognition
- Social features, meal plans, or mental health modules

## User stories

### Core MVP

1. **Sign up / log in** — Create an account with email and password via Supabase Auth.
2. **Set profile** — Enter age, sex, height, weight, and optional body fat percentage; choose an activity level for TDEE calculation.
3. **Log food** — Search or select from the `foods` table, enter servings, and save a food log entry.
4. **Log activity** — Select an activity type, enter duration, and save an activity log entry with estimated calories burned.
5. **View daily summary** — See total intake, total burn, net calories, and comparison to TDEE target on a simple dashboard.

### Lean differentiator layer

6. **Daily body check-in** — Complete the daily form (energy, mood, hunger, cravings, sleep, stress, bloating, soreness, optional notes).
7. **Configure cycle context** — Enable or disable cycle tracking; set last period start, average cycle/period length, and optional life stage.
8. **See cycle-aware label** — Dashboard shows a simple cycle day or phase label when tracking is on, or “Cycle tracking off” when disabled.
9. **Choose daily target mode** — Select Maintain, Gentle deficit, Performance / energy, or Recovery day for contextual messaging.
10. **View pattern placeholder** — See the 7-day logging prompt until enough data exists; then see simple averages, not AI insights.

## Data model

### `profiles`

| Column | Type | Notes |
|---|---|---|
| `user_id` | uuid (PK, FK → auth.users) | Supabase Auth user |
| `age` | integer | Years |
| `sex` | text | `male` or `female` (used in BMR formula) |
| `height_cm` | numeric | Centimeters |
| `weight_kg` | numeric | Kilograms |
| `body_fat_pct` | numeric (nullable) | Optional |
| `activity_level` | text | `sedentary`, `light`, `moderate`, `active`, `very_active` |
| `cycle_tracking_enabled` | boolean | Default false |
| `last_period_start` | date (nullable) | When cycle tracking is on |
| `avg_cycle_length_days` | integer (nullable) | e.g. 28 |
| `avg_period_length_days` | integer (nullable) | e.g. 5 |
| `life_stage` | text (nullable) | `regular_cycle`, `irregular_cycle`, `perimenopause`, `menopause`, `prefer_not_to_say` |

### `daily_check_ins`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `user_id` | uuid (FK → auth.users) | |
| `check_in_date` | date | One row per user per day |
| `energy` | smallint | 1–5 |
| `mood` | smallint | 1–5 |
| `hunger` | smallint | 1–5 |
| `cravings` | text | `none`, `mild`, `strong` |
| `sleep_quality` | smallint | 1–5 |
| `stress` | smallint | 1–5 |
| `bloating` | text | `none`, `mild`, `strong` |
| `soreness` | text | `none`, `mild`, `strong` |
| `notes` | text (nullable) | Optional free text |
| `daily_target_mode` | text (nullable) | `maintain`, `gentle_deficit`, `performance`, `recovery` |

### `foods`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `name` | text | Food name |
| `calories_per_serving` | numeric | kcal |
| `serving_unit` | text | e.g. `g`, `cup`, `piece` |
| `protein_g` | numeric (nullable) | Optional macro |
| `carbs_g` | numeric (nullable) | Optional macro |
| `fat_g` | numeric (nullable) | Optional macro |
| `created_by` | uuid (nullable, FK) | Null for seeded foods; set for user-added foods |

### `food_logs`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `user_id` | uuid (FK → auth.users) | |
| `food_id` | uuid (FK → foods) | |
| `servings` | numeric | |
| `logged_at` | timestamptz | Defaults to now |

### `activities`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `name` | text | e.g. Walking, Running, Cycling |
| `met_value` | numeric | Metabolic equivalent of task |

### `activity_logs`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `user_id` | uuid (FK → auth.users) | |
| `activity_id` | uuid (FK → activities) | |
| `duration_minutes` | numeric | |
| `logged_at` | timestamptz | Defaults to now |

## Row-level security (RLS)

- `profiles` — users can read/write only their own row (`user_id = auth.uid()`)
- `daily_check_ins` — users can read/write only their own rows
- `food_logs` — users can read/write only their own rows
- `activity_logs` — users can read/write only their own rows
- `foods` — all users can read seeded foods; users can insert foods where `created_by = auth.uid()`
- `activities` — all authenticated users can read (reference table)

## Calorie formulas

All calculations live in `lib/calories.ts` (Phase 2). Pure functions — deterministic, testable, zero API cost.

### BMR — Mifflin-St Jeor

- **Male:** `10 × weight_kg + 6.25 × height_cm − 5 × age + 5`
- **Female:** `10 × weight_kg + 6.25 × height_cm − 5 × age − 161`

### TDEE

`TDEE = BMR × activity_multiplier`

| Activity level | Multiplier |
|---|---|
| sedentary | 1.2 |
| light | 1.375 |
| moderate | 1.55 |
| active | 1.725 |
| very_active | 1.9 |

### Food intake

`calories = calories_per_serving × servings`

### Activity burn (MET-based)

`calories_burned = MET × weight_kg × (duration_minutes / 60)`

### Daily summary

```
net_calories = total_food_intake − total_activity_burn
remaining    = TDEE − net_calories   (positive = under target)
```

Daily target mode does **not** change these formulas in MVP — it only affects user-facing copy on the dashboard.

## AI extension points (future — not implemented)

The MVP keeps core calorie math separate from any AI layer so features can be added later without refactoring logs or profiles.

### `lib/calories.ts`

Pure formula functions. AI never replaces these — it only augments recommendations on top of the same data.

### `lib/ai/gateway.ts` (future stub)

Planned facade interface:

```typescript
// Future — not implemented in MVP
interface AIHealthGateway {
  suggestMeals(context: UserCalorieContext): Promise<MealSuggestion[]>;
  suggestWorkout(context: UserActivityContext): Promise<WorkoutSuggestion[]>;
  generateInsights(context: UserHabitContext): Promise<HealthInsight[]>;
}
```

- No AI SDK dependencies in `package.json` until explicitly enabled
- No API keys required for MVP
- Log and profile schemas remain stable so AI can read historical data later

## Future roadmap (not MVP)

Features planned after the core MVP is stable. **Do not implement these in the first release.**

### Dynamic calorie adjustments / metabolic adaptation

Adjust calorie and macro targets on a weekly cadence based on weight trends and intake history (e.g. when actual loss/gain diverges from expected rates).

**Why deferred:**
- Requires enough logged data (weight entries, consistent food logs) before adjustments are meaningful
- Needs careful safety messaging so users understand limits, medical context, and that the app is not medical advice
- MVP should use fixed TDEE/budget from profile and formulas until logging habits are established

### Restaurant menu logging

Help users log chain-restaurant meals via a restaurant menu database or crowdsourced nutrition data (search by restaurant and menu item instead of only generic foods).

**Why deferred:**
- MVP food logging starts with a simple manual `foods` table and user-added entries
- Restaurant data sourcing, accuracy, and maintenance add scope beyond basic calorie tracking
- Can be layered on once core food logging and daily summary work reliably

### Advanced cycle and body pattern analytics

Richer correlations between check-ins, cycle phase, and intake — potentially with AI-assisted summaries. Deferred until simple averages and manual logging habits are proven.

## Phase 2+ build order

1. Runnable Next.js shell — `tsconfig.json`, `next.config.ts`, `.gitignore`, `app/layout.tsx`, `app/page.tsx`
2. Supabase setup — project, env vars, tables, RLS policies, seed `foods` and `activities`
3. Auth — signup/login pages, session middleware, protected routes
4. Profile — onboarding form for age, sex, height, weight, body fat %, and optional cycle context
5. Food logging — search/select from `foods`, log servings
6. Activity logging — select activity, enter duration, MET-based burn
7. Daily summary + dashboard — net calories, TDEE comparison, cycle-aware label, daily target mode messaging
8. Daily body check-in — form and storage
9. Pattern insight placeholder — 7-day gate and simple averages
10. Polish — basic styling, empty states, form validation
