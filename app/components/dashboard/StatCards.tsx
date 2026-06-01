"use client";

import React from "react";
import { parseISO, differenceInCalendarDays, startOfDay } from "date-fns";
import { Briefcase, Activity, CalendarDays, CheckCircle2 } from "lucide-react";
import { JobDocument } from "@/lib/hooks/useJobs";

interface StatCardsProps {
  jobs: JobDocument[];
}

export const StatCards: React.FC<StatCardsProps> = ({ jobs }) => {
  const today = startOfDay(new Date());

  // 1. Total jobs
  const totalCount = jobs.length;

  // 2. Active jobs (status not in: skipped, failed)
  const activeCount = jobs.filter(
    (job) => job.status !== "skipped" && job.status !== "failed",
  ).length;

  // 3. Upcoming jobs: deadline within 7 days, excluding past (since startOfDay)
  const upcomingCount = jobs.filter((job) => {
    if (!job.deadline) return false;
    try {
      const deadlineDate = startOfDay(parseISO(job.deadline));
      const diff = differenceInCalendarDays(deadlineDate, today);
      // Status excluding final negative results and only future/today's jobs
      return (
        diff >= 0 &&
        diff <= 7 &&
        job.status !== "skipped" &&
        job.status !== "failed"
      );
    } catch {
      return false;
    }
  }).length;

  // 4. Passed jobs (status === "passed")
  const passedCount = jobs.filter((job) => job.status === "passed").length;

  const cardConfig = [
    {
      title: "মোট চাকরি",
      count: totalCount,
      icon: <Briefcase className="w-5 h-5" />,
      themeColor: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "সক্রিয় আবেদন",
      count: activeCount,
      icon: <Activity className="w-5 h-5" />,
      themeColor: "text-green-600 bg-green-50 border-green-100",
    },
    {
      title: "৭ দিনে শেষ হবে",
      count: upcomingCount,
      icon: <CalendarDays className="w-5 h-5" />,
      themeColor: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: "পাস করেছেন",
      count: passedCount,
      icon: <CheckCircle2 className="w-5 h-5" />,
      themeColor: "text-purple-600 bg-purple-50 border-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cardConfig.map((card, index) => (
        <div
          key={index}
          className="bg-white border border-gray-100 shadow-xs rounded-xl p-4 flex items-center justify-between text-left transition-all hover:shadow-sm"
        >
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 font-sans mb-1">
              {card.title}
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-gray-900 font-mono">
              {card.count}
            </span>
          </div>
          <div
            className={`p-2.5 rounded-lg border ${card.themeColor} shrink-0`}
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};
