import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Business Directory Help Center",
  description:
    "Get help searching the directory, managing a business listing, writing reviews, using maps or contacting support.",
  path: "/help"
});

export default function HelpLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
