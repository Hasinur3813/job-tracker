export interface CategoryInfo {
  label: string;
  color: string;
}

export type JobCategoryType = "govt" | "non-govt";

export const CATEGORY_CONFIG: Record<JobCategoryType, CategoryInfo> = {
  govt: {
    label: "সরকারি",
    color: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  "non-govt": {
    label: "বেসরকারি",
    color: "bg-green-50 text-green-700 border border-green-200",
  },
};
