import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { LazyAiAssistant } from "@/components/ai/LazyAiAssistant";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteUrl } from "@/lib/blog";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/seo";
import "@/components/layout/layout.css";
import "@/components/ui/ui.css";
import "@/components/directory/directory.css";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope"
});

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();
const bingSiteVerification = process.env.BING_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  applicationName: "Nepali Directory",
  title: {
    default: "Nepali Directory: Nepal Business Directory & Local Listings",
    template: "%s | Nepali Directory"
  },
  description:
    "Use Nepali Directory, Nepal's online business directory, to find local services, restaurants, hotels, hospitals, schools, shops and IT companies by city.",
  metadataBase: new URL(siteUrl),
  keywords: [
    "Nepali Directory",
    "Nepal business directory",
    "local businesses Nepal",
    "restaurants Nepal",
    "doctors Nepal",
    "hotels Nepal",
    "home services Nepal",
    "compare businesses Nepal"
  ],
  authors: [{ name: "Nepali Directory Editorial Team", url: "/authors" }],
  creator: "Nepali Directory",
  publisher: "Nepali Directory",
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
    siteName: "Nepali Directory",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/nepali-directory-og.png",
        width: 1729,
        height: 909,
        alt: "Nepali Directory — find trusted local businesses across Nepal"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepali Directory: Nepal Business Directory & Local Listings",
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
    <html lang="en" className={manrope.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        <Header />
        {children}
        <Footer />
        <LazyAiAssistant />
      </body>
    </html>
  );
}
