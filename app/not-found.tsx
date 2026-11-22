import Link from "next/link";
import { ArrowLeft, Compass, Home } from "lucide-react";
import { Logo } from "@/app/components/brand/Logo";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-4 py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-brand-200/50 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-[22rem] w-[22rem] rounded-full bg-accent-200/40 blur-3xl" />
        <div className="absolute inset-0 bg-grid-light opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="relative w-full max-w-md rounded-4xl border border-white/70 bg-white/90 p-8 text-center shadow-lift backdrop-blur-xl">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mx-auto mt-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Compass size={26} />
        </div>
        <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand-600">
          404 · Not Found
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
          পাতাটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          লিঙ্কটি ভুল হতে পারে, অথবা পেজটি সরিয়ে ফেলা হয়েছে। ড্যাশবোর্ড থেকে
          আবার শুরু করুন।
        </p>

        <div className="mt-7 space-y-2.5">
          <Link
            href="/"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-brand-700"
          >
            <Home size={15} />
            হোমপেজে ফিরে যান
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-soft transition-all hover:border-slate-300 hover:text-slate-900"
          >
            <ArrowLeft size={15} />
            ড্যাশবোর্ডে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
