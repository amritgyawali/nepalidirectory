/**
 * Pure hub-link helpers with no server dependencies, so client components (search) can apply the
 * same "never link an unpublished hub" rule as server-rendered pages.
 */
export type IndexableHubSlugs = {
  cities: string[];
  categories: string[];
  /** `${citySlug}/${categorySlug}` pairs. */
  cityCategories: string[];
};

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
