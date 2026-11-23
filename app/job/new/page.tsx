"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { useJobMutations } from "@/lib/hooks/useJobMutations";
import type { JobAttachment } from "@/lib/types/attachment";
import {
  deleteJobAttachment,
  uploadJobAttachment,
} from "@/lib/utils/attachments";
import { toBnDigits } from "@/lib/utils/bn";
import {
  jobFormDefaultValues,
  toJobPayload,
  type JobFormInput,
} from "@/lib/validation/jobFormSchema";
import { Header } from "@/app/components/layout/Header";
import { ProtectedRoute } from "@/app/components/layout/ProtectedRoute";
import {
  JobForm,
  type JobFormAttachmentChanges,
} from "@/app/components/job/JobForm";

export default function JobNewPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { addJob } = useJobMutations();
  const [saving, setSaving] = useState(false);
  const [savingLabel, setSavingLabel] = useState<string | null>(null);

  const handleSubmit = async (
    data: JobFormInput,
    changes: JobFormAttachmentChanges,
  ) => {
    if (!currentUser) {
      toast.error("লগইন করা প্রয়োজন।");
      return;
    }

    setSaving(true);
    const uploaded: JobAttachment[] = [];

    try {
      if (changes.files.length > 0) {
        for (const [index, file] of changes.files.entries()) {
          setSavingLabel(
            changes.files.length > 1
              ? `ফাইল আপলোড হচ্ছে… ${toBnDigits(index + 1)}/${toBnDigits(changes.files.length)}`
              : "ফাইল আপলোড হচ্ছে…",
          );
          uploaded.push(await uploadJobAttachment(file, currentUser));
        }
      }

      setSavingLabel("আবেদন সংরক্ষণ হচ্ছে…");
      const docRef = await addJob({
        ...toJobPayload(data),
        attachments: [...changes.attachments, ...uploaded],
      });
      toast.success("চাকরি সফলভাবে যোগ করা হয়েছে ✓");
      router.push(`/job/${docRef.id}`);
    } catch (error) {
      if (uploaded.length > 0) {
        const cleanup = await Promise.allSettled(
          uploaded.map((attachment) =>
            deleteJobAttachment(attachment, currentUser),
          ),
        );
        cleanup.forEach((result) => {
          if (result.status === "rejected") {
            console.error("Uploaded file cleanup failed:", result.reason);
          }
        });
      }
      toast.error(
        error instanceof Error
          ? error.message
          : "কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন",
      );
    } finally {
      setSaving(false);
      setSavingLabel(null);
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
              <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-slate-500">
                ড্যাশবোর্ড / নতুন আবেদন
              </p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                নতুন আবেদন যোগ করুন
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                তথ্য যত গোছানো থাকবে, ডেডলাইন তত কম মিস হবে।
              </p>
            </div>
            <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[12px] font-semibold text-emerald-700 sm:inline-flex">
              <ShieldCheck size={12} />
              অ্যাকাউন্টে সুরক্ষিত
            </span>
          </div>

          <JobForm
            initialValues={jobFormDefaultValues}
            submitLabel="সংরক্ষণ করুন"
            saving={saving}
            savingLabel={savingLabel ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
}
