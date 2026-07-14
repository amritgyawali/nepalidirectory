import { describe, expect, it } from "vitest";
import { buildPublicPageMetadata } from "@/lib/site-metadata";

describe("public page index controls", () => {
  it("noindexes empty utility surfaces but preserves crawlable links", () => {
    const metadata = buildPublicPageMetadata({
      title: "Events",
      description: "Events pending publication.",
      path: "/events",
    });

    expect(metadata.robots).toMatchObject({ index: false, follow: true });
  });

  it("keeps substantive directory hubs indexable", () => {
    const metadata = buildPublicPageMetadata({
      title: "Categories",
      description: "Browse directory categories.",
      path: "/categories",
    });

    expect(metadata.robots).toBeUndefined();
  });
});
