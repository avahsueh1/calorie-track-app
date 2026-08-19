-- Extend foods table for USDA FoodData Central imports.

alter table public.foods
  add column if not exists fdc_id integer,
  add column if not exists data_type text,
  add column if not exists brand_owner text,
  add column if not exists serving_size_g numeric;

create unique index if not exists foods_fdc_id_unique_idx
  on public.foods (fdc_id);

create index if not exists foods_data_type_idx on public.foods (data_type);

comment on column public.foods.fdc_id is 'USDA FoodData Central ID';
comment on column public.foods.data_type is 'foundation_food | sr_legacy_food | survey_fndds_food | branded_food';
