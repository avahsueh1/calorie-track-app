# Calorie Tracker — MVP Scope

## Goals

Build a simple, reliable calorie-tracking app that helps users log food and activity, view a daily calorie summary, and track progress against their energy needs — all without external paid APIs.

**MVP focus:** Basic calorie tracking, manual food logging, activity logging, and a daily summary. Targets are set from profile data and standard formulas — not auto-adjusted from trends in the first release.

## Non-goals (MVP)

- Paid AI APIs (OpenAI, Anthropic, etc.)
- Photo-based food recognition
- Wearable device integrations
- Social features, meal plans, or mental health modules
- Macro coaching or personalized AI recommendations
- Dynamic calorie adjustments / metabolic adaptation (see Future roadmap)
- Restaurant menu logging (see Future roadmap)

## User stories

1. **Sign up / log in** — Create an account with email and password via Supabase Auth.
2. **Set profile** — Enter age, sex, height, weight, and optional body fat percentage; choose an activity level for TDEE calculation.
3. **Log food** — Search or select from the `foods` table, enter servings, and save a food log entry.
4. **Log activity** — Select an activity type, enter duration, and save an activity log entry with estimated calories burned.
5. **View daily summary** — See total intake, total burn, net calories, and comparison to TDEE target on a simple dashboard.

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

## Phase 2+ build order

1. Runnable Next.js shell — `tsconfig.json`, `next.config.ts`, `.gitignore`, `app/layout.tsx`, `app/page.tsx`
2. Supabase setup — project, env vars, tables, RLS policies, seed `foods` and `activities`
3. Auth — signup/login pages, session middleware, protected routes
4. Profile — onboarding form for age, sex, height, weight, body fat %
5. Food logging — search/select from `foods`, log servings
6. Activity logging — select activity, enter duration, MET-based burn
7. Daily summary + dashboard — net calories, TDEE comparison, simple cards
8. Polish — basic styling, empty states, form validation
