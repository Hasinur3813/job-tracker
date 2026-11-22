"use client";

import React, { useState } from "react";
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { copyText } from "@/lib/utils/clipboard";

interface CredentialsBlockProps {
  username?: string;
  password?: string;
}

export const CredentialsBlock: React.FC<CredentialsBlockProps> = ({
  username,
  password,
}) => {
  const [copiedField, setCopiedField] = useState<
    "username" | "password" | null
  >(null);
  const [showPassword, setShowPassword] = useState(false);

  if (!username && !password) return null;

  const handleCopy = async (
    value: string,
    label: string,
    field: "username" | "password",
  ) => {
    const copied = await copyText(value);
    if (!copied) {
      toast.error("কপি করা যায়নি, অনুগ্রহ করে ম্যানুয়ালি কপি করুন");
      return;
    }
    toast.success(`${label} কপি হয়েছে ✓`);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  return (
    <section className="mt-4 overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand-600 shadow-soft">
            <Lock size={15} />
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-900">পোর্টাল লগইন তথ্য</h2>
            <p className="text-[10px] text-slate-400">
              আবেদন পোর্টালে প্রবেশের জন্য
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">
          <ShieldCheck size={10} />
          শুধু আপনার অ্যাকাউন্টে
        </span>
      </div>

      <div className="space-y-2.5 p-4 sm:p-5">
        {username && (
          <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-slate-400">
                ইউজারনেম / মোবাইল
              </p>
              <p className="mt-0.5 select-all break-all font-mono text-sm font-bold text-slate-800">
                {username}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(username, "ইউজারনেম", "username")}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-soft transition-all hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              title="ইউজারনেম কপি করুন"
            >
              {copiedField === "username" ? (
                <Check size={13} className="text-emerald-600" />
              ) : (
                <Copy size={13} />
              )}
              {copiedField === "username" ? "কপি হয়েছে" : "কপি"}
            </button>
          </div>
        )}

        {password && (
          <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-slate-400">
                পাসওয়ার্ড
              </p>
              <p className="mt-0.5 select-all break-all font-mono text-sm font-bold text-slate-800">
                {showPassword ? password : "••••••••"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-500 shadow-soft transition-all hover:bg-slate-50 hover:text-slate-800"
                title={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                aria-label={
                  showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"
                }
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                type="button"
                onClick={() => handleCopy(password, "পাসওয়ার্ড", "password")}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-soft transition-all hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                title="পাসওয়ার্ড কপি করুন"
              >
                {copiedField === "password" ? (
                  <Check size={13} className="text-emerald-600" />
                ) : (
                  <Copy size={13} />
                )}
                {copiedField === "password" ? "কপি হয়েছে" : "কপি"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
