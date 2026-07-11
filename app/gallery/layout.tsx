import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/noindex";

export const metadata: Metadata = {
  ...noIndexMetadata,
  title: "Business Photo Gallery",
  description:
    "Explore and manage photos that help customers understand a business, its location, products, services and atmosphere.",
};

export default function GalleryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
