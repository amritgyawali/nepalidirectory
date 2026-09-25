import { unstable_cache } from "next/cache";
import { cityDirectoryPages, type CityDirectoryPage } from "@/lib/city-pages";
import {
  directoryCategories,
  listingMatchesDirectoryCategory,
  type DirectoryCategory,
} from "@/lib/directory-categories";
import { MIN_INDEXABLE_DIRECTORY_RESULTS } from "@/lib/directory-pagination";
import type { Listing } from "@/lib/enrich";
import { getIndexableListings, listingMatchesCity } from "@/lib/public-listings";

/**
 * City, category and city+category hubs that currently have enough reviewed listings to be
 * published. A hub below the threshold returns 404 rather than a noindex page, so nothing on the
 * site may link to it: every crawlable link to a hub goes through this list. That keeps Google
 * from discovering thin hubs and reporting them as "Excluded by 'noindex' tag" in Search Console.
 */
export type IndexableHubSlugs = {
  cities: string[];
  categories: string[];
  /** `${citySlug}/${categorySlug}` pairs. */
  cityCategories: string[];
};

export function computeIndexableHubSlugs(listings: readonly Listing[]): IndexableHubSlugs {
  const qualifies = (count: number) => count >= MIN_INDEXABLE_DIRECTORY_RESULTS;
  const cityListings = new Map(
    cityDirectoryPages.map((city) => [
      city.slug,
      listings.filter((listing) => listingMatchesCity(listing, city.slug)),
    ]),
  );

  return {
    cities: cityDirectoryPages
      .filter((city) => qualifies(cityListings.get(city.slug)!.length))
      .map((city) => city.slug),
    categories: directoryCategories
      .filter((category) =>
        qualifies(listings.filter((listing) => listingMatchesDirectoryCategory(listing, category)).length),
      )
      .map((category) => category.slug),
    cityCategories: cityDirectoryPages.flatMap((city) =>
      directoryCategories
        .filter((category) =>
          qualifies(
            cityListings
              .get(city.slug)!
              .filter((listing) => listingMatchesDirectoryCategory(listing, category)).length,
          ),
        )
        .map((category) => `${city.slug}/${category.slug}`),
    ),
  };
}

// Only the slug lists are cached, so every page and the site-wide footer can ask for them
// without each render re-reading the whole listings table.
const loadIndexableHubSlugs = unstable_cache(
  async () => computeIndexableHubSlugs(await getIndexableListings()),
  ["indexable-hub-slugs"],
  { revalidate: 300 },
);

export const noIndexableHubs: IndexableHubSlugs = { cities: [], categories: [], cityCategories: [] };

/** Throws when listings cannot be loaded, so ISR keeps serving the last good page. */
export function getIndexableHubSlugs(): Promise<IndexableHubSlugs> {
  return loadIndexableHubSlugs();
}

/** For surfaces that must render without listings (footer, guides): link no hub rather than guess. */
export async function getIndexableHubSlugsOrNone(): Promise<IndexableHubSlugs> {
  try {
    return await loadIndexableHubSlugs();
  } catch (error) {
    console.error("Unable to load published directory hubs", error);
    return noIndexableHubs;
  }
}

export function filterIndexableCityPages(hubs: IndexableHubSlugs): CityDirectoryPage[] {
  return cityDirectoryPages.filter((city) => hubs.cities.includes(city.slug));
}

export function filterIndexableDirectoryCategories(hubs: IndexableHubSlugs): DirectoryCategory[] {
  return directoryCategories.filter((category) => hubs.categories.includes(category.slug));
}

export async function getIndexableCityPages(): Promise<CityDirectoryPage[]> {
  return filterIndexableCityPages(await getIndexableHubSlugs());
}

/**
 * False for a city, category or city+category hub URL that is not currently published.
 * Every other URL passes, so content link lists can be filtered with it wholesale.
 */
export function isLiveHubHref(href: string, hubs: IndexableHubSlugs): boolean {
  const path = href.split(/[?#]/, 1)[0].replace(/\/+$/, "");
  const cityCategory = path.match(/^\/city\/([^/]+)\/([^/]+)$/);
  if (cityCategory) return hubs.cityCategories.includes(`${cityCategory[1]}/${cityCategory[2]}`);
  const city = path.match(/^\/city\/([^/]+)$/);
  if (city) return hubs.cities.includes(city[1]);
  const category = path.match(/^\/category\/([^/]+)$/);
  if (category) return hubs.categories.includes(category[1]);
  return true;
}
