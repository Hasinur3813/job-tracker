"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import {
  ChevronDown,
  Compass,
  Home as HomeIcon,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Plus,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { Logo } from "@/app/components/brand/Logo";

function UserAvatar({
  user,
  className = "h-9 w-9",
}: {
  user: User;
  className?: string;
}) {
  const initial = (user.displayName?.trim() || user.email || "?")
    .charAt(0)
    .toUpperCase();

  if (user.photoURL) {
    return (
      <span
        className={`${className} shrink-0 rounded-full bg-cover bg-center ring-1 ring-slate-200`}
        style={{ backgroundImage: `url("${user.photoURL}")` }}
        aria-hidden="true"
      />
    );
  }

  return (
    <span
      className={`${className} flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-500 to-brand-700 text-sm font-bold text-white ring-1 ring-brand-200`}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

export const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accountOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [accountOpen]);

  const handleLogout = async () => {
    setAccountOpen(false);
    setMobileMenuOpen(false);
    try {
      await logout();
      toast.success("লগআউট সফল হয়েছে ✓");
      router.replace("/");
    } catch {
      toast.error("লগআউট করতে সমস্যা হয়েছে, আবার চেষ্টা করুন");
    }
  };

  const navLinks = [
    { label: "হোম", path: "/", icon: <HomeIcon size={15} /> },
    ...(currentUser
      ? [
          {
            label: "ড্যাশবোর্ড",
            path: "/dashboard",
            icon: <LayoutDashboard size={15} />,
          },
        ]
      : []),
  ];

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const accountName = currentUser?.displayName?.trim();
  const accountPrimary =
    accountName || currentUser?.email || "আমার অ্যাকাউন্ট";
  const accountSecondary = accountName ? currentUser?.email : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-900/5 bg-white/80 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand-400/60 to-transparent" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo size="md" />

        <nav className="hidden items-center gap-1 md:flex" aria-label="প্রধান নেভিগেশন">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-all ${
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}

          <Link
            href="/#features-section"
            className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-semibold text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900"
          >
            <Compass size={15} />
            <span>ফিচারসমূহ</span>
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {currentUser ? (
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                aria-label="অ্যাকাউন্ট মেনু"
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-2.5 shadow-soft transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                <UserAvatar user={currentUser} />
                <span className="flex max-w-[150px] flex-col text-left leading-tight">
                  <span className="truncate text-xs font-semibold text-slate-800">
                    {accountPrimary}
                  </span>
                  {accountSecondary && (
                    <span className="truncate text-[10px] text-slate-400">
                      {accountSecondary}
                    </span>
                  )}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform ${
                    accountOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-lift animate-fade-in"
                >
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50/80 p-3">
                    <UserAvatar user={currentUser} className="h-10 w-10" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-900">
                        {accountPrimary}
                      </p>
                      {accountSecondary && (
                        <p className="truncate text-[11px] text-slate-400">
                          {accountSecondary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-1.5 space-y-0.5">
                    <Link
                      href="/dashboard"
                      role="menuitem"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    >
                      <LayoutDashboard size={15} className="text-slate-400" />
                      আমার ড্যাশবোর্ড
                    </Link>
                    <Link
                      href="/job/new"
                      role="menuitem"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Plus size={15} className="text-slate-400" />
                      নতুন আবেদন যোগ করুন
                    </Link>
                  </div>

                  <div className="mt-1.5 border-t border-slate-100 pt-1.5">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                    >
                      <LogOut size={15} />
                      লগআউট
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgba(91,61,245,0.9)] transition-all hover:bg-brand-700"
            >
              <LogIn size={16} />
              <span>লগইন করুন</span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {!currentUser && (
            <Link
              href="/auth"
              className="rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white shadow-glow"
            >
              লগইন
            </Link>
          )}
          {currentUser && <UserAvatar user={currentUser} className="h-8 w-8" />}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-soft"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-slate-100 bg-white/95 px-4 pb-5 pt-3 shadow-lg animate-fade-in md:hidden"
        >
          <nav className="space-y-1" aria-label="মোবাইল নেভিগেশন">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/#features-section"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              <Compass size={15} />
              ফিচারসমূহ
            </Link>
          </nav>

          <div className="mt-4 border-t border-slate-100 pt-4">
            {currentUser ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                  <UserAvatar user={currentUser} className="h-10 w-10" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {accountPrimary}
                    </p>
                    {accountSecondary && (
                      <p className="truncate text-xs text-slate-400">
                        {accountSecondary}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/job/new"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2.5 text-xs font-semibold text-white shadow-glow"
                  >
                    <Plus size={14} />
                    নতুন আবেদন
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-600"
                  >
                    <LogOut size={14} />
                    লগআউট
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-glow"
              >
                <LogIn size={16} />
                লগইন করুন
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
