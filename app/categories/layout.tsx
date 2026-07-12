import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Nepal Services Directory: Browse Business Categories",
  description:
    "Browse Nepal's services directory by business category, from restaurants, hotels and shops to healthcare, schools, IT companies and home services.",
  path: "/categories"
});

export default function CategoriesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
