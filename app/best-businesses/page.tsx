import type { Metadata } from "next";
import { SeoLandingPageView } from "@/components/directory/SeoLandingPage";
import { siteUrl } from "@/lib/blog";
import { getLandingPage } from "@/lib/landing";

const page = getLandingPage("best-businesses")!;

export const metadata: Metadata = {
  title: page.seoTitle,
  description: page.description,
  alternates: { canonical: page.href },
  robots: { index: false, follow: true },
  openGraph: {
    title: page.seoTitle,
    description: page.description,
    url: `${siteUrl}${page.href}`,
    siteName: "NepaliDirectory",
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

export default function BestBusinessesPage() {
  return <SeoLandingPageView page={page} />;
}
