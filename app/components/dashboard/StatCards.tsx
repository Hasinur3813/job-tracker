"use client";

import React from "react";
import { Briefcase, Activity, CalendarDays, CheckCircle2 } from "lucide-react";
import type { JobStats } from "@/lib/hooks/useJobStats";
import { toBnDigits } from "@/lib/utils/bn";

interface StatCardsProps {
  stats: JobStats;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  const totalCount = stats.total;
  const activeCount = stats.active;
  const upcomingCount = stats.upcoming;
  const passedCount = stats.passed;

  const cards = [
    {
      title: "মোট চাকরি",
      caption: "সর্বমোট আবেদন",
      count: totalCount,
      icon: <Briefcase className="h-5 w-5" />,
      featured: true,
    },
    {
      title: "সক্রিয় আবেদন",
      caption: "চলমান প্রক্রিয়া",
      count: activeCount,
      icon: <Activity className="h-5 w-5" />,
      theme: "bg-blue-50 text-blue-600",
    },
    {
      title: "৭ দিনে শেষ হবে",
      caption: "ডেডলাইন নিকটে",
      count: upcomingCount,
      icon: <CalendarDays className="h-5 w-5" />,
      theme: "bg-amber-50 text-amber-600",
    },
    {
      title: "পাস করেছেন",
      caption: "সফল ফলাফল",
      count: passedCount,
      icon: <CheckCircle2 className="h-5 w-5" />,
      theme: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`group relative overflow-hidden rounded-2xl border p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift sm:p-5 ${
            card.featured
              ? "border-brand-800/30 bg-[linear-gradient(135deg,#211762_0%,#4c2fe0_58%,#6a53ff_100%)] text-white"
              : "border-slate-200/70 bg-white"
          }`}
        >
          {card.featured && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full border border-white/10"
            >
              <div className="absolute inset-4 rounded-full border border-white/10" />
              <div className="absolute inset-8 rounded-full bg-white/5" />
            </div>
          )}

          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p
                className={`text-[12.5px] font-semibold ${
                  card.featured ? "text-white/80" : "text-slate-600"
                }`}
              >
                {card.title}
              </p>
              <p
                className={`mt-2 font-mono text-3xl font-bold tracking-tight ${
                  card.featured ? "text-white" : "text-slate-900"
                }`}
              >
                {toBnDigits(card.count)}
              </p>
              <p
                className={`mt-1 truncate text-[12px] ${
                  card.featured ? "text-white/65" : "text-slate-500"
                }`}
              >
                {card.caption}
              </p>
            </div>

            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                card.featured
                  ? "border border-white/15 bg-white/10 text-white"
                  : `border border-white ${card.theme} shadow-soft`
              }`}
            >
              {card.icon}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
