import { describe, expect, it } from "vitest";
import { compareCategories } from "@/lib/compare";
import { getAllMatchups, getCategoryMatchup } from "@/lib/compare-matchups";

describe("compare matchups", () => {
  it("attaches every matchup to an existing comparison category", () => {
    const categorySlugs = new Set(compareCategories.map((category) => category.slug));
    for (const matchup of getAllMatchups()) {
      expect(categorySlugs.has(matchup.slug), matchup.slug).toBe(true);
      expect(getCategoryMatchup(matchup.slug), matchup.slug).toBe(matchup);
    }
  });

  it("gives each category 10 unique contenders and 20 unique conditions", () => {
    for (const matchup of getAllMatchups()) {
      expect(matchup.conditions, matchup.slug).toHaveLength(20);
      expect(new Set(matchup.conditions).size, matchup.slug).toBe(20);
      expect(matchup.contenders, matchup.slug).toHaveLength(10);
      expect(new Set(matchup.contenders.map((contender) => contender.name)).size, matchup.slug).toBe(10);
    }
  });

  it("scores every condition with an integer from 1 to 10", () => {
    for (const matchup of getAllMatchups()) {
      for (const contender of matchup.contenders) {
        expect(contender.scores, `${matchup.slug}: ${contender.name}`).toHaveLength(matchup.conditions.length);
        for (const score of contender.scores) {
          expect(Number.isInteger(score) && score >= 1 && score <= 10, `${matchup.slug}: ${contender.name}`).toBe(true);
        }
      }
    }
  });
});
