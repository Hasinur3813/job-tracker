"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  Clock,
  ExternalLink,
  KeyRound,
  Layers,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Header } from "@/app/components/layout/Header";
import { Logo } from "@/app/components/brand/Logo";

const features = [
  {
    icon: <KeyRound size={18} />,
    tone: "bg-emerald-50 text-emerald-600 border-emerald-100",
    title: "ক্রেডেনশিয়াল ভল্ট",
    description:
      "সরকারি পোর্টালের ইউজারনেম ও পাসওয়ার্ড এক জায়গায়—এক ক্লিকে কপি করুন, যখন দরকার।",
  },
  {
    icon: <Clock size={18} />,
    tone: "bg-amber-50 text-amber-600 border-amber-100",
    title: "ডেডলাইন সতর্কবার্তা",
    description:
      "কোন আবেদনের সময় শেষ হচ্ছে, কত দিন বাকি—কালার-কোডেড ভিজ্যুয়ালে এক নজরে।",
  },
  {
    icon: <Layers size={18} />,
    tone: "bg-brand-50 text-brand-600 border-brand-100",
    title: "স্ট্যাটাস ফ্লো",
    description:
      "আবেদন থেকে ভাইভা—প্রতিটি ধাপ ট্র্যাক করুন। কোনটায় কী করতে হবে আর ভাবতে হবে না।",
  },
  {
    icon: <TrendingUp size={18} />,
    tone: "bg-violet-50 text-violet-600 border-violet-100",
    title: "স্মার্ট ফিল্টার",
    description:
      "সরকারি/বেসরকারি, স্ট্যাটাস আর ডেডলাইন অনুযায়ী মুহূর্তেই খুঁজে নিন যেকোনো আবেদন।",
  },
];

const steps = [
  {
    number: "০১",
    title: "অ্যাকাউন্ট খুলুন",
    description: "Google দিয়ে এক ক্লিকে, অথবা ইমেইল দিয়ে ৩০ সেকেন্ডে।",
  },
  {
    number: "০২",
    title: "আবেদন যোগ করুন",
    description: "প্রতিষ্ঠান, পদ, ডেডলাইন আর পোর্টালের লগইন তথ্য লিখে রাখুন।",
  },
  {
    number: "০৩",
    title: "শান্ত থাকুন",
    description: "ডেডলাইনের আগেই সতর্কবার্তা পাবেন—কিছুই আর মিস হবে না।",
  },
];

const trustPoints = [
  "Firebase Authentication",
  "Google সাইন-ইন",
  "রিয়েল-টাইম সিঙ্ক",
  "সম্পূর্ণ ফ্রি",
];

function GoogleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A11.99 11.99 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

