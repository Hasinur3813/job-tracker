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
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-sans ${config.color}`}
    >
      {config.label}
    </span>
  );
};
