"use client";

import React, {
  SelectHTMLAttributes,
  forwardRef,
  useId,
} from "react";
import { ChevronDown, CircleAlert } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, options, error, hint, fullWidth = true, className = "", ...props },
    ref,
  ) => {
    const id = useId();
    const widthClass = fullWidth ? "w-full" : "";
    const describedBy = error
      ? `${id}-error`
      : hint
        ? `${id}-hint`
        : undefined;

    return (
      <div className={`${widthClass} text-left`}>
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-[13px] font-semibold text-slate-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={id}
            ref={ref}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={`
              h-11 w-full appearance-none rounded-xl border bg-white pl-3.5 pr-10
              text-sm font-medium text-slate-900 transition-all duration-200
              focus:border-brand-500 focus:outline-none focus:ring-4
              disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500
              ${
                error
                  ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                  : "border-slate-200 hover:border-slate-300 focus:ring-brand-100"
              }
              ${className}
            `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
        {error ? (
          <p
            id={`${id}-error`}
            className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600"
          >
            <CircleAlert size={12} className="shrink-0" />
            {error}
          </p>
        ) : hint ? (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = "Select";
