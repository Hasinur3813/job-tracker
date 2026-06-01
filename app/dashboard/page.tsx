"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search, Sparkles, ClipboardList } from "lucide-react";
import { useJobs } from "@/lib/hooks/useJobs";
import { JobStatusType } from "@/lib/constants/statusConfig";
import { StatCards } from "@/app/components/dashboard/StatCards";
import { FilterBar } from "@/app/components/dashboard/FilterBar";
import { JobCard } from "@/app/components/dashboard/JobCard";
import { Header } from "@/app/components/layout/Header";
import { ProtectedRoute } from "@/app/components/layout/ProtectedRoute";

export default function DashboardPage() {
  const { jobs, loading } = useJobs();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "govt" | "non-govt"
  >("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | JobStatusType>(
    "all",
  );

  const filteredJobs = jobs.filter((job) => {
    const categoryMatch =
      selectedCategory === "all" || job.category === selectedCategory;
    const statusMatch =
      selectedStatus === "all" || job.status === selectedStatus;
    const searchLower = searchQuery.toLowerCase().trim();
    const titleMatch = job.title?.toLowerCase().includes(searchLower);
    const orgMatch = job.organisation?.toLowerCase().includes(searchLower);
    const searchMatch = !searchLower || titleMatch || orgMatch;
    return categoryMatch && statusMatch && searchMatch;
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans select-none">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50/70 border border-blue-100 rounded-full px-3 py-1 w-fit mb-2">
                <Sparkles size={12} className="animate-pulse" />
                <span>রিয়েল-টাইম ক্লাউড ক্যারিয়ার সিঙ্ক</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                আমার চাকরি ক্যারিয়ার ট্র্যাকার
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                আপনার আবেদনের সঠিক ডেডলাইন, অগ্রগতি, পাসওয়ার্ড ভল্ট এবং
                স্ট্যাটাস ট্র্যাকিং ড্যাশবোর্ড।
              </p>
            </div>
            <Link
              href="/job/new"
              className="inline-flex  items-center justify-center gap-2 px-5 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all cursor-pointer shrink-0 self-start md:self-auto group active:scale-98"
            >
              <Plus
                size={18}
                className="transition-transform group-hover:rotate-90"
              />
              <span>নতুন চাকুরির আবেদন যোগ করুন</span>
            </Link>
          </div>

          {/* Stat Cards */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-150 h-21 sm:h-24 rounded-2xl p-4 animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <StatCards jobs={jobs} />
          )}

          {/* Search Bar */}
          <div className="bg-white border border-gray-150 shadow-xs rounded-2xl p-4.5 mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="প্রতিষ্ঠান বা কোম্পানির নাম অথবা চাকরির পদের নাম দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-24 py-3 bg-gray-50 hover:bg-gray-100/60 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-sans focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder-gray-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-3 flex items-center text-xs font-bold text-gray-400 hover:text-red-500 font-sans cursor-pointer h-fit my-auto"
                >
                  ক্লিয়ার
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <FilterBar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />

          {/* Job List */}
          <div className="mt-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-150 rounded-2xl p-5 animate-pulse h-24"
                  ></div>
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white border border-gray-150 rounded-2xl py-16 px-4 text-center max-w-xl mx-auto shadow-xs mt-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                  <ClipboardList size={26} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 font-sans mb-1">
                  কোনো চাকরির আবেদন মেলেনি
                </h3>
                <p className="text-sm text-gray-550 font-sans max-w-xs mx-auto mb-6 leading-relaxed">
                  {searchQuery ||
                  selectedCategory !== "all" ||
                  selectedStatus !== "all"
                    ? "আপনার অনুসন্ধান অনুযায়ী কোনো তথ্য পাওয়া যায়নি।"
                    : "আপনার অ্যাকাউন্টে এখনো কোনো চাকরির আবেদন যোগ করেননি।"}
                </p>
                {!searchQuery &&
                  selectedCategory === "all" &&
                  selectedStatus === "all" && (
                    <Link
                      href="/job/new"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>প্রথম আবেদন যোগ করুন</span>
                    </Link>
                  )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Floating Action Button */}
        <Link
          href="/job/new"
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-blue-200 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer z-40 group"
          title="নতুন চাকরি যোগ করুন"
        >
          <Plus
            size={26}
            className="transition-transform group-hover:rotate-90 stroke-[2.5]"
          />
        </Link>
      </div>
    </ProtectedRoute>
  );
}
