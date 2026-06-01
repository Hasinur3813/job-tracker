"use client";

import React, { InputHTMLAttributes, forwardRef, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, fullWidth = true, className = "", type = "text", ...props },
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
        <input
          id={id}
          type={type}
          ref={ref}
          className={`
            ${widthClass}
            px-3 py-2
            bg-white
            border
            ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}
            rounded-lg
            text-sm
            text-gray-900
            placeholder-gray-400
            focus:outline-hidden
            focus:ring-2
            focus:border-transparent
            transition-all
            duration-200
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-600 font-sans">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
