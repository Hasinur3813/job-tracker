"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { STATUS_CONFIG, JobStatusType } from "@/lib/constants/statusConfig";

interface StatusDropdownProps {
  currentStatus: JobStatusType;
  onChange: (newStatus: JobStatusType) => void;
  disabled?: boolean;
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
  currentStatus,
  onChange,
  disabled = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as JobStatusType);
  };

  const current = STATUS_CONFIG[currentStatus] ?? STATUS_CONFIG.not_applied;

  return (
    <div className="relative w-full text-left">
      <span
        className={`pointer-events-none absolute left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${current.dot}`}
        aria-hidden="true"
      />
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={disabled}
        aria-label="আবেদনের স্ট্যাটাস পরিবর্তন করুন"
        className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-7 pr-8 text-xs font-semibold text-slate-700 transition-all hover:border-slate-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {Object.entries(STATUS_CONFIG).map(([value, info]) => (
          <option key={value} value={value} className="text-slate-900">
            {info.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
      />
    </div>
  );
};
