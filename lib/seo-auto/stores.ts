import type { SqlExecutor } from "@/lib/ai-core/queue/pg-repo";
import type { InternalLinkSuggestion } from "./internal-links";

export type SeoPageIntro = {
  categorySlug: string;
  citySlug: string;
  introMd: string;
  metaTitle: string;
  metaDescription: string;
  listingCount: number;
  averageQualityScore: number;
  generatedAt: Date;
};

export interface SeoPageIntroRepository {
  upsert(intro: SeoPageIntro): Promise<void>;
  get(categorySlug: string, citySlug: string): Promise<SeoPageIntro | null>;
  all(): Promise<SeoPageIntro[]>;
}

export interface InternalLinkSuggestionRepository {
  replacePending(suggestions: InternalLinkSuggestion[]): Promise<number>;
  list(status?: "pending" | "approved" | "rejected"): Promise<Array<InternalLinkSuggestion & { status: string; createdAt: Date }>>;
}

export class InMemorySeoPageIntroRepository implements SeoPageIntroRepository {
  private readonly intros = new Map<string, SeoPageIntro>();

  async upsert(intro: SeoPageIntro): Promise<void> {
    this.intros.set(`${intro.categorySlug}/${intro.citySlug}`, intro);
  }

  async get(categorySlug: string, citySlug: string): Promise<SeoPageIntro | null> {
    return this.intros.get(`${categorySlug}/${citySlug}`) ?? null;
  }

  async all(): Promise<SeoPageIntro[]> {
    return [...this.intros.values()];
  }
}

export class InMemoryInternalLinkSuggestionRepository implements InternalLinkSuggestionRepository {
  private suggestions: Array<InternalLinkSuggestion & { status: string; createdAt: Date }> = [];

  async replacePending(suggestions: InternalLinkSuggestion[]): Promise<number> {
    this.suggestions = [
      ...this.suggestions.filter((suggestion) => suggestion.status !== "pending"),
      ...suggestions.map((suggestion) => ({ ...suggestion, status: "pending", createdAt: new Date() })),
    ];
    return suggestions.length;
  }

  async list(status?: "pending" | "approved" | "rejected"): Promise<Array<InternalLinkSuggestion & { status: string; createdAt: Date }>> {
    return status ? this.suggestions.filter((suggestion) => suggestion.status === status) : [...this.suggestions];
  }
}

type SeoPageIntroRow = {
  category_slug: string;
  city_slug: string;
  intro_md: string;
  meta_title: string | null;
  meta_description: string | null;
  listing_count: number;
  avg_quality_score: number | string;
  generated_at: Date | string;
};

function mapSeoPageIntro(row: SeoPageIntroRow): SeoPageIntro {
  return {
    categorySlug: row.category_slug,
    citySlug: row.city_slug,
    introMd: row.intro_md,
    metaTitle: row.meta_title ?? "",
    metaDescription: row.meta_description ?? "",
    listingCount: row.listing_count,
    averageQualityScore: Number(row.avg_quality_score),
    generatedAt: new Date(row.generated_at),
  };
}

export class PostgresSeoPageIntroRepository implements SeoPageIntroRepository {
  constructor(private readonly sql: SqlExecutor) {}

  async upsert(intro: SeoPageIntro): Promise<void> {
    await this.sql(
      `INSERT INTO seo_page_intros
          (category_slug, city_slug, intro_md, meta_title, meta_description, listing_count, avg_quality_score, generated_at, refreshed_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())
       ON CONFLICT (category_slug, city_slug) DO UPDATE SET
          intro_md = EXCLUDED.intro_md,
          meta_title = EXCLUDED.meta_title,
          meta_description = EXCLUDED.meta_description,
          listing_count = EXCLUDED.listing_count,
          avg_quality_score = EXCLUDED.avg_quality_score,
          refreshed_at = now()`,
      [
        intro.categorySlug,
        intro.citySlug,
        intro.introMd,
        intro.metaTitle,
        intro.metaDescription,
        intro.listingCount,
        intro.averageQualityScore,
        intro.generatedAt,
      ],
    );
  }

  async get(categorySlug: string, citySlug: string): Promise<SeoPageIntro | null> {
    const rows = await this.sql<SeoPageIntroRow>(
      `SELECT * FROM seo_page_intros WHERE category_slug = $1 AND city_slug = $2`,
      [categorySlug, citySlug],
    );
    return rows.length ? mapSeoPageIntro(rows[0]) : null;
  }

  async all(): Promise<SeoPageIntro[]> {
    const rows = await this.sql<SeoPageIntroRow>(`SELECT * FROM seo_page_intros ORDER BY category_slug, city_slug`);
    return rows.map(mapSeoPageIntro);
  }
}

type InternalLinkSuggestionRow = {
  source_ref: string;
  target_ref: string;
  score: number | string;
  reason: string;
  status: string;
  created_at: Date | string;
};

function titleFromHref(href: string): string {
  return href.split("/").filter(Boolean).join(" / ");
}

function mapInternalLinkSuggestion(row: InternalLinkSuggestionRow): InternalLinkSuggestion & { status: string; createdAt: Date } {
  return {
    sourceTitle: titleFromHref(row.source_ref),
    sourceHref: row.source_ref,
    targetTitle: titleFromHref(row.target_ref),
    targetHref: row.target_ref,
    score: Number(row.score),
    reason: row.reason,
    status: row.status,
    createdAt: new Date(row.created_at),
  };
}

export class PostgresInternalLinkSuggestionRepository implements InternalLinkSuggestionRepository {
  constructor(private readonly sql: SqlExecutor) {}

  async replacePending(suggestions: InternalLinkSuggestion[]): Promise<number> {
    await this.sql(`DELETE FROM internal_link_suggestions WHERE status = 'pending'`);
    for (const suggestion of suggestions) {
      await this.sql(
        `INSERT INTO internal_link_suggestions
            (source_type, source_ref, target_type, target_ref, score, reason, status)
         VALUES ('blog', $1, 'evergreen_page', $2, $3, $4, 'pending')`,
        [suggestion.sourceHref, suggestion.targetHref, suggestion.score, suggestion.reason],
      );
    }
    return suggestions.length;
  }

  async list(status?: "pending" | "approved" | "rejected"): Promise<Array<InternalLinkSuggestion & { status: string; createdAt: Date }>> {
    const rows = await this.sql<InternalLinkSuggestionRow>(
      `SELECT source_ref, target_ref, score, reason, status, created_at
         FROM internal_link_suggestions
        ${status ? "WHERE status = $1" : ""}
        ORDER BY score DESC, id`,
      status ? [status] : [],
    );
    return rows.map(mapInternalLinkSuggestion);
  }
}
