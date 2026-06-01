"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, EyeOff, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { JobDocument, useJobs } from "@/lib/hooks/useJobs";
import { Header } from "@/app/components/layout/Header";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import { Button } from "@/app/components/ui/Button";
import { STATUS_CONFIG } from "@/lib/constants/statusConfig";
import { ProtectedRoute } from "@/app/components/layout/ProtectedRoute";

const jobFormSchema = z.object({
  title: z.string().min(1, "চাকরির পদের নাম আবশ্যক"),
  organisation: z.string().min(1, "প্রতিষ্ঠানের নাম আবশ্যক"),
  category: z.enum(["govt", "non-govt"]),
  deadline: z.string().min(1, "আবেদনের শেষ তারিখ আবশ্যক"),
  status: z.enum([
    "not_applied",
    "applied",
    "skipped",
    "given_exam",
    "passed",
    "failed",
    "interviewed",
  ]),
  source_url: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "সঠিক লিংক প্রদান করুন (যেমন: https://example.com)" },
    )
    .optional()
    .or(z.literal("")),
  salary_range: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  credentials: z
    .object({
      username: z.string().optional().or(z.literal("")),
      password: z.string().optional().or(z.literal("")),
    })
    .optional(),
});

type JobFormInput = z.infer<typeof jobFormSchema>;

export default function JobNewPage() {
  const router = useRouter();
  const { addJob } = useJobs();
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<JobFormInput>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      organisation: "",
      category: "non-govt",
      deadline: "",
      status: "not_applied",
      source_url: "",
      salary_range: "",
      notes: "",
      credentials: {
        username: "",
        password: "",
      },
    },
  });

  const categoryValue = useWatch({ control, name: "category" });

  const onSubmit = async (data: JobFormInput) => {
    setSaving(true);

    const payload: Omit<JobDocument, "id"> = {
      title: data.title,
      organisation: data.organisation,
      category: data.category,
      deadline: data.deadline,
      status: data.status,
      source_url: data.source_url || "",
      salary_range: data.salary_range || "",
      notes: data.notes || "",
    };

    if (data.category === "govt") {
      payload.credentials = {
        username: data.credentials?.username || "",
        password: data.credentials?.password || "",
      };
    } else {
      payload.credentials = {
        username: "",
        password: "",
      };
    }

    try {
      const docRef = await addJob(payload);
      toast.success("চাকরি সফলভাবে যোগ করা হয়েছে ✓");
      if (docRef?.id) {
        router.push(`/job/${docRef.id}`);
      } else {
        router.push("/dashboard");
      }
    } catch {
      toast.error("কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setSaving(false);
    }
  };

  const categoryOptions = [
    { value: "govt", label: "সরকারি" },
    { value: "non-govt", label: "বেসরকারি" },
  ];

  const statusOptions = Object.entries(STATUS_CONFIG).map(([value, info]) => ({
    value,
    label: info.label,
  }));

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 select-none">
          <div className="flex items-center gap-3 mb-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 hover:bg-white border hover:border-gray-200 text-gray-600 hover:text-gray-900 rounded-lg transition-all duration-200"
              title="ফিরে যান"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="text-left">
              <h1 className="text-2xl font-black text-gray-900 font-sans tracking-tight">
                নতুন আবেদন যুক্ত করুন
              </h1>
              <p className="text-xs text-gray-500 font-sans mt-0.5">
                আবেদন ঢোকান এবং ট্র্যাকিং শুরু করুন।
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="bg-white border border-gray-150 shadow-xs rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="আবেদনের নাম / পদের নাম"
                  placeholder="যেমন: অ্যাসিস্ট্যান্ট প্রোগ্রামার"
                  error={errors.title?.message}
                  {...register("title")}
                />
                <Input
                  label="প্রতিষ্ঠান বা অর্গানাইজেশন"
                  placeholder="যেমন: বাংলাদেশ ব্যাংক"
                  error={errors.organisation?.message}
                  {...register("organisation")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="আবেদনের বিভাগ"
                  options={categoryOptions}
                  error={errors.category?.message}
                  {...register("category")}
                />

                <Input
                  label="আবেদনের শেষ সময়"
                  type="date"
                  error={errors.deadline?.message}
                  {...register("deadline")}
                />

                <Select
                  label="আবেদনের বর্তমান অবস্থা"
                  options={statusOptions}
                  error={errors.status?.message}
                  {...register("status")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="সার্কুলার লিঙ্ক / রেফারেন্স URL"
                  type="text"
                  placeholder="https://example.com/circular"
                  error={errors.source_url?.message}
                  {...register("source_url")}
                />
                <Input
                  label="বেতন বা রেঞ্জ"
                  type="text"
                  placeholder="যেমন: ২২,০০০ - ৫৩,০৬০ টাকা"
                  error={errors.salary_range?.message}
                  {...register("salary_range")}
                />
              </div>

              <div className="text-left mb-4">
                <label className="block mb-1.5 text-sm font-medium text-gray-700 font-sans">
                  গুরুত্বপূর্ণ নোট / অতিরিক্ত বিবরণ
                </label>
                <textarea
                  rows={4}
                  placeholder="পরীক্ষার সিলেবাস, প্রবেশপত্র প্রাপ্তি ইত্যাদি সম্পর্কিত তথ্য..."
                  className={
                    "w-full px-3 py-2 bg-white border border-gray-300 focus:ring-blue-500 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:border-transparent transition-all duration-200 font-sans"
                  }
                  {...register("notes")}
                />
              </div>
            </div>

            {categoryValue === "govt" && (
              <div className="bg-white border border-blue-100 shadow-xs rounded-2xl p-6 text-left space-y-4">
                <div className="flex items-center gap-2 text-blue-700 font-semibold font-sans mb-1 pb-2 border-b border-blue-50">
                  <Lock size={18} className="text-blue-600" />
                  <span>লগইন ও আবেদন ভেরিফিকেশন তথ্য</span>
                </div>
                <p className="text-xs text-gray-500 font-sans leading-relaxed">
                  সরকারি আবেদনের পোর্টালে লগইন করার জন্য ইউজারনেম এবং পাসওয়ার্ড
                  সংরক্ষণ করুন।
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="ইউজারনেম / মোবাইল নম্বর"
                    placeholder="যেমন: USER12345"
                    error={errors.credentials?.username?.message}
                    {...register("credentials.username")}
                  />
                  <div className="relative">
                    <Input
                      label="পাসওয়ার্ড"
                      type={showPassword ? "text" : "password"}
                      placeholder="যেমন: pass@123"
                      error={errors.credentials?.password?.message}
                      className="pr-10"
                      {...register("credentials.password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-9.25 right-3 text-gray-400 hover:text-gray-600 focus:outline-hidden cursor-pointer p-1 rounded-sm"
                      title={
                        showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"
                      }
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={() => router.back()}
                disabled={saving}
              >
                বাতিল করুন
              </Button>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={saving}
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Save size={16} />
                    <span>সংরক্ষণ করুন</span>
                  </span>
                )}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}
