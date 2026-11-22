"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AnimatePresence, motion } from "motion/react";
import {
  CircleAlert,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { getAuthErrorMessage, isAuthCancellation } from "@/lib/firebase/authErrors";
import { getSafeNextPath } from "@/lib/utils/navigation";
import { AuthShell } from "@/app/components/auth/AuthShell";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "ইমেইল প্রবেশ করান")
    .email("সঠিক ইমেইল ঠিকানা প্রদান করুন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"),
});

const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "ইমেইল প্রবেশ করান")
      .email("সঠিক ইমেইল ঠিকানা প্রদান করুন"),
    password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"),
    confirmPassword: z.string().min(1, "পাসওয়ার্ডটি নিশ্চিত করুন"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড মেলেনি",
    path: ["confirmPassword"],
  });

type LoginInput = z.infer<typeof loginSchema>;
type RegisterInput = z.infer<typeof registerSchema>;
type AuthMode = "login" | "register";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.87z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.71-4.93H1.28v3.09A11.99 11.99 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.32A7.2 7.2 0 0 1 4.91 12c0-.81.14-1.6.38-2.32V6.59H1.28A11.99 11.99 0 0 0 0 12c0 1.94.46 3.77 1.28 5.41l4.01-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.28 6.59l4.01 3.09C6.23 6.85 8.88 4.75 12 4.75z"
      />
    </svg>
  );
}

function getPasswordScore(password: string) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

