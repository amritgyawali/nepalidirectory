import type { MetadataRoute } from "next";
import { allSitemapEntries } from "@/lib/seo-auto";

export default function sitemap(): MetadataRoute.Sitemap {
  return allSitemapEntries();
}
