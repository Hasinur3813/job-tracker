"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import {
  ArrowLeft,
  CircleAlert,
  FileQuestion,
  RotateCcw,
} from "lucide-react";
import toast from "react-hot-toast";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/hooks/useAuth";
import { useJobMutations } from "@/lib/hooks/useJobMutations";
import type { JobDocument } from "@/lib/hooks/useJobs";
import {
  jobDocumentToFormInput,
  toJobPayload,
  type JobFormInput,
} from "@/lib/validation/jobFormSchema";
import { Header } from "@/app/components/layout/Header";
import { ProtectedRoute } from "@/app/components/layout/ProtectedRoute";
import { JobForm } from "@/app/components/job/JobForm";
import { Button } from "@/app/components/ui/Button";

export default function JobEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = React.use(params);
  const { currentUser } = useAuth();
  const { updateJob } = useJobMutations();
  const [job, setJob] = useState<JobDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser || !id) return;

    let active = true;

    const loadJob = async () => {
      try {
        const snapshot = await getDoc(
          doc(db, "users", currentUser.uid, "jobs", id),
        );
        if (!active) return;

        if (snapshot.exists()) {
          setJob({
            id: snapshot.id,
            ...(snapshot.data() as Omit<JobDocument, "id">),
          });
        } else {
          setJob(null);
        }
      } catch (error) {
        console.error("Failed to load job for editing:", error);
        if (active) {
          setFetchError(
            "আবেদনের তথ্য লোড করা যায়নি। ইন্টারনেট সংযোগ যাচাই করে আবার চেষ্টা করুন।",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadJob();

    return () => {
      active = false;
    };
  }, [currentUser, id, reloadKey]);

  const handleSubmit = async (data: JobFormInput) => {
    setSaving(true);
    try {
      await updateJob(id, toJobPayload(data));
      toast.success("চাকরির তথ্য সফলভাবে আপডেট হয়েছে ✓");
      router.push(`/job/${id}`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "আপডেট করা যায়নি, আবার চেষ্টা করুন",
      );
    } finally {
      setSaving(false);
    }
  };

  const retryFetch = () => {
    setLoading(true);
    setFetchError(null);
    setReloadKey((value) => value + 1);
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-canvas">
        <Header />

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-200/70" />
                <div className="space-y-2">
                  <div className="h-2 w-28 rounded bg-slate-200/70" />
                  <div className="h-6 w-52 rounded bg-slate-200/70" />
                </div>
              </div>
              <div className="h-52 rounded-3xl border border-slate-200/70 bg-white" />
              <div className="h-36 rounded-3xl border border-slate-200/70 bg-white" />
            </div>
          ) : fetchError ? (
            <div className="mx-auto max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-card">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <CircleAlert size={26} />
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-900">
                তথ্য লোড করা যায়নি
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {fetchError}
              </p>
              <div className="mt-6 space-y-2.5">
                <Button variant="primary" fullWidth onClick={retryFetch}>
                  <RotateCcw size={15} />
                  আবার চেষ্টা করুন
                </Button>
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => router.push("/dashboard")}
                >
                  ড্যাশবোর্ডে ফিরে যান
                </Button>
              </div>
            </div>
          ) : !job ? (
            <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-card">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <FileQuestion size={26} />
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-900">
                চাকরির তথ্য খুঁজে পাওয়া যায়নি
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                আবেদনটি মুছে ফেলা হয়েছে অথবা এটি আপনার অ্যাকাউন্টের সঙ্গে
                যুক্ত নয়।
              </p>
              <Button
                variant="primary"
                fullWidth
                className="mt-6"
                onClick={() => router.push("/dashboard")}
              >
                ড্যাশবোর্ডে ফিরে যান
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => router.push(`/job/${id}`)}
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-soft transition-all hover:border-slate-300 hover:text-slate-800"
                  title="ফিরে যান"
                  aria-label="ফিরে যান"
                >
                  <ArrowLeft size={17} />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    ড্যাশবোর্ড / সম্পাদনা
                  </p>
                  <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                    আবেদন সম্পাদনা করুন
                  </h1>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                    {job.title} · {job.organisation}
                  </p>
                </div>
              </div>

              <JobForm
                initialValues={jobDocumentToFormInput(job)}
                submitLabel="আপডেট করুন"
                saving={saving}
                onSubmit={handleSubmit}
                onCancel={() => router.push(`/job/${id}`)}
              />
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
