"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Hash,
  KeyRound,
  Lock,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";
import { JobDocument } from "@/lib/hooks/useJobs";
import {
  DeadlineUrgency,
  getDeadlineInfo,
} from "@/lib/utils/deadline";
import { copyText } from "@/lib/utils/clipboard";
import { getSafeHttpUrl } from "@/lib/utils/url";
import { StatusBadge } from "../job/StatusBadge";
import { CategoryBadge } from "../job/CategoryBadge";

interface JobCardProps {
  job: JobDocument;
}

const urgencyStyles: Record<
  DeadlineUrgency,
  { bar: string; chip: string; dot: string; text: string }
> = {
  none: {
    bar: "bg-slate-200",
    chip: "border-slate-200 bg-slate-50 text-slate-500",
    dot: "bg-slate-300",
    text: "text-slate-400",
  },
  expired: {
    bar: "bg-slate-300",
    chip: "border-slate-200 bg-slate-100 text-slate-500",
    dot: "bg-slate-400",
    text: "text-slate-400",
  },
  today: {
    bar: "bg-linear-to-r from-rose-600 to-rose-400",
    chip: "border-rose-200 bg-rose-50 text-rose-700",
    dot: "bg-rose-500 animate-pulse",
    text: "text-rose-600",
  },
  soon: {
    bar: "bg-linear-to-r from-orange-500 to-amber-400",
    chip: "border-orange-200 bg-orange-50 text-orange-700",
    dot: "bg-orange-500",
    text: "text-orange-600",
  },
  week: {
    bar: "bg-linear-to-r from-amber-400 to-yellow-300",
    chip: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
    text: "text-amber-600",
  },
  normal: {
    bar: "bg-linear-to-r from-brand-500 to-violet-400",
    chip: "border-slate-200 bg-slate-50 text-slate-600",
    dot: "bg-emerald-500",
    text: "text-brand-600",
  },
};

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const router = useRouter();
  const [showCreds, setShowCreds] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [copiedField, setCopiedField] = useState<
    "username" | "password" | null
  >(null);

  const deadline = getDeadlineInfo(job.deadline);
  const styles = urgencyStyles[deadline.urgency];
  const sourceUrl = getSafeHttpUrl(job.source_url);

  const hasCredentials =
    job.category === "govt" &&
    Boolean(job.credentials?.username || job.credentials?.password);

  const handleCopy = async (
    text: string,
    label: string,
    field: "username" | "password",
  ) => {
    const copied = await copyText(text);
    if (!copied) {
      toast.error("কপি করা যায়নি, অনুগ্রহ করে ম্যানুয়ালি কপি করুন");
      return;
    }
    toast.success(`${label} কপি হয়েছে ✓`);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  return (
    <article
      id={`job-card-${job.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${styles.bar}`} />

      <button
        type="button"
        onClick={() => router.push(`/job/${job.id}`)}
        className="w-full flex-1 p-4.5 text-left sm:p-5"
        aria-label={`চাকরির বিবরণ দেখুন: ${job.title}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <CategoryBadge category={job.category} />
            <StatusBadge status={job.status} />
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold ${styles.chip}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
            {deadline.formatted}
          </span>
        </div>

        <h3 className="mt-3 line-clamp-2 text-[17px] font-bold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-brand-700">
          {job.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-[13px] text-slate-500">
          <Building2 size={13} className="shrink-0 text-slate-400" />
          <span className="truncate">{job.organisation}</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {job.position_number && (
            <span className="inline-flex max-w-full items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-500 ring-1 ring-inset ring-slate-100">
              <Hash size={10} className="shrink-0" />
              <span className="truncate">পদ: {job.position_number}</span>
            </span>
          )}
          {job.salary_range && (
            <span className="inline-flex max-w-full items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-500 ring-1 ring-inset ring-slate-100">
              <Wallet size={10} className="shrink-0" />
              <span className="truncate">{job.salary_range}</span>
            </span>
          )}
          {deadline.label && (
            <span className={`text-[10px] font-bold ${styles.text}`}>
              {deadline.label}
            </span>
          )}
        </div>

        {job.notes && (
          <p className="mt-3 line-clamp-2 rounded-lg bg-slate-50/80 px-2.5 py-2 text-[11px] leading-5 text-slate-500">
            {job.notes}
          </p>
        )}
      </button>

      {(hasCredentials || sourceUrl) && (
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-2.5">
          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-brand-700 transition-colors hover:bg-brand-50"
            >
              <ExternalLink size={11} />
              সার্কুলার
            </a>
          ) : (
            <span />
          )}

          {hasCredentials && (
            <button
              type="button"
              onClick={() => setShowCreds((value) => !value)}
              aria-expanded={showCreds}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-bold transition-all ${
                showCreds
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
              }`}
            >
              <KeyRound size={11} />
              {showCreds ? "তথ্য লুকান" : "লগইন তথ্য"}
              {showCreds ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
          )}
        </div>
      )}

      {hasCredentials && showCreds && (
        <div className="border-t border-slate-200/70 bg-slate-50/80 px-4 pb-4 pt-3">
          <p className="mb-2.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
            <Lock size={10} />
            পোর্টাল লগইন তথ্য
          </p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {job.credentials?.username && (
              <div className="space-y-1.5 rounded-xl border border-slate-200 bg-white p-2.5 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    ইউজারনেম
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        job.credentials?.username || "",
                        "ইউজারনেম",
                        "username",
                      )
                    }
                    className="rounded-md p-1 text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
                    title="কপি করুন"
                    aria-label="ইউজারনেম কপি করুন"
                  >
                    {copiedField === "username" ? (
                      <Check size={12} className="text-emerald-600" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
                <div className="select-all rounded-lg border border-slate-100 bg-slate-50 px-2 py-1 font-mono text-xs font-bold tracking-wide text-slate-800">
                  {job.credentials.username}
                </div>
              </div>
            )}

            {job.credentials?.password && (
              <div className="space-y-1.5 rounded-xl border border-slate-200 bg-white p-2.5 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    পাসওয়ার্ড
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => setPasswordVisible((value) => !value)}
                      className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                      title={passwordVisible ? "লুকান" : "দেখুন"}
                      aria-label={
                        passwordVisible ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"
                      }
                    >
                      {passwordVisible ? (
                        <EyeOff size={12} />
                      ) : (
                        <Eye size={12} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          job.credentials?.password || "",
                          "পাসওয়ার্ড",
                          "password",
                        )
                      }
                      className="rounded-md p-1 text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
                      title="কপি করুন"
                      aria-label="পাসওয়ার্ড কপি করুন"
                    >
                      {copiedField === "password" ? (
                        <Check size={12} className="text-emerald-600" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="select-all rounded-lg border border-slate-100 bg-slate-50 px-2 py-1 font-mono text-xs font-bold tracking-wide text-slate-800">
                  {passwordVisible
                    ? job.credentials.password
                    : "••••••••"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
};
