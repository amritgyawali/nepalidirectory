import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Events and Festivals Across Nepal",
  description:
    "Find community events, festivals, workshops, food experiences and neighborhood activities happening across Nepal.",
  path: "/events"
});

export default function EventsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
