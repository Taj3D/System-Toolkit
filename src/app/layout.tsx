import type { Metadata } from "next";
import { Geist, Geist_Mono, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "System Toolkit - 115+ Professional Tools",
  description: "সম্পূর্ণ PC মেইনটেন্যান্স ও অপ্টিমাইজেশন সফটওয়্যার। ১১৫+ প্রফেশনাল টুল Windows, macOS, Linux, Android, iOS এ।",
  keywords: ["System Toolkit", "PC Optimization", "Windows Tools", "macOS Tools", "Linux Tools", "Android Tools", "iOS Tools"],
  authors: [{ name: "NextGen Digital Studio" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "System Toolkit - 115+ Professional Tools",
    description: "সম্পূর্ণ PC মেইনটেন্যান্স ও অপ্টিমাইজেশন সফটওয়্যার",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${hindSiliguri.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
