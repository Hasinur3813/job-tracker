import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "আবেদনের বিস্তারিত",
  description:
    "চাকরির আবেদনের সম্পূর্ণ তথ্য, ডেডলাইন, স্ট্যাটাস ও পোর্টাল লগইন বিবরণ।",
  robots: { index: false, follow: false },
};

export default function JobDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
