"use client";

import React from "react";
import {
  CATEGORY_CONFIG,
  JobCategoryType,
} from "@/lib/constants/categoryConfig";

interface CategoryBadgeProps {
  category: JobCategoryType;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG["non-govt"];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${config.color}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
