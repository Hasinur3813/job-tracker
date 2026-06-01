"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseISO, differenceInCalendarDays, format, isValid } from "date-fns";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Calendar,
  Building2,
  DollarSign,
  Globe,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { useJobs, JobDocument } from "@/lib/hooks/useJobs";
import { db } from "@/lib/firebase/config";
import { doc, onSnapshot } from "firebase/firestore";
import { Header } from "@/app/components/layout/Header";
import { CategoryBadge } from "@/app/components/job/CategoryBadge";
import { StatusBadge } from "@/app/components/job/StatusBadge";
import { StatusDropdown } from "@/app/components/job/StatusDropdown";
import { CredentialsBlock } from "@/app/components/job/CredentialsBlock";
import { Button } from "@/app/components/ui/Button";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";
import { ProtectedRoute } from "@/app/components/layout/ProtectedRoute";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = React.use(params);
  const { currentUser } = useAuth();
  const { updateStatus, deleteJob } = useJobs();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [job, setJob] = useState<JobDocument | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!currentUser || !id) return;

    const jobRef = doc(db, "users", currentUser.uid, "jobs", id);
    const unsubscribe = onSnapshot(
      jobRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const snapshotData = snapshot.data() as Omit<JobDocument, "id">;
          setJob({ id: snapshot.id, ...snapshotData });
        } else {
          setJob(null);
        }
        setFetching(false);
      },
      (error) => {
        console.error("Job fetch error:", error);
        setJob(null);
        setFetching(false);
      },
    );

    return () => unsubscribe();
  }, [currentUser, id]);

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 max-w-md mx-auto pt-16 px-4 text-center">
          <div className="p-4 bg-red-50 text-red-600 rounded-full inline-block mb-4 border border-red-100">
            <ArrowLeft className="w-8 h-8 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 font-sans mb-2">
            চাকরির তথ্য খুঁজে পাওয়া যায়নি
          </h2>
          <p className="text-sm text-gray-500 font-sans mb-6">
            নির্ঘণ্ট অনুযায়ী সুনির্দিষ্ট চাকরিটির তথ্য ইতোমধ্যে মুছে ফেলা হয়েছে
            অথবা আপনার অ্যাকাউন্টে যুক্ত নেই।
          </p>
          <Button
            variant="primary"
            fullWidth
            onClick={() => router.push("/dashboard")}
          >
            হোমপেজে ফিরে যান
          </Button>
        </div>
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let formattedDeadline = "কোনো ডেডলাইন নেই";
  let urgencyText = "";
  let urgencyClass = "text-gray-700";
  let isDateValid = false;

  if (job.deadline) {
    try {
      const deadlineDate = parseISO(job.deadline);
      isDateValid = isValid(deadlineDate);
      if (isDateValid) {
        deadlineDate.setHours(0, 0, 0, 0);
        const diff = differenceInCalendarDays(deadlineDate, today);
        formattedDeadline = format(deadlineDate, "dd MMM yyyy");

        if (diff < 0) {
          urgencyText = "ডেডলাইন শেষ হয়ে গেছে";
          urgencyClass = "text-red-500 font-semibold";
        } else if (diff === 0) {
          urgencyText = "আবেদন করার আজই শেষ সুযোগ!";
          urgencyClass = "text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded";
        } else if (diff <= 3) {
          urgencyText = `${diff} দিন বাকি (জরুরী শেষ হচ্ছে)`;
          urgencyClass =
            "text-red-600 font-bold bg-red-50/50 px-2 py-0.5 rounded";
        } else if (diff <= 7) {
          urgencyText = `${diff} দিন বাকি`;
          urgencyClass =
            "text-amber-600 font-semibold bg-amber-50/50 px-2 py-0.5 rounded";
        } else {
          urgencyText = `${diff} দিন বাকি`;
          urgencyClass = "text-blue-600 font-semibold";
        }
      }
    } catch {
      isDateValid = false;
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    try {
      await updateStatus(id, newStatus);
      toast.success("স্ট্যাটাস আপডেট হয়েছে ✓");
    } catch {
      toast.error("স্ট্যাটাস আপডেট করা যায়নি, আবার চেষ্টা করুন");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;
    try {
      await deleteJob(id);
      toast.success("চাকরি মুছে ফেলা হয়েছে");
      router.push("/dashboard");
    } catch {
      toast.error("তথ্যটি মোছা সম্ভব হয়নি, আবার চেষ্টা করুন");
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const hasCredentials =
    job.category === "govt" &&
    (job.credentials?.username || job.credentials?.password);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 select-none">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2 hover:bg-white border hover:border-gray-200 text-gray-600 hover:text-gray-900 rounded-lg transition-all duration-200 cursor-pointer"
              title="ফিরে যান"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="text-left min-w-0 flex-1">
              <h1 className="text-2xl font-black text-gray-900 font-sans tracking-tight truncate leading-tight">
                {job.title}
              </h1>
              <div className="flex items-center gap-1 text-xs text-gray-500 font-sans mt-0.5">
                <Building2 size={13} className="text-gray-400" />
                <span>{job.organisation}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-150 shadow-xs rounded-2xl p-5 mb-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <CategoryBadge category={job.category} />
                <StatusBadge status={job.status} />
              </div>
              <div className="flex items-center gap-2 text-left self-start sm:self-auto">
                <span className="text-xs font-semibold text-gray-500 font-sans">
                  স্ট্যাটাস পরিবর্তন করুন:
                </span>
                <StatusDropdown
                  currentStatus={job.status}
                  onChange={handleStatusChange}
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-150 shadow-xs rounded-2xl p-6 mb-5 space-y-4 text-left">
            <h3 className="text-sm font-bold text-gray-800 font-sans border-b border-gray-100 pb-2 mb-2">
              আবেদনের সাধারণ বিবরণ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-gray-400">
                  <Building2 size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-sans">
                    প্রতিষ্ঠানের নাম
                  </span>
                  <span className="text-sm font-semibold text-gray-800 font-sans">
                    {job.organisation}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-gray-400">
                  <Calendar size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-sans">
                    শেষ সময়সীমা
                  </span>
                  <div className="flex flex-col text-sm">
                    <span className="font-mono font-bold text-gray-800">
                      {formattedDeadline}
                    </span>
                    {urgencyText && (
                      <span
                        className={`text-[11px] font-sans font-medium mt-0.5 ${urgencyClass}`}
                      >
                        {urgencyText}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-gray-400">
                  <DollarSign size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-sans">
                    বেতনের স্কেল
                  </span>
                  <span className="text-sm font-semibold text-gray-800 font-sans">
                    {job.salary_range || "উল্লেখ করা হয়নি"}
                  </span>
                </div>
              </div>
              {job.source_url && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-gray-400">
                    <Globe size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-sans">
                      রেফারেন্স বা আবেদন লিংক
                    </span>
                    <a
                      href={job.source_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-semibold font-sans hover:underline mt-0.5"
                    >
                      <span>সার্কুলার দেখুন</span>
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {hasCredentials && (
            <CredentialsBlock
              username={job.credentials?.username}
              password={job.credentials?.password}
            />
          )}

          {job.notes && (
            <div className="bg-white border border-gray-150 shadow-xs rounded-2xl p-6 mb-6 text-left">
              <div className="flex items-center gap-2 font-bold text-gray-800 font-sans border-b border-gray-100 pb-2.5 mb-3">
                <FileText className="text-gray-400" size={16} />
                <span>গুরুত্বপূর্ণ নোট</span>
              </div>
              <p className="text-sm text-gray-650 font-sans leading-relaxed whitespace-pre-line bg-gray-50/50 p-3.5 rounded-lg border border-gray-100">
                {job.notes}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button
              type="button"
              variant="danger"
              fullWidth
              onClick={() => setDeleteModalOpen(true)}
              className="sm:order-1 order-2"
            >
              <span className="flex items-center justify-center gap-1.5">
                <Trash2 size={16} />
                <span>মুছে ফেলুন</span>
              </span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => router.push(`/job/${id}/edit`)}
              className="sm:order-2 order-1"
            >
              <span className="flex items-center justify-center gap-1.5">
                <Pencil size={12} />
                <span>সম্পাদনা করুন</span>
              </span>
            </Button>
          </div>

          <ConfirmDialog
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
}
