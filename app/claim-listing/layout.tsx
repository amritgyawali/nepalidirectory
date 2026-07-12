import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Free Nepal Business Listing: Add or Claim a Business",
  description:
    "Add a free Nepal business listing or claim an existing profile. Submit accurate company, service, contact and location details for review.",
  path: "/claim-listing"
});

export default function ClaimListingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
