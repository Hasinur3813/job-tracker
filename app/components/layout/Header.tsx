"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  LogIn,
  Briefcase,
  Menu,
  X,
  Compass,
  Home as HomeIcon,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import toast from "react-hot-toast";

export const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("লগআউট সফল হয়েছে ✓");
      router.push("/");
    } catch {
      toast.error("লগআউট করতে সমস্যা হয়েছে, আবার চেষ্টা করুন");
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navLinks = [
    { label: "হোম", path: "/", icon: <HomeIcon size={15} /> },
    {
      label: "ড্যাশবোর্ড",
      path: "/dashboard",
      icon: <LayoutDashboard size={15} />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer group">
          <div className="p-2.5 bg-linear-to-tr from-blue-600 to-indigo-600 text-white rounded-xl shadow-md shadow-blue-100 group-hover:scale-105 transition-transform">
            <Briefcase size={18} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-lg font-black text-gray-900 tracking-tight leading-none">
              চাকরি <span className="text-blue-600">ট্র্যাকার</span>
            </span>
            <span className="text-[10px] text-gray-400 font-mono tracking-widest font-semibold uppercase mt-0.5">
              Chakri Tracker
            </span>
          </div>
        </Link>

        {/* Mid Page Links - Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`
                  inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer
                  ${
                    active
                      ? "bg-blue-50 text-blue-700 shadow-xs"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }
                `}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => {
              if (pathname !== "/") {
                router.push("/");
                setTimeout(() => {
                  const el = document.getElementById("features-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              } else {
                const el = document.getElementById("features-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all cursor-pointer"
          >
            <Compass size={15} />
            <span>ফিচারসমূহ</span>
          </button>
        </nav>

        {/* Right Actions Block */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
              <div className="flex flex-col text-right text-sm">
                <span className="text-xs text-gray-500 font-sans">
                  লগইন করা আছেন
                </span>
                <span className="text-xs font-semibold text-gray-900 font-sans truncate">
                  {currentUser.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-900 rounded-lg text-sm font-semibold transition-all cursor-pointer"
              >
                <LogOut size={16} />
                <span>লগআউট</span>
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all"
            >
              <LogIn size={16} />
              <span>লগইন</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          {currentUser && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold transition-all"
            >
              <LogOut size={14} />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`
                    block px-4 py-2 rounded-lg text-sm font-semibold transition-all
                    ${
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            {!currentUser && (
              <Link
                href="/auth"
                className="block px-4 py-2 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                লগইন
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
