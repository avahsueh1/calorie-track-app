# USDA FoodData Central import

Import calories and nutrition data from [USDA FoodData Central](https://fdc.nal.usda.gov/download-datasets/) into your Supabase `foods` table.

## What you can download

| Dataset | Size (unzipped) | Foods | Best for |
|---|---|---|---|
| **Foundation Foods** | ~26 MB | ~500+ | Whole foods, ingredients (highest quality) |
| **SR Legacy** | ~54 MB | ~7,800 | Common reference foods (final 2018 release) |
| **FNDDS** | ~1.6 GB | ~7,000+ | Survey / prepared dishes |
| **Branded Foods** | ~2.9 GB | **400,000+** | Packaged products, chain items |
| **Full CSV** | ~3.1 GB | All of the above | One archive with every table |

**Recommendation:** Start with **Foundation + SR Legacy** (~8k foods). That covers most whole foods without blowing past Supabase’s free-tier database limit (~500 MB).

## Prerequisites

1. Run `supabase/migrations/001_foods.sql` (if not already done)
2. Run `supabase/migrations/002_foods_usda_columns.sql` in the Supabase SQL Editor
3. Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get the **service_role** key from Supabase → **Project Settings → API**. Never commit it or expose it in the browser — it bypasses row-level security.

## Install script dependencies

```bash
npm install
```

## Commands

```bash
# Default: Foundation Foods + SR Legacy (~8k foods, ~80 MB download)
npm run usda:import

# Download zips only (no Supabase upload)
npm run usda:import -- --download-only --all

# Import everything (WARNING: ~3 GB download, 400k+ foods — needs paid Supabase plan)
npm run usda:import -- --all

# Import one dataset
npm run usda:import -- --datasets branded

# Test with first 100 rows (no upload)
npm run usda:import -- --limit 100 --dry-run

# Test upload of 500 foods
npm run usda:import -- --limit 500
```

## Manual download from the website

You can also download directly from [fdc.nal.usda.gov/download-datasets](https://fdc.nal.usda.gov/download-datasets/):

1. Click **Downloads** on each card (Foundation, SR Legacy, FNDDS, Branded)
2. Or use **Full Download of All Data Types** for one CSV archive
3. Place zips in `data/usda/raw/` and run with `--download-only` skipped (script re-downloads by default)

## Data attribution

U.S. Department of Agriculture, Agricultural Research Service. FoodData Central, 2019. fdc.nal.usda.gov. Public domain (CC0 / U.S. Government work).

## Troubleshooting

| Issue | Fix |
|---|---|
| `Invalid API key` | Use **service_role** key, not anon key, for import |
| `column fdc_id does not exist` | Run `002_foods_usda_columns.sql` |
| Import very slow / DB full | Use `--limit` or import only `foundation,sr-legacy` |
| Download 404 | USDA may have updated filenames; edit `scripts/usda/config.ts` release date |
