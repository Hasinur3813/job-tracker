"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useJobMutations } from "@/lib/hooks/useJobMutations";
import {
  jobFormDefaultValues,
  toJobPayload,
  type JobFormInput,
} from "@/lib/validation/jobFormSchema";
import { Header } from "@/app/components/layout/Header";
import { ProtectedRoute } from "@/app/components/layout/ProtectedRoute";
import { JobForm } from "@/app/components/job/JobForm";

export default function JobNewPage() {
  const router = useRouter();
  const { addJob } = useJobMutations();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data: JobFormInput) => {
    setSaving(true);
    try {
      const docRef = await addJob(toJobPayload(data));
      toast.success("চাকরি সফলভাবে যোগ করা হয়েছে ✓");
      router.push(`/job/${docRef.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-canvas">
        <Header />

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mb-6 flex items-start gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-soft transition-all hover:border-slate-300 hover:text-slate-800"
              title="ফিরে যান"
              aria-label="ফিরে যান"
            >
              <ArrowLeft size={17} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                ড্যাশবোর্ড / নতুন আবেদন
              </p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                নতুন আবেদন যোগ করুন
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                তথ্য যত গোছানো থাকবে, ডেডলাইন তত কম মিস হবে।
              </p>
            </div>
            <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700 sm:inline-flex">
              <ShieldCheck size={12} />
              অ্যাকাউন্টে সুরক্ষিত
            </span>
          </div>

          <JobForm
            initialValues={jobFormDefaultValues}
            submitLabel="সংরক্ষণ করুন"
            saving={saving}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
}
