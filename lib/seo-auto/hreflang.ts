import { siteUrl } from "@/lib/blog";

export function buildHreflangAlternates(path: string, hasNepaliVersion: boolean) {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  if (!hasNepaliVersion) {
    return { canonical: canonicalPath };
  }

  return {
    canonical: canonicalPath,
    languages: {
      en: `${siteUrl}${canonicalPath}`,
      ne: `${siteUrl}/ne${canonicalPath}`,
      "x-default": `${siteUrl}${canonicalPath}`,
    },
  };
}
