export interface CategoryInfo {
  label: string;
  color: string;
  dot: string;
}

export type JobCategoryType = "govt" | "non-govt";

export const CATEGORY_CONFIG: Record<JobCategoryType, CategoryInfo> = {
  govt: {
    label: "সরকারি",
    color: "bg-brand-50 text-brand-700 border border-brand-200",
    dot: "bg-brand-500",
  },
  "non-govt": {
    label: "বেসরকারি",
    color: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
};
