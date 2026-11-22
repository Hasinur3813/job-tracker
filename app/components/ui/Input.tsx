"use client";

import React, {
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useId,
} from "react";
import { CircleAlert } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      fullWidth = true,
      className = "",
      leftIcon,
      rightElement,
      type = "text",
      ...props
    },
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
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              {leftIcon}
            </span>
          )}
          <input
            id={id}
            type={type}
            ref={ref}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={`
              h-11 w-full rounded-xl border bg-white text-sm text-slate-900
              placeholder:text-slate-400
              transition-all duration-200
              focus:border-brand-500 focus:outline-none focus:ring-4
              disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500
              ${
                error
                  ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                  : "border-slate-200 hover:border-slate-300 focus:ring-brand-100"
              }
              ${leftIcon ? "pl-10.5" : "pl-3.5"}
              ${rightElement ? "pr-11" : "pr-3.5"}
              ${className}
            `}
            {...props}
          />
          {rightElement && (
            <span className="absolute inset-y-0 right-1.5 flex items-center">
              {rightElement}
            </span>
          )}
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

Input.displayName = "Input";