function PasswordMeter({ password }: { password: string }) {
  if (!password) return null;

  const score = getPasswordScore(password);
  const labels = ["খুব দুর্বল", "দুর্বল", "মোটামুটি", "ভালো", "শক্তিশালী"];
  const tone =
    score <= 1
      ? "bg-rose-500"
      : score === 2
        ? "bg-amber-500"
        : score === 3
          ? "bg-brand-500"
          : "bg-emerald-500";
  const activeSegments = Math.max(1, Math.min(4, Math.ceil((score / 5) * 4)));

  return (
    <div className="-mt-1.5">
      <div className="flex gap-1.5" aria-hidden="true">
        {[1, 2, 3, 4].map((segment) => (
          <span
            key={segment}
            className={`h-1 flex-1 rounded-full transition-colors ${
              segment <= activeSegments ? tone : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-[11px] font-medium text-slate-500">
        পাসওয়ার্ডের শক্তি:{" "}
        <span className="font-semibold text-slate-700">
          {labels[Math.min(score, 4)]}
        </span>
      </p>
    </div>
  );
}

function FormAlert({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium leading-5 text-rose-700"
    >
      <CircleAlert size={14} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getSafeNextPath(searchParams.get("next"));
  const {
    login,
    register,
    loginWithGoogle,
    currentUser,
    loading: authStatusLoading,
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (currentUser && !authStatusLoading) {
      router.replace(nextPath);
    }
  }, [currentUser, authStatusLoading, router, nextPath]);

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const registerPassword = useWatch({
    control: registerForm.control,
    name: "password",
  });

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setFormError(null);
    setShowPassword(false);
    setShowConfirm(false);
  };

  const handleGoogle = async () => {
    setFormError(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Google দিয়ে লগইন সফল হয়েছে ✓");
      router.replace(nextPath);
    } catch (error) {
      if (!isAuthCancellation(error)) {
        setFormError(getAuthErrorMessage(error));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const onLoginSubmit = async (data: LoginInput) => {
    setFormError(null);
    setEmailLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("সফলভাবে লগইন করা হয়েছে ✓");
      router.replace(nextPath);
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setEmailLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterInput) => {
    setFormError(null);
    setEmailLoading(true);
    try {
      await register(data.email, data.password);
      toast.success("অ্যাকাউন্ট তৈরি সফল হয়েছে! ✓");
      router.replace(nextPath);
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setEmailLoading(false);
    }
  };

  const busy = emailLoading || googleLoading;
  const isLogin = mode === "login";

  return (
    <AuthShell
      eyebrow={isLogin ? "আবার স্বাগতম" : "নতুন শুরু"}
      title={isLogin ? "আপনার অ্যাকাউন্টে প্রবেশ করুন" : "নতুন অ্যাকাউন্ট খুলুন"}
      description={
        isLogin
          ? "আপনার আবেদন, ডেডলাইন আর অগ্রগতি—সব যেখানে রেখেছিলেন, ঠিক সেখানেই।"
          : "একটি অ্যাকাউন্টেই সব চাকরির আবেদন গুছিয়ে রাখুন—সম্পূর্ণ ফ্রি।"
      }
      footer={
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-slate-400">
            <Sparkles size={13} className="text-accent-500" />
            সব ফিচার, আজীবন ফ্রি
          </span>
          <Link
            href="/#features-section"
            className="font-semibold text-brand-600 transition-colors hover:text-brand-700 hover:underline"
          >
            ফিচারগুলো দেখুন
          </Link>
        </div>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100/90 p-1">
        <button
          type="button"
          onClick={() => switchMode("login")}
          aria-pressed={isLogin}
          className={`rounded-lg px-3 py-2 text-[13px] font-semibold transition-all ${
            isLogin
              ? "bg-white text-brand-700 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          লগইন
        </button>
        <button
          type="button"
          onClick={() => switchMode("register")}
          aria-pressed={!isLogin}
          className={`rounded-lg px-3 py-2 text-[13px] font-semibold transition-all ${
            !isLogin
              ? "bg-white text-brand-700 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          নতুন অ্যাকাউন্ট
        </button>
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={busy}
        className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-soft transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {googleLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
        ) : (
          <GoogleIcon />
        )}
        Google দিয়ে চালিয়ে যান
      </button>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-[11px] font-semibold text-slate-400">
          অথবা ইমেইল দিয়ে
        </span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {isLogin ? (
          <motion.form
            key="login"
            noValidate
            onSubmit={loginForm.handleSubmit(onLoginSubmit)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <Input
              {...loginForm.register("email")}
              type="email"
              label="ইমেইল ঠিকানা"
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              leftIcon={<Mail size={16} />}
              error={loginForm.formState.errors.email?.message}
            />

            <div>
              <Input
                {...loginForm.register("password")}
                type={showPassword ? "text" : "password"}
                label="পাসওয়ার্ড"
                placeholder="••••••••"
                autoComplete="current-password"
                leftIcon={<Lock size={16} />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                error={loginForm.formState.errors.password?.message}
              />
              <div className="-mt-2 flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-semibold text-brand-600 transition-colors hover:text-brand-700 hover:underline"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>
            </div>

            <FormAlert message={formError} />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={emailLoading}
              disabled={googleLoading}
            >
              লগইন করুন
            </Button>
          </motion.form>
        ) : (
          <motion.form
            key="register"
            noValidate
            onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <Input
              {...registerForm.register("email")}
              type="email"
              label="ইমেইল ঠিকানা"
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              leftIcon={<Mail size={16} />}
              error={registerForm.formState.errors.email?.message}
            />

            <div>
              <Input
                {...registerForm.register("password")}
                type={showPassword ? "text" : "password"}
                label="পাসওয়ার্ড"
                placeholder="কমপক্ষে ৬ অক্ষর"
                autoComplete="new-password"
                leftIcon={<Lock size={16} />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                error={registerForm.formState.errors.password?.message}
              />
              <div className="mt-2.5">
                <PasswordMeter password={registerPassword ?? ""} />
              </div>
            </div>

            <Input
              {...registerForm.register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              label="পাসওয়ার্ড নিশ্চিত করুন"
              placeholder="আবার পাসওয়ার্ডটি লিখুন"
              autoComplete="new-password"
              leftIcon={<Lock size={16} />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirm((value) => !value)}
                  aria-label={
                    showConfirm ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              error={registerForm.formState.errors.confirmPassword?.message}
            />

            <FormAlert message={formError} />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={emailLoading}
              disabled={googleLoading}
            >
              অ্যাকাউন্ট তৈরি করুন
            </Button>

            <p className="text-center text-[11px] leading-5 text-slate-400">
              অ্যাকাউন্ট তৈরি করলে আপনার তথ্য শুধুমাত্র আপনার অ্যাকাউন্টের
              সাথে যুক্ত থাকবে।
            </p>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-[11px]">
        <span className="text-slate-400">
          {isLogin ? "অ্যাকাউন্ট নেই?" : "আগে থেকেই অ্যাকাউন্ট আছে?"}
        </span>
        <button
          type="button"
          onClick={() => switchMode(isLogin ? "register" : "login")}
          className="font-semibold text-brand-600 transition-colors hover:text-brand-700 hover:underline"
        >
          {isLogin ? "নতুন অ্যাকাউন্ট খুলুন" : "লগইন করুন"}
        </button>
      </div>
    </AuthShell>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-canvas">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
