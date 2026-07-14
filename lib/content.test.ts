import { describe, expect, it } from "vitest";
import { contentPages } from "@/lib/content";

describe("public trust content", () => {
  it("explains the directory's limits in substantive about-page copy", () => {
    const copy = contentPages.about.body.join(" ");
    expect(contentPages.about.body.length).toBeGreaterThanOrEqual(6);
    expect(copy).toContain("not a government registration certificate");
    expect(copy).toContain("Preview records");
  });

  it("does not publish placeholder contact details", () => {
    const copy = contentPages.contact.body.join(" ");
    expect(copy).not.toContain("555-0198");
    expect(copy).not.toContain("Kamaladi");
    expect(copy).not.toContain("hello@nepalidirectory.com");
  });
});
