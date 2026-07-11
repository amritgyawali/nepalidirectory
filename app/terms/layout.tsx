import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Terms of Use",
  description:
    "Review the terms that apply when using our Nepal business directory, submitting content or managing a listing.",
  path: "/terms"
});

export default function TermsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
