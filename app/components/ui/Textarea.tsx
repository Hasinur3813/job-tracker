"use client";

import React, { TextareaHTMLAttributes, forwardRef, useId } from "react";
import { CircleAlert } from "lucide-react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, hint, fullWidth = true, className = "", ...props },
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
            className="mb-1.5 block text-[14px] font-semibold text-slate-700"
          >
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`
            w-full resize-y rounded-xl border bg-white px-3.5 py-3
            text-sm text-slate-900 placeholder:text-slate-500
            transition-all duration-200
            focus:border-brand-500 focus:outline-none focus:ring-4
            disabled:cursor-not-allowed disabled:bg-slate-50
            ${
              error
                ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                : "border-slate-200 hover:border-slate-300 focus:ring-brand-100"
            }
            ${className}
          `}
          {...props}
        />
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

Textarea.displayName = "Textarea";
