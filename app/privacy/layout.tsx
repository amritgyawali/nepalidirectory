import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Privacy Policy",
  description:
    "Read how we collect, use, protect and manage personal information when you browse or contribute to the directory.",
  path: "/privacy"
});

export default function PrivacyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
