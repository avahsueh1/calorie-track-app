-- Foods reference table: seeded common items + user-added entries.
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).

create extension if not exists "pgcrypto";

-- Trigram extension powers fuzzy name search.
create extension if not exists pg_trgm;

create table if not exists public.foods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  calories_per_serving numeric not null check (calories_per_serving >= 0),
  serving_unit text not null,
  protein_g numeric check (protein_g is null or protein_g >= 0),
  carbs_g numeric check (carbs_g is null or carbs_g >= 0),
  fat_g numeric check (fat_g is null or fat_g >= 0),
  fiber_g numeric check (fiber_g is null or fiber_g >= 0),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists foods_name_trgm_idx on public.foods using gin (name gin_trgm_ops);
create index if not exists foods_name_lower_idx on public.foods (lower(name));

alter table public.foods enable row level security;

drop policy if exists "Read seeded foods" on public.foods;
create policy "Read seeded foods"
  on public.foods for select
  using (created_by is null);

drop policy if exists "Users read own foods" on public.foods;
create policy "Users read own foods"
  on public.foods for select
  using (auth.uid() = created_by);

drop policy if exists "Users insert own foods" on public.foods;
create policy "Users insert own foods"
  on public.foods for insert
  with check (auth.uid() = created_by);

drop policy if exists "Users update own foods" on public.foods;
create policy "Users update own foods"
  on public.foods for update
  using (auth.uid() = created_by);

drop policy if exists "Users delete own foods" on public.foods;
create policy "Users delete own foods"
  on public.foods for delete
  using (auth.uid() = created_by);

