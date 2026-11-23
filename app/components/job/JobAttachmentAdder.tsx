"use client";

import React, { useState } from "react";
import { FilePlus2, Paperclip, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { useJobMutations } from "@/lib/hooks/useJobMutations";
import type { JobAttachment } from "@/lib/types/attachment";
import {
  MAX_ATTACHMENT_COUNT,
  deleteJobAttachment,
  uploadJobAttachment,
  validateAttachmentSelection,
} from "@/lib/utils/attachments";
import { toBnDigits } from "@/lib/utils/bn";
import { Button } from "@/app/components/ui/Button";
import { AttachmentManager } from "./AttachmentManager";

interface JobAttachmentAdderProps {
  jobId: string;
  attachments: JobAttachment[];
}

const UPLOAD_TOAST_ID = "job-attachment-upload";

export function JobAttachmentAdder({
  jobId,
  attachments,
}: JobAttachmentAdderProps) {
  const { currentUser } = useAuth();
  const { updateJob } = useJobMutations();
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const total = attachments.length + selectedFiles.length;
  const remaining = MAX_ATTACHMENT_COUNT - total;
  const hasAttachments = attachments.length > 0;

  const handleFilesSelected = (files: File[]) => {
    const validation = validateAttachmentSelection(files, total);
    if (validation) {
      setError(validation);
      return;
    }
    setSelectedFiles((current) => [...current, ...files]);
    setError(null);
  };

  const handleRemoveSelected = (index: number) => {
    setSelectedFiles((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
    setError(null);
  };

  const closePanel = () => {
    if (saving) return;
    setOpen(false);
    setSelectedFiles([]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!currentUser) {
      toast.error("লগইন করা প্রয়োজন।");
      return;
    }

    const validation = validateAttachmentSelection(
      selectedFiles,
      attachments.length,
    );
    if (validation) {
      setError(validation);
      return;
    }
    if (selectedFiles.length === 0) return;

    setSaving(true);
    const uploaded: JobAttachment[] = [];

    try {
      for (const [index, file] of selectedFiles.entries()) {
        if (selectedFiles.length > 1) {
          toast.loading(
            `ফাইল আপলোড হচ্ছে… ${toBnDigits(index + 1)}/${toBnDigits(selectedFiles.length)}`,
            { id: UPLOAD_TOAST_ID },
          );
        }
        uploaded.push(await uploadJobAttachment(file, currentUser));
      }

      await updateJob(jobId, {
        attachments: [...attachments, ...uploaded],
      });

      toast.success(
        uploaded.length > 1
          ? `${toBnDigits(uploaded.length)}টি ফাইল সংযুক্ত হয়েছে ✓`
          : "ফাইল সংযুক্ত হয়েছে ✓",
        { id: UPLOAD_TOAST_ID },
      );
      setSelectedFiles([]);
      setError(null);
      setOpen(false);
    } catch (uploadError) {
      toast.dismiss(UPLOAD_TOAST_ID);
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
        uploadError instanceof Error
          ? uploadError.message
          : "ফাইল সংযুক্ত করা যায়নি, আবার চেষ্টা করুন",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-4 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-card">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-brand-600">
          <FilePlus2 size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-slate-900">
            {hasAttachments ? "নতুন ফাইল সংযুক্ত করুন" : "সংযুক্ত ফাইল ও ডকুমেন্ট"}
          </h2>
          <p className="mt-0.5 text-[12px] leading-5 text-slate-500">
            {hasAttachments
              ? `আরও ${toBnDigits(remaining)}টি ফাইল যোগ করা যাবে।`
              : `এখনো কোনো ফাইল নেই। আবেদনের কপি বা প্রয়োজনীয় ডকুমেন্ট যোগ করুন।`}
          </p>
        </div>

        {open ? (
          <button
            type="button"
            onClick={closePanel}
            disabled={saving}
            title="বন্ধ করুন"
            aria-label="সংযুক্তি যোগ করার অংশ বন্ধ করুন"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
          >
            <X size={16} />
          </button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setOpen(true)}
            disabled={remaining === 0}
            className="shrink-0"
          >
            <Paperclip size={13} />
            যোগ করুন
          </Button>
        )}
      </div>

      {!open && remaining === 0 && (
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] font-medium leading-5 text-amber-800">
          সর্বোচ্চ {toBnDigits(MAX_ATTACHMENT_COUNT)}টি ফাইল সংযুক্ত আছে। নতুন ফাইল
          যোগ করতে প্রথমে সম্পাদনা থেকে একটি ফাইল সরান।
        </p>
      )}

      {open && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <AttachmentManager
            attachments={[]}
            selectedFiles={selectedFiles}
            error={error}
            disabled={saving}
            countOffset={attachments.length}
            onFilesSelected={handleFilesSelected}
            onRemoveExisting={() => {}}
            onRemoveSelected={handleRemoveSelected}
          />

          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={closePanel}
              disabled={saving}
            >
              বাতিল করুন
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleUpload}
              loading={saving}
              disabled={selectedFiles.length === 0}
            >
              <Plus size={15} />
              {saving ? "সংযুক্ত হচ্ছে…" : "সংযুক্ত করুন"}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
