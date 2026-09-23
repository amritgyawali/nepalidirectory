import { describe, expect, it } from "vitest";
import type { Business } from "@/lib/data";
import { searchRecords } from "@/lib/search";

const databaseBusiness: Business = {
  rank: 9001,
  name: "Database Bakery Pokhara",
  slug: "database-bakery-pokhara",
  categories: ["Bakery"],
  area: "Pokhara",
  neighborhood: "Lakeside",
  address: "Lakeside, Pokhara",
  phone: "061-000000",
  rating: 4.5,
  reviews: 12,
  price: 2,
  status: "open",
  hoursToday: "Today: 8:00 am - 8:00 pm",
  image: "/icon.svg",
  quote: "A persisted bakery listing.",
  amenities: ["Takeaway"],
};

describe("searchRecords database catalog", () => {
  it("searches the catalog supplied by the database-backed page", () => {
    const results = searchRecords("bakery", "Pokhara", "business", [databaseBusiness]);

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      id: "business-database-bakery-pokhara",
      title: "Database Bakery Pokhara",
      location: "Pokhara",
    });
  });

  it("does not leak bundled businesses into a supplied database catalog", () => {
    const results = searchRecords("Pampu International", "", "business", [databaseBusiness]);
    expect(results).toEqual([]);
  });
});
