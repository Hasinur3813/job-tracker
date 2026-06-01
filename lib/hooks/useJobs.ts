"use client";

import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase/config";
import { useAuth } from "./useAuth";

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface JobDocument {
  id: string;
  title: string;
  organisation: string;
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
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState<JobDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setJobs([]);
      setLoading(false);
      return;
    }

    const path = `users/${currentUser.uid}/jobs`;
    const jobsRef = collection(db, "users", currentUser.uid, "jobs");
    const jobsQuery = query(jobsRef, orderBy("deadline", "asc"));

    const unsubscribe = onSnapshot(
      jobsQuery,
      (snapshot) => {
        try {
          const jobsList: JobDocument[] = snapshot.docs.map(
            (doc) =>
              ({
                ...doc.data(),
                id: doc.id,
              }) as JobDocument,
          );
          setJobs(jobsList);
          setLoading(false);
        } catch (err) {
          handleFirestoreError(err, OperationType.LIST, path);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, path);
      },
    );

    return unsubscribe;
  }, [currentUser]);

  const addJob = async (jobData: Omit<JobDocument, "id">) => {
    if (!currentUser) throw new Error("No user logged in");
    try {
      //   const path = `users/${currentUser.uid}/jobs`;
      const jobsRef = collection(db, "users", currentUser.uid, "jobs");
      const docRef = await addDoc(jobsRef, {
        ...jobData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      return docRef;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, null);
    }
  };

  const updateJob = async (jobId: string, updates: Partial<JobDocument>) => {
    if (!currentUser) throw new Error("No user logged in");
    try {
      //   const path = `users/${currentUser.uid}/jobs/${jobId}`;
      const jobRef = doc(db, "users", currentUser.uid, "jobs", jobId);
      const { ...updateData } = updates;
      await updateDoc(jobRef, {
        ...updateData,
        updated_at: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, null);
    }
  };

  const updateStatus = async (jobId: string, status: string) => {
    if (!currentUser) throw new Error("No user logged in");
    try {
      //   const path = `users/${currentUser.uid}/jobs/${jobId}`;
      const jobRef = doc(db, "users", currentUser.uid, "jobs", jobId);
      await updateDoc(jobRef, {
        status,
        updated_at: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, null);
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!currentUser) throw new Error("No user logged in");
    try {
      //   const path = `users/${currentUser.uid}/jobs/${jobId}`;
      const jobRef = doc(db, "users", currentUser.uid, "jobs", jobId);
      await deleteDoc(jobRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, null);
    }
  };

  return {
    jobs,
    loading,
    addJob,
    updateJob,
    updateStatus,
    deleteJob,
  };
}
