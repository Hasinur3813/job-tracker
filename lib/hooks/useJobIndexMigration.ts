"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  collection,
  getCountFromServer,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  getFirestoreErrorMessage,
  reportFirestoreError,
} from "@/lib/firebase/firestoreErrors";
import type { JobDocument } from "@/lib/types/job";
import {
  buildJobIndexMigrationFields,
  JOB_INDEX_VERSION,
} from "@/lib/utils/jobIndex";
import { useAuth } from "./useAuth";

export type JobIndexStatus =
  | "checking"
  | "needs_confirmation"
  | "migrating"
  | "ready"
  | "error";

type JobIndexCheck = Pick<
  JobDocument,
  | "filter_key"
  | "search_terms"
  | "title_norm"
  | "created_ms"
  | "search_index_version"
>;

const MIGRATION_BATCH_SIZE = 100;

function needsIndex(data: JobIndexCheck): boolean {
  return (
    data.search_index_version !== JOB_INDEX_VERSION ||
    typeof data.filter_key !== "string" ||
    !Array.isArray(data.search_terms) ||
    typeof data.title_norm !== "string" ||
    typeof data.created_ms !== "number"
  );
}

export function useJobIndexMigration() {
  const { currentUser, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<JobIndexStatus>("checking");
  const [pendingCount, setPendingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [checkVersion, setCheckVersion] = useState(0);
  const runningRef = useRef(false);

  useEffect(() => {
    if (authLoading || !currentUser) return;

    let active = true;
    const uid = currentUser.uid;
    const jobsRef = collection(db, "users", uid, "jobs");

    const check = async () => {
      try {
        const [totalSnapshot, indexedSnapshot] = await Promise.all([
          getCountFromServer(jobsRef),
          getCountFromServer(
            query(
              jobsRef,
              where("search_index_version", "==", JOB_INDEX_VERSION),
            ),
          ),
        ]);

        if (!active) return;

        const pending = Math.max(
          0,
          totalSnapshot.data().count - indexedSnapshot.data().count,
        );

        setPendingCount(pending);
        setError(null);
        setStatus(pending === 0 ? "ready" : "needs_confirmation");
      } catch (checkError) {
        if (!active) return;

        reportFirestoreError(checkError, "list", `users/${uid}/jobs`);
        setError(
          "আবেদনের সার্চ সূচি যাচাই করা যায়নি। ইন্টারনেট সংযোগ যাচাই করে আবার চেষ্টা করুন।",
        );
        setStatus("error");
      }
    };

    void check();

    return () => {
      active = false;
    };
  }, [currentUser, authLoading, checkVersion]);

  const confirm = useCallback(async () => {
    if (!currentUser || runningRef.current) return;

    runningRef.current = true;
    setStatus("migrating");
    setError(null);

    const uid = currentUser.uid;
    const jobsRef = collection(db, "users", uid, "jobs");

    try {
      const snapshot = await getDocs(jobsRef);
      let batch = writeBatch(db);
      let batchCount = 0;

      for (const jobSnapshot of snapshot.docs) {
        const data = jobSnapshot.data() as Partial<JobDocument>;

        const indexCheck: JobIndexCheck = {
          filter_key: data.filter_key,
          search_terms: data.search_terms,
          title_norm: data.title_norm,
          created_ms: data.created_ms,
          search_index_version: data.search_index_version,
        };

        if (!needsIndex(indexCheck)) continue;

        batch.set(
          jobSnapshot.ref,
          {
            ...buildJobIndexMigrationFields({
              title: data.title,
              organisation: data.organisation,
              position_number: data.position_number,
              category: data.category,
              status: data.status,
              created_at: data.created_at,
              updated_at: data.updated_at,
              created_ms: data.created_ms,
            }),
          },
          { merge: true },
        );
        batchCount += 1;

        if (batchCount >= MIGRATION_BATCH_SIZE) {
          await batch.commit();
          batch = writeBatch(db);
          batchCount = 0;
        }
      }

      if (batchCount > 0) {
        await batch.commit();
      }

      setPendingCount(0);
      setStatus("ready");
    } catch (migrationError) {
      reportFirestoreError(migrationError, "update", `users/${uid}/jobs`);
      setError(getFirestoreErrorMessage("update"));
      setStatus("error");
    } finally {
      runningRef.current = false;
    }
  }, [currentUser]);

  const retry = useCallback(() => {
    setError(null);
    setStatus("checking");
    setCheckVersion((value) => value + 1);
  }, []);

  return {
    status,
    pendingCount,
    error,
    confirm,
    retry,
  };
}