function MiniJobCard({
  title,
  organisation,
  deadlineline,
  urgency,
}: {
  title: string;
  organisation: string;
  deadlineline: string;
  urgency: "soon" | "week" | "normal";
}) {
  const tone = {
    soon: { bar: "bg-linear-to-r from-rose-400 to-rose-500", chip: "text-rose-600 bg-rose-50" },
    week: { bar: "bg-linear-to-r from-amber-400 to-accent-400", chip: "text-amber-600 bg-amber-50" },
    normal: { bar: "bg-linear-to-r from-brand-400 to-brand-500", chip: "text-brand-600 bg-brand-50" },
  }[urgency];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-soft">
      <span className={`absolute inset-y-0 left-0 w-1 ${tone.bar}`} />
      <div className="pl-1.5">
        <p className="truncate text-[14px] font-bold text-slate-900">{title}</p>
        <p className="mt-0.5 truncate text-[12.5px] text-slate-500">
          {organisation}
        </p>
        <span
          className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[12px] font-bold ${tone.chip}`}
        >
          {deadlineline}
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const { currentUser } = useAuth();

  const scrollToFeatures = () => {
    document
      .getElementById("features-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 top-0 h-[30rem] w-[30rem] rounded-full bg-brand-200/50 blur-3xl" />
            <div className="absolute -right-24 top-24 h-[26rem] w-[26rem] rounded-full bg-accent-200/40 blur-3xl" />
            <div className="absolute inset-0 bg-grid-light opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
          </div>

          <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_minmax(0,440px)] lg:gap-16">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-200/70 bg-white/80 px-3 py-1 text-[12.5px] font-bold text-brand-700 shadow-soft backdrop-blur-sm"
                >
                  <Sparkles size={13} className="text-accent-500" />
                  চাকরি আবেদন ব্যবস্থাপনার আধুনিক, শান্ত সমাধান
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 }}
                  className="mt-5 text-[2.35rem] font-black leading-[1.16] tracking-tight text-slate-900 sm:text-5xl"
                >
                  আপনার সব চাকরি আবেদন
                  <br />
                  <span className="bg-linear-to-r from-brand-700 via-brand-500 to-violet-500 bg-clip-text text-transparent">
                    গুছিয়ে রাখুন এক জায়গায়।
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.16 }}
                  className="mt-5 max-w-xl text-[15px] leading-8 text-slate-500"
                >
                  সরকারি থেকে বেসরকারি—আবেদনের লিংক, পোর্টালের লগইন তথ্য, বেতন
                  আর পরীক্ষার স্ট্যাটাস সব এক ড্যাশবোর্ডে। ডেডলাইন মিস করা আর
                  ভুলে যাওয়ার দিন শেষ।
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.24 }}
                  className="mt-7 flex flex-col gap-3 sm:flex-row"
                >
                  {currentUser ? (
                    <Link
                      href="/dashboard"
                      className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-bold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-brand-700"
                    >
                      <LayoutDashboard size={16} />
                      আপনার ড্যাশবোর্ডে যান
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/auth"
                        className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-bold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-brand-700"
                      >
                        ফ্রি অ্যাকাউন্ট খুলুন
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                      <button
                        type="button"
                        onClick={scrollToFeatures}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-6 text-sm font-semibold text-slate-700 shadow-soft backdrop-blur-sm transition-all hover:border-slate-300 hover:text-slate-900"
                      >
                        ফিচারসমূহ দেখুন
                      </button>
                    </>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.34 }}
                  className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2"
                >
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-2.5 py-1 text-[12px] font-semibold text-slate-500">
                    <GoogleIcon size={12} />
                    Google দিয়ে সাইন-ইন
                  </span>
                  {trustPoints
                    .filter((point) => point !== "Google সাইন-ইন")
                    .map((point) => (
                      <span
                        key={point}
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-500"
                      >
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        {point}
                      </span>
                    ))}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.15 }}
                className="relative"
              >
                <div
                  aria-hidden="true"
                  className="absolute -inset-4 rounded-4xl bg-linear-to-br from-brand-300/30 via-transparent to-accent-300/30 blur-2xl"
                />
                <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-4 shadow-lift backdrop-blur-xl sm:p-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                    </div>
                    <span className="rounded-md bg-slate-50 px-2 py-0.5 font-mono text-[10.5px] text-slate-500">
                      chakri-tracker · ড্যাশবোর্ড
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-[12px] text-slate-500">শুভ সন্ধ্যা</p>
                      <p className="text-sm font-black text-slate-900">
                        আপনার ৩টি আবেদন চলছে
                      </p>
                    </div>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-brand-500 to-violet-500 text-[12.5px] font-bold text-white">
                      রা
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      { label: "মোট", value: "১২", cls: "text-slate-900" },
                      { label: "চলমান", value: "৩", cls: "text-brand-600" },
                      { label: "এই সপ্তাহে", value: "২", cls: "text-rose-500" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 text-center"
                      >
                        <p className={`text-lg font-black ${stat.cls}`}>
                          {stat.value}
                        </p>
                        <p className="text-[10.5px] font-semibold text-slate-500">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 space-y-2">
                    <MiniJobCard
                      title="সহকারী প্রোগ্রামার"
                      organisation="বাংলাদেশ ব্যাংক · সরকারি"
                      deadlineline="৩ দিন বাকি"
                      urgency="soon"
                    />
                    <MiniJobCard
                      title="অফিসার (জেনারেল)"
                      organisation="সিটি ব্যাংক পিএলসি"
                      deadlineline="৬ দিন বাকি"
                      urgency="week"
                    />
                    <MiniJobCard
                      title="সিনিয়র অ্যাসিস্ট্যান্ট ম্যানেজার"
                      organisation="NPCL · সরকারি"
                      deadlineline="১৮ দিন বাকি"
                      urgency="normal"
                    />
                  </div>

                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 p-2.5 text-[12px] font-medium text-emerald-700">
                    <ShieldCheck size={14} className="shrink-0" />
                    Firestore সিকিউরিটি রুলসে আপনার ডেটা সুরক্ষিত
                  </div>
                </div>

                <div className="absolute -bottom-5 -left-4 hidden items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/95 px-3 py-2 shadow-lift backdrop-blur-sm sm:flex">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <BellRing size={13} />
                  </span>
                  <span className="text-[12px] font-bold text-slate-700">
                    ডেডলাইন রিমাইন্ডার সক্রিয়
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200/60 bg-white/70 py-3">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-[12.5px] font-semibold text-slate-500 sm:px-6">
            {trustPoints.map((point) => (
              <span key={point} className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-500" />
                {point}
              </span>
            ))}
          </div>
        </section>

        <section
          id="features-section"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20"
        >
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-mono text-[12px] font-bold uppercase tracking-[0.22em] text-brand-600">
              Features
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-[2.3rem] sm:leading-tight">
              আবেদনের হিসাব রাখার কাজটা
              <br className="hidden sm:block" /> এখন অনেক সহজ
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              প্রয়োজনীয় সবকিছু এক জায়গায়—অতিরিক্ত কোনো জটিলতা ছাড়াই।
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="group rounded-2xl border border-slate-200/70 bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border ${feature.tone}`}
                >
                  {feature.icon}
                </span>
                <h3 className="mt-4 text-sm font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-xs leading-6 text-slate-500">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200/60 bg-white/70 py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
              <div>
                <span className="font-mono text-[12px] font-bold uppercase tracking-[0.22em] text-brand-600">
                  How it works
                </span>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  তিন ধাপে শুরু
                </h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
                  কোনো জটিল সেটআপ নেই। অ্যাকাউন্ট খুলে প্রথম আবেদনটি যোগ করুন—
                  বাকিটা ড্যাশবোর্ড সামলে নেবে।
                </p>
                <Link
                  href={currentUser ? "/dashboard" : "/auth"}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition-colors hover:text-brand-700"
                >
                  {currentUser ? "ড্যাশবোর্ড খুলুন" : "বিনামূল্যে শুরু করুন"}
                  <ArrowRight size={15} />
                </Link>
              </div>

              <ol className="space-y-3">
                {steps.map((step) => (
                  <li
                    key={step.number}
                    className="flex items-start gap-4 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-card"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 font-mono text-sm font-black text-brand-600">
                      {step.number}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {step.title}
                      </p>
                      <p className="mt-1 text-xs leading-6 text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="relative overflow-hidden rounded-4xl bg-[#120f2e] p-7 text-white shadow-lift sm:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand-500/25 blur-3xl" />
              <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl" />
              <div className="absolute inset-0 bg-grid opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
            </div>

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12.5px] font-bold text-brand-200">
                  <ShieldCheck size={13} className="text-emerald-400" />
                  নিরাপত্তা, কোনো বাড়তি চাপ ছাড়াই
                </span>
                <h2 className="mt-4 max-w-xl text-2xl font-black leading-snug tracking-tight sm:text-[1.8rem]">
                  আপনার ডেটা শুধু আপনার—
                  <br />
                  Firestore সিকিউরিটি রুলসে সুরক্ষিত।
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/75">
                  প্রতিটি আবেদন আপনার নিজের অ্যাকাউন্টের ডকুমেন্টে থাকে; অন্য
                  কোনো ব্যবহারকারী তা দেখতে পারে না। Google বা ইমেইল—দুভাবেই
                  লগইন করা যায়, আর যেকোনো সময় অ্যাকাউন্ট মুছে ফেলা যায়।
                </p>

                <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {[
                    "শুধু আপনার অ্যাকাউন্টে অ্যাক্সেস",
                    "Firebase Authentication",
                    "রিয়েল-টাইম সিঙ্ক",
                    "ইমেইল/পাসওয়ার্ড রিসেট",
                  ].map((item) => (
                    <span
                      key={item}
                      className="flex items-center gap-2 text-xs text-white/70"
                    >
                      <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
                      {item}
                    </span>
                  ))}
                </div>

                <p className="mt-5 max-w-xl rounded-xl border border-white/10 bg-white/[0.04] p-3 text-[12px] leading-5 text-white/65">
                  স্বচ্ছতার জন্য: পোর্টালের ক্রেডেনশিয়াল এন্ড-টু-এন্ড
                  এনক্রিপ্টেড নয়—এগুলো আপনার ব্যক্তিগত Firestore
                  অ্যাকাউন্টে সংরক্ষিত থাকে, তাই কারও সঙ্গে শেয়ার করবেন না।
                </p>
              </div>

              <div className="flex w-full shrink-0 flex-col gap-2.5 rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm lg:w-60">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
                  <Wallet size={14} className="text-accent-300" />
                  আজীবন ফ্রি
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
                  <Zap size={14} className="text-accent-300" />
                  ৩০ সেকেন্ডে সেটআপ
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
                  <ExternalLink size={14} className="text-accent-300" />
                  যেকোনো ডিভাইসে
                </div>
                <Link
                  href={currentUser ? "/dashboard" : "/auth"}
                  className="mt-1 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-white text-xs font-bold text-slate-900 transition-colors hover:bg-brand-50"
                >
                  {currentUser ? "ড্যাশবোর্ডে যান" : "শুরু করুন"}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200/60 bg-white/70 py-14">
          <div className="mx-auto w-full max-w-6xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              আজ থেকেই গুছিয়ে রাখুন
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
              ফ্রি, দ্রুত আর মনের মতো—আপনার পরবর্তী চাকরির আবেদনটি এখান থেকেই
              শুরু হোক।
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
              <Link
                href={currentUser ? "/job/new" : "/auth"}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-bold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-brand-700"
              >
                {currentUser ? "নতুন আবেদন যোগ করুন" : "ফ্রি অ্যাকাউন্ট খুলুন"}
                <ArrowRight size={15} />
              </Link>
              <span className="text-[12.5px] text-slate-500">
                Google দিয়ে এক ক্লিকেই সাইন-ইন
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/60 bg-white/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="hidden text-[12px] text-slate-500 sm:block">
              চাকরির আবেদন, শান্তভাবে গোছানো।
            </span>
          </div>
          <div className="flex items-center gap-4 text-[12.5px] font-medium text-slate-500">
            <button
              type="button"
              onClick={scrollToFeatures}
              className="transition-colors hover:text-slate-700"
            >
              ফিচার
            </button>
            <Link
              href={currentUser ? "/dashboard" : "/auth"}
              className="transition-colors hover:text-slate-700"
            >
              {currentUser ? "ড্যাশবোর্ড" : "লগইন"}
            </Link>
            <span>© ২০২৬ চাকরি ট্র্যাকার</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
