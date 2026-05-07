import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Hind_Siliguri, Noto_Sans_Bengali } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SITE_URL, FB_PIXEL_ID } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ─── Premium Bengali Fonts (optimized weights) ─── */
const hindSiliguri = Hind_Siliguri({
  variable: "--font-bangla",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-bangla-body",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "সবজান্তা সাপ্লাইয়ার – মুদি, ইলেকট্রনিক্স (কিস্তি), ফ্যাশন ও ডিজিটাল সার্ভিস",
  description:
    "চাল ডাল তেল মাছ মাংস সবজি থেকে শুরু করে টিভি ফ্রিজ AC ফোন — সব কিস্তিতে পান। ক্যাশ অন ডেলিভারি ও ২৪/৭ হোয়াটসঅ্যাপ সাপোর্ট। সারা বাংলাদেশ ডেলিভারি।",
  keywords: [
    "সবজান্তা", "বাসমতী চাল", "পাকিস্তানি চাল", "কিস্তিতে ইলেকট্রনিক্স",
    "অনলাইন শপ", "টিভি কিস্তি", "ফ্রিজ কিস্তি", "মাছ মাংস ডেলিভারি",
    "সবজি অনলাইন", "EMI ইলেকট্রনিক্স", "বাংলাদেশ শপিং",
  ],
  icons: {
    icon: "/images/logo.webp",
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "সবজান্তা সাপ্লাইয়ার – বিশ্বস্ত মাল্টি-ক্যাটাগরি অনলাইন শপ",
    description: "মুদি পণ্য, ইলেকট্রনিক্স (কিস্তিতে), ফ্যাশন ও ডিজিটাল সার্ভিস। সারা বাংলাদেশ ডেলিভারি।",
    type: "website",
    url: SITE_URL,
    siteName: "সবজান্তা সাপ্লাইয়ার",
    images: [{ url: "/images/rice-jar.webp", width: 1200, height: 630, alt: "সবজান্তা সাপ্লাইয়ার" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "সবজান্তা সাপ্লাইয়ার",
    description: "মুদি পণ্য, ইলেকট্রনিক্স কিস্তিতে, ফ্যাশন ও ডিজিটাল সার্ভিস।",
    images: ["/images/rice-jar.webp"],
  },
  other: {
    "theme-color": "#2c7a47",
  },
};

/* ─── Facebook Pixel Component ─── */
function FacebookPixel() {
  return (
    <>
      <Script id="fb-pixel-init" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${FB_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

/* ─── Schema.org Structured Data ─── */
function SchemaMarkup() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "সবজান্তা সাপ্লাইয়ার",
    description: "মুদি পণ্য, ইলেকট্রনিক্স (কিস্তিতে), ফ্যাশন ও ডিজিটাল সার্ভিস",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.webp`,
    image: `${SITE_URL}/images/rice-jar.webp`,
    telephone: "+8801711731354",
    address: {
      "@type": "PostalAddress",
      addressLocality: "যশোর",
      addressCountry: "BD",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+8801711731354",
      contactType: "Customer Service",
      availableLanguage: "bn",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "214",
    },
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Product",
          name: "প্রিমিয়াম পাকিস্তানি বাসমতী চাল (৩ কেজি জার)",
          image: `${SITE_URL}/images/rice-jar.webp`,
          description: "খাঁটি পাকিস্তানি বাসমতী চাল, এয়ারটাইট জারে ৩ কেজি",
          brand: { "@type": "Brand", name: "সবজান্তা সাপ্লাইয়ার" },
          offers: { "@type": "Offer", price: "1250", priceCurrency: "BDT", availability: "https://schema.org/InStock" },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Product",
          name: "খাঁটি ডাল ও সরিষার তেল প্যাকেজ",
          image: `${SITE_URL}/images/dal-oil.webp`,
          description: "খাঁটি ডাল ও সরিষার তেল কম্বো প্যাকেজ",
          brand: { "@type": "Brand", name: "সবজান্তা সাপ্লাইয়ার" },
          offers: { "@type": "Offer", price: "850", priceCurrency: "BDT", availability: "https://schema.org/InStock" },
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Product",
          name: "সতেজ ইলিশ মাছ (১ কেজি)",
          image: `${SITE_URL}/images/fish.webp`,
          description: "সতেজ ইলিশ মাছ হোম ডেলিভারি",
          brand: { "@type": "Brand", name: "সবজান্তা সাপ্লাইয়ার" },
          offers: { "@type": "Offer", price: "1400", priceCurrency: "BDT", availability: "https://schema.org/InStock" },
        },
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "Product",
          name: "সতেজ গরুর মাংস (১ কেজি)",
          image: `${SITE_URL}/images/meat.webp`,
          description: "সতেজ গরুর মাংস হোম ডেলিভারি",
          brand: { "@type": "Brand", name: "সবজান্তা সাপ্লাইয়ার" },
          offers: { "@type": "Offer", price: "750", priceCurrency: "BDT", availability: "https://schema.org/InStock" },
        },
      },
      {
        "@type": "ListItem",
        position: 5,
        item: {
          "@type": "Product",
          name: "তাজা সবজি বাস্কেট (মিশ্র ৩ কেজি)",
          image: `${SITE_URL}/images/vegetables.webp`,
          description: "তাজা মিশ্র সবজি বাস্কেট ৩ কেজি",
          brand: { "@type": "Brand", name: "সবজান্তা সাপ্লাইয়ার" },
          offers: { "@type": "Offer", price: "350", priceCurrency: "BDT", availability: "https://schema.org/InStock" },
        },
      },
      {
        "@type": "ListItem",
        position: 6,
        item: {
          "@type": "Product",
          name: '৪৩" স্মার্ট টিভি',
          image: `${SITE_URL}/images/smart-tv.webp`,
          description: "৪৩ ইঞ্চি স্মার্ট টিভি - কিস্তিতে পাওয়া যায়",
          brand: { "@type": "Brand", name: "সবজান্তা সাপ্লাইয়ার" },
          offers: { "@type": "Offer", price: "37999", priceCurrency: "BDT", availability: "https://schema.org/InStock" },
        },
      },
      {
        "@type": "ListItem",
        position: 7,
        item: {
          "@type": "Product",
          name: "ডাবল ডোর ফ্রিজ (২৬০ লিটার)",
          image: `${SITE_URL}/images/fridge.webp`,
          description: "ডাবল ডোর ফ্রিজ - কিস্তিতে পাওয়া যায়",
          brand: { "@type": "Brand", name: "সবজান্তা সাপ্লাইয়ার" },
          offers: { "@type": "Offer", price: "42999", priceCurrency: "BDT", availability: "https://schema.org/InStock" },
        },
      },
      {
        "@type": "ListItem",
        position: 8,
        item: {
          "@type": "Product",
          name: "১.৫ টন স্প্লিট AC",
          image: `${SITE_URL}/images/ac.webp`,
          description: "১.৫ টন স্প্লিট AC - কিস্তিতে পাওয়া যায়",
          brand: { "@type": "Brand", name: "সবজান্তা সাপ্লাইয়ার" },
          offers: { "@type": "Offer", price: "48999", priceCurrency: "BDT", availability: "https://schema.org/InStock" },
        },
      },
      {
        "@type": "ListItem",
        position: 9,
        item: {
          "@type": "Product",
          name: "এয়ার কুলার (টাওয়ার ফ্যান)",
          image: `${SITE_URL}/images/air-cooler.webp`,
          description: "এয়ার কুলার টাওয়ার ফ্যান - কিস্তিতে পাওয়া যায়",
          brand: { "@type": "Brand", name: "সবজান্তা সাপ্লাইয়ার" },
          offers: { "@type": "Offer", price: "8999", priceCurrency: "BDT", availability: "https://schema.org/InStock" },
        },
      },
      {
        "@type": "ListItem",
        position: 10,
        item: {
          "@type": "Product",
          name: "স্মার্টফোন (৪GB RAM, 128GB)",
          image: `${SITE_URL}/images/phone.webp`,
          description: "স্মার্টফোন ৪GB RAM 128GB - কিস্তিতে পাওয়া যায়",
          brand: { "@type": "Brand", name: "সবজান্তা সাপ্লাইয়ার" },
          offers: { "@type": "Offer", price: "12999", priceCurrency: "BDT", availability: "https://schema.org/InStock" },
        },
      },
      {
        "@type": "ListItem",
        position: 11,
        item: {
          "@type": "Product",
          name: "ঈদ কালেকশন শাড়ি",
          image: `${SITE_URL}/images/saree.webp`,
          description: "ঈদ কালেকশন শাড়ি - ক্যাশ অন ডেলিভারি",
          brand: { "@type": "Brand", name: "সবজান্তা সাপ্লাইয়ার" },
          offers: { "@type": "Offer", price: "2190", priceCurrency: "BDT", availability: "https://schema.org/InStock" },
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#2c7a47" />
        <SchemaMarkup />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${hindSiliguri.variable} ${notoSansBengali.variable} antialiased bg-background text-foreground`}
      >
        <FacebookPixel />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
