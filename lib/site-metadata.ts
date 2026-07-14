import type { Metadata } from "next";
import { siteUrl } from "@/lib/blog";
import { noIndexRoutes } from "@/lib/seo-config";

type PublicPageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

/** Complete metadata graph for public pages so social tags never fall back to homepage content. */
export function buildPublicPageMetadata({
  title,
  description,
  path,
  image = "/nepali-directory-og.png",
}: PublicPageMetadataInput): Metadata {
  const url = new URL(path, `${siteUrl}/`).toString();
  const socialTitle = `${title} | Nepali Directory`;
  const indexable = !noIndexRoutes.has(path);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: "Nepali Directory",
      locale: "en_US",
      type: "website",
      images: [{ url: image, width: 1729, height: 909, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image],
    },
    robots: indexable
      ? undefined
      : {
          index: false,
          follow: true,
          googleBot: { index: false, follow: true },
        },
  };
}
