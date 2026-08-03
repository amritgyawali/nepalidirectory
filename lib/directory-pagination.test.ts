import { describe, expect, it } from "vitest";
import {
  DIRECTORY_PAGE_SIZE,
  MAX_DIRECTORY_PAGE_NUMBER,
  paginateDirectoryItems,
  paginatedDirectoryHref,
  parseDirectoryPage,
} from "./directory-pagination";

describe("directory pagination", () => {
  it("parses only bounded positive integer pages", () => {
    expect(parseDirectoryPage(undefined)).toBe(1);
    expect(parseDirectoryPage("1")).toBe(1);
    expect(parseDirectoryPage(String(MAX_DIRECTORY_PAGE_NUMBER))).toBe(MAX_DIRECTORY_PAGE_NUMBER);
    expect(parseDirectoryPage("0")).toBeNull();
    expect(parseDirectoryPage("2.5")).toBeNull();
    expect(parseDirectoryPage(String(MAX_DIRECTORY_PAGE_NUMBER + 1))).toBeNull();
  });

  it("returns 24 items per page and rejects beyond-final pages", () => {
    const items = Array.from({ length: DIRECTORY_PAGE_SIZE + 1 }, (_, index) => index + 1);
    expect(paginateDirectoryItems(items, 1).items).toHaveLength(DIRECTORY_PAGE_SIZE);
    expect(paginateDirectoryItems(items, 2).items).toEqual([DIRECTORY_PAGE_SIZE + 1]);
    expect(paginateDirectoryItems(items, 3).valid).toBe(false);
  });

  it("uses a clean canonical for page one and a query canonical after it", () => {
    expect(paginatedDirectoryHref("/city/kathmandu", 1)).toBe("/city/kathmandu");
    expect(paginatedDirectoryHref("/city/kathmandu", 2)).toBe("/city/kathmandu?page=2");
  });
});
