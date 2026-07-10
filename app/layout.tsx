import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { AiAssistant } from "@/components/ai/AiAssistant";
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

export const metadata: Metadata = {
  applicationName: "Nepali Directory",
  title: {
    default: "Nepali Directory | Nepal's trusted local business directory",
    template: "%s | Nepali Directory"
  },
  description:
    "Find verified local businesses, restaurants, doctors, hotels, services and city guides across Nepal.",
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
    title: "Nepali Directory | Nepal's trusted local business directory",
    description:
      "Find verified local businesses, restaurants, doctors, hotels, services and city guides across Nepal.",
    url: siteUrl,
    siteName: "Nepali Directory",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo.svg",
        width: 512,
        height: 512,
        alt: "Nepali Directory logo"
      }
    ]
  },
  twitter: {
    card: "summary",
    title: "Nepali Directory",
    description:
      "Find verified local businesses, restaurants, doctors, hotels, services and city guides across Nepal.",
    images: ["/logo.svg"]
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
        <AiAssistant />
      </body>
    </html>
  );
}
