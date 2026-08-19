-- Fuzzy food search using pg_trgm (typo-tolerant).
-- Run in Supabase SQL Editor after 001_foods.sql.

create or replace function public.search_foods(
  search_query text,
  result_limit integer default 12
)
returns setof public.foods
language sql
stable
security invoker
set search_path = public
as $$
  with normalized as (
    select trim(lower(search_query)) as q
  )
  select f.*
  from public.foods f
  cross join normalized n
  where
    length(n.q) < 2
    or f.name ilike '%' || search_query || '%'
    or (
      length(n.q) >= 3
      and (
        word_similarity(n.q, lower(f.name)) > 0.35
        or similarity(lower(f.name), n.q) > 0.25
      )
    )
  order by
    case when lower(f.name) like n.q || '%' then 0 else 1 end,
    case when f.name ilike '%' || search_query || '%' then 0 else 1 end,
    greatest(
      word_similarity(n.q, lower(f.name)),
      similarity(lower(f.name), n.q)
    ) desc,
    f.name asc
  limit greatest(result_limit, 1);
$$;

grant execute on function public.search_foods(text, integer) to anon, authenticated;
