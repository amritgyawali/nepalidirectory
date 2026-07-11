import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Ask a Local Question About Nepal",
  description:
    "Ask practical questions about Nepal's businesses, restaurants, services, travel and city life and get local answers.",
  path: "/ask-question"
});

export default function AskQuestionLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
