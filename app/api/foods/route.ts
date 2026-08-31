import { NextResponse } from "next/server";
import { fuzzySearchPrefix, rankFoodMatches } from "../../../lib/fuzzyMatch";
import { mapFoodRow, normalizeFoodQuery } from "../../../lib/foods";
import { createServerClient } from "../../../lib/supabase/server";
import type { FoodRow } from "../../../types/database";

const FOOD_COLUMNS =
  "id, name, calories_per_serving, serving_unit, protein_g, carbs_g, fat_g, fiber_g, data_type, created_by, created_at";

const CANDIDATE_POOL = 250;

async function fetchFoodCandidates(
  supabase: NonNullable<ReturnType<typeof createServerClient>>,
  query: string,
  limit: number,
) {
  const exact = await supabase
    .from("foods")
    .select(FOOD_COLUMNS)
    .ilike("name", `%${query}%`)
    .limit(CANDIDATE_POOL)
    .returns<FoodRow[]>();

  if (exact.error) {
    return { data: null, error: exact.error };
  }

  const merged = new Map<string, FoodRow>();
  for (const row of exact.data ?? []) {
    merged.set(row.id, row);
  }

  const prefix = fuzzySearchPrefix(query);
  if (prefix) {
    const fuzzy = await supabase
      .from("foods")
      .select(FOOD_COLUMNS)
      .ilike("name", `%${prefix}%`)
      .limit(CANDIDATE_POOL)
      .returns<FoodRow[]>();

    if (!fuzzy.error) {
      for (const row of fuzzy.data ?? []) {
        merged.set(row.id, row);
      }
    }
  }

  const ranked = rankFoodMatches(Array.from(merged.values()), query, limit);
  return { data: ranked, error: null };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = normalizeFoodQuery(searchParams.get("q") ?? "");
  const limit = Math.min(
    Math.max(Number(searchParams.get("limit") ?? 12), 1),
    30,
  );

  const supabase = createServerClient();
  if (!supabase) {
    return NextResponse.json(
      {
        error: "Supabase is not configured",
        hint: "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local",
        foods: [],
      },
      { status: 503 },
    );
  }

  if (query.length >= 2) {
    const { data, error } = await fetchFoodCandidates(supabase, query, limit);

    if (error) {
      return NextResponse.json(
        { error: error.message, foods: [] },
        { status: 500 },
      );
    }

    return NextResponse.json({
      foods: (data ?? []).map(mapFoodRow),
    });
  }

  const { data, error } = await supabase
    .from("foods")
    .select(FOOD_COLUMNS)
    .order("name", { ascending: true })
    .limit(limit)
    .returns<FoodRow[]>();

  if (error) {
    return NextResponse.json(
      { error: error.message, foods: [] },
      { status: 500 },
    );
  }

  const foods: FoodRow[] = data ?? [];
  return NextResponse.json({
    foods: foods.map(mapFoodRow),
  });
}
