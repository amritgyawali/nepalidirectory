import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Nepal Q&A Topics and Community Guides",
  description:
    "Browse community question topics covering travel, dining, home services, healthcare and everyday life in Nepal.",
  path: "/qa/community"
});

export default function QACommunityLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
