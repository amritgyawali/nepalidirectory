import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Local Deals and Offers in Nepal",
  description:
    "Discover current coupons, discounts and special offers from verified restaurants, hotels and local businesses in Nepal.",
  path: "/deals"
});

export default function DealsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
