export interface StatusInfo {
  label: string;
  color: string;
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
    color: "bg-gray-100 text-gray-600 border border-gray-200",
  },
  applied: {
    label: "আবেদন করা হয়েছে",
    color: "bg-blue-100 text-blue-700 border border-blue-200",
  },
  given_exam: {
    label: "পরীক্ষা দেওয়া হয়েছে",
    color: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  passed: {
    label: "পাস",
    color: "bg-green-100 text-green-700 border border-green-200",
  },
  failed: {
    label: "ফেল",
    color: "bg-red-100 text-red-700 border border-red-200",
  },
  interviewed: {
    label: "ইন্টারভিউ",
    color: "bg-purple-100 text-purple-700 border border-purple-200",
  },
  skipped: {
    label: "বাদ দেওয়া হয়েছে",
    color: "bg-gray-200 text-gray-400 border border-gray-300",
  },
};
