"use client";

import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "dangerSoft" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  className = "",
  disabled,
  type = "button",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.985]";

  const variantClasses = {
    primary:
      "bg-brand-600 text-white shadow-[0_12px_28px_-14px_rgba(91,61,245,0.9)] hover:bg-brand-700 hover:shadow-[0_16px_32px_-14px_rgba(91,61,245,0.9)] focus-visible:ring-brand-200",
    secondary:
      "border border-slate-200 bg-white text-slate-700 shadow-soft hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-200",
    danger:
      "bg-rose-600 text-white shadow-[0_12px_28px_-14px_rgba(225,29,72,0.8)] hover:bg-rose-700 focus-visible:ring-rose-200",
    dangerSoft:
      "border border-rose-200 bg-rose-50 text-rose-600 shadow-soft hover:border-rose-300 hover:bg-rose-100 hover:text-rose-700 focus-visible:ring-rose-100",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-200",
  };

  const sizeClasses = {
    sm: "px-3.5 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-sm",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
};
