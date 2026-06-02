"use client";

import React from "react";
import { STATUS_CONFIG, JobStatusType } from "@/lib/constants/statusConfig";

interface FilterBarProps {
  selectedCategory: "all" | "govt" | "non-govt";
  setSelectedCategory: (category: "all" | "govt" | "non-govt") => void;
  selectedStatus: "all" | JobStatusType;
  setSelectedStatus: (status: "all" | JobStatusType) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
}) => {
  const categories: { value: "all" | "govt" | "non-govt"; label: string }[] = [
    { value: "all", label: "সব চাকরি" },
    { value: "govt", label: "সরকারি" },
    { value: "non-govt", label: "বেসরকারি" },
  ];

  return (
    <div className="bg-white border border-gray-100 shadow-xs rounded-xl p-4 mb-6 space-y-4">
      {/* Category Toggle Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
        <label className="text-sm font-semibold text-gray-700 font-sans">
          ক্যাটাগরি অনুযায়ী ফিল্টার:
        </label>
        <div className="flex bg-gray-100 p-1 rounded-lg self-start sm:self-auto">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`
                px-4 py-1.5
                text-xs font-semibold rounded-md font-sans
                transition-all duration-200 cursor-pointer
                ${
                  selectedCategory === cat.value
                    ? "bg-white text-blue-600 shadow-xs font-bold"
                    : "text-gray-500 hover:text-gray-900"
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Scrollable Status Chip Row */}
      <div className="text-left">
        <label className="block text-sm font-semibold text-gray-700 font-sans mb-2">
          স্ট্যাটাস অনুযায়ী ফিল্টার:
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {/* "সব" indicator */}
          <button
            onClick={() => setSelectedStatus("all")}
            className={`
              inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold font-sans cursor-pointer whitespace-nowrap shrink-0 border transition-all duration-200
              ${
                selectedStatus === "all"
                  ? "bg-gray-900 text-white border-gray-950 shadow-xs"
                  : "bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >
            সব স্ট্যাটাস
          </button>

          {/* Specific Status Chips */}
          {Object.entries(STATUS_CONFIG).map(([value, info]) => {
            const isSelected = selectedStatus === value;
            return (
              <button
                key={value}
                onClick={() => setSelectedStatus(value as JobStatusType)}
                className={`
                  inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold font-sans cursor-pointer whitespace-nowrap shrink-0 border transition-all duration-200
                  ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-700 shadow-xs font-bold"
                      : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                {info.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
