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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${config.color}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
