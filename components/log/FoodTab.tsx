"use client";

import { useState } from "react";
import { useDailyLog } from "../providers/DailyLogProvider";
import type { DailyFoodEntry, MealType } from "../../types/wellness";
import {
  cardStyle,
  colors,
  formatNumber,
  labelStyle,
  sans,
  sectionTitleStyle,
} from "../dashboard/theme";
import {
  cardSectionStyle,
  dangerButtonStyle,
  fieldLabel,
  inputStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  selectStyle,
  textActionStyle,
} from "./shared";

const mealTypes: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

type FoodFormState = Omit<DailyFoodEntry, "id">;

function emptyFoodForm(): FoodFormState {
  return {
    name: "",
    meal: "Lunch",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };
}

function foodToForm(food: DailyFoodEntry): FoodFormState {
  return {
    name: food.name,
    meal: food.meal,
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
  };
}

function validateFoodForm(
  form: FoodFormState,
  caloriesInput: string,
): string | null {
  const trimmed = form.name.trim();
  const cal = Number(caloriesInput);
  if (!trimmed) {
    return "Enter a food name.";
  }
  if (!caloriesInput || Number.isNaN(cal) || cal <= 0) {
    return "Enter valid calories.";
  }
  return null;
}

export function FoodTab() {
  const { foods, addFood, updateFood, deleteFood } = useDailyLog();
  const [name, setName] = useState("");
  const [meal, setMeal] = useState<MealType>("Lunch");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FoodFormState>(emptyFoodForm());
  const [editCalories, setEditCalories] = useState("");
  const [editError, setEditError] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const form: FoodFormState = {
      name,
      meal,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
    };
    const validationError = validateFoodForm(form, calories);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    addFood({
      ...form,
      name: form.name.trim(),
      calories: Number(calories),
    });
    setName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
  }

  function startEditing(item: DailyFoodEntry) {
    setEditingId(item.id);
    setEditForm(foodToForm(item));
    setEditCalories(String(item.calories));
    setEditError("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditForm(emptyFoodForm());
    setEditCalories("");
    setEditError("");
  }

  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) {
      return;
    }
    const validationError = validateFoodForm(editForm, editCalories);
    if (validationError) {
      setEditError(validationError);
      return;
    }
    updateFood(editingId, {
      ...editForm,
      name: editForm.name.trim(),
      calories: Number(editCalories),
      protein: Number(editForm.protein) || 0,
      carbs: Number(editForm.carbs) || 0,
      fat: Number(editForm.fat) || 0,
    });
    cancelEditing();
  }

  function handleDelete(id: string) {
    deleteFood(id);
    if (editingId === id) {
      cancelEditing();
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <section style={{ ...cardStyle(), ...cardSectionStyle() }}>
        <h2 style={{ ...sectionTitleStyle(), marginBottom: "14px" }}>
          Add food
        </h2>
        <form
          onSubmit={handleAdd}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <div>
            <label style={fieldLabel("Food name")} htmlFor="food-name">
              Food name
            </label>
            <input
              id="food-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Greek yogurt bowl"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={fieldLabel("Meal type")} htmlFor="meal-type">
              Meal type
            </label>
            <select
              id="meal-type"
              value={meal}
              onChange={(e) => setMeal(e.target.value as MealType)}
              style={selectStyle}
            >
              {mealTypes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px",
            }}
          >
            <div>
              <label style={fieldLabel("Calories")} htmlFor="food-calories">
                Calories
              </label>
              <input
                id="food-calories"
                type="number"
                min={0}
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="kcal"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={fieldLabel("Protein (g)")} htmlFor="food-protein">
                Protein (g)
              </label>
              <input
                id="food-protein"
                type="number"
                min={0}
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="Optional"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={fieldLabel("Carbs (g)")} htmlFor="food-carbs">
                Carbs (g)
              </label>
              <input
                id="food-carbs"
                type="number"
                min={0}
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="Optional"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={fieldLabel("Fat (g)")} htmlFor="food-fat">
                Fat (g)
              </label>
              <input
                id="food-fat"
                type="number"
                min={0}
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                placeholder="Optional"
                style={inputStyle}
              />
            </div>
          </div>
          {error && (
            <p
              style={{
                margin: 0,
                fontSize: "0.78rem",
                color: colors.terracotta,
                fontFamily: sans,
              }}
            >
              {error}
            </p>
          )}
          <button type="submit" style={primaryButtonStyle()}>
            Add Food
          </button>
        </form>
      </section>

      <section style={{ ...cardStyle(), ...cardSectionStyle() }}>
        <h2 style={{ ...sectionTitleStyle(), marginBottom: "14px" }}>
          Today&apos;s food
        </h2>
        {mealTypes.map((mealGroup) => {
          const items = foods.filter((f) => f.meal === mealGroup);
          return (
            <div
              key={mealGroup}
              style={{ marginBottom: items.length ? "14px" : "10px" }}
            >
              <p style={{ ...labelStyle(), marginBottom: "8px" }}>{mealGroup}</p>
              {items.length === 0 ? (
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.78rem",
                    color: colors.muted,
                    fontFamily: sans,
                    fontStyle: "italic",
                    padding: "8px 0",
                  }}
                >
                  No {mealGroup.toLowerCase()} logged yet.
                </p>
              ) : (
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {items.map((item) => (
                    <li
                      key={item.id}
                      style={{
                        backgroundColor: colors.shell,
                        borderRadius: "12px",
                        padding: "10px 12px",
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      {editingId === item.id ? (
                        <form
                          onSubmit={handleSaveEdit}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              color: colors.text,
                              fontFamily: sans,
                            }}
                          >
                            Edit food
                          </p>
                          <div>
                            <label
                              style={fieldLabel("Food name")}
                              htmlFor={`edit-name-${item.id}`}
                            >
                              Food name
                            </label>
                            <input
                              id={`edit-name-${item.id}`}
                              type="text"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm((current) => ({
                                  ...current,
                                  name: e.target.value,
                                }))
                              }
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label
                              style={fieldLabel("Meal type")}
                              htmlFor={`edit-meal-${item.id}`}
                            >
                              Meal type
                            </label>
                            <select
                              id={`edit-meal-${item.id}`}
                              value={editForm.meal}
                              onChange={(e) =>
                                setEditForm((current) => ({
                                  ...current,
                                  meal: e.target.value as MealType,
                                }))
                              }
                              style={selectStyle}
                            >
                              {mealTypes.map((m) => (
                                <option key={m} value={m}>
                                  {m}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(2, 1fr)",
                              gap: "8px",
                            }}
                          >
                            <div>
                              <label
                                style={fieldLabel("Calories")}
                                htmlFor={`edit-calories-${item.id}`}
                              >
                                Calories
                              </label>
                              <input
                                id={`edit-calories-${item.id}`}
                                type="number"
                                min={0}
                                value={editCalories}
                                onChange={(e) => setEditCalories(e.target.value)}
                                style={inputStyle}
                              />
                            </div>
                            <div>
                              <label
                                style={fieldLabel("Protein (g)")}
                                htmlFor={`edit-protein-${item.id}`}
                              >
                                Protein (g)
                              </label>
                              <input
                                id={`edit-protein-${item.id}`}
                                type="number"
                                min={0}
                                value={editForm.protein || ""}
                                onChange={(e) =>
                                  setEditForm((current) => ({
                                    ...current,
                                    protein: Number(e.target.value) || 0,
                                  }))
                                }
                                style={inputStyle}
                              />
                            </div>
                            <div>
                              <label
                                style={fieldLabel("Carbs (g)")}
                                htmlFor={`edit-carbs-${item.id}`}
                              >
                                Carbs (g)
                              </label>
                              <input
                                id={`edit-carbs-${item.id}`}
                                type="number"
                                min={0}
                                value={editForm.carbs || ""}
                                onChange={(e) =>
                                  setEditForm((current) => ({
                                    ...current,
                                    carbs: Number(e.target.value) || 0,
                                  }))
                                }
                                style={inputStyle}
                              />
                            </div>
                            <div>
                              <label
                                style={fieldLabel("Fat (g)")}
                                htmlFor={`edit-fat-${item.id}`}
                              >
                                Fat (g)
                              </label>
                              <input
                                id={`edit-fat-${item.id}`}
                                type="number"
                                min={0}
                                value={editForm.fat || ""}
                                onChange={(e) =>
                                  setEditForm((current) => ({
                                    ...current,
                                    fat: Number(e.target.value) || 0,
                                  }))
                                }
                                style={inputStyle}
                              />
                            </div>
                          </div>
                          {editError && (
                            <p
                              style={{
                                margin: 0,
                                fontSize: "0.78rem",
                                color: colors.terracotta,
                                fontFamily: sans,
                              }}
                            >
                              {editError}
                            </p>
                          )}
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "8px",
                            }}
                          >
                            <button type="submit" style={primaryButtonStyle()}>
                              Save changes
                            </button>
                            <button
                              type="button"
                              style={secondaryButtonStyle()}
                              onClick={cancelEditing}
                            >
                              Cancel
                            </button>
                          </div>
                          <button
                            type="button"
                            style={dangerButtonStyle()}
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        </form>
                      ) : (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: "8px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                color: colors.text,
                                fontFamily: sans,
                              }}
                            >
                              {item.name}
                            </span>
                            <span
                              style={{
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                color: colors.terracotta,
                                fontFamily: sans,
                                flexShrink: 0,
                              }}
                            >
                              {formatNumber(item.calories)} kcal
                            </span>
                          </div>
                          {(item.protein > 0 ||
                            item.carbs > 0 ||
                            item.fat > 0) && (
                            <p
                              style={{
                                margin: "4px 0 0",
                                fontSize: "0.72rem",
                                color: colors.muted,
                                fontFamily: sans,
                              }}
                            >
                              P {item.protein}g · C {item.carbs}g · F {item.fat}
                              g
                            </p>
                          )}
                          <button
                            type="button"
                            style={{
                              ...textActionStyle(),
                              marginTop: "8px",
                            }}
                            onClick={() => startEditing(item)}
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
