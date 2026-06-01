"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { parseISO, differenceInCalendarDays, format, isValid } from "date-fns";
import {
  Building2,
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  KeyRound,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { JobDocument } from "@/lib/hooks/useJobs";
import { StatusBadge } from "../job/StatusBadge";
import { CategoryBadge } from "../job/CategoryBadge";

interface JobCardProps {
  job: JobDocument;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const router = useRouter();
  const [showCreds, setShowCreds] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let diff = -999;
  let formattedDeadline = "তারিখ নেই";
  let isDateValid = false;

  if (job.deadline) {
    try {
      const deadlineDate = parseISO(job.deadline);
      isDateValid = isValid(deadlineDate);
      if (isDateValid) {
        deadlineDate.setHours(0, 0, 0, 0);
        diff = differenceInCalendarDays(deadlineDate, today);
        formattedDeadline = format(deadlineDate, "dd MMM yyyy");
      }
    } catch {
      isDateValid = false;
    }
  }

  type UrgencyLevel = "expired" | "today" | "soon" | "week" | "normal";

  let urgency: UrgencyLevel = "normal";
  let deadlineSuffix = "";
  if (isDateValid) {
    if (diff < 0) {
      urgency = "expired";
      deadlineSuffix = "মেয়াদ শেষ";
    } else if (diff === 0) {
      urgency = "today";
      deadlineSuffix = "আজই শেষ!";
    } else if (diff <= 3) {
      urgency = "soon";
      deadlineSuffix = `${diff} দিন বাকি`;
    } else if (diff <= 7) {
      urgency = "week";
      deadlineSuffix = `${diff} দিন বাকি`;
    } else {
      urgency = "normal";
      deadlineSuffix = `${diff} দিন বাকি`;
    }
  }

  const urgencyStyles: Record<
    UrgencyLevel,
    { card: string; badge: string; dot: string }
  > = {
    expired: {
      card: "border-gray-200 bg-white opacity-70 hover:opacity-90",
      badge: "bg-gray-100 text-gray-500 border-gray-200",
      dot: "bg-gray-400",
    },
    today: {
      card: "border-red-300 bg-red-50/30 shadow-red-100/50",
      badge: "bg-red-100 text-red-700 border-red-200",
      dot: "bg-red-500 animate-pulse",
    },
    soon: {
      card: "border-orange-200 bg-orange-50/20",
      badge: "bg-orange-100 text-orange-700 border-orange-200",
      dot: "bg-orange-500",
    },
    week: {
      card: "border-amber-200 bg-amber-50/10",
      badge: "bg-amber-100 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },
    normal: {
      card: "border-gray-200 bg-white hover:border-indigo-200",
      badge: "bg-indigo-50 text-indigo-600 border-indigo-100",
      dot: "bg-emerald-500",
    },
  };

  const styles = urgencyStyles[urgency];

  const hasCredentials =
    job.category === "govt" &&
    (job.credentials?.username || job.credentials?.password);

  const handleCopy = (text: string, label: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success(`${label} কপি হয়েছে ✓`);
  };

  const handleToggleCreds = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCreds((v) => !v);
  };

  const handlePassToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPasswordVisible((v) => !v);
  };

  const handleCardClick = () => {
    router.push(`/job/${job.id}`);
  };

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl  border shadow-sm transition-all duration-300 mb-3 ${styles.card}  hover:shadow-sm `}
      id={`job-card-${job.id}`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 ${
          urgency === "today"
            ? "bg-linear-to-r from-red-500 via-red-400 to-red-500"
            : urgency === "soon"
              ? "bg-linear-to-r from-orange-400 to-orange-500"
              : urgency === "week"
                ? "bg-linear-to-r from-amber-400 to-amber-500"
                : urgency === "expired"
                  ? "bg-slate-300"
                  : "bg-linear-to-r from-indigo-500 to-violet-500"
        }`}
      />

      <button
        type="button"
        className="w-full text-left p-4"
        onClick={handleCardClick}
        aria-label={`View details for ${job.title}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className=" min-w-0 w-full">
            {/* Badges row */}
            {/* Top info  */}

            <div className="flex items-center justify-between gap-3 mb-2.5 w-full">
              {/* Left: Badges */}
              <div className="flex flex-wrap items-center gap-1.5">
                <CategoryBadge category={job.category} />
                <StatusBadge status={job.status} />
              </div>

              {/* Right: Deadline + Urgency */}
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold font-mono ${styles.badge}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot}`}
                  />
                  <span>{formattedDeadline}</span>
                </div>
                {deadlineSuffix && (
                  <span
                    className={`text-[10px] font-sans font-semibold ${
                      urgency === "today"
                        ? "text-red-600"
                        : urgency === "soon"
                          ? "text-orange-600"
                          : urgency === "week"
                            ? "text-amber-600"
                            : urgency === "expired"
                              ? "text-gray-400"
                              : "text-indigo-500"
                    }`}
                  >
                    {deadlineSuffix}
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 leading-snug font-sans line-clamp-2">
              {job.title}
            </h3>

            {/* Organisation */}
            <div className="flex items-center gap-1.5 mt-1.5 text-sm text-gray-500">
              <Building2 size={13} className="text-gray-400 shrink-0" />
              <span className="truncate font-sans">{job.organisation}</span>
            </div>
          </div>
        </div>
      </button>

      {/* Bottom bar: Circular link + Credential toggle */}
      {(hasCredentials || job.source_url) && (
        <div
          className="flex mt-auto items-center justify-between gap-2 px-5 py-2.5 border-t border-gray-100 bg-gray-50/60"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            {/* Circular link */}
            {job.source_url && (
              <a
                href={job.source_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold font-sans bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
              >
                <ExternalLink size={11} />
                সার্কুলার দেখুন
              </a>
            )}
          </div>

          {/* Credential toggle */}
          {hasCredentials && (
            <button
              onClick={handleToggleCreds}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold font-sans border transition-all ${
                showCreds
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
              }`}
            >
              <KeyRound size={11} />
              {showCreds ? (
                <>
                  লগইন তথ্য বন্ধ
                  <ChevronUp size={11} />
                </>
              ) : (
                <>
                  লগইন তথ্য দেখুন
                  <ChevronDown size={11} />
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Credentials panel */}
      {hasCredentials && showCreds && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="px-5 pb-4 pt-3 bg-linear-to-b from-gray-50/80 to-gray-100/40 border-t border-gray-200/60"
        >
          <p className="text-[10px] text-gray-400 font-sans font-semibold uppercase tracking-wider mb-2.5">
            Teletalk / Alljobs পোর্টাল — লগইন তথ্য
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Username */}
            {job.credentials?.username && (
              <div className="bg-white rounded-xl border border-gray-200 p-3 space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-sans font-semibold uppercase tracking-wider">
                    ইউজারনেম / মোবাইল
                  </span>
                  <button
                    onClick={(e) =>
                      handleCopy(job.credentials?.username || "", "ইউজারনেম", e)
                    }
                    className="p-1 hover:bg-indigo-50 rounded-md text-gray-400 hover:text-indigo-600 transition-colors"
                    title="কপি করুন"
                  >
                    <Copy size={12} />
                  </button>
                </div>
                <div className="font-mono font-bold text-gray-800 text-sm tracking-wide select-all bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                  {job.credentials.username}
                </div>
              </div>
            )}

            {/* Password */}
            {job.credentials?.password && (
              <div className="bg-white rounded-xl border border-gray-200 p-3 space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-sans font-semibold uppercase tracking-wider">
                    পাসওয়ার্ড
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePassToggle}
                      className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
                      title={passwordVisible ? "লুকান" : "দেখুন"}
                    >
                      {passwordVisible ? (
                        <EyeOff size={12} />
                      ) : (
                        <Eye size={12} />
                      )}
                    </button>
                    <button
                      onClick={(e) =>
                        handleCopy(
                          job.credentials?.password || "",
                          "পাসওয়ার্ড",
                          e,
                        )
                      }
                      className="p-1 hover:bg-indigo-50 rounded-md text-gray-400 hover:text-indigo-600 transition-colors"
                      title="কপি করুন"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
                <div className="font-mono font-bold text-gray-800 text-sm tracking-wide select-all bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                  {passwordVisible ? job.credentials.password : "••••••••"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
};
