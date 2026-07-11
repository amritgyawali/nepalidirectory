import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Claim or Add Your Business Listing",
  description:
    "Add your Nepal business to the directory or claim its profile to publish accurate contact, service and location details.",
  path: "/claim-listing"
});

export default function ClaimListingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
