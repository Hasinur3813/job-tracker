import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "চাকরি ট্র্যাকার — Chakri Tracker",
    short_name: "চাকরি ট্র্যাকার",
    description:
      "সরকারি ও বেসরকারি চাকরির আবেদন, ডেডলাইন, স্ট্যাটাস ও লগইন তথ্য এক জায়গায় ট্র্যাক করুন।",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f7fb",
    theme_color: "#5b3df5",
    lang: "bn",
    icons: [
      {
        src: "/job-tracker-logo.png",
        sizes: "500x500",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/job-tracker-logo-raw.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
