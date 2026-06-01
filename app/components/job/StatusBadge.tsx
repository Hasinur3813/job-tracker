"use client";

import React from "react";
import { STATUS_CONFIG, JobStatusType } from "@/lib/constants/statusConfig";

interface StatusBadgeProps {
  status: JobStatusType;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.not_applied;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-sans ${config.color}`}
    >
      {config.label}
    </span>
  );
};
