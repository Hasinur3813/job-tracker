import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "পাসওয়ার্ড রিসেট",
  description:
    "ইমেইল ঠিকানা দিয়ে পাসওয়ার্ড রিসেট লিঙ্ক পাঠান এবং অ্যাকাউন্টে আবার প্রবেশ করুন।",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
