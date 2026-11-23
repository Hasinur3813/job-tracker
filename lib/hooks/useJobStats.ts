"use client";

import { useCallback, useEffect, useState } from "react";
import { addDays, format } from "date-fns";
import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  getFirestoreQueryErrorMessage,
  reportFirestoreError,
} from "@/lib/firebase/firestoreErrors";
import type { JobStatusType } from "@/lib/constants/statusConfig";
import type { JobCategory, JobDocument } from "@/lib/types/job";
import {
  ACTIVE_FILTER_KEYS,
  ALL_STATUSES,
} from "@/lib/utils/jobIndex";
import { useAuth } from "./useAuth";

export interface JobStats {
  total: number;
  active: number;
  upcoming: number;
  passed: number;
  categoryCounts: Record<JobCategory, number>;
  statusCounts: Record<JobStatusType, number>;
  nextDeadlineJob: JobDocument | null;
}

function toDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function useJobStats(enabled: boolean) {
  const { currentUser, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<JobStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((value) => value + 1);
  }, []);

  useEffect(() => {
    if (authLoading || !currentUser || !enabled) return;

    let active = true;
    const uid = currentUser.uid;
    const jobsRef = collection(db, "users", uid, "jobs");

    const load = async () => {
      setLoading(true);

      try {
        const today = toDateKey(new Date());
        const weekEnd = toDateKey(addDays(new Date(), 8));
        const upcomingConstraints = [
          where("filter_key", "in", ACTIVE_FILTER_KEYS),
          where("deadline", ">=", today),
          where("deadline", "<", weekEnd),
        ];

        const [
          totalSnapshot,
          govtSnapshot,
          nonGovtSnapshot,
          upcomingSnapshot,
          ...statusSnapshots
        ] = await Promise.all([
          getCountFromServer(jobsRef),
          getCountFromServer(
            query(jobsRef, where("category", "==", "govt")),
          ),
          getCountFromServer(
            query(jobsRef, where("category", "==", "non-govt")),
          ),
          getCountFromServer(
            query(jobsRef, ...upcomingConstraints),
          ),
          ...ALL_STATUSES.map((status) =>
            getCountFromServer(
              query(jobsRef, where("status", "==", status)),
            ),
          ),
        ]);

        const nextDeadlineSnapshot = await getDocs(
          query(
            jobsRef,
            where("filter_key", "in", ACTIVE_FILTER_KEYS),
            where("deadline", ">=", today),
            orderBy("deadline", "asc"),
            limit(1),
          ),
        );

        if (!active) return;

        const statusCounts = ALL_STATUSES.reduce(
          (counts, status, index) => {
            counts[status] = statusSnapshots[index].data().count;
            return counts;
          },
          {} as Record<JobStatusType, number>,
        );

        const total = totalSnapshot.data().count;
        const nextDeadlineDoc = nextDeadlineSnapshot.docs[0];

        setStats({
          total,
          active:
            total -
            statusCounts.passed -
            statusCounts.failed -
            statusCounts.skipped,
          upcoming: upcomingSnapshot.data().count,
          passed: statusCounts.passed,
          categoryCounts: {
            govt: govtSnapshot.data().count,
            "non-govt": nonGovtSnapshot.data().count,
          },
          statusCounts,
          nextDeadlineJob: nextDeadlineDoc
            ? ({
                id: nextDeadlineDoc.id,
                ...nextDeadlineDoc.data(),
              } as JobDocument)
            : null,
        });
        setError(null);
        setLoading(false);
      } catch (loadError) {
        if (!active) return;

        reportFirestoreError(loadError, "list", `users/${uid}/jobs`);
        setError(getFirestoreQueryErrorMessage(loadError));
        setStats(null);
        setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [currentUser, authLoading, enabled, refreshKey]);

  return { stats, loading, error, refresh };
}
