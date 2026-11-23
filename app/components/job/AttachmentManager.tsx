"use client";

import React, { useRef, useState } from "react";
import {
  CloudUpload,
  FileText,
  Image as ImageIcon,
  Paperclip,
  Trash2,
} from "lucide-react";
import type { JobAttachment } from "@/lib/types/attachment";
import {
  ATTACHMENT_ACCEPT,
  MAX_ATTACHMENT_BYTES,
  MAX_ATTACHMENT_COUNT,
  formatFileSize,
} from "@/lib/utils/attachments";
import { toBnDigits } from "@/lib/utils/bn";
import { AttachmentOpenButton } from "./AttachmentOpenButton";

interface AttachmentManagerProps {
  attachments: JobAttachment[];
  selectedFiles: File[];
  error: string | null;
  disabled?: boolean;
  countOffset?: number;
  onFilesSelected: (files: File[]) => void;
  onRemoveExisting: (publicId: string) => void;
  onRemoveSelected: (index: number) => void;
}

function isPdfAttachment(attachment: JobAttachment): boolean {
  return (
    attachment.format?.toLowerCase() === "pdf" ||
    attachment.original_filename.toLowerCase().endsWith(".pdf")
  );
}

export function AttachmentManager({
  attachments,
  selectedFiles,
  error,
  disabled = false,
  countOffset = 0,
  onFilesSelected,
  onRemoveExisting,
  onRemoveSelected,
}: AttachmentManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const total = countOffset + attachments.length + selectedFiles.length;
  const maxMegabytes = Math.round(MAX_ATTACHMENT_BYTES / (1024 * 1024));

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) setDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    if (
      event.relatedTarget instanceof Node &&
      event.currentTarget.contains(event.relatedTarget)
    ) {
      return;
    }
    setDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) onFilesSelected(files);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ATTACHMENT_ACCEPT}
        multiple
        className="sr-only"
        disabled={disabled}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length > 0) onFilesSelected(files);
          event.target.value = "";
        }}
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-5 text-center transition-colors ${
          dragging
            ? "border-brand-400 bg-brand-50"
            : "border-slate-300 bg-slate-50/70"
        } ${disabled ? "opacity-60" : ""}`}
      >
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-brand-600 shadow-soft">
          <CloudUpload size={20} />
        </span>
        <p className="mt-2.5 text-sm font-bold text-slate-800">
          ফাইল সংযুক্ত করুন
        </p>
        <p className="mt-1 text-[12px] leading-5 text-slate-500">
          অথবা ফাইল এখানে টেনে ছেড়ে দিন
        </p>
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-brand-200 bg-white px-3.5 py-2 text-[12.5px] font-bold text-brand-700 shadow-soft transition-colors hover:bg-brand-50 disabled:cursor-not-allowed"
        >
          <Paperclip size={14} />
          ফাইল বাছাই করুন
        </button>
        <p className="mt-2.5 text-[11px] leading-5 text-slate-500">
          PDF, JPG, PNG বা WebP · প্রতিটি সর্বোচ্চ {toBnDigits(maxMegabytes)} MB
          · সর্বোচ্চ {toBnDigits(MAX_ATTACHMENT_COUNT)}টি
        </p>
      </div>

      <p className="mt-2.5 text-right text-[11.5px] font-semibold text-slate-500">
        {toBnDigits(total)} / {toBnDigits(MAX_ATTACHMENT_COUNT)}টি ফাইল
      </p>

      {error && (
        <p
          role="alert"
          className="mt-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] font-medium leading-5 text-rose-700"
        >
          {error}
        </p>
      )}

      {total > 0 && (
        <div className="mt-3 space-y-2">
          {attachments.map((attachment) => {
            const isPdf = isPdfAttachment(attachment);
            return (
              <div
                key={attachment.public_id}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-soft"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isPdf
                      ? "bg-rose-50 text-rose-600"
                      : "bg-brand-50 text-brand-600"
                  }`}
                >
                  {isPdf ? <FileText size={18} /> : <ImageIcon size={18} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-[13px] font-semibold text-slate-800"
                    title={attachment.original_filename}
                  >
                    {attachment.original_filename}
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-slate-500">
                    {(attachment.format || "ফাইল").toUpperCase()} ·{" "}
                    {formatFileSize(attachment.bytes)} · আগে থেকে সংযুক্ত
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <AttachmentOpenButton
                    attachment={attachment}
                    mode="view"
                    compact
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveExisting(attachment.public_id)}
                    disabled={disabled}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed"
                    title="সংযুক্তি সরান"
                    aria-label={`${attachment.original_filename} সরান`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}

          {selectedFiles.map((file, index) => {
            const isPdf = file.name.toLowerCase().endsWith(".pdf");
            return (
              <div
                key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isPdf
                      ? "bg-rose-50 text-rose-600"
                      : "bg-brand-50 text-brand-600"
                  }`}
                >
                  {isPdf ? <FileText size={18} /> : <ImageIcon size={18} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-[13px] font-semibold text-slate-800"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p className="mt-0.5 text-[11.5px] font-medium text-amber-800">
                    {formatFileSize(file.size)} · সংরক্ষণের সময় আপলোড হবে
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveSelected(index)}
                  disabled={disabled}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white hover:text-rose-600 disabled:cursor-not-allowed"
                  title="ফাইল সরান"
                  aria-label={`${file.name} সরান`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
