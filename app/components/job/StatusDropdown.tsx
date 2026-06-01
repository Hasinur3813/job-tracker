"use client";

import React from "react";
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
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as JobStatusType);
  };

  return (
    <div className="relative inline-block text-left">
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={disabled}
        className={`
          appearance-none
          px-3 py-1.5 pr-8
          bg-white hover:bg-gray-50
          border border-gray-200
          text-gray-700 font-sans text-xs font-semibold
          rounded-lg
          focus:outline-hidden
          focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
          cursor-pointer
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {Object.entries(STATUS_CONFIG).map(([value, info]) => (
          <option
            key={value}
            value={value}
            className="text-gray-900 font-sans font-medium text-sm"
          >
            {info.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
        <svg
          className="h-4 w-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
};
