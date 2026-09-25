import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Business Reviews Are Not Open Yet",
  description:
    "NepaliDirectory is not accepting public business reviews until identity, moderation and visible-review safeguards are complete.",
  path: "/write-review"
});

export default function WriteReviewLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
