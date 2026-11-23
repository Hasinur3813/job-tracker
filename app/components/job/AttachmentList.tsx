import { FileText, Image as ImageIcon, Paperclip } from "lucide-react";
import type { JobAttachment } from "@/lib/types/attachment";
import { formatFileSize } from "@/lib/utils/attachments";
import { toBnDigits } from "@/lib/utils/bn";
import { formatTimestamp } from "@/lib/utils/deadline";
import { AttachmentOpenButton } from "./AttachmentOpenButton";

interface AttachmentListProps {
  attachments: JobAttachment[];
}

function isPdfAttachment(attachment: JobAttachment): boolean {
  return (
    attachment.format?.toLowerCase() === "pdf" ||
    attachment.original_filename.toLowerCase().endsWith(".pdf")
  );
}

export function AttachmentList({ attachments }: AttachmentListProps) {
  if (attachments.length === 0) return null;

  return (
    <section className="mt-4 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-card">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Paperclip size={15} />
        </span>
        <h2 className="text-sm font-bold text-slate-900">
          সংযুক্ত ফাইল ও ডকুমেন্ট
        </h2>
        <span className="ml-auto rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11.5px] font-bold text-slate-600">
          {toBnDigits(attachments.length)}টি
        </span>
      </div>

      <div className="mt-3 space-y-2.5">
        {attachments.map((attachment) => {
          const isPdf = isPdfAttachment(attachment);
          const uploadedAt = formatTimestamp(attachment.uploaded_at);
          const formatLabel = (attachment.format || "file").toUpperCase();

          return (
            <div
              key={attachment.public_id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                    isPdf
                      ? "border-rose-200 bg-rose-50 text-rose-600"
                      : "border-brand-200 bg-brand-50 text-brand-600"
                  }`}
                >
                  {isPdf ? <FileText size={19} /> : <ImageIcon size={19} />}
                </span>
                <div className="min-w-0">
                  <p
                    className="truncate text-[13.5px] font-bold text-slate-800"
                    title={attachment.original_filename}
                  >
                    {attachment.original_filename}
                  </p>
                  <p className="mt-0.5 text-[11.5px] font-medium text-slate-500">
                    {formatLabel} · {formatFileSize(attachment.bytes)}
                    {uploadedAt && <> · {uploadedAt}</>}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <AttachmentOpenButton attachment={attachment} mode="view" />
                <AttachmentOpenButton
                  attachment={attachment}
                  mode="download"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
