export interface FoodRow {
  id: string;
  name: string;
  calories_per_serving: number;
  serving_unit: string;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  fdc_id: number | null;
  data_type: string | null;
  brand_owner: string | null;
  serving_size_g: number | null;
  created_by: string | null;
  created_at: string;
}

export interface FoodSearchResult {
  id: string;
  name: string;
  caloriesPerServing: number;
  servingUnit: string;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
}

export interface Database {
  public: {
    Tables: {
      foods: {
        Row: FoodRow;
        Insert: Omit<FoodRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<FoodRow>;
      };
    };
  };
}
