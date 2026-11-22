"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  getFirestoreErrorMessage,
  reportFirestoreError,
} from "@/lib/firebase/firestoreErrors";
import { useAuth } from "./useAuth";

export interface JobDocument {
  id: string;
  title: string;
  organisation: string;
  position_number?: string;
  category: "govt" | "non-govt";
  deadline: string; // YYYY-MM-DD
  source_url?: string;
  salary_range?: string;
  notes?: string;
  status:
    | "not_applied"
    | "applied"
    | "skipped"
    | "given_exam"
    | "passed"
    | "failed"
    | "interviewed";
  credentials?: {
    username?: string;
    password?: string;
  };
  created_at?: unknown;
  updated_at?: unknown;
}

export function useJobs() {
  const { currentUser, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<JobDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!currentUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setJobs([]);
      setError(null);
      setLoading(false);
      return;
    }

    const path = `users/${currentUser.uid}/jobs`;
    const jobsRef = collection(db, "users", currentUser.uid, "jobs");

    const unsubscribe = onSnapshot(
      jobsRef,
      (snapshot) => {
        setJobs(
          snapshot.docs.map(
            (doc) =>
              ({
                ...doc.data(),
                id: doc.id,
              }) as JobDocument,
          ),
        );
        setError(null);
        setLoading(false);
      },
      (listError) => {
        reportFirestoreError(listError, "list", path);
        setError(getFirestoreErrorMessage("list"));
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [currentUser, authLoading]);

  return { jobs, loading, error };
}
