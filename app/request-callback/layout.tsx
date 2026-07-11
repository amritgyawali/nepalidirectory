import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Request a Business Support Callback",
  description:
    "Ask our support team to call you about a business listing, advertising options, account help or directory questions.",
  path: "/request-callback"
});

export default function RequestCallbackLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
