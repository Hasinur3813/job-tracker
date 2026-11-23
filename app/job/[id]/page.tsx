"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  ChevronRight,
  CircleAlert,
  ExternalLink,
  FileQuestion,
  FileText,
  Globe2,
  Hash,
  Pencil,
  RotateCcw,
  Trash2,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/hooks/useAuth";
import { useJobMutations } from "@/lib/hooks/useJobMutations";
import type { JobDocument } from "@/lib/hooks/useJobs";
import type { JobStatusType } from "@/lib/constants/statusConfig";
import { deleteJobAttachment } from "@/lib/utils/attachments";
import {
  DeadlineUrgency,
  formatTimestamp,
  getDeadlineInfo,
} from "@/lib/utils/deadline";
import { getHostname, getSafeHttpUrl } from "@/lib/utils/url";
import { Header } from "@/app/components/layout/Header";
import { ProtectedRoute } from "@/app/components/layout/ProtectedRoute";
import { CategoryBadge } from "@/app/components/job/CategoryBadge";
import { StatusBadge } from "@/app/components/job/StatusBadge";
import { StatusDropdown } from "@/app/components/job/StatusDropdown";
import { CredentialsBlock } from "@/app/components/job/CredentialsBlock";
import { AttachmentList } from "@/app/components/job/AttachmentList";
import { JobAttachmentAdder } from "@/app/components/job/JobAttachmentAdder";
import { Button } from "@/app/components/ui/Button";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";

const deadlineTone: Record<DeadlineUrgency, string> = {
  none: "border-slate-200 bg-slate-50 text-slate-500",
  expired: "border-slate-200 bg-slate-100 text-slate-500",
  today: "border-rose-200 bg-rose-50 text-rose-700",
  soon: "border-orange-200 bg-orange-50 text-orange-700",
  week: "border-amber-200 bg-amber-50 text-amber-700",
  normal: "border-brand-200 bg-brand-50 text-brand-700",
};

function InfoItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-card">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold text-slate-500">{label}</p>
        <div className="mt-1 text-sm font-semibold text-slate-800">
          {children}
        </div>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-slate-200/70" />
        <div className="h-3 w-48 rounded bg-slate-200/70" />
      </div>
      <div className="h-56 rounded-3xl border border-slate-200/70 bg-white" />
      <div className="grid gap-3 sm:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-24 rounded-2xl border border-slate-200/70 bg-white"
          />
        ))}
      </div>
    </div>
  );
}

interface JobDetailViewProps {
  job: JobDocument;
  updatingStatus: boolean;
  onStatusChange: (status: JobStatusType) => void;
  onBack: () => void;
  onEdit: () => void;
  onDeleteRequest: () => void;
  deleteOpen: boolean;
  onCloseDelete: () => void;
  onConfirmDelete: () => void;
  deleting: boolean;
}

