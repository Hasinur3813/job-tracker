import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "আবেদন সম্পাদনা",
  description: "চাকরির আবেদনের তথ্য, ডেডলাইন ও স্ট্যাটাস হালনাগাদ করুন।",
  robots: { index: false, follow: false },
};

export default function EditJobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
