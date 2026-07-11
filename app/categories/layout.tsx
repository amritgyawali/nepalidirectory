import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Nepal Business Categories",
  description:
    "Browse local businesses and service providers by category, from restaurants and hotels to healthcare and home services.",
  path: "/categories"
});

export default function CategoriesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
