import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "সবজান্তা সাপ্লাইয়ার – প্রিমিয়াম পাকিস্তানি বাসমতী, ইলেকট্রনিক্স ও ডিজিটাল সার্ভিস",
  description:
    "সেরা দামে পাকিস্তানি বাসমতী চাল (৩ কেজি ১২৫০ টাকা), টিভি, ফ্রিজ, শাড়ি ও ডিজিটাল সার্ভিস। ক্যাশ অন ডেলিভারি ও ২৪/৭ হোয়াটসঅ্যাপ সাপোর্ট।",
  keywords: ["সবজান্তা", "বাসমতী চাল", "পাকিস্তানি চাল", "অনলাইন শপ", "ইলেকট্রনিক্স"],
  icons: {
    icon: "/images/logo.png",
  },
  openGraph: {
    title: "সবজান্তা সাপ্লাইয়ার – বিশ্বস্ত অনলাইন শপিং গন্তব্য",
    description: "প্রিমিয়াম পাকিস্তানি বাসমতী ৩ কেজি ১২৫০ টাকা। অর্ডার করুন দ্রুত।",
    type: "website",
    siteName: "সবজান্তা সাপ্লাইয়ার",
  },
  twitter: {
    card: "summary_large_image",
    title: "সবজান্তা সাপ্লাইয়ার",
    description: "প্রিমিয়াম পাকিস্তানি বাসমতী ৩ কেজি ১২৫০ টাকা। অর্ডার করুন দ্রুত।",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
