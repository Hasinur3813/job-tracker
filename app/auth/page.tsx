"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "ইমেইল প্রবেশ করান")
    .email("সঠিক ইমেইল ঠিকানা প্রদান করুন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"),
});

const registerSchema = z
  .object({
    email: z
      .string()
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

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const {
    login,
    register,
    currentUser,
    loading: authStatusLoading,
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser && !authStatusLoading) {
      router.replace("/");
    }
  }, [currentUser, authStatusLoading, router]);

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onLoginSubmit = async (data: LoginInput) => {
    setAuthLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("সফলভাবে লগইন করা হয়েছে ✓");
      router.push("/");
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "লগইন ব্যর্থ হয়েছে";
      toast.error(errMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterInput) => {
    setAuthLoading(true);
    try {
      await register(data.email, data.password);
      toast.success("অ্যাকাউন্ট তৈরি সফল হয়েছে! ✓");
      router.push("/");
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "অ্যাকাউন্ট তৈরি ব্যর্থ হয়েছে";
      toast.error(errMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 bg-linear-to-tr from-blue-600 to-indigo-600 text-white rounded-xl mb-4">
              <Briefcase size={24} />
            </div>
            <h1 className="text-2xl font-black text-gray-900">
              চাকরি ট্র্যাকার
            </h1>
            <p className="text-xs text-gray-400 mt-1">Chakri Tracker</p>
          </div>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  লগইন করুন
                </h2>

                <Input
                  {...loginForm.register("email")}
                  type="email"
                  label="ইমেইল ঠিকানা"
                  placeholder="your@email.com"
                  error={loginForm.formState.errors.email?.message}
                />

                <Input
                  {...loginForm.register("password")}
                  type="password"
                  label="পাসওয়ার্ড"
                  placeholder="••••••••"
                  error={loginForm.formState.errors.password?.message}
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={authLoading}
                  className="mt-6"
                >
                  {authLoading ? "চলছে..." : "লগইন করুন"}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">অথবা</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  নতুন অ্যাকাউন্ট তৈরি করুন
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  অ্যাকাউন্ট তৈরি করুন
                </h2>

                <Input
                  {...registerForm.register("email")}
                  type="email"
                  label="ইমেইল ঠিকানা"
                  placeholder="your@email.com"
                  error={registerForm.formState.errors.email?.message}
                />

                <Input
                  {...registerForm.register("password")}
                  type="password"
                  label="পাসওয়ার্ড"
                  placeholder="••••••••"
                  error={registerForm.formState.errors.password?.message}
                />

                <Input
                  {...registerForm.register("confirmPassword")}
                  type="password"
                  label="পাসওয়ার্ড নিশ্চিত করুন"
                  placeholder="••••••••"
                  error={registerForm.formState.errors.confirmPassword?.message}
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={authLoading}
                  className="mt-6"
                >
                  {authLoading ? "চলছে..." : "অ্যাকাউন্ট তৈরি করুন"}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">অথবা</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  আগে থেকেই অ্যাকাউন্ট আছে? লগইন করুন
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <Link
            href="/"
            className="block text-center text-xs text-gray-400 hover:text-gray-600 mt-6 font-medium"
          >
            হোমপেজে ফিরে যান
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
