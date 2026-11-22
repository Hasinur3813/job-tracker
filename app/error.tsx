"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CircleAlert, Home, RotateCcw } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Logo } from "@/app/components/brand/Logo";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-4 py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-[22rem] w-[22rem] rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute inset-0 bg-grid-light opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="relative w-full max-w-md rounded-4xl border border-white/70 bg-white/90 p-8 text-center shadow-lift backdrop-blur-xl">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mx-auto mt-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <CircleAlert size={26} />
        </div>
        <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900">
          কিছু একটা ভুল হয়েছে
        </h1>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          অপ্রত্যাশিত একটি সমস্যা হয়েছে। আবার চেষ্টা করুন—সমস্যা থেকে গেলে
          হোমপেজে ফিরে যান।
        </p>

        <div className="mt-7 space-y-2.5">
          <Button variant="primary" fullWidth onClick={reset}>
            <RotateCcw size={15} />
            আবার চেষ্টা করুন
          </Button>
          <Link
            href="/"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-soft transition-all hover:border-slate-300 hover:text-slate-900"
          >
            <Home size={15} />
            হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
