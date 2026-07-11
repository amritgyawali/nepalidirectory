import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Business Map and Directions in Nepal",
  description:
    "Explore local businesses on the map, compare nearby locations and open listing details for directions across Nepal.",
  path: "/map"
});

export default function MapLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
