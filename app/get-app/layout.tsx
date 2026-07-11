import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Nepal Local Search Mobile App",
  description:
    "Use the mobile app to find Nepal businesses, compare reviews, save listings, open maps and contact services on the go.",
  path: "/get-app"
});

export default function GetAppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
