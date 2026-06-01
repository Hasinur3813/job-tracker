"use client";

import React, { SelectHTMLAttributes, forwardRef, useId } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, options, error, fullWidth = true, className = "", ...props },
    ref,
  ) => {
    const id = useId();
    const widthClass = fullWidth ? "w-full" : "";

    return (
      <div className={`${widthClass} mb-4 text-left`}>
        {label && (
          <label
            htmlFor={id}
            className="block mb-1.5 text-sm font-medium text-gray-700 font-sans"
          >
            {label}
          </label>
        )}
        <select
          id={id}
          ref={ref}
          className={`
            ${widthClass}
            px-3 py-2
            bg-white
            border
            ${error ? "border-red-500 focus:ring-red-500 font-sans" : "border-gray-300 focus:ring-blue-500 font-sans"}
            rounded-lg
            text-sm
            text-gray-900
            focus:outline-hidden
            focus:ring-2
            focus:border-transparent
            transition-all
            duration-200
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
        {error && (
          <p className="mt-1 text-xs text-red-600 font-sans">{error}</p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
