import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "নতুন আবেদন",
  description:
    "নতুন চাকরির আবেদন যোগ করুন—প্রতিষ্ঠান, পদ, ডেডলাইন, বেতন ও পোর্টালের লগইন তথ্য একসঙ্গে।",
  robots: { index: false, follow: false },
};

export default function NewJobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
