/**
 * Postgres-backed BlogPostRepository (prompt §8.5 / §13 `blog_posts` + V17 display columns).
 * Selected by `./factory.ts` whenever `DATABASE_URL` is set. This is the store that makes the
 * auto-publisher usable on serverless (Vercel): the cron invocation that generates and publishes a
 * post writes here, and the separate invocation that renders `/blog` reads the same rows — an
 * in-memory store would keep them in different process memories and the post would never appear.
 * Persisting the `embedding` column is also what lets the duplicate check in
 * `handlers/blog-generate.ts` dedupe across cold starts instead of only within one process.
 *
 * Runs against an injected `SqlExecutor` (never imports `pg` directly — only pg-client does).
 * `cluster_id` is intentionally written NULL: trend clusters live in the in-memory stores for the
 * duration of one generation cycle only, so the V8 FK to `trend_clusters(id)` cannot be satisfied
 * across processes and the linkage is never read after the post is created.
 */
import type { SqlExecutor } from "../../ai-core/queue/pg-repo";
import type {
  BlogFaqEntry,
  BlogPost,
  BlogPostFactcheck,
  BlogPostRepository,
  BlogPostSeo,
  BlogPostStatus,
  NewBlogPost,
} from "../types";

const COLUMNS = `id, slug, title, excerpt, body_md, lang, status, hero_image_url, seo, sources,
  cluster_id, article_type, author_type, factcheck, confidence, reviewed_by, published_at,
  embedding::text AS embedding, categories, faq, links_injected, created_at`;

type BlogPostRow = {
  id: number | string;
  slug: string;
  title: string;
  excerpt: string | null;
  body_md: string | null;
  lang: string | null;
  status: string;
  hero_image_url: string | null;
  seo: BlogPostSeo | null;
  sources: string[] | null;
  cluster_id: number | string | null;
  article_type: string | null;
  author_type: string | null;
  factcheck: BlogPostFactcheck | null;
  confidence: number | string | null;
  reviewed_by: string | null;
  published_at: string | Date | null;
  embedding: string | null;
  categories: string[] | null;
  faq: BlogFaqEntry[] | null;
  links_injected: number | null;
  created_at: string | Date;
};

function parseEmbedding(text: string | null): number[] | undefined {
  if (!text) return undefined;
  const inner = text.trim().replace(/^\[/, "").replace(/\]$/, "");
  if (!inner) return undefined;
  return inner.split(",").map(Number);
}

function mapRow(r: BlogPostRow): BlogPost {
  return {
    id: Number(r.id),
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    bodyMd: r.body_md ?? "",
    lang: r.lang ?? "en",
    status: r.status as BlogPostStatus,
    heroImageUrl: r.hero_image_url ?? undefined,
    seo: r.seo ?? { metaTitle: r.title, metaDescription: r.excerpt ?? "" },
    sources: r.sources ?? [],
    clusterId: r.cluster_id != null ? Number(r.cluster_id) : undefined,
    articleType: (r.article_type as BlogPost["articleType"]) ?? "guide",
    authorType: r.author_type ?? "ai_assisted",
    factcheck: r.factcheck ?? undefined,
    confidence: r.confidence != null ? Number(r.confidence) : 0,
    reviewedBy: r.reviewed_by ?? undefined,
    publishedAt: r.published_at ? new Date(r.published_at) : undefined,
    embedding: parseEmbedding(r.embedding),
    categories: r.categories ?? [],
    faq: r.faq ?? [],
    linksInjected: r.links_injected ?? 0,
    createdAt: new Date(r.created_at),
  };
}

