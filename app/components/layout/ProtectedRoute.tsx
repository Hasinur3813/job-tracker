"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !currentUser) {
      const next = pathname && pathname !== "/" ? pathname : "/dashboard";
      router.replace(`/auth?next=${encodeURIComponent(next)}`);
    }
  }, [currentUser, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-canvas">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <span className="absolute inset-0 rounded-full border-4 border-brand-100" />
          <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-brand-600" />
        </div>
        <p className="mt-4 text-sm font-medium text-slate-500">
          আপনার ড্যাশবোর্ড প্রস্তুত হচ্ছে...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return children;
};
