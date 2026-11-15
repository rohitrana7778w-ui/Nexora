"use client";

import React from "react";
import { CATEGORIES } from "@/lib/youtube";
import { VideoCategory } from "@/lib/types";

interface CategoryPillsProps {
  selectedCategory: VideoCategory;
  onSelectCategory: (category: VideoCategory) => void;
}

export function CategoryPills({
  selectedCategory,
  onSelectCategory,
}: CategoryPillsProps) {
  return (
    <div className="flex w-full items-center gap-2 overflow-x-auto py-2 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
              isSelected
                ? "bg-zinc-100 text-zinc-950 font-semibold shadow-sm"
                : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