/** Maps a `BlogPost` field name to its column + a value serializer, for dynamic UPDATE building. */
const UPDATABLE: Record<string, { col: string; cast?: string; to: (v: unknown) => unknown }> = {
  slug: { col: "slug", to: (v) => v },
  title: { col: "title", to: (v) => v },
  excerpt: { col: "excerpt", to: (v) => v },
  bodyMd: { col: "body_md", to: (v) => v },
  lang: { col: "lang", to: (v) => v },
  status: { col: "status", to: (v) => v },
  heroImageUrl: { col: "hero_image_url", to: (v) => v ?? null },
  seo: { col: "seo", cast: "jsonb", to: (v) => JSON.stringify(v ?? {}) },
  sources: { col: "sources", cast: "jsonb", to: (v) => JSON.stringify(v ?? []) },
  articleType: { col: "article_type", to: (v) => v },
  authorType: { col: "author_type", to: (v) => v },
  factcheck: { col: "factcheck", cast: "jsonb", to: (v) => (v == null ? null : JSON.stringify(v)) },
  confidence: { col: "confidence", to: (v) => v },
  reviewedBy: { col: "reviewed_by", to: (v) => v ?? null },
  publishedAt: { col: "published_at", to: (v) => (v instanceof Date ? v.toISOString() : (v ?? null)) },
  embedding: { col: "embedding", cast: "vector", to: (v) => (Array.isArray(v) ? `[${v.join(",")}]` : null) },
  categories: { col: "categories", cast: "jsonb", to: (v) => JSON.stringify(v ?? []) },
  faq: { col: "faq", cast: "jsonb", to: (v) => JSON.stringify(v ?? []) },
  linksInjected: { col: "links_injected", to: (v) => v ?? 0 },
};

export class PostgresBlogPostRepository implements BlogPostRepository {
  constructor(private readonly sql: SqlExecutor) {}

  async create(input: NewBlogPost): Promise<BlogPost> {
    const status: BlogPostStatus = input.status ?? "DRAFT";
    const rows = await this.sql<BlogPostRow>(
      `INSERT INTO blog_posts
         (slug, title, excerpt, body_md, lang, status, hero_image_url, seo, sources, cluster_id,
          article_type, author_type, factcheck, confidence, embedding, categories, faq,
          links_injected)
       VALUES
         ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9::jsonb,NULL,$10,$11,$12::jsonb,$13,$14::vector,
          $15::jsonb,$16::jsonb,$17)
       RETURNING ${COLUMNS}`,
      [
        input.slug,
        input.title,
        input.excerpt,
        input.bodyMd,
        input.lang,
        status,
        input.heroImageUrl ?? null,
        JSON.stringify(input.seo ?? {}),
        JSON.stringify(input.sources ?? []),
        input.articleType,
        input.authorType,
        input.factcheck ? JSON.stringify(input.factcheck) : null,
        input.confidence,
        input.embedding ? `[${input.embedding.join(",")}]` : null,
        JSON.stringify(input.categories ?? []),
        JSON.stringify(input.faq ?? []),
        input.linksInjected ?? 0,
      ],
    );
    return mapRow(rows[0]);
  }

  async get(id: number): Promise<BlogPost | null> {
    const rows = await this.sql<BlogPostRow>(`SELECT ${COLUMNS} FROM blog_posts WHERE id=$1`, [id]);
    return rows.length ? mapRow(rows[0]) : null;
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const rows = await this.sql<BlogPostRow>(`SELECT ${COLUMNS} FROM blog_posts WHERE slug=$1`, [slug]);
    return rows.length ? mapRow(rows[0]) : null;
  }

  async update(id: number, patch: Partial<BlogPost>): Promise<void> {
    const sets: string[] = [];
    const params: unknown[] = [id];
    for (const [key, value] of Object.entries(patch)) {
      const spec = UPDATABLE[key];
      if (!spec) continue; // id/clusterId/createdAt are never updated through this store.
      params.push(spec.to(value));
      sets.push(`${spec.col}=$${params.length}${spec.cast ? `::${spec.cast}` : ""}`);
    }
    if (sets.length === 0) return;
    await this.sql(`UPDATE blog_posts SET ${sets.join(", ")} WHERE id=$1`, params);
  }

  async list(filter?: { status?: BlogPostStatus }): Promise<BlogPost[]> {
    const rows = filter?.status
      ? await this.sql<BlogPostRow>(
          `SELECT ${COLUMNS} FROM blog_posts WHERE status=$1 ORDER BY id DESC`,
          [filter.status],
        )
      : await this.sql<BlogPostRow>(`SELECT ${COLUMNS} FROM blog_posts ORDER BY id DESC`);
    return rows.map(mapRow);
  }
}
