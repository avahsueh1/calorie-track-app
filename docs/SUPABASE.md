# Supabase setup

This app uses Supabase PostgreSQL for a shared **foods** database (calories + macros for common items).

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com/) and create a free project.
2. Open **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Configure environment variables

Copy `.env.example` to `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Paste your URL and anon key, then restart the dev server.

## 3. Run the database migration

In the Supabase dashboard, open **SQL Editor → New query**, paste the contents of:

```
supabase/migrations/001_foods.sql
```

Click **Run**. This creates the `foods` table, row-level security policies, and seeds **60+ common foods** (fruits, proteins, grains, snacks, drinks, etc.) with calories and nutritional facts per serving.

## 4. Verify

1. In Supabase **Table Editor**, open `foods` — you should see seeded rows.
2. In the app, go to **Log → Food** and search for e.g. `chicken` or `banana`.
3. Selecting a result auto-fills calories, protein, carbs, and fat.

## Schema

| Column | Description |
|---|---|
| `name` | Food name |
| `calories_per_serving` | kcal per serving |
| `serving_unit` | e.g. `1 medium (118g)`, `100g`, `1 cup` |
| `protein_g`, `carbs_g`, `fat_g`, `fiber_g` | Macros per serving |
| `created_by` | `null` for seeded foods; user id for custom entries (future) |

## API

`GET /api/foods?q=banana&limit=12` — search foods by name (requires Supabase env vars).

## Adding more foods

Insert rows in the Supabase table editor, or run SQL:

```sql
insert into public.foods (name, calories_per_serving, serving_unit, protein_g, carbs_g, fat_g, fiber_g)
values ('Your food', 250, '1 serving', 20, 30, 8, 4);
```

Leave `created_by` null for foods visible to all users.
