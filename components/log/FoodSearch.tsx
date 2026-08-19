"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FoodSearchResult } from "../../types/database";
import { formatFoodDisplayName } from "../../lib/foods";
import { colors, labelStyle, sans } from "../dashboard/theme";
import { inputStyle } from "./shared";

interface FoodSearchProps {
  onSelect: (food: FoodSearchResult) => void;
}

export function FoodSearch({ onSelect }: FoodSearchProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/foods?q=${encodeURIComponent(trimmed)}&limit=12`,
          { signal: controller.signal },
        );
        const payload = (await response.json()) as {
          foods?: FoodSearchResult[];
          error?: string;
          hint?: string;
        };

        if (!response.ok) {
          setResults([]);
          setError(payload.error ?? "Could not search foods.");
          return;
        }

        setResults(payload.foods ?? []);
        setOpen(true);
        setActiveIndex(-1);
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }
        setResults([]);
        setError("Could not search foods.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [query]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function handleSelect(food: FoodSearchResult) {
    onSelect(food);
    setQuery("");
    setResults([]);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        current <= 0 ? results.length - 1 : current - 1,
      );
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <label style={labelStyle()} htmlFor="food-search">
        Search food database
      </label>
      <input
        id="food-search"
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (query.trim().length >= 2) {
            setOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search e.g. chicken, banana, oatmeal..."
        autoComplete="off"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={showDropdown ? listboxId : undefined}
        aria-autocomplete="list"
        style={inputStyle}
      />
      <p
        style={{
          margin: "6px 0 0",
          fontSize: "0.72rem",
          color: colors.muted,
          fontFamily: sans,
        }}
      >
        Pick a food to auto-fill calories and macros.
      </p>

      {loading ? (
        <p
          style={{
            margin: "8px 0 0",
            fontSize: "0.75rem",
            color: colors.muted,
            fontFamily: sans,
          }}
        >
          Searching...
        </p>
      ) : null}

      {error ? (
        <p
          style={{
            margin: "8px 0 0",
            fontSize: "0.75rem",
            color: colors.terracotta,
            fontFamily: sans,
          }}
        >
          {error}
        </p>
      ) : null}

      {showDropdown ? (
        <ul
          id={listboxId}
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            margin: 0,
            padding: "6px",
            listStyle: "none",
            backgroundColor: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: "14px",
            boxShadow: "0 8px 24px rgba(39, 32, 24, 0.08)",
            maxHeight: "280px",
            overflowY: "auto",
            zIndex: 20,
          }}
        >
          {results.length === 0 && !loading ? (
            <li
              style={{
                padding: "10px 12px",
                fontSize: "0.78rem",
                color: colors.muted,
                fontFamily: sans,
              }}
            >
              No foods found. Try another search or enter manually below.
            </li>
          ) : (
            results.map((food, index) => {
              const active = index === activeIndex;
              return (
                <li key={food.id} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(food)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "12px",
                      padding: "10px 12px",
                      border: "none",
                      borderRadius: "10px",
                      backgroundColor: active ? colors.terracottaPale : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: sans,
                    }}
                  >
                    <span>
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: colors.text,
                        }}
                      >
                        {formatFoodDisplayName(food.name)}
                      </span>
                      <span
                        style={{
                          display: "block",
                          marginTop: "2px",
                          fontSize: "0.72rem",
                          color: colors.muted,
                        }}
                      >
                        {food.servingUnit} · P {food.proteinG}g · C {food.carbsG}g ·
                        F {food.fatG}g
                      </span>
                    </span>
                    <span
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: colors.terracotta,
                        flexShrink: 0,
                      }}
                    >
                      {food.caloriesPerServing} kcal
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
