import type { JobStatusType } from "@/lib/constants/statusConfig";
import type { JobCategory, JobDocument } from "@/lib/types/job";
import { timestampToMillis } from "./deadline";

export const JOB_INDEX_VERSION = 1;

export const JOB_CATEGORIES: readonly JobCategory[] = ["govt", "non-govt"];

export const ALL_STATUSES: readonly JobStatusType[] = [
  "not_applied",
  "applied",
  "given_exam",
  "passed",
  "failed",
  "interviewed",
  "skipped",
];

export const FINAL_STATUSES: readonly JobStatusType[] = [
  "passed",
  "failed",
  "skipped",
];

export const ACTIVE_STATUSES = ALL_STATUSES.filter(
  (status) => !FINAL_STATUSES.includes(status),
);

export type JobFilterCategory = "all" | JobCategory;
export type JobFilterStatus = "all" | JobStatusType;
export type JobSortOption = "deadline" | "recent" | "title";

const SEARCH_TERM_SEPARATOR = "|";
const MAX_PREFIX_LENGTH = 24;
const MAX_SEARCH_TERMS = 5000;
const BENGALI_DIGITS = "০১২৩৪৫৬৭৮৯";

export function getJobFilterKey(
  category: JobCategory,
  status: JobStatusType,
): string {
  return `${category}:${status}`;
}

export function buildFilterKeys(
  category: JobFilterCategory,
  status: JobFilterStatus,
): string[] {
  const categories =
    category === "all" ? JOB_CATEGORIES : ([category] as const);
  const statuses = status === "all" ? ALL_STATUSES : ([status] as const);
  const keys: string[] = [];

  for (const itemCategory of categories) {
    for (const itemStatus of statuses) {
      keys.push(getJobFilterKey(itemCategory, itemStatus));
    }
  }

  return keys;
}

export const ACTIVE_FILTER_KEYS = buildFilterKeys("all", "all").filter(
  (key) =>
    ACTIVE_STATUSES.includes(
      key.slice(key.indexOf(":") + 1) as JobStatusType,
    ),
);

export function normalizeSearchText(value?: unknown): string {
  if (typeof value !== "string" && typeof value !== "number") {
    return "";
  }

  return String(value)
    .normalize("NFKC")
    .replace(/[০-৯]/g, (digit) =>
      String(BENGALI_DIGITS.indexOf(digit)),
    )
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function addPrefixTokens(value: unknown, tokens: Set<string>) {
  const normalized = normalizeSearchText(value);
  if (!normalized) return;

  const maxPrefix = Math.min(normalized.length, MAX_PREFIX_LENGTH);

  for (let start = 0; start < normalized.length; start += 1) {
    if (start > 0 && normalized[start - 1] !== " ") continue;

    for (
      let length = 1;
      length <= maxPrefix && start + length <= normalized.length;
      length += 1
    ) {
      const token = normalized.slice(start, start + length);
      if (token.endsWith(" ")) continue;
      tokens.add(token);
    }
  }
}

export function getSearchPrefix(query: string): string | null {
  const normalized = normalizeSearchText(query);
  if (!normalized) return null;

  const prefix = normalized.slice(0, MAX_PREFIX_LENGTH).trimEnd();
  return prefix || null;
}

export function buildSearchQueryTerms(
  filterKeys: string[],
  query: string,
): string[] {
  const prefix = getSearchPrefix(query);
  if (!prefix) return [];

  return filterKeys.map(
    (filterKey) =>
      `${filterKey}${SEARCH_TERM_SEPARATOR}${prefix}`,
  );
}

export interface JobIndexSource {
  title?: string;
  organisation?: string;
  position_number?: string;
  category?: JobCategory;
  status?: JobStatusType;
}

type JobIndexMigrationSource = JobIndexSource &
  Pick<JobDocument, "created_ms" | "created_at" | "updated_at">;

export interface JobIndexFields {
  filter_key: string;
  search_terms: string[];
  title_norm: string;
  search_index_version: number;
}

export function buildJobIndexFields(job: JobIndexSource): JobIndexFields {
  const category: JobCategory =
    job.category === "govt" ? "govt" : "non-govt";
  const status: JobStatusType =
    job.status && ALL_STATUSES.includes(job.status)
      ? job.status
      : "not_applied";
  const filterKey = getJobFilterKey(category, status);

  const tokens = new Set<string>();
  addPrefixTokens(job.title, tokens);
  addPrefixTokens(job.organisation, tokens);
  addPrefixTokens(job.position_number, tokens);

  return {
    filter_key: filterKey,
    search_terms: Array.from(tokens)
      .slice(0, MAX_SEARCH_TERMS)
      .map(
        (token) =>
          `${filterKey}${SEARCH_TERM_SEPARATOR}${token}`,
      ),
    title_norm: normalizeSearchText(job.title),
    search_index_version: JOB_INDEX_VERSION,
  };
}

export function getJobCreatedMs(
  job: Pick<JobDocument, "created_ms" | "created_at" | "updated_at">,
): number {
  if (typeof job.created_ms === "number") return job.created_ms;

  return (
    timestampToMillis(job.created_at) ??
    timestampToMillis(job.updated_at) ??
    0
  );
}

export function buildJobIndexMigrationFields(
  job: JobIndexMigrationSource,
): JobIndexFields & { created_ms: number } {
  return {
    ...buildJobIndexFields(job),
    created_ms: getJobCreatedMs(job),
  };
}
