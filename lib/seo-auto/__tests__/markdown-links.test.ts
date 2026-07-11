import { describe, expect, it } from "vitest";
import { parseInternalMarkdownLinks } from "@/lib/markdown-links";

describe("safe internal Markdown links", () => {
  it("turns same-site injected links into structured link segments", () => {
    const segments = parseInternalMarkdownLinks("Compare [restaurants](/compare-business/restaurants) before booking.");
    expect(segments).toContainEqual({
      type: "link",
      label: "restaurants",
      href: "/compare-business/restaurants",
    });
  });

  it("leaves external and protocol-relative links inert", () => {
    expect(parseInternalMarkdownLinks("[bad](https://evil.example) [also bad](//evil.example)"))
      .toEqual([{ type: "text", value: "[bad](https://evil.example) [also bad](//evil.example)" }]);
  });
});
