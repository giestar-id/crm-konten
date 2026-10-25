import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Social Post Hub — Multi-Platform Posting & Content CRM",
  description: "Universal 1-click multi-platform posting to YouTube, Instagram, TikTok & Facebook with integrated content CRM, scheduling, and analytics.",
  other: {
    "tiktok-developers-site-verification": "aY5fZn3JAkUQIQtc5HFLFc48ZGF45c1R",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="font-sans min-h-full flex flex-col bg-white text-[#171717] antialiased">
        {children}
      </body>
    </html>
  );
}
