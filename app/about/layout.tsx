import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "About Nepal's Local Business Directory",
  description:
    "Learn how our Nepal-wide directory helps people discover reliable local businesses, services and practical city information.",
  path: "/about"
});

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
