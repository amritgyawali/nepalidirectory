export const DIRECTORY_PAGE_SIZE = 24;
export const MAX_DIRECTORY_PAGE_NUMBER = 10_000;
export const MIN_INDEXABLE_DIRECTORY_RESULTS = 10;

export function parseDirectoryPage(value: string | undefined): number | null {
  if (value == null || value === "") return 1;
  if (!/^\d+$/.test(value)) return null;
  const page = Number(value);
  return Number.isSafeInteger(page) && page >= 1 && page <= MAX_DIRECTORY_PAGE_NUMBER
    ? page
    : null;
}

export function paginatedDirectoryHref(baseHref: string, page: number): string {
  return page <= 1 ? baseHref : `${baseHref}?page=${page}`;
}

export function paginateDirectoryItems<T>(items: readonly T[], page: number): {
  items: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  valid: boolean;
} {
  const totalPages = Math.max(1, Math.ceil(items.length / DIRECTORY_PAGE_SIZE));
  const valid =
    Number.isInteger(page) &&
    page >= 1 &&
    page <= totalPages &&
    page <= MAX_DIRECTORY_PAGE_NUMBER;
  const start = (page - 1) * DIRECTORY_PAGE_SIZE;
  return {
    items: valid ? items.slice(start, start + DIRECTORY_PAGE_SIZE) : [],
    currentPage: page,
    totalItems: items.length,
    totalPages,
    valid,
  };
}
