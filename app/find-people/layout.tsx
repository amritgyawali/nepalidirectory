import { buildPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPublicPageMetadata({
  title: "Find Professionals and Service Providers in Nepal",
  description:
    "Search public profiles for professionals, specialists, business contacts and local service providers throughout Nepal.",
  path: "/find-people"
});

export default function FindPeopleLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
