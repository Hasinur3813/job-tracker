"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CircleAlert,
  Mail,
  MailCheck,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  getAuthErrorCode,
  getAuthErrorMessage,
} from "@/lib/firebase/authErrors";
import { toBnDigits } from "@/lib/utils/bn";
import { AuthShell } from "@/app/components/auth/AuthShell";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";

const resetSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "ইমেইল প্রবেশ করান")
    .email("সঠিক ইমেইল ঠিকানা প্রদান করুন"),
});

type ResetInput = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ResetInput>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const sendResetLink = async (email: string) => {
    setSending(true);
    setFormError(null);
    try {
      await resetPassword(email);
      setSentTo(email);
      setCooldown(30);
      return true;
    } catch (error) {
      // Avoid revealing whether an account exists for this email.
      if (getAuthErrorCode(error) === "auth/user-not-found") {
        setSentTo(email);
        setCooldown(30);
        return true;
      }
      setFormError(getAuthErrorMessage(error));
      return false;
    } finally {
      setSending(false);
    }
  };

  const onSubmit = (data: ResetInput) => {
    void sendResetLink(data.email);
  };

  const handleResend = async () => {
    const email = sentTo ?? getValues("email");
    if (!email) return;
    const sent = await sendResetLink(email);
    if (sent) toast.success("রিসেট লিংক আবার পাঠানো হয়েছে ✓");
  };

  return (
    <AuthShell
      eyebrow="পাসওয়ার্ড রিকভারি"
      title={sentTo ? "ইমেইলটি দেখুন" : "পাসওয়ার্ড রিসেট করুন"}
      description={
        sentTo
          ? "নিরাপদ রিসেট লিংক আপনার ইনবক্সের পথে।"
          : "অ্যাকাউন্টের ইমেইলটি দিন—আমরা একটি নিরাপদ রিসেট লিংক পাঠিয়ে দেব।"
      }
      footer={
        <Link
          href="/auth"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 transition-colors hover:text-brand-700 hover:underline"
        >
          <ArrowLeft size={13} />
          লগইন পেজে ফিরে যান
        </Link>
      }
    >
      {sentTo ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-[0_18px_36px_-18px_rgba(5,150,105,0.9)]">
            <MailCheck size={30} />
          </div>

          <h2 className="mt-5 text-lg font-bold text-slate-900">
            রিসেট লিংক পাঠানো হয়েছে
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            <span className="font-semibold text-slate-700">{sentTo}</span>{" "}
            ঠিকানায় একটি পাসওয়ার্ড রিসেট লিংক পাঠিয়েছি। লিংকে ক্লিক করে নতুন
            পাসওয়ার্ড সেট করুন।
          </p>

          <div className="mt-5 space-y-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-left text-xs leading-5 text-slate-500">
            <p className="flex items-start gap-2">
              <ShieldCheck
                size={14}
                className="mt-0.5 shrink-0 text-emerald-600"
              />
              লিংকটি শুধু আপনার জন্য—কারও সঙ্গে শেয়ার করবেন না।
            </p>
            <p className="flex items-start gap-2">
              <CircleAlert
                size={14}
                className="mt-0.5 shrink-0 text-amber-500"
              />
              ইনবক্সে না পেলে স্প্যাম বা প্রমোশন ফোল্ডার দেখুন।
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={handleResend}
              loading={sending}
              disabled={cooldown > 0}
            >
              {cooldown > 0 ? (
                <>
                  <RefreshCw size={15} />
                  আবার পাঠান ({toBnDigits(cooldown)})
                </>
              ) : (
                <>
                  <RefreshCw size={15} />
                  আবার পাঠান
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={() => {
                setSentTo(null);
                setFormError(null);
                setCooldown(0);
              }}
              className="w-full text-center text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800"
            >
              অন্য ইমেইল ব্যবহার করুন
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Input
            {...register("email")}
            type="email"
            label="অ্যাকাউন্টের ইমেইল"
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            leftIcon={<Mail size={16} />}
            error={errors.email?.message}
            hint="Google দিয়ে তৈরি অ্যাকাউন্টেও এই ইমেইল ব্যবহার করতে পারবেন।"
          />

          {formError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium leading-5 text-rose-700"
            >
              <CircleAlert size={14} className="mt-0.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={sending}
          >
            রিসেট লিংক পাঠান
          </Button>

          <p className="text-center text-[12.5px] leading-5 text-slate-500">
            নিরাপত্তার স্বার্থে আমরা নিশ্চিত করি না যে এই ইমেইলে অ্যাকাউন্ট
            আছে কি নেই।
          </p>
        </motion.form>
      )}
    </AuthShell>
  );
}
