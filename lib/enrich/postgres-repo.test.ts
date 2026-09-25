import { describe, expect, it } from "vitest";
import type { SqlExecutor } from "@/lib/ai-core/queue/pg-repo";
import { makeNewListing } from "./listing-repo";
import { PostgresListingRepository } from "./postgres-repo";

describe("PostgresListingRepository publication fields", () => {
  it("persists active=false atomically with trust metadata", async () => {
    const calls: Array<{ text: string; params: unknown[] }> = [];
    const sql: SqlExecutor = async (text: string, params: unknown[] = []) => {
      calls.push({ text, params });
      return [];
    };
    const repository = new PostgresListingRepository(sql);
    const listing = {
      ...makeNewListing({
        name: "Rejected Business",
        slug: "rejected-business",
        area: "Kathmandu",
        address: "Kathmandu",
        dataSource: "owner",
        verificationStatus: "rejected",
        sourceRef: "owner-submission:test",
        active: false,
      }),
      id: 42,
    };

    await repository.update(listing);

    expect(calls[0].text).toContain("image_verified=$45, active=$46, email=$47, status=$48");
    expect(calls[0].params).toHaveLength(49);
    expect(calls[0].params[0]).toBe(42);
    expect(calls[0].params[45]).toBe(false);
  });

  it("includes submitted contact, operational and image fields in an insert", async () => {
    let insertCall: { text: string; params: unknown[] } | undefined;
    const sql: SqlExecutor = async (text: string, params: unknown[] = []) => {
      insertCall = { text, params };
      throw new Error("stop after capturing insert");
    };
    const repository = new PostgresListingRepository(sql);
    const listing = makeNewListing({
      name: "Submitted Business",
      slug: "submitted-business",
      area: "Lalitpur",
      address: "Pulchowk, Lalitpur",
      email: "contact@submitted-business.example.np",
      status: "open",
      image: "https://submitted-business.example.np/storefront.jpg",
      dataSource: "owner",
      active: true,
    });

    await expect(repository.insert(listing)).rejects.toThrow("stop after capturing insert");

    expect(insertCall?.text).toContain("active, email, status, image");
    expect(insertCall?.params).toHaveLength(48);
    expect(insertCall?.params.slice(44)).toEqual([
      true,
      "contact@submitted-business.example.np",
      "open",
      "https://submitted-business.example.np/storefront.jpg",
    ]);
  });
});
