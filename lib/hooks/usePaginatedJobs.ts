"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  getFirestoreQueryErrorMessage,
  reportFirestoreError,
} from "@/lib/firebase/firestoreErrors";
import type { JobDocument } from "@/lib/types/job";
import {
  buildFilterKeys,
  buildSearchQueryTerms,
  type JobFilterCategory,
  type JobFilterStatus,
  type JobSortOption,
} from "@/lib/utils/jobIndex";
import { useAuth } from "./useAuth";

export const JOBS_PAGE_SIZE = 9;

export interface JobPageQuery {
  search: string;
  category: JobFilterCategory;
  status: JobFilterStatus;
  sort: JobSortOption;
  page: number;
}

export interface PaginatedJobs {
  jobs: JobDocument[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

interface QueryCache {
  key: string;
  pages: Map<number, JobDocument[]>;
  cursors: Map<number, QueryDocumentSnapshot<DocumentData>>;
  upcomingCursors: Map<number, QueryDocumentSnapshot<DocumentData>>;
  expiredCursors: Map<number, QueryDocumentSnapshot<DocumentData>>;
  counts?: {
    total: number;
    upcoming: number;
    expired: number;
  };
}

function toJobs(snapshot: QuerySnapshot): JobDocument[] {
  return snapshot.docs.map(
    (jobSnapshot) =>
      ({
        id: jobSnapshot.id,
        ...jobSnapshot.data(),
      }) as JobDocument,
  );
}

function getPageMeta(total: number, requestedPage: number) {
  const pageCount =
    total === 0 ? 0 : Math.ceil(total / JOBS_PAGE_SIZE);
  const page =
    pageCount === 0
      ? 1
      : Math.min(Math.max(1, Math.floor(requestedPage)), pageCount);

  return { pageCount, page };
}

export function usePaginatedJobs(
  queryParams: JobPageQuery,
  enabled: boolean,
): PaginatedJobs {
  const { currentUser, loading: authLoading } = useAuth();
  const { search, category, status, sort, page } = queryParams;
  const [jobs, setJobs] = useState<JobDocument[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const cacheRef = useRef<QueryCache | null>(null);

  const refresh = useCallback(() => {
    setRefreshKey((value) => value + 1);
  }, []);

  useEffect(() => {
    if (authLoading || !currentUser || !enabled) return;

    let active = true;
    const uid = currentUser.uid;
    const jobsRef = collection(db, "users", uid, "jobs");
    const cacheKey = JSON.stringify({
      uid,
      search,
      category,
      status,
      sort,
      refreshKey,
    });

    if (!cacheRef.current || cacheRef.current.key !== cacheKey) {
      cacheRef.current = {
        key: cacheKey,
        pages: new Map(),
        cursors: new Map(),
        upcomingCursors: new Map(),
        expiredCursors: new Map(),
      };
    }

    const cache = cacheRef.current;

    const resetCachedPages = () => {
      cache.pages.clear();
      cache.cursors.clear();
      cache.upcomingCursors.clear();
      cache.expiredCursors.clear();
    };

    const load = async () => {
      setLoading(true);

      try {
        const filterKeys = buildFilterKeys(category, status);
        const searchTerms = buildSearchQueryTerms(filterKeys, search);
        const constraints: QueryConstraint[] =
          searchTerms.length > 0
            ? [
                where(
                  "search_terms",
                  "array-contains-any",
                  searchTerms,
                ),
              ]
            : [where("filter_key", "in", filterKeys)];

        let nextJobs: JobDocument[] = [];
        let nextTotal = 0;

        if (sort === "deadline") {
          const today = format(new Date(), "yyyy-MM-dd");
          const upcomingConstraints: QueryConstraint[] = [
            ...constraints,
            where("deadline", ">=", today),
          ];
          const expiredConstraints: QueryConstraint[] = [
            ...constraints,
            where("deadline", "<", today),
          ];

          const [upcomingSnapshot, expiredSnapshot] =
            await Promise.all([
              getCountFromServer(
                query(jobsRef, ...upcomingConstraints),
              ),
              getCountFromServer(
                query(jobsRef, ...expiredConstraints),
              ),
            ]);

          if (!active) return;

          const upcoming = upcomingSnapshot.data().count;
          const expired = expiredSnapshot.data().count;
          nextTotal = upcoming + expired;

          const countsChanged =
            cache.counts !== undefined &&
            (cache.counts.total !== nextTotal ||
              cache.counts.upcoming !== upcoming ||
              cache.counts.expired !== expired);

          if (countsChanged) resetCachedPages();

          cache.counts = {
            total: nextTotal,
            upcoming,
            expired,
          };

          const meta = getPageMeta(nextTotal, page);

          for (
            let pageNumber = 1;
            pageNumber <= meta.page;
            pageNumber += 1
          ) {
            if (cache.pages.has(pageNumber)) continue;

            const pageStart =
              (pageNumber - 1) * JOBS_PAGE_SIZE;
            const pageEnd = pageStart + JOBS_PAGE_SIZE;
            const upcomingDocs: JobDocument[] = [];
            let upcomingCursor: QueryDocumentSnapshot<DocumentData> | null =
              null;

            if (pageStart < upcoming) {
              if (pageNumber > 1) {
                const storedCursor =
                  cache.upcomingCursors.get(pageNumber);
                if (!storedCursor) {
                  throw new Error("Pagination cursor missing");
                }
                upcomingCursor = storedCursor;
              }

              const aLimit = Math.min(
                JOBS_PAGE_SIZE,
                upcoming - pageStart,
              );
              const pageConstraints: QueryConstraint[] = [
                ...upcomingConstraints,
                orderBy("deadline", "asc"),
              ];

              if (upcomingCursor) {
                pageConstraints.push(startAfter(upcomingCursor));
              }

              pageConstraints.push(limit(aLimit));

              const upcomingSnapshot = await getDocs(
                query(jobsRef, ...pageConstraints),
              );

              if (!active) return;

              upcomingDocs.push(...toJobs(upcomingSnapshot));
              const lastUpcoming = upcomingSnapshot.docs.at(-1);

              if (
                lastUpcoming &&
                pageStart + aLimit < upcoming
              ) {
                cache.upcomingCursors.set(
                  pageNumber + 1,
                  lastUpcoming,
                );
              }
            }

            const expiredDocs: JobDocument[] = [];

            if (pageEnd > upcoming && expired > 0) {
              const expiredOffset = Math.max(
                0,
                pageStart - upcoming,
              );
              const remaining = JOBS_PAGE_SIZE - upcomingDocs.length;

              if (remaining > 0 && expiredOffset < expired) {
                let expiredCursor: QueryDocumentSnapshot<DocumentData> | null =
                  null;

                if (expiredOffset > 0) {
                  const storedCursor =
                    cache.expiredCursors.get(pageNumber);
                  if (!storedCursor) {
                    throw new Error("Pagination cursor missing");
                  }
                  expiredCursor = storedCursor;
                }

                const bLimit = Math.min(
                  remaining,
                  expired - expiredOffset,
                );
                const pageConstraints: QueryConstraint[] = [
                  ...expiredConstraints,
                  orderBy("deadline", "desc"),
                ];

                if (expiredCursor) {
                  pageConstraints.push(startAfter(expiredCursor));
                }

                pageConstraints.push(limit(bLimit));

                const expiredSnapshot = await getDocs(
                  query(jobsRef, ...pageConstraints),
                );

                if (!active) return;

                expiredDocs.push(...toJobs(expiredSnapshot));
                const lastExpired = expiredSnapshot.docs.at(-1);

                if (
                  lastExpired &&
                  expiredOffset + bLimit < expired
                ) {
                  cache.expiredCursors.set(
                    pageNumber + 1,
                    lastExpired,
                  );
                }
              }
            }

            cache.pages.set(pageNumber, [
              ...upcomingDocs,
              ...expiredDocs,
            ]);
          }

          nextJobs = cache.pages.get(meta.page) ?? [];

          if (!active) return;

          setPageCount(meta.pageCount);
          setCurrentPage(meta.page);
        } else {
          const sortField =
            sort === "recent" ? "created_ms" : "title_norm";
          const direction: "asc" | "desc" =
            sort === "recent" ? "desc" : "asc";

          const countSnapshot = await getCountFromServer(
            query(jobsRef, ...constraints),
          );

          if (!active) return;

          nextTotal = countSnapshot.data().count;

          const countsChanged =
            cache.counts !== undefined &&
            cache.counts.total !== nextTotal;

          if (countsChanged) resetCachedPages();

          cache.counts = {
            total: nextTotal,
            upcoming: 0,
            expired: 0,
          };

          const meta = getPageMeta(nextTotal, page);

          for (
            let pageNumber = 1;
            pageNumber <= meta.page;
            pageNumber += 1
          ) {
            if (cache.pages.has(pageNumber)) continue;

            let cursor: QueryDocumentSnapshot<DocumentData> | null =
              null;

            if (pageNumber > 1) {
              const storedCursor = cache.cursors.get(pageNumber);
              if (!storedCursor) {
                throw new Error("Pagination cursor missing");
              }
              cursor = storedCursor;
            }

            const pageConstraints: QueryConstraint[] = [
              ...constraints,
              orderBy(sortField, direction),
            ];

            if (cursor) {
              pageConstraints.push(startAfter(cursor));
            }

            pageConstraints.push(limit(JOBS_PAGE_SIZE));

            const pageSnapshot = await getDocs(
              query(jobsRef, ...pageConstraints),
            );

            if (!active) return;

            cache.pages.set(pageNumber, toJobs(pageSnapshot));
            const lastDoc = pageSnapshot.docs.at(-1);

            if (lastDoc && pageNumber < meta.pageCount) {
              cache.cursors.set(pageNumber + 1, lastDoc);
            }
          }

          nextJobs = cache.pages.get(meta.page) ?? [];

          if (!active) return;

          setPageCount(meta.pageCount);
          setCurrentPage(meta.page);
        }

        setJobs(nextJobs);
        setTotal(nextTotal);
        setError(null);
        setLoading(false);
      } catch (loadError) {
        if (!active) return;

        cacheRef.current = null;
        reportFirestoreError(loadError, "list", `users/${uid}/jobs`);
        setError(getFirestoreQueryErrorMessage(loadError));
        setJobs([]);
        setTotal(0);
        setPageCount(0);
        setCurrentPage(1);
        setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [
    currentUser,
    authLoading,
    enabled,
    search,
    category,
    status,
    sort,
    page,
    refreshKey,
  ]);

  return {
    jobs,
    total,
    page: currentPage,
    pageCount,
    loading,
    error,
    refresh,
  };
}