function JobDetailView({
  job,
  updatingStatus,
  onStatusChange,
  onBack,
  onEdit,
  onDeleteRequest,
  deleteOpen,
  onCloseDelete,
  onConfirmDelete,
  deleting,
}: JobDetailViewProps) {
  const deadline = getDeadlineInfo(job.deadline);
  const createdAt = formatTimestamp(job.created_at);
  const updatedAt = formatTimestamp(job.updated_at);

  const hasCredentials =
    job.category === "govt" &&
    Boolean(job.credentials?.username || job.credentials?.password);

  const sourceUrl = getSafeHttpUrl(job.source_url);
  const sourceHost = getHostname(job.source_url) ?? "বিজ্ঞপ্তির লিঙ্ক";

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-soft transition-all hover:border-slate-300 hover:text-slate-800"
          title="ফিরে যান"
          aria-label="ড্যাশবোর্ডে ফিরে যান"
        >
          <ArrowLeft size={17} />
        </button>
        <nav
          className="flex min-w-0 items-center gap-1.5 text-[12.5px] font-medium text-slate-500"
          aria-label="ব্রেডক্রাম্ব"
        >
          <Link
            href="/dashboard"
            className="shrink-0 transition-colors hover:text-brand-600"
          >
            ড্যাশবোর্ড
          </Link>
          <ChevronRight size={12} className="shrink-0 text-slate-300" />
          <span className="truncate text-slate-600">{job.title}</span>
        </nav>
        {updatedAt && (
          <span className="ml-auto hidden shrink-0 text-[12px] text-slate-500 sm:block">
            আপডেট: {updatedAt}
          </span>
        )}
      </div>

      <section className="relative mt-4 overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-5 shadow-card sm:p-6">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-brand-500 via-violet-500 to-accent-400"
        />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <CategoryBadge category={job.category} />
              <StatusBadge status={job.status} />
            </div>
            <h1 className="mt-3 text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-[1.7rem]">
              {job.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Building2 size={14} className="text-slate-500" />
                {job.organisation}
              </span>
              {job.position_number && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="inline-flex items-center gap-1 text-xs">
                    <Hash size={12} className="text-slate-500" />
                    পদ {job.position_number}
                  </span>
                </>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12.5px] font-bold ${deadlineTone[deadline.urgency]}`}
              >
                <CalendarClock size={12} />
                {deadline.formatted}
                {deadline.label && (
                  <span className="font-semibold opacity-70">
                    · {deadline.label}
                  </span>
                )}
              </span>
              {job.salary_range && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[12.5px] font-semibold text-slate-600">
                  <Wallet size={12} className="text-slate-500" />
                  {job.salary_range}
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0 rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 lg:w-52">
            <p className="text-[12px] font-bold text-slate-500">
              স্ট্যাটাস আপডেট করুন
            </p>
            <div className="mt-2">
              <StatusDropdown
                currentStatus={job.status}
                onChange={onStatusChange}
                disabled={updatingStatus}
              />
            </div>
            <p className="mt-2 text-[10.5px] leading-4 text-slate-500">
              {updatingStatus
                ? "সংরক্ষণ হচ্ছে..."
                : "পরিবর্তন সাথে সাথে সেভ হয়ে যাবে।"}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <InfoItem icon={<Building2 size={16} />} label="প্রতিষ্ঠান">
          {job.organisation}
        </InfoItem>
        <InfoItem icon={<Hash size={16} />} label="পদ সংখ্যা">
          {job.position_number || "উল্লেখ করা হয়নি"}
        </InfoItem>
        <InfoItem icon={<CalendarClock size={16} />} label="শেষ সময়সীমা">
          <span className="block">{deadline.formatted}</span>
          {deadline.label && (
            <span
              className={`mt-0.5 block text-[12px] font-semibold ${
                deadline.urgency === "expired"
                  ? "text-slate-500"
                  : deadline.urgency === "today" ||
                      deadline.urgency === "soon"
                    ? "text-rose-600"
                    : deadline.urgency === "week"
                      ? "text-amber-600"
                      : "text-brand-600"
              }`}
            >
              {deadline.label}
            </span>
          )}
        </InfoItem>
        <InfoItem icon={<Wallet size={16} />} label="বেতন">
          {job.salary_range || "উল্লেখ করা হয়নি"}
        </InfoItem>
      </div>

      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-card transition-all hover:border-brand-200 hover:shadow-lift"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-brand-600">
              <Globe2 size={16} />
            </span>
            <span className="min-w-0">
              <span className="block text-[12px] font-semibold text-slate-500">
                বিজ্ঞপ্তির লিঙ্ক
              </span>
              <span className="block truncate text-sm font-semibold text-slate-800">
                {sourceHost}
              </span>
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-[12.5px] font-semibold text-brand-600">
            খুলুন
            <ExternalLink size={13} />
          </span>
        </a>
      )}

      {hasCredentials && (
        <CredentialsBlock
          username={job.credentials?.username}
          password={job.credentials?.password}
        />
      )}

      {job.notes && (
        <section className="mt-4 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText size={16} className="text-slate-500" />
            <h2 className="text-sm font-bold text-slate-900">গুরুত্বপূর্ণ নোট</h2>
          </div>
          <p className="mt-3 whitespace-pre-line rounded-xl bg-slate-50/80 p-3.5 text-sm leading-7 text-slate-600">
            {job.notes}
          </p>
        </section>
      )}

      {job.attachments && job.attachments.length > 0 && (
        <AttachmentList attachments={job.attachments} />
      )}

      <JobAttachmentAdder
        jobId={job.id}
        attachments={job.attachments ?? []}
      />

      <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="dangerSoft"
          onClick={onDeleteRequest}
          className="sm:min-w-36"
        >
          <Trash2 size={15} />
          মুছে ফেলুন
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={onEdit}
          className="sm:min-w-40"
        >
          <Pencil size={15} />
          সম্পাদনা করুন
        </Button>
      </div>

      {(createdAt || updatedAt) && (
        <p className="mt-5 text-center text-[12px] text-slate-300">
          {createdAt && <>যোগ করা হয়েছে {createdAt}</>}
          {createdAt && updatedAt && " · "}
          {updatedAt && <>সর্বশেষ আপডেট {updatedAt}</>}
        </p>
      )}

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={onCloseDelete}
        onConfirm={onConfirmDelete}
        loading={deleting}
        title="আবেদনটি মুছে ফেলবেন?"
        message={`“${job.title}” স্থায়ীভাবে মুছে যাবে। এই কাজটি ফিরিয়ে আনা যাবে না।`}
        confirmText="হ্যাঁ, মুছে ফেলুন"
      />
    </>
  );
}

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = React.use(params);
  const { currentUser } = useAuth();
  const { updateStatus, deleteJob } = useJobMutations();
  const [job, setJob] = useState<JobDocument | null>(null);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!currentUser || !id) return;

    const jobRef = doc(db, "users", currentUser.uid, "jobs", id);
    const unsubscribe = onSnapshot(
      jobRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setJob({
            id: snapshot.id,
            ...(snapshot.data() as Omit<JobDocument, "id">),
          });
        } else {
          setJob(null);
        }
        setFetchError(null);
        setFetching(false);
      },
      (error) => {
        console.error("Job fetch error:", error);
        setJob(null);
        setFetchError(
          "চাকরির তথ্য লোড করা যায়নি। ইন্টারনেট সংযোগ যাচাই করে আবার চেষ্টা করুন।",
        );
        setFetching(false);
      },
    );

    return () => unsubscribe();
  }, [currentUser, id, reloadKey]);

  const handleStatusChange = async (newStatus: JobStatusType) => {
    setUpdatingStatus(true);
    try {
      await updateStatus(id, newStatus);
      toast.success("স্ট্যাটাস আপডেট হয়েছে ✓");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "স্ট্যাটাস আপডেট করা যায়নি, আবার চেষ্টা করুন",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteJob(id);

      if (currentUser && job?.attachments?.length) {
        const cleanup = await Promise.allSettled(
          job.attachments.map((attachment) =>
            deleteJobAttachment(attachment, currentUser),
          ),
        );
        cleanup.forEach((result) => {
          if (result.status === "rejected") {
            console.error("Attached file cleanup failed:", result.reason);
          }
        });
      }

      toast.success("চাকরি মুছে ফেলা হয়েছে");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "তথ্যটি মোছা সম্ভব হয়নি, আবার চেষ্টা করুন",
      );
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const retryFetch = () => {
    setFetching(true);
    setFetchError(null);
    setReloadKey((value) => value + 1);
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-canvas">
        <Header />

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {fetching ? (
            <DetailSkeleton />
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
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <FileQuestion size={26} />
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-900">
                চাকরির তথ্য খুঁজে পাওয়া যায়নি
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                আবেদনটি ইতিমধ্যে মুছে ফেলা হয়েছে অথবা এটি আপনার অ্যাকাউন্টের
                সঙ্গে যুক্ত নয়।
              </p>
              <div className="mt-6 space-y-2.5">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => router.push("/dashboard")}
                >
                  ড্যাশবোর্ডে ফিরে যান
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => router.push("/job/new")}
                >
                  নতুন আবেদন যোগ করুন
                </Button>
              </div>
            </div>
          ) : (
            <JobDetailView
              job={job}
              updatingStatus={updatingStatus}
              onStatusChange={handleStatusChange}
              onBack={() => router.push("/dashboard")}
              onEdit={() => router.push(`/job/${id}/edit`)}
              onDeleteRequest={() => setDeleteOpen(true)}
              deleteOpen={deleteOpen}
              onCloseDelete={() => setDeleteOpen(false)}
              onConfirmDelete={handleDeleteConfirm}
              deleting={deleting}
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
