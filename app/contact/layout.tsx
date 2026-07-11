import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Contact Our Directory Team",
  description:
    "Contact our team for help with Nepal business listings, corrections, partnerships, advertising or directory support.",
  path: "/contact"
});

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
