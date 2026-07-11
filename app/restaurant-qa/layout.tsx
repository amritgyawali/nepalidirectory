import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Nepal Restaurant Questions and Answers",
  description:
    "Get community answers about Nepal restaurants, menus, reservations, group dining, dietary needs and local recommendations.",
  path: "/restaurant-qa"
});

export default function RestaurantQALayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
