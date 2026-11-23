"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Paperclip,
  Save,
  ShieldCheck,
} from "lucide-react";
import {
  jobFormSchema,
  type JobFormInput,
} from "@/lib/validation/jobFormSchema";
import { STATUS_CONFIG } from "@/lib/constants/statusConfig";
import type { JobAttachment } from "@/lib/types/attachment";
import { validateAttachmentSelection } from "@/lib/utils/attachments";
import { toBnDigits } from "@/lib/utils/bn";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import { Textarea } from "@/app/components/ui/Textarea";
import { AttachmentManager } from "./AttachmentManager";

export interface JobFormAttachmentChanges {
  files: File[];
  attachments: JobAttachment[];
  removedAttachments: JobAttachment[];
}

interface JobFormProps {
  initialValues: JobFormInput;
  initialAttachments?: JobAttachment[];
  submitLabel: string;
  saving: boolean;
  savingLabel?: string;
  onSubmit: (
    data: JobFormInput,
    attachmentChanges: JobFormAttachmentChanges,
  ) => Promise<void>;
  onCancel: () => void;
}

interface FormSectionProps {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tone?: "default" | "brand";
  children: React.ReactNode;
}

function FormSection({
  step,
  title,
  description,
  icon,
  tone = "default",
  children,
}: FormSectionProps) {
  return (
    <section
      className={`rounded-3xl border p-5 shadow-card sm:p-6 ${
        tone === "brand"
          ? "border-brand-200/70 bg-brand-50/40"
          : "border-slate-200/70 bg-white"
      }`}
    >
      <div className="mb-5 flex items-start gap-3 border-b border-slate-200/60 pb-4">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            tone === "brand"
              ? "bg-brand-600 text-white shadow-glow"
              : "border border-slate-100 bg-slate-50 text-brand-600"
          }`}
        >
          {icon}
        </span>
        <div>
          <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-slate-500">
            ধাপ {step}
          </p>
          <h2 className="mt-0.5 text-base font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-0.5 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function JobForm({
  initialValues,
  initialAttachments = [],
  submitLabel,
  saving,
  savingLabel,
  onSubmit,
  onCancel,
}: JobFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [attachments, setAttachments] =
    useState<JobAttachment[]>(initialAttachments);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [removedAttachments, setRemovedAttachments] = useState<JobAttachment[]>(
    [],
  );
  const [attachmentError, setAttachmentError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<JobFormInput>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: initialValues,
    mode: "onTouched",
  });

  const categoryValue = useWatch({ control, name: "category" });
  const notesValue = useWatch({ control, name: "notes" });

  const categoryOptions = [
    { value: "govt", label: "সরকারি" },
    { value: "non-govt", label: "বেসরকারি" },
  ];

  const statusOptions = Object.entries(STATUS_CONFIG).map(([value, info]) => ({
    value,
    label: info.label,
  }));

  const handleFilesSelected = (files: File[]) => {
    const validation = validateAttachmentSelection(
      files,
      attachments.length + selectedFiles.length,
    );
    if (validation) {
      setAttachmentError(validation);
      return;
    }
    setSelectedFiles((current) => [...current, ...files]);
    setAttachmentError(null);
  };

  const handleRemoveExisting = (publicId: string) => {
    const target = attachments.find(
      (attachment) => attachment.public_id === publicId,
    );
    if (!target) return;
    setAttachments((current) =>
      current.filter((attachment) => attachment.public_id !== publicId),
    );
    setRemovedAttachments((current) => [...current, target]);
    setAttachmentError(null);
  };

  const handleRemoveSelected = (index: number) => {
    setSelectedFiles((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
    setAttachmentError(null);
  };

  const handleFormSubmit = async (data: JobFormInput) => {
    const validation = validateAttachmentSelection(
      selectedFiles,
      attachments.length,
    );
    if (validation) {
      setAttachmentError(validation);
      document.getElementById("job-attachments")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setAttachmentError(null);
    await onSubmit(data, {
      files: selectedFiles,
      attachments,
      removedAttachments,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4"
      noValidate
    >
      <fieldset disabled={saving} className="min-w-0 space-y-4">
        <FormSection
          step="০১"
          title="আবেদনের মূল তথ্য"
          description="কোন পদে, কোথায় আবেদন করছেন—সবকিছু এক জায়গায় লিখুন।"
          icon={<Briefcase size={18} />}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
              label="পদের নাম"
              placeholder="যেমন: অ্যাসিস্ট্যান্ট প্রোগ্রামার"
              maxLength={200}
              error={errors.title?.message}
              {...register("title")}
            />
            <Input
              label="প্রতিষ্ঠান"
              placeholder="যেমন: বাংলাদেশ ব্যাংক"
              maxLength={200}
              error={errors.organisation?.message}
              {...register("organisation")}
            />
            <Input
              label="পদ সংখ্যা"
              placeholder="যেমন: ০১ বা ৫"
              inputMode="numeric"
              maxLength={20}
              error={errors.position_number?.message}
              {...register("position_number")}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Select
              label="আবেদনের বিভাগ"
              options={categoryOptions}
              error={errors.category?.message}
              {...register("category")}
            />
            <Input
              label="আবেদনের শেষ সময়"
              type="date"
              error={errors.deadline?.message}
              hint="মেয়াদ শেষ হলেও আবেদনটি ট্র্যাক করতে পারবেন।"
              {...register("deadline")}
            />
            <Select
              label="বর্তমান অবস্থা"
              options={statusOptions}
              error={errors.status?.message}
              {...register("status")}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="সার্কুলার লিঙ্ক"
              type="url"
              placeholder="https://example.com/circular"
              maxLength={500}
              error={errors.source_url?.message}
              hint="বিজ্ঞপ্তির মূল লিঙ্কটি রাখলে পরে দ্রুত খুঁজে পাবেন।"
              {...register("source_url")}
            />
            <Input
              label="বেতন বা রেঞ্জ"
              type="text"
              placeholder="যেমন: ২২,০০০ - ৫৩,০৬০ টাকা"
              maxLength={100}
              error={errors.salary_range?.message}
              {...register("salary_range")}
            />
          </div>
        </FormSection>

        <FormSection
          step="০২"
          title="নোট ও অতিরিক্ত তথ্য"
          description="পরীক্ষার সিলেবাস, প্রবেশপত্র বা পরবর্তী করণীয় লিখে রাখুন।"
          icon={<FileText size={18} />}
        >
          <Textarea
            label="গুরুত্বপূর্ণ নোট"
            rows={5}
            maxLength={2000}
            placeholder="পরীক্ষার সিলেবাস, প্রবেশপত্রের অবস্থা, ভাইভার প্রস্তুতি..."
            error={errors.notes?.message}
            hint={`${toBnDigits((notesValue ?? "").length)} / ${toBnDigits(2000)} অক্ষর`}
            {...register("notes")}
          />
        </FormSection>

        <FormSection
          step="০৩"
          title="সংযুক্ত ফাইল ও ডকুমেন্ট"
          description="আবেদনের কপি, প্রবেশপত্র বা প্রয়োজনীয় ফাইল সংরক্ষণ করুন।"
          icon={<Paperclip size={18} />}
        >
          <div id="job-attachments">
            <AttachmentManager
              attachments={attachments}
              selectedFiles={selectedFiles}
              error={attachmentError}
              disabled={saving}
              onFilesSelected={handleFilesSelected}
              onRemoveExisting={handleRemoveExisting}
              onRemoveSelected={handleRemoveSelected}
            />
          </div>
          <p className="text-[11.5px] leading-5 text-slate-500">
            ফাইলগুলো Cloudinary-তে আপনার অ্যাকাউন্টের নিজস্ব ফোল্ডারে রাখা হয়।
            পরে বিবরণ পেজ থেকে দেখা ও ডাউনলোড করা যাবে।
          </p>
        </FormSection>

        {categoryValue === "govt" && (
          <FormSection
            step="০৪"
            title="পোর্টাল লগইন তথ্য"
            description="সরকারি আবেদন পোর্টালে প্রবেশের জন্য প্রয়োজনীয় তথ্য।"
            icon={<Lock size={18} />}
            tone="brand"
          >
            <div className="flex items-start gap-2 rounded-xl border border-brand-200/70 bg-white/70 p-3 text-[12.5px] leading-5 text-brand-800">
              <ShieldCheck
                size={14}
                className="mt-0.5 shrink-0 text-brand-600"
              />
              এই তথ্য শুধুমাত্র আপনার লগইন করা অ্যাকাউন্ট থেকেই দেখা যাবে।
              পাবলিকভাবে কোথাও শেয়ার হবে না।
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="ইউজারনেম / মোবাইল নম্বর"
                placeholder="যেমন: USER12345"
                maxLength={100}
                autoComplete="off"
                error={errors.credentials?.username?.message}
                {...register("credentials.username")}
              />
              <Input
                label="পাসওয়ার্ড"
                type={showPassword ? "text" : "password"}
                placeholder="যেমন: pass@123"
                maxLength={100}
                autoComplete="off"
                error={errors.credentials?.password?.message}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                {...register("credentials.password")}
              />
            </div>
          </FormSection>
        )}
      </fieldset>

      <div className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-card backdrop-blur sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={saving}
          className="sm:min-w-32"
        >
          বাতিল করুন
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={saving}
          className="sm:min-w-40"
        >
          <Save size={16} />
          {saving && savingLabel ? savingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
