import type { Metadata } from "next";
import { SeoLandingPageView } from "@/components/directory/SeoLandingPage";
import { siteUrl } from "@/lib/blog";
import { getLandingPage } from "@/lib/landing";
import { uniqueKeywords } from "@/lib/seo";

const page = getLandingPage("near-me")!;

export const metadata: Metadata = {
  title: page.seoTitle,
  description: page.description,
  keywords: uniqueKeywords([...page.keywords, ...page.quickLinks]),
  alternates: { canonical: page.href },
  openGraph: {
    title: page.seoTitle,
    description: page.description,
    url: `${siteUrl}${page.href}`,
    siteName: "Nepali Directory",
    locale: "en_US",
    type: "website",
    images: [{ url: page.image, width: 1200, height: 760, alt: page.imageAlt }]
  },
  twitter: {
    card: "summary_large_image",
    title: page.seoTitle,
    description: page.description,
    images: [page.image]
  }
};

export default function NearMePage() {
  return <SeoLandingPageView page={page} />;
}
