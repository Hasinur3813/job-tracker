"use client";

import React from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import {
  STATUS_CONFIG,
  JobStatusType,
} from "@/lib/constants/statusConfig";
import { JobDocument } from "@/lib/hooks/useJobs";
import { toBnDigits } from "@/lib/utils/bn";

interface FilterBarProps {
  selectedCategory: "all" | "govt" | "non-govt";
  setSelectedCategory: (category: "all" | "govt" | "non-govt") => void;
  selectedStatus: "all" | JobStatusType;
  setSelectedStatus: (status: "all" | JobStatusType) => void;
  jobs: JobDocument[];
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  jobs,
  onReset,
}) => {
  const categories: {
    value: "all" | "govt" | "non-govt";
    label: string;
    count: number;
  }[] = [
    { value: "all", label: "সব", count: jobs.length },
    {
      value: "govt",
      label: "সরকারি",
      count: jobs.filter((job) => job.category === "govt").length,
    },
    {
      value: "non-govt",
      label: "বেসরকারি",
      count: jobs.filter((job) => job.category === "non-govt").length,
    },
  ];

  const statusCounts = jobs.reduce<Record<string, number>>((acc, job) => {
    acc[job.status] = (acc[job.status] ?? 0) + 1;
    return acc;
  }, {});

  const hasActiveFilter =
    selectedCategory !== "all" || selectedStatus !== "all";

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <SlidersHorizontal size={14} className="text-slate-400" />
          ক্যাটাগরি
        </div>
        <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100/90 p-1">
          {categories.map((category) => {
            const active = selectedCategory === category.value;
            return (
              <button
                key={category.value}
                type="button"
                onClick={() => setSelectedCategory(category.value)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${
                  active
                    ? "bg-white text-brand-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {category.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                    active
                      ? "bg-brand-50 text-brand-600"
                      : "bg-white/70 text-slate-400"
                  }`}
                >
                  {toBnDigits(category.count)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="my-3 h-px bg-slate-100" />

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">স্ট্যাটাস</span>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 transition-colors hover:text-rose-600"
            >
              <RotateCcw size={11} />
              রিসেট
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedStatus("all")}
            aria-pressed={selectedStatus === "all"}
            className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all ${
              selectedStatus === "all"
                ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800"
            }`}
          >
            সব
            <span
              className={`rounded-full px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                selectedStatus === "all"
                  ? "bg-white/15 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {toBnDigits(jobs.length)}
            </span>
          </button>

          {Object.entries(STATUS_CONFIG).map(([value, info]) => {
            const active = selectedStatus === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedStatus(value as JobStatusType)}
                aria-pressed={active}
                className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all ${
                  active
                    ? "border-brand-600 bg-brand-600 text-white shadow-[0_8px_20px_-12px_rgba(91,61,245,0.9)]"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    active ? "bg-white" : info.dot
                  }`}
                />
                {info.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                    active
                      ? "bg-white/15 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {toBnDigits(statusCounts[value] ?? 0)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
