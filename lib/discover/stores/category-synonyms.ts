/**
 * category_synonyms store (prompt §9.1): AI-generated once per category (EN, NE, romanized-NE),
 * folded into the tsvector / NL query parser fast path. In-memory default, seeded from
 * `../synonyms/seed.ts`; Postgres contract in the migration.
 */
import type { CategorySynonym, CategorySynonymRepository } from "../types";

export class InMemoryCategorySynonymRepository implements CategorySynonymRepository {
  constructor(private readonly seed: CategorySynonym[] = []) {}

  async all(): Promise<CategorySynonym[]> {
    return [...this.seed];
  }
}
