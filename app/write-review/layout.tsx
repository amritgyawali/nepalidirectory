import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Write a Business Review in Nepal",
  description:
    "Share a fair, detailed review of a Nepal business or service to help local customers make informed choices.",
  path: "/write-review"
});

export default function WriteReviewLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
