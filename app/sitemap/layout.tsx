import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Directory HTML Sitemap",
  description:
    "Browse the main business directory, city, category, comparison, author and local guide pages from one index.",
  path: "/sitemap"
});

export default function SitemapLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
