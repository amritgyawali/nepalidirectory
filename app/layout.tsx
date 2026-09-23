import type { Metadata, Viewport } from "next";
import { Anek_Latin, Manrope } from "next/font/google";
import { LazyAiAssistant } from "@/components/ai/LazyAiAssistant";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { siteUrl } from "@/lib/blog";
import { buildOrganizationJsonLd, buildWebSiteJsonLd, serializeJsonLd } from "@/lib/seo";
import "@/components/layout/layout.css";
import "@/components/ui/ui.css";
import "@/components/directory/directory.css";
import "./globals.css";
import "./theme.css";
import "./mobile.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope"
});

const anekLatin = Anek_Latin({
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth"],
  variable: "--font-anek"
});

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();
const bingSiteVerification = process.env.BING_SITE_VERIFICATION?.trim();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f1c2e"
};

export const metadata: Metadata = {
  applicationName: "NepaliDirectory",
  title: {
    default: "Nepali Directory: Nepal Business Directory & Local Listings",
    template: "%s | Nepali Directory"
  },
  description:
    "Use NepaliDirectory, Nepal's online business directory, to find local services, restaurants, hotels, hospitals, schools, shops and IT companies by city.",
  metadataBase: new URL(siteUrl),
  authors: [{ name: "NepaliDirectory Editorial Team", url: "/authors" }],
  creator: "NepaliDirectory",
  publisher: "NepaliDirectory",
  category: "Local business directory",
  classification: "Local search, business directory, Nepal city guides",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  },
  openGraph: {
    title: "Nepali Directory: Nepal Business Directory & Local Listings",
    description:
      "Find businesses and local services across Nepal by category and city.",
    url: siteUrl,
    siteName: "NepaliDirectory",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/nepali-directory-og.png",
        width: 1729,
        height: 909,
        alt: "NepaliDirectory — find local businesses across Nepal"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "NepaliDirectory: Nepal Business Directory & Local Listings",
    description:
      "Find businesses and local services across Nepal by category and city.",
    images: ["/nepali-directory-og.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: false
  },
  appleWebApp: {
    capable: true,
    title: "NepaliDirectory",
    statusBarStyle: "default"
  },
  verification: {
    ...(googleSiteVerification ? { google: googleSiteVerification } : {}),
    ...(bingSiteVerification
      ? { other: { "msvalidate.01": bingSiteVerification } }
      : {}),
  },
  other: {
    "content-language": "en",
    "geo.region": "NP",
    "geo.placename": "Nepal",
    "ai-content-declaration": "human-reviewed local directory and guide content"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const siteJsonLd = [buildOrganizationJsonLd(), buildWebSiteJsonLd()];

  return (
    <html lang="en" className={`${manrope.variable} ${anekLatin.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical third-party origins for faster LCP / font loads */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        {/* DNS-prefetch for Supabase (non-blocking, benefits API calls) */}
        <link rel="dns-prefetch" href="https://tiles.openfreemap.org" />
        {/* Machine-readable pointers for AI platforms */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM context guide" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLM full context" />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteJsonLd) }} />
        <Header />
        {children}
        <Footer />
        <MobileTabBar />
        <LazyAiAssistant />
      </body>
    </html>
  );
}
