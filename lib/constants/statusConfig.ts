export interface StatusInfo {
  label: string;
  color: string;
  dot: string;
}

export type JobStatusType =
  | "not_applied"
  | "applied"
  | "skipped"
  | "given_exam"
  | "passed"
  | "failed"
  | "interviewed";

export const STATUS_CONFIG: Record<JobStatusType, StatusInfo> = {
  not_applied: {
    label: "আবেদন করা হয়নি",
    color: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
  },
  applied: {
    label: "আবেদন করা হয়েছে",
    color: "bg-blue-50 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
  },
  given_exam: {
    label: "পরীক্ষা দেওয়া হয়েছে",
    color: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
  },
  passed: {
    label: "পাস",
    color: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  failed: {
    label: "ফেল",
    color: "bg-rose-50 text-rose-700 border border-rose-200",
    dot: "bg-rose-500",
  },
  interviewed: {
    label: "ইন্টারভিউ",
    color: "bg-violet-50 text-violet-700 border border-violet-200",
    dot: "bg-violet-500",
  },
  skipped: {
    label: "বাদ দেওয়া হয়েছে",
    color: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-500",
  },
};
