import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Business Listing Plans and Pricing",
  description:
    "Compare directory listing and advertising plans designed to help Nepal businesses improve local visibility and leads.",
  path: "/pricing"
});

export default function PricingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
