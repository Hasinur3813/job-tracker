"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Layers,
  Sparkles,
  Lock,
  Clock,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Zap,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Header } from "@/app/components/layout/Header";

export default function Home() {
  const { currentUser } = useAuth();

  const features = [
    {
      icon: <Lock className="text-emerald-600 w-5 h-5" />,
      title: "ক্রেডেনশিয়াল ভল্ট (Credentials Vault)",
      desc: "সরকারি চাকরির সরকারি পোর্টালের (যেমন: Teletalk Alljobs) ইউজারনেম এবং পাসওয়ার্ড নিরাপদ উপায়ে সংরক্ষণ করুন। সরাসরি হোম ড্যাশবোর্ড থেকে এক ক্লিকে অ্যাক্সেস ও কপি করুন।",
    },
    {
      icon: <Clock className="text-amber-600 w-5 h-5" />,
      title: "স্মার্ট দিন গণনাকারী ও রিমাইন্ডার",
      desc: "আবেদনের শেষ ডেডলাইন কত দিন বাকি আছে তা সরাসরি ড্যাশবোর্ডে কালার-কোডেড ভিজ্যুয়াল ওয়ার্নিং সহ দেখতে পাবেন। অতিরিক্ত চাপ ছাড়া আবেদন সম্পন্ন করুন।",
    },
    {
      icon: <Layers className="text-blue-600 w-5 h-5" />,
      title: "অগ্রগতি ট্র্যাকার (Status Flow)",
      desc: "আবেদন করা হয়নি, ইমেইল বা কার্ড সাবমিট করা হয়েছে, পরীক্ষা সম্পন্ন, ভাইভা অবশিষ্টাংশসহ প্রতিটি পর্যায় নিখুঁত ট্র্যাকিং মোডে রাখুন।",
    },
    {
      icon: <TrendingUp className="text-indigo-600 w-5 h-5" />,
      title: "ক্যাটাগরি-ভিত্তি ফিল্টারিং",
      desc: "সরকারি (Govt) ও বেসরকারি (Non-Govt) আলাদা সেকশনে আপনার কাজের ট্র্যাক রাখুন। মাল্টিপল কলাম ফিল্টার ও সার্চ দিয়ে যেকোনো চাকুরি মুহূর্তে খুঁজুন।",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans select-none">
      {/* Top Navbar */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100 py-16 sm:py-24 text-left">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero text */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-bold"
              >
                <Sparkles size={14} className="animate-spin text-blue-600" />
                <span>চাকরি আবেদন ব্যবস্থাপনার আধুনিক সমাধান</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight"
              >
                আপনার সব চাকরি আবেদন <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
                  গুছিয়ে রাখুন এক জায়গায়
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-gray-650 max-w-xl leading-relaxed"
              >
                সরকারি বা বেসরকারি চাকরির আবেদনের লিংক, ইউজার আইডি, পাসওয়ার্ড,
                বেতনের তথ্য এবং পরীক্ষার ট্র্যাকিং স্ট্যাটাস নিখুঁতভাবে সংরক্ষণ
                করুন।
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4 w-full sm:w-auto"
              >
                {currentUser ? (
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-blue-200/50 transition-all cursor-pointer group"
                  >
                    <span>আপনার ড্যাশবোর্ডে যান</span>
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-blue-200/50 transition-all cursor-pointer group"
                    >
                      <span>এখনই যাত্রা শুরু করুন (ফ্রি)</span>
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                    <button
                      onClick={() => {
                        const el = document.getElementById("features-section");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-all cursor-pointer"
                    >
                      ফিচারসমূহ দেখুন
                    </button>
                  </>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100 w-full"
              >
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-600">
                    ১০০%
                  </div>
                  <div className="text-xs text-gray-400 font-sans mt-0.5">
                    নিরাপদ ডিক্রিপশন
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-indigo-600">
                    ১-ক্লিক
                  </div>
                  <div className="text-xs text-gray-400 font-sans mt-0.5">
                    ক্রেডেনশিয়াল কপি
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                    ০৳
                  </div>
                  <div className="text-xs text-gray-400 font-sans mt-0.5">
                    আজীবন ফ্রি
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Visual Screen Widget Mockup */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative bg-white border border-gray-150 rounded-2xl shadow-xl overflow-hidden p-6 text-left"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-red-400 rounded-full inline-block"></span>
                    <span className="w-3 h-3 bg-amber-400 rounded-full inline-block"></span>
                    <span className="w-3 h-3 bg-green-400 rounded-full inline-block"></span>
                  </div>
                  <div className="px-3 py-0.5 bg-gray-100 rounded-md text-[10px] text-gray-400 font-mono">
                    chakri-tracker.web.app
                  </div>
                </div>

                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">
                  সরাসরি কাজের প্রিভিউ
                </h4>
                <div className="bg-linear-to-br from-blue-50/50 to-indigo-50/10 border border-blue-100/80 rounded-xl p-4 relative mb-4">
                  <span className="inline-flex px-2 py-0.5 bg-blue-100/70 border border-blue-200 text-[10px] font-bold rounded-full text-blue-700 mb-2">
                    সরকারি চাকরি (Govt)
                  </span>
                  <span className="inline-flex px-2 py-0.5 bg-amber-100/70 border border-amber-200 text-[10px] font-semibold rounded-full text-amber-700 ml-1.5 mb-2">
                    পরীক্ষা বাকি (Exam)
                  </span>
                  <h5 className="font-bold text-gray-900 text-base leading-tight">
                    নিউক্লিয়ার পাওয়ার প্ল্যান্ট কোম্পানি বাংলাদেশ লি.
                  </h5>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                    পদের নাম: সিনিয়র অ্যাসিস্ট্যান্ট ম্যানেজার
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <ShieldCheck
                    size={16}
                    className="text-emerald-500 shrink-0"
                  />
                  <span>
                    এটি সম্পূর্ণ নিরাপদ ফায়ারবেস সিস্টেমে সংরক্ষিত থাকে।
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Detail Section */}
      <section
        id="features-section"
        className="py-20 bg-white border-b border-gray-100 text-left"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight sm:text-4xl">
              রিয়েল-টাইম চাকরি ক্যারিয়ার হেল্পার
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              নিশ্চিন্তে চাকরির আবেদন করুন, ডেটা সংরক্ষণ এবং সময়ের পূর্বে আবেদন
              ট্র্যাকিং করুন নিরাপদে।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-gray-50 hover:bg-white border hover:border-blue-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-start gap-4"
                whileHover={{ scale: 1.01 }}
              >
                <div className="p-3 bg-white border border-gray-100 shadow-sm rounded-xl">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 font-sans mt-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-650 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Promo */}
      <section className="py-16 bg-blue-50/20 border-b border-gray-100 text-left">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-linear-to-br from-blue-700 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-blue-200">
                  <ShieldCheck size={14} className="text-green-300" />
                  <span>নিরাপত্তা নিশ্চিতকরণ</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                  পাসওয়ার্ড ও ক্রেডেন্সিয়াল সুরক্ষায় দ্বিমুখী সুরক্ষা স্তর।
                </h3>
                <p className="text-sm text-blue-100 leading-relaxed">
                  আমরা সরাসরি আপনার ফায়ারবেস সিকিউরিটি রুলস-এর মাধ্যমে ডেটা
                  ব্লক করে রেখেছি। শুধুমাত্র আপনি নিজের লগইন ইমেইল এবং
                  পাসওয়ার্ড দিয়ে প্রবেশ করলেই ডেটা অ্যাক্সেস করতে পারবেন।
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <span className="flex items-center gap-1.5 text-xs text-blue-200">
                    <CheckCircle2 size={13} className="text-green-300" />
                    ফায়ারস্টোর সিকিউরিটি লকিং
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-blue-200">
                    <CheckCircle2 size={13} className="text-green-300" />
                    এন্ড-টু-এন্ড এনক্রিপশন
                  </span>
                </div>
              </div>
              <div className="shrink-0 bg-white/10 p-6 rounded-2xl border border-white/10 text-center w-full md:w-auto max-w-xs">
                <Zap
                  size={36}
                  className="text-yellow-300 mx-auto mb-3 animate-pulse"
                />
                <p className="text-sm font-bold text-white">
                  সম্পূর্ণ নিরাপদ এবং সুরক্ষিত
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
