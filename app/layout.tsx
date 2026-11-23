import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: "চাকরি ট্র্যাকার — আপনার ক্যারিয়ার, গোছানো",
    template: "%s · চাকরি ট্র্যাকার",
  },
  description:
    "সরকারি ও বেসরকারি চাকরির আবেদন, ডেডলাইন, পরীক্ষার স্ট্যাটাস, লগইন তথ্য ও নোট — সব এক জায়গায় নিরাপদে ট্র্যাক করুন।",
  applicationName: "চাকরি ট্র্যাকার",
  keywords: [
    "চাকরি ট্র্যাকার",
    "চাকরির আবেদন",
    "সরকারি চাকরি",
    "চাকরি ট্র্যাকিং",
    "job tracker bangladesh",
    "chakri tracker",
  ],
  authors: [{ name: "Chakri Tracker" }],
  openGraph: {
    type: "website",
    locale: "bn_BD",
    siteName: "চাকরি ট্র্যাকার",
    title: "চাকরি ট্র্যাকার — আপনার ক্যারিয়ার, গোছানো",
    description:
      "প্রতিটি চাকরির আবেদন, ডেডলাইন ও অগ্রগতি এক জায়গায়। Google দিয়ে সাইন ইন করে আজই শুরু করুন।",
  },
  twitter: {
    card: "summary_large_image",
    title: "চাকরি ট্র্যাকার — আপনার ক্যারিয়ার, গোছানো",
    description:
      "প্রতিটি চাকরির আবেদন, ডেডলাইন ও অগ্রগতি এক জায়গায় ট্র্যাক করুন।",
  },
  icons: [
    { rel: "icon", url: "/job-tracker-logo.ico" },
    { rel: "apple-touch-icon", url: "/job-tracker-logo.png" },
  ],
};

export const viewport: Viewport = {
  themeColor: "#5b3df5",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      data-scroll-behavior="smooth"
      className={`h-full ${hindSiliguri.variable} ${jetbrainsMono.variable}`}
    >
      {/* Grammarly and similar extensions inject attributes into <body>. */}
      <body
        className="min-h-full flex flex-col font-sans antialiased"
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={10}
            toastOptions={{
              duration: 3200,
              style: {
                background: "rgba(255, 255, 255, 0.97)",
                color: "#17142b",
                fontFamily:
                  "var(--font-hind-siliguri), ui-sans-serif, system-ui, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                padding: "12px 16px",
                boxShadow:
                  "0 2px 4px rgba(23,20,64,0.04), 0 24px 48px -20px rgba(23,20,64,0.24)",
                borderRadius: "14px",
                border: "1px solid rgba(23, 20, 64, 0.08)",
                backdropFilter: "blur(12px)",
              },
              success: {
                iconTheme: { primary: "#16a34a", secondary: "#ffffff" },
              },
              error: {
                iconTheme: { primary: "#e11d48", secondary: "#ffffff" },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
