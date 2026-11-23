"use client";

import { useState, type MouseEvent } from "react";
import { Download, Eye, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/hooks/useAuth";
import type { JobAttachment } from "@/lib/types/attachment";
import { requestAttachmentUrl } from "@/lib/utils/attachments";

interface AttachmentOpenButtonProps {
  attachment: JobAttachment;
  mode: "view" | "download";
  compact?: boolean;
}

export function AttachmentOpenButton({
  attachment,
  mode,
  compact = false,
}: AttachmentOpenButtonProps) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const isView = mode === "view";
  const label = isView ? "দেখুন" : "ডাউনলোড";
  const Icon = isView ? Eye : Download;

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (loading) return;
    if (!currentUser) {
      toast.error("লগইন সেশন শেষ হয়েছে। আবার লগইন করে চেষ্টা করুন।");
      return;
    }

    const popup = isView ? window.open("about:blank", "_blank") : null;
    if (popup) popup.opener = null;

    setLoading(true);
    try {
      const url = await requestAttachmentUrl(
        attachment,
        currentUser,
        !isView,
      );

      if (isView) {
        if (popup) {
          popup.location.replace(url);
        } else {
          window.location.href = url;
        }
      } else {
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = attachment.original_filename;
        anchor.rel = "noopener";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
      }
    } catch (error) {
      popup?.close();
      toast.error(
        error instanceof Error
          ? error.message
          : "ফাইলটি খোলা যায়নি, আবার চেষ্টা করুন।",
      );
    } finally {
      setLoading(false);
    }
  };

  const className = compact
    ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-600 disabled:cursor-wait disabled:opacity-60"
    : `inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-bold shadow-soft transition-colors disabled:cursor-wait disabled:opacity-60 sm:flex-none ${
        isView
          ? "border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
          : "border-brand-200 bg-white text-brand-700 hover:bg-brand-50"
      }`;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-busy={loading || undefined}
      title={compact ? label : undefined}
      aria-label={`${attachment.original_filename} ${label}`}
      className={className}
    >
      {loading ? (
        <Loader2 size={compact ? 14 : 13} className="animate-spin" />
      ) : (
        <Icon size={compact ? 14 : 13} />
      )}
      {!compact && label}
    </button>
  );
}
