import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BellRing,
  Cloud,
  KeyRound,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/app/components/brand/Logo";

interface AuthShellProps {
  eyebrow?: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const features = [
  {
    icon: <BellRing size={16} />,
    title: "ডেডলাইন আর মিস হবে না",
    description: "কোন আবেদনের সময় শেষ হচ্ছে—সেটা এক নজরেই।",
  },
  {
    icon: <KeyRound size={16} />,
    title: "ক্রেডেনশিয়াল ভল্ট",
    description: "পোর্টালের ইউজারনেম ও পাসওয়ার্ড গোছানো থাকে।",
  },
  {
    icon: <Cloud size={16} />,
    title: "রিয়েল-টাইম সিঙ্ক",
    description: "যেকোনো ডিভাইসে আপনার ডেটা সবসময় হালনাগাদ।",
  },
];

export function AuthShell({
  eyebrow = "স্বাগতম",
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-brand-200/60 blur-3xl" />
        <div className="absolute -right-32 top-1/4 h-[26rem] w-[26rem] rounded-full bg-accent-200/50 blur-3xl" />
        <div className="absolute inset-0 bg-grid-light opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.08fr_minmax(0,460px)] lg:gap-14">
          <aside className="relative hidden flex-col overflow-hidden rounded-4xl bg-[#120f2e] p-10 text-white shadow-lift lg:flex lg:min-h-[650px]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
              <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl" />
              <div className="absolute inset-0 bg-grid opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
            </div>

            <div className="relative flex items-center justify-between">
              <Logo light />
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
                Since 2025
              </span>
            </div>

            <div className="relative mt-12">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-brand-200">
                <Sparkles size={12} className="text-accent-300" />
                সম্পূর্ণ ফ্রি · শুরু করতে ৩০ সেকেন্ড
              </span>

              <h2 className="mt-5 text-[2.15rem] font-black leading-[1.18] tracking-tight">
                আপনার ক্যারিয়ারের
                <br />
                সবকিছু,{" "}
                <span className="bg-linear-to-r from-brand-300 via-white to-accent-200 bg-clip-text text-transparent">
                  এক জায়গায় গোছানো।
                </span>
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">
                সরকারি থেকে বেসরকারি—প্রতিটি আবেদন, পরীক্ষা আর ফলাফলের
                হিসাব রাখুন এক শান্ত, পরিষ্কার ড্যাশবোর্ডে।
              </p>
            </div>

            <ul className="relative mt-9 space-y-3.5">
              {features.map((feature) => (
                <li key={feature.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-brand-200">
                    {feature.icon}
                  </span>
                  <span>
                    <span className="block text-[13px] font-semibold text-white/90">
                      {feature.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-white/45">
                      {feature.description}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="relative mt-auto pt-10">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                    পরবর্তী ডেডলাইন
                  </span>
                  <span className="rounded-full bg-accent-400/15 px-2.5 py-0.5 text-[10px] font-bold text-accent-200">
                    ৩ দিন বাকি
                  </span>
                </div>
                <p className="mt-3 text-sm font-bold text-white">
                  সহকারী প্রোগ্রামার
                </p>
                <p className="mt-0.5 text-xs text-white/45">
                  বাংলাদেশ ব্যাংক · সরকারি
                </p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[72%] rounded-full bg-linear-to-r from-brand-400 to-accent-300" />
                </div>
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-[11px] text-white/35">
                <ShieldCheck size={12} className="text-emerald-400/80" />
                Firebase-সুরক্ষিত অ্যাকাউন্ট · আপনার ডেটা আপনারই
              </p>
            </div>
          </aside>

          <section className="w-full">
            <div className="mb-5 flex items-center justify-between lg:hidden">
              <Logo size="sm" />
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-soft"
              >
                <ArrowLeft size={13} />
                হোম
              </Link>
            </div>

            <div className="rounded-4xl border border-white/70 bg-white/90 p-6 shadow-lift backdrop-blur-xl sm:p-8">
              <div className="mb-7">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand-600">
                  {eyebrow}
                </p>
                <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-[1.7rem]">
                  {title}
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {description}
                </p>
              </div>

              {children}

              {footer && (
                <div className="mt-6 border-t border-slate-100 pt-5">
                  {footer}
                </div>
              )}
            </div>

            <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
              <ShieldCheck size={12} />
              Firebase দ্বারা সুরক্ষিত · যেকোনো সময় অ্যাকাউন্ট মুছে ফেলতে পারবেন
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
