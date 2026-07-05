import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SearchExperience } from "@/components/search/SearchExperience";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Search Nepali Directory",
  description:
    "Search Nepali Directory for local businesses, restaurants, doctors, hotels and services across Nepal.",
  alternates: {
    canonical: routes.search
  },
  robots: {
    index: false,
    follow: true
  }
};

type SearchPageProps = {
  searchParams?: Promise<{
    q?: string;
    location?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = (await searchParams) ?? {};

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: routes.home },
          { label: "Search" }
        ]}
      />
      <SearchExperience initialQuery={params.q ?? ""} initialLocation={params.location ?? "Kathmandu, Bagmati"} />
    </>
  );
}
