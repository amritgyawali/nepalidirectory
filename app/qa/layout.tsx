import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Nepal Community Questions and Answers",
  description:
    "Browse practical community answers about Nepal's cities, travel, restaurants, healthcare, businesses and services.",
  path: "/qa"
});

export default function QALayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
