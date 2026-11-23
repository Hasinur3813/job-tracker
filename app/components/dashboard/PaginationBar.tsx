"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toBnDigits } from "@/lib/utils/bn";

interface PaginationBarProps {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
}

type PageItem = number | "ellipsis-start" | "ellipsis-end";

function getPageItems(page: number, pageCount: number): PageItem[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const items: PageItem[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);

  if (start > 2) items.push("ellipsis-start");
  for (let item = start; item <= end; item += 1) items.push(item);
  if (end < pageCount - 1) items.push("ellipsis-end");
  items.push(pageCount);

  return items;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  page,
  pageCount,
  total,
  pageSize,
  loading = false,
  onPageChange,
}) => {
  if (total === 0 || pageCount === 0) return null;

  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);
  const pageItems = getPageItems(page, pageCount);
  const disabled = loading;

  const navButtonClass =
    "inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-[12px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav
      aria-label="আবেদন পৃষ্ঠা"
      className="mt-5 flex flex-col gap-3 border-t border-slate-200/70 pt-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-[12.5px] text-slate-500" aria-live="polite">
        {toBnDigits(rangeStart)}–{toBnDigits(rangeEnd)} /{" "}
        {toBnDigits(total)} টি আবেদন
      </p>

      {pageCount > 1 && (
        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={disabled || page <= 1}
            className={navButtonClass}
            aria-label="আগের পৃষ্ঠা"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">আগের</span>
          </button>

          <span className="text-[12.5px] font-semibold text-slate-600 sm:hidden">
            পৃষ্ঠা {toBnDigits(page)} / {toBnDigits(pageCount)}
          </span>

          <div className="hidden items-center gap-1 sm:flex">
            {pageItems.map((item) =>
              typeof item === "number" ? (
                <button
                  key={item}
                  type="button"
                  onClick={() => onPageChange(item)}
                  disabled={disabled}
                  aria-label={`পৃষ্ঠা ${toBnDigits(item)}`}
                  aria-current={item === page ? "page" : undefined}
                  className={`h-8 min-w-8 rounded-lg border px-2 text-[12px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    item === page
                      ? "border-brand-600 bg-brand-600 text-white shadow-[0_8px_20px_-12px_rgba(91,61,245,0.9)]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {toBnDigits(item)}
                </button>
              ) : (
                <span
                  key={item}
                  className="flex h-8 min-w-8 items-center justify-center text-[12px] font-bold text-slate-400"
                  aria-hidden="true"
                >
                  …
                </span>
              ),
            )}
          </div>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={disabled || page >= pageCount}
            className={navButtonClass}
            aria-label="পরের পৃষ্ঠা"
          >
            <span className="hidden sm:inline">পরের</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </nav>
  );
};
