import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Advertise Your Business in Nepal",
  description:
    "Reach customers searching for local businesses, services and places across Nepal with targeted directory advertising.",
  path: "/advertise"
});

export default function AdvertiseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