-- Seed common foods (idempotent — skips if name already exists as seeded food).
insert into public.foods (name, calories_per_serving, serving_unit, protein_g, carbs_g, fat_g, fiber_g)
select v.name, v.calories, v.serving, v.protein, v.carbs, v.fat, v.fiber
from (values
  ('Banana', 105, '1 medium (118g)', 1.3, 27.0, 0.4, 3.1),
  ('Apple', 95, '1 medium (182g)', 0.5, 25.0, 0.3, 4.4),
  ('Orange', 62, '1 medium (131g)', 1.2, 15.4, 0.2, 3.1),
  ('Strawberries', 49, '1 cup (152g)', 1.0, 11.7, 0.5, 3.0),
  ('Blueberries', 84, '1 cup (148g)', 1.1, 21.4, 0.5, 3.6),
  ('Grapes', 104, '1 cup (151g)', 1.1, 27.3, 0.2, 1.4),
  ('Avocado', 240, '1/2 medium (100g)', 3.0, 12.8, 22.0, 10.0),
  ('Broccoli', 55, '1 cup chopped (91g)', 3.7, 11.2, 0.6, 5.2),
  ('Spinach', 7, '1 cup raw (30g)', 0.9, 1.1, 0.1, 0.7),
  ('Carrots', 52, '1 cup chopped (128g)', 1.2, 12.3, 0.3, 3.6),
  ('Sweet potato', 103, '1 medium baked (114g)', 2.3, 23.6, 0.1, 3.8),
  ('White rice, cooked', 205, '1 cup (158g)', 4.3, 44.5, 0.4, 0.6),
  ('Brown rice, cooked', 216, '1 cup (195g)', 5.0, 44.8, 1.8, 3.5),
  ('Quinoa, cooked', 222, '1 cup (185g)', 8.1, 39.4, 3.6, 5.2),
  ('Oatmeal, cooked', 158, '1 cup (234g)', 6.0, 27.4, 3.2, 4.0),
  ('Whole wheat bread', 81, '1 slice (32g)', 4.0, 13.8, 1.1, 1.9),
  ('White bread', 75, '1 slice (25g)', 2.5, 14.0, 1.0, 0.8),
  ('Pasta, cooked', 220, '1 cup (140g)', 8.1, 43.2, 1.3, 2.5),
  ('Chicken breast, grilled', 165, '100g', 31.0, 0.0, 3.6, 0.0),
  ('Chicken thigh, roasted', 209, '100g', 26.0, 0.0, 10.9, 0.0),
  ('Ground beef, 90% lean', 176, '100g cooked', 25.0, 0.0, 8.0, 0.0),
  ('Salmon, baked', 206, '100g', 22.1, 0.0, 12.4, 0.0),
  ('Tuna, canned in water', 116, '100g', 25.5, 0.0, 0.8, 0.0),
  ('Shrimp, cooked', 99, '100g', 24.0, 0.2, 0.3, 0.0),
  ('Egg, large', 72, '1 large (50g)', 6.3, 0.4, 4.8, 0.0),
  ('Egg whites', 17, '1 large (33g)', 3.6, 0.2, 0.1, 0.0),
  ('Greek yogurt, plain nonfat', 100, '170g (3/4 cup)', 17.0, 6.0, 0.7, 0.0),
  ('Greek yogurt, plain 2%', 150, '170g (3/4 cup)', 15.0, 8.0, 4.0, 0.0),
  ('Cottage cheese, low fat', 183, '1 cup (226g)', 24.0, 10.0, 5.0, 0.0),
  ('Cheddar cheese', 113, '1 oz (28g)', 7.0, 0.4, 9.3, 0.0),
  ('Mozzarella cheese', 85, '1 oz (28g)', 6.3, 0.6, 6.3, 0.0),
  ('Milk, 2%', 122, '1 cup (244g)', 8.0, 11.7, 4.8, 0.0),
  ('Almond milk, unsweetened', 30, '1 cup (240ml)', 1.0, 1.0, 2.5, 0.5),
  ('Peanut butter', 188, '2 tbsp (32g)', 8.0, 6.0, 16.0, 2.0),
  ('Almonds', 164, '1 oz (28g / ~23 nuts)', 6.0, 6.1, 14.2, 3.5),
  ('Walnuts', 185, '1 oz (28g / ~14 halves)', 4.3, 3.9, 18.5, 1.9),
  ('Black beans, cooked', 227, '1 cup (172g)', 15.2, 40.8, 0.9, 15.0),
  ('Chickpeas, cooked', 269, '1 cup (164g)', 14.5, 45.0, 4.2, 12.5),
  ('Lentils, cooked', 230, '1 cup (198g)', 17.9, 39.9, 0.8, 15.6),
  ('Tofu, firm', 144, '100g', 15.8, 3.9, 8.7, 2.3),
  ('Hummus', 166, '1/4 cup (70g)', 4.8, 14.0, 9.6, 3.4),
  ('Potato, baked with skin', 161, '1 medium (173g)', 4.3, 36.6, 0.2, 3.8),
  ('French fries', 365, '1 medium serving (117g)', 4.0, 48.0, 17.0, 4.6),
  ('Pizza, cheese slice', 285, '1 slice (107g)', 12.0, 36.0, 10.0, 2.5),
  ('Hamburger, plain', 354, '1 sandwich', 17.0, 29.0, 19.0, 1.5),
  ('Turkey sandwich', 320, '1 sandwich', 22.0, 35.0, 10.0, 3.0),
  ('Caesar salad', 184, '1.5 cups', 4.0, 8.0, 15.0, 2.0),
  ('Protein bar', 200, '1 bar (60g)', 20.0, 22.0, 6.0, 3.0),
  ('Granola bar', 132, '1 bar (28g)', 2.0, 19.0, 5.0, 1.5),
  ('Protein shake', 160, '1 scoop + water', 25.0, 4.0, 2.0, 1.0),
  ('Coffee, black', 2, '1 cup (240ml)', 0.3, 0.0, 0.0, 0.0),
  ('Latte, whole milk', 190, '12 oz (355ml)', 10.0, 15.0, 7.0, 0.0),
  ('Orange juice', 112, '1 cup (248g)', 1.7, 25.8, 0.5, 0.5),
  ('Coca-Cola', 140, '12 oz can (355ml)', 0.0, 39.0, 0.0, 0.0),
  ('Beer', 153, '12 oz (355ml)', 1.3, 12.6, 0.0, 0.0),
  ('Red wine', 125, '5 oz (148ml)', 0.1, 3.8, 0.0, 0.0),
  ('Ice cream, vanilla', 137, '1/2 cup (66g)', 2.3, 15.6, 7.3, 0.5),
  ('Dark chocolate', 170, '1 oz (28g)', 2.2, 13.0, 12.0, 3.1),
  ('Honey', 64, '1 tbsp (21g)', 0.1, 17.3, 0.0, 0.0),
  ('Olive oil', 119, '1 tbsp (14g)', 0.0, 0.0, 13.5, 0.0),
  ('Butter', 102, '1 tbsp (14g)', 0.1, 0.0, 11.5, 0.0),
  ('Bagel, plain', 289, '1 medium (105g)', 11.0, 56.0, 2.0, 2.4),
  ('Tortilla, flour', 146, '1 medium (45g)', 4.0, 24.0, 3.0, 1.5),
  ('Burrito bowl, chicken', 650, '1 bowl', 42.0, 65.0, 22.0, 10.0),
  ('Sushi roll, California', 255, '8 pieces', 9.0, 38.0, 7.0, 2.0),
  ('Stir fry, chicken & vegetables', 320, '1 cup', 28.0, 18.0, 14.0, 4.0)
) as v(name, calories, serving, protein, carbs, fat, fiber)
where not exists (
  select 1 from public.foods f
  where lower(f.name) = lower(v.name) and f.created_by is null
);
