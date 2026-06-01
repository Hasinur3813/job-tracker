import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "চাকরি ট্র্যাকার - Chakri Tracker",
  description: "আপনার সব চাকরি আবেদন এক জায়গায় সংরক্ষণ এবং ট্র্যাক করুন",
  icons: [{ rel: "icon", url: "/job-tracker-logo.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="h-full">
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          {children}
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: "#ffffff",
                color: "#1f2937",
                fontFamily: "Hind Siliguri, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                boxShadow:
                  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                borderRadius: "12px",
                border: "1px solid #f3f4f6",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
