import type { JobStatusType } from "@/lib/constants/statusConfig";
import type { JobAttachment } from "./attachment";

export type JobCategory = "govt" | "non-govt";

export interface JobDocument {
  id: string;
  title: string;
  organisation: string;
  position_number?: string;
  category: JobCategory;
  deadline: string; // YYYY-MM-DD
  source_url?: string;
  salary_range?: string;
  notes?: string;
  status: JobStatusType;
  credentials?: {
    username?: string;
    password?: string;
  };
  attachments?: JobAttachment[];
  created_at?: unknown;
  updated_at?: unknown;
  // Derived fields used by server-side filtering, search and sorting.
  filter_key?: string;
  search_terms?: string[];
  title_norm?: string;
  created_ms?: number;
  search_index_version?: number;
}
