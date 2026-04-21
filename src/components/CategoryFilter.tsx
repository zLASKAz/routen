"use client";

import { Activity, CATEGORY_COLORS } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  activeFilter: Activity["category"] | "all";
  onFilter: (cat: Activity["category"] | "all") => void;
  availableCategories: Activity["category"][];
}

const CATEGORY_LABELS: Record<Activity["category"], string> = {
  work: "Work",
  coding: "Coding",
  exercise: "Exercise",
  chinese: "Chinese",
  routine: "Routine",
  free: "Free",
  football: "Football",
};

export default function CategoryFilter({
  activeFilter,
  onFilter,
  availableCategories,
}: CategoryFilterProps) {
  if (availableCategories.length === 0) return null;

  return (
    <div className="px-4 py-2">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {/* All pill */}
        <button
          onClick={() => onFilter("all")}
          className={cn(
            "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all",
            activeFilter === "all"
              ? "bg-purple-600/40 text-purple-100 border border-purple-500/40"
              : "bg-white/[0.04] text-purple-300/40 border border-purple-500/10 hover:border-purple-500/20"
          )}
        >
          All
        </button>

        {availableCategories.map((cat) => {
          const isActive = activeFilter === cat;
          const color = CATEGORY_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => onFilter(cat)}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border",
                isActive
                  ? "text-white"
                  : "bg-white/[0.04] text-purple-300/40 border-purple-500/10 hover:border-purple-500/20"
              )}
              style={
                isActive
                  ? {
                      backgroundColor: `${color}30`,
                      borderColor: `${color}60`,
                      color: color,
                    }
                  : {}
              }
            >
              {CATEGORY_LABELS[cat]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
