"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  CircleAlert,
  ClipboardList,
  LayoutGrid,
  List as ListIcon,
  Plus,
  Search,
  SearchX,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useJobs } from "@/lib/hooks/useJobs";
import { JobStatusType } from "@/lib/constants/statusConfig";
import { getDeadlineInfo, timestampToMillis } from "@/lib/utils/deadline";
import { getGreeting, toBnDigits } from "@/lib/utils/bn";
import { StatCards } from "@/app/components/dashboard/StatCards";
import { FilterBar } from "@/app/components/dashboard/FilterBar";
import { JobCard } from "@/app/components/dashboard/JobCard";
import { Header } from "@/app/components/layout/Header";
import { ProtectedRoute } from "@/app/components/layout/ProtectedRoute";
import { Button } from "@/app/components/ui/Button";

type SortOption = "deadline" | "recent" | "title";
type ViewMode = "grid" | "list";

const VIEW_STORAGE_KEY = "chakri-tracker:job-view";

const deadlineBadgeTone: Record<string, string> = {
  today: "bg-rose-400/15 text-rose-200",
  soon: "bg-orange-400/15 text-orange-200",
  week: "bg-amber-400/15 text-amber-200",
  normal: "bg-emerald-400/15 text-emerald-200",
};

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const { jobs, loading, error } = useJobs();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "govt" | "non-govt"
  >("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | JobStatusType>(
    "all",
  );
  const [sortBy, setSortBy] = useState<SortOption>("deadline");
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "grid";
    return window.localStorage.getItem(VIEW_STORAGE_KEY) === "list"
      ? "list"
      : "grid";
  });

  const changeViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      window.localStorage.setItem(VIEW_STORAGE_KEY, mode);
    } catch {
      // Storage can be unavailable in private browsing; switching still works.
    }
  };

  const displayName =
    currentUser?.displayName?.trim() ||
    currentUser?.email?.split("@")[0] ||
    "বন্ধু";
  const friendlyName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  const nextDeadline = useMemo(() => {
    const finalStatuses: JobStatusType[] = ["passed", "failed", "skipped"];
    const candidates = jobs
      .filter(
        (job) =>
          job.deadline && !finalStatuses.includes(job.status),
      )
      .map((job) => ({ job, info: getDeadlineInfo(job.deadline) }))
      .filter(({ info }) => info.isValid && (info.daysLeft ?? -1) >= 0)
      .sort((a, b) => (a.info.daysLeft ?? 0) - (b.info.daysLeft ?? 0));

    return candidates[0] ?? null;
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const searchLower = searchQuery.toLowerCase().trim();

    const filtered = jobs.filter((job) => {
      const categoryMatch =
        selectedCategory === "all" || job.category === selectedCategory;
      const statusMatch =
        selectedStatus === "all" || job.status === selectedStatus;
      const titleMatch = job.title?.toLowerCase().includes(searchLower);
      const orgMatch = job.organisation?.toLowerCase().includes(searchLower);
      const positionMatch = job.position_number
        ?.toLowerCase()
        .includes(searchLower);
      const searchMatch =
        !searchLower || titleMatch || orgMatch || positionMatch;
      return categoryMatch && statusMatch && searchMatch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title, "bn");
      }
      if (sortBy === "recent") {
        return (
          (timestampToMillis(b.created_at) ?? 0) -
          (timestampToMillis(a.created_at) ?? 0)
        );
      }
      const aInfo = getDeadlineInfo(a.deadline);
      const bInfo = getDeadlineInfo(b.deadline);
      if (!aInfo.isValid || !bInfo.isValid) {
        return Number(bInfo.isValid) - Number(aInfo.isValid);
      }
      const aDays = aInfo.daysLeft ?? 0;
      const bDays = bInfo.daysLeft ?? 0;
      const aExpired = aDays < 0;
      const bExpired = bDays < 0;
      if (aExpired !== bExpired) return aExpired ? 1 : -1;
      return aExpired ? bDays - aDays : aDays - bDays;
    });
  }, [jobs, searchQuery, selectedCategory, selectedStatus, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedStatus !== "all";

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStatus("all");
  };

  const scrollToJobs = () => {
    document
      .getElementById("jobs-list")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-canvas font-sans">
        <Header />

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 text-left sm:px-6 sm:py-8 lg:px-8">
          <section className="relative overflow-hidden rounded-4xl border border-brand-900/10 bg-[#110e2c] px-5 py-6 text-white shadow-lift sm:px-8 sm:py-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
              <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl" />
              <div className="absolute inset-0 bg-grid opacity-30 [mask-image:linear-gradient(to_right,black,transparent_82%)]" />
            </div>

            <div className="relative grid gap-6 lg:grid-cols-[1fr_310px] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12.5px] font-semibold text-brand-200">
                  <Sparkles size={12} className="text-accent-300" />
                  {getGreeting()}, {friendlyName}
                </span>
                <h1 className="mt-3 text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                  আপনার ক্যারিয়ার, আজ আরও{" "}
                  <span className="bg-linear-to-r from-brand-300 via-white to-accent-200 bg-clip-text text-transparent">
                    গোছানো।
                  </span>
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-7 text-white/75">
                  প্রতিটি আবেদন, ডেডলাইন, পরীক্ষা আর লগইন তথ্য—সব এক জায়গায়।
                  আজকের ছোট পদক্ষেপই কালকের বড় সুযোগ।
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  <Link
                    href="/job/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-brand-800 shadow-[0_12px_28px_-14px_rgba(255,255,255,0.7)] transition-all hover:bg-brand-50 active:scale-[0.98]"
                  >
                    <Plus size={15} strokeWidth={2.8} />
                    নতুন আবেদন যোগ করুন
                  </Link>
                  <button
                    type="button"
                    onClick={scrollToJobs}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white/80 transition-all hover:bg-white/10 hover:text-white"
                  >
                    আবেদনগুলো দেখুন
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold tracking-[0.12em] text-white/65">
                    পরবর্তী ডেডলাইন
                  </span>
                  <CalendarDays size={14} className="text-white/60" />
                </div>

                {nextDeadline ? (
                  <div className="mt-3">
                    <p className="line-clamp-2 text-sm font-bold leading-snug text-white">
                      {nextDeadline.job.title}
                    </p>
                    <p className="mt-1 truncate text-[13px] text-white/70">
                      {nextDeadline.job.organisation}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[13px] font-medium text-white/80">
                        {nextDeadline.info.formatted}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[12px] font-bold ${
                          deadlineBadgeTone[nextDeadline.info.urgency] ??
                          "bg-white/10 text-white/70"
                        }`}
                      >
                        {nextDeadline.info.label}
                      </span>
                    </div>
                    <Link
                      href={`/job/${nextDeadline.job.id}`}
                      className="mt-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[12.5px] font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      বিস্তারিত দেখুন
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4 flex items-start gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-accent-200">
                      <Trophy size={14} />
                    </span>
                    <p className="text-[13px] leading-6 text-white/70">
                      কোনো আসন্ন ডেডলাইন নেই। শান্ত মনে প্রস্তুতি নিন—আমরা
                      হিসাব রাখছি।
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="mt-4 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="flex items-start gap-2">
                <CircleAlert size={16} className="mt-0.5 shrink-0" />
                {error}
              </span>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="self-start rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 shadow-soft sm:self-auto"
              >
                আবার চেষ্টা করুন
              </button>
            </div>
          )}

          <div className="mt-4">
            {loading ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-[104px] animate-pulse rounded-2xl border border-slate-200/70 bg-white p-5 shadow-card"
                  >
                    <div className="h-2 w-16 rounded bg-slate-100" />
                    <div className="mt-3 h-7 w-12 rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : (
              <StatCards jobs={jobs} />
            )}
          </div>

          <section className="mt-5 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-card">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="পদ, প্রতিষ্ঠান বা পদ সংখ্যা দিয়ে খুঁজুন..."
                  aria-label="আবেদন খুঁজুন"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-10 text-[15px] text-slate-900 placeholder:text-slate-500 transition-all hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-100"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="সার্চ মুছুন"
                    className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort-jobs"
                  className="shrink-0 text-[12.5px] font-semibold text-slate-500"
                >
                  সাজান:
                </label>
                <div className="relative flex-1 lg:flex-none">
                  <select
                    id="sort-jobs"
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(event.target.value as SortOption)
                    }
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 lg:w-48"
                  >
                    <option value="deadline">ডেডলাইন অনুযায়ী</option>
                    <option value="recent">সাম্প্রতিক যোগ করা</option>
                    <option value="title">নাম অনুযায়ী</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="mt-4">
            <FilterBar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              jobs={jobs}
              onReset={resetFilters}
            />
          </div>

          <div
            id="jobs-list"
            className="mt-6 flex scroll-mt-24 flex-wrap items-end justify-between gap-3"
          >
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900">
                আপনার আবেদনসমূহ
              </h2>
              <p
                className="mt-0.5 text-[12.5px] text-slate-500"
                aria-live="polite"
              >
                {toBnDigits(filteredJobs.length)} / {toBnDigits(jobs.length)}{" "}
                টি আবেদন দেখানো হচ্ছে
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-500 transition-colors hover:text-rose-600"
                >
                  <X size={12} />
                  সব ফিল্টার মুছুন
                </button>
              )}

              <div
                role="group"
                aria-label="আবেদন দেখার ধরন"
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-soft"
              >
                <button
                  type="button"
                  onClick={() => changeViewMode("grid")}
                  aria-pressed={viewMode === "grid"}
                  aria-label="কার্ড ভিউ"
                  title="কার্ড ভিউ"
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors ${
                    viewMode === "grid"
                      ? "bg-brand-600 text-white shadow-soft"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <LayoutGrid size={15} />
                  <span className="hidden sm:inline">কার্ড</span>
                </button>
                <button
                  type="button"
                  onClick={() => changeViewMode("list")}
                  aria-pressed={viewMode === "list"}
                  aria-label="লিস্ট ভিউ"
                  title="লিস্ট ভিউ"
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors ${
                    viewMode === "list"
                      ? "bg-brand-600 text-white shadow-soft"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <ListIcon size={15} />
                  <span className="hidden sm:inline">লিস্ট</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            {loading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-48 animate-pulse rounded-2xl border border-slate-200/70 bg-white p-5 shadow-card"
                  >
                    <div className="flex gap-2">
                      <div className="h-5 w-16 rounded-full bg-slate-100" />
                      <div className="h-5 w-20 rounded-full bg-slate-100" />
                    </div>
                    <div className="mt-4 h-4 w-3/4 rounded bg-slate-100" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : error && jobs.length === 0 ? null : jobs.length === 0 ? (
              <div className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-card">
                <div className="relative p-6 sm:p-9">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand-50 blur-3xl"
                  />
                  <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500 to-brand-700 text-white shadow-glow">
                      <ClipboardList size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                        চলুন আপনার চাকরি ট্র্যাকিং শুরু করি
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
                        আপনি এখনো কোনো আবেদন যোগ করেননি। প্রথম আবেদনটি যোগ
                        করলেই ডেডলাইন, স্ট্যাটাস আর লগইন তথ্য—সব এক জায়গায়
                        গুছিয়ে যাবে।
                      </p>

                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        {[
                          {
                            step: "১",
                            title: "আবেদন যোগ করুন",
                            text: "পদ, প্রতিষ্ঠান ও ডেডলাইন লিখুন।",
                          },
                          {
                            step: "২",
                            title: "স্ট্যাটাস আপডেট করুন",
                            text: "পরীক্ষা, ভাইভা, ফলাফল—সব ট্র্যাক করুন।",
                          },
                          {
                            step: "৩",
                            title: "সময়মতো প্রস্তুত হন",
                            text: "ডেডলাইনের আগেই সতর্ক হন।",
                          },
                        ].map((item) => (
                          <div
                            key={item.step}
                            className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                          >
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 font-mono text-[12px] font-bold text-white">
                              {item.step}
                            </span>
                            <p className="mt-2.5 text-xs font-bold text-slate-800">
                              {item.title}
                            </p>
                            <p className="mt-1 text-[12.5px] leading-5 text-slate-500">
                              {item.text}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2.5">
                        <Link
                          href="/job/new"
                          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white shadow-glow transition-colors hover:bg-brand-700"
                        >
                          <Plus size={15} />
                          প্রথম আবেদন যোগ করুন
                        </Link>
                        <Link
                          href="/#features-section"
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                        >
                          ফিচারসমূহ দেখুন
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <SearchX size={24} />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">
                  কোনো আবেদন মেলেনি
                </h3>
                <p className="mx-auto mt-1.5 max-w-md text-xs leading-6 text-slate-500">
                  আপনার সার্চ বা ফিল্টারের সঙ্গে মিলে এমন কোনো আবেদন পাওয়া
                  যায়নি। ফিল্টার মুছে আবার দেখুন।
                </p>
                <div className="mt-5 flex justify-center">
                  <Button variant="secondary" onClick={resetFilters}>
                    সব ফিল্টার মুছুন
                  </Button>
                </div>
              </div>
            ) : viewMode === "list" ? (
              <div className="flex flex-col gap-3">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} variant="list" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>

          <p className="mt-10 text-center text-[12.5px] text-slate-500">
            চাকরি ট্র্যাকার · আপনার সব তথ্য আপনার অ্যাকাউন্টে সুরক্ষিত
          </p>
        </main>

        <Link
          href="/job/new"
          aria-label="নতুন আবেদন যোগ করুন"
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-glow transition-all hover:scale-105 hover:bg-brand-700 active:scale-95 md:hidden"
        >
          <Plus size={24} strokeWidth={2.8} />
        </Link>
      </div>
    </ProtectedRoute>
  );
}
