"use client";

import { useCallback, useMemo } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  getFirestoreErrorMessage,
  reportFirestoreError,
} from "@/lib/firebase/firestoreErrors";
import type { JobStatusType } from "@/lib/constants/statusConfig";
import { useAuth } from "./useAuth";
import type { JobDocument } from "./useJobs";

export function useJobMutations() {
  const { currentUser } = useAuth();

  const addJob = useCallback(
    async (jobData: Omit<JobDocument, "id">) => {
      if (!currentUser) throw new Error("লগইন করা প্রয়োজন।");
      const path = `users/${currentUser.uid}/jobs`;

      try {
        const jobsRef = collection(db, "users", currentUser.uid, "jobs");
        return await addDoc(jobsRef, {
          ...jobData,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
      } catch (error) {
        reportFirestoreError(error, "create", path);
        throw new Error(getFirestoreErrorMessage("create"));
      }
    },
    [currentUser],
  );

  const updateJob = useCallback(
    async (jobId: string, updates: Partial<JobDocument>) => {
      if (!currentUser) throw new Error("লগইন করা প্রয়োজন।");
      const path = `users/${currentUser.uid}/jobs/${jobId}`;

      try {
        const jobRef = doc(db, "users", currentUser.uid, "jobs", jobId);
        await updateDoc(jobRef, {
          ...updates,
          updated_at: serverTimestamp(),
        });
      } catch (error) {
        reportFirestoreError(error, "update", path);
        throw new Error(getFirestoreErrorMessage("update"));
      }
    },
    [currentUser],
  );

  const updateStatus = useCallback(
    async (jobId: string, status: JobStatusType) => {
      if (!currentUser) throw new Error("লগইন করা প্রয়োজন।");
      const path = `users/${currentUser.uid}/jobs/${jobId}`;

      try {
        const jobRef = doc(db, "users", currentUser.uid, "jobs", jobId);
        await updateDoc(jobRef, {
          status,
          updated_at: serverTimestamp(),
        });
      } catch (error) {
        reportFirestoreError(error, "update", path);
        throw new Error(getFirestoreErrorMessage("update"));
      }
    },
    [currentUser],
  );

  const deleteJob = useCallback(
    async (jobId: string) => {
      if (!currentUser) throw new Error("লগইন করা প্রয়োজন।");
      const path = `users/${currentUser.uid}/jobs/${jobId}`;

      try {
        const jobRef = doc(db, "users", currentUser.uid, "jobs", jobId);
        await deleteDoc(jobRef);
      } catch (error) {
        reportFirestoreError(error, "delete", path);
        throw new Error(getFirestoreErrorMessage("delete"));
      }
    },
    [currentUser],
  );

  return useMemo(
    () => ({ addJob, updateJob, updateStatus, deleteJob }),
    [addJob, updateJob, updateStatus, deleteJob],
  );
}
