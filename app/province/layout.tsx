import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Bagmati Province Business Directory",
  description:
    "Find businesses and local services across Kathmandu, Lalitpur, Bhaktapur and other communities in Bagmati Province.",
  path: "/province"
});

export default function ProvinceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
