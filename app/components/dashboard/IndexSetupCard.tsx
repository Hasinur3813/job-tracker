"use client";

import React from "react";
import {
  CircleAlert,
  Database,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { JobIndexStatus } from "@/lib/hooks/useJobIndexMigration";
import { toBnDigits } from "@/lib/utils/bn";
import { Button } from "@/app/components/ui/Button";

interface IndexSetupCardProps {
  status: JobIndexStatus;
  pendingCount: number;
  error: string | null;
  onConfirm: () => void;
  onRetry: () => void;
}

export const IndexSetupCard: React.FC<IndexSetupCardProps> = ({
  status,
  pendingCount,
  error,
  onConfirm,
  onRetry,
}) => {
  if (status === "checking" || status === "migrating") {
    const isMigrating = status === "migrating";

    return (
      <section
        className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-card sm:p-8"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Loader2 size={18} className="animate-spin" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {isMigrating
                ? "সার্চ সূচি তৈরি হচ্ছে…"
                : "আপনার আবেদনের সার্চ সূচি যাচাই করা হচ্ছে…"}
            </h2>
            <p className="mt-0.5 text-[12.5px] text-slate-500">
              {isMigrating
                ? "অনুগ্রহ করে পাতাটি খোলা রাখুন। কয়েক মুহূর্ত লাগতে পারে।"
                : "এক মুহূর্ত অপেক্ষা করুন।"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section
        className="rounded-3xl border border-rose-200 bg-white p-6 shadow-card sm:p-8"
        role="alert"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <CircleAlert size={18} />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900">
              সার্চ সূচি প্রস্তুত করা যায়নি
            </h2>
            <p className="mt-1 text-[12.5px] leading-6 text-slate-500">
              {error ??
                "ইন্টারনেট সংযোগ যাচাই করে আবার চেষ্টা করুন।"}
            </p>
            <Button
              variant="secondary"
              className="mt-4"
              onClick={onRetry}
            >
              <RotateCcw size={14} />
              আবার চেষ্টা করুন
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-card">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-50 blur-3xl"
      />

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500 to-brand-700 text-white shadow-glow">
            <Database size={24} />
          </span>

          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 text-[11.5px] font-bold text-brand-700">
              <Sparkles size={11} />
              একবারের সেটআপ
            </span>

            <h2 className="mt-3 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
              পুরোনো আবেদনে সার্চ সূচি যোগ করুন
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
              সার্ভার-সাইড পেজিং, ফিল্টার ও দ্রুত সার্চের জন্য আপনার
              পুরোনো আবেদনগুলোতে কিছু অতিরিক্ত সার্চ ফিল্ড যোগ করা
              প্রয়োজন। এতে আবেদনের মূল তথ্য বা পোর্টাল লগইন তথ্য
              পরিবর্তন হবে না।
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {[
                "আবেদনের মূল তথ্য অপরিবর্তিত থাকবে",
                "লগইন তথ্য ব্যবহার করা হবে না",
                "শুধু এই একবারই প্রয়োজন",
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 text-[11.5px] font-semibold text-slate-600 ring-1 ring-inset ring-slate-100"
                >
                  <ShieldCheck
                    size={12}
                    className="shrink-0 text-emerald-600"
                  />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white shadow-glow transition-colors hover:bg-brand-700 active:scale-[0.98]"
              >
                <Database size={15} />
                সূচি তৈরি করুন
              </button>
              <span className="text-[12px] font-semibold text-slate-500">
                {toBnDigits(pendingCount)} টি আবেদন আপডেট হবে
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
