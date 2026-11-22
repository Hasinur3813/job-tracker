import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ড্যাশবোর্ড",
  description:
    "আপনার সব চাকরির আবেদন, চলমান ডেডলাইন আর পরীক্ষার অগ্রগতি এক নজরে।",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
