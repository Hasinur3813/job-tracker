import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "লগইন ও রেজিস্ট্রেশন",
  description:
    "Google অথবা ইমেইল দিয়ে চাকরি ট্র্যাকার অ্যাকাউন্টে প্রবেশ করুন—আপনার সব আবেদন, ডেডলাইন ও অগ্রগতি এক জায়গায়।",
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
