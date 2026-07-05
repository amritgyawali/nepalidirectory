/**
 * Trending blog engine domain (prompt Module D, §8). Named `blog-engine` (not `blog`) so it
 * doesn't collide with the existing hand-curated `lib/blog.ts` dataset that powers the current
 * `/blog` pages — published engine posts are merged into those pages via `./adapter.ts`.
 */

export type TrendSourceKind = "rss" | "reddit" | "youtube" | "gtrends";

export type TrendSource = {
  id: number;
  name: string;
  kind: TrendSourceKind;
  url: string;
  region: string;
  active: boolean;
  lastFetchedAt?: Date;
  failCount: number;
};

export type NewTrendSource = Omit<TrendSource, "id" | "failCount" | "lastFetchedAt"> & {
  failCount?: number;
};

export interface TrendSourceRepository {
  create(input: NewTrendSource): Promise<TrendSource>;
  list(filter?: { active?: boolean }): Promise<TrendSource[]>;
  recordFetch(id: number, ok: boolean): Promise<void>;
}

export type TrendItem = {
  id: number;
  sourceId: number;
  title: string;
  url: string;
  urlHash: string;
  summary?: string;
  publishedAt?: Date;
  embedding?: number[];
  clusterId?: number;
  createdAt: Date;
};

export type NewTrendItem = Omit<TrendItem, "id" | "urlHash" | "createdAt" | "clusterId">;

export interface TrendItemRepository {
  /** Insert, deduping by URL hash; returns null if the URL was already seen. */
  create(input: NewTrendItem): Promise<TrendItem | null>;
  listSince(since: Date): Promise<TrendItem[]>;
  setCluster(ids: number[], clusterId: number): Promise<void>;
  listByCluster(clusterId: number): Promise<TrendItem[]>;
}

export type TrendClusterStatus = "new" | "selected" | "skipped" | "generated";

export type TrendCluster = {
  id: number;
  label: string;
  score: number;
  itemCount: number;
  status: TrendClusterStatus;
  selectorOutput?: Record<string, unknown>;
  createdAt: Date;
};

export type NewTrendCluster = Pick<TrendCluster, "label" | "score" | "itemCount">;

export interface TrendClusterRepository {
  create(input: NewTrendCluster): Promise<TrendCluster>;
  update(id: number, patch: Partial<TrendCluster>): Promise<void>;
  list(filter?: { status?: TrendClusterStatus }): Promise<TrendCluster[]>;
  get(id: number): Promise<TrendCluster | null>;
}

export type BlogPostStatus = "DRAFT" | "REVIEW" | "PUBLISHED" | "REJECTED";
export type ArticleType = "news_explainer" | "guide" | "listicle";

export type BlogFaqEntry = { question: string; answer: string };

export type BlogPostSeo = { metaTitle: string; metaDescription: string; keywords?: string[] };

export type BlogPostFactcheck = {
  verdict: "pass" | "revise";
  unsupportedClaims: { claim: string; why: string }[];
};

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  bodyMd: string;
  lang: string;
  status: BlogPostStatus;
  heroImageUrl?: string;
  seo: BlogPostSeo;
  sources: string[];
  clusterId?: number;
  articleType: ArticleType;
  authorType: string;
  factcheck?: BlogPostFactcheck;
  confidence: number;
  reviewedBy?: string;
  publishedAt?: Date;
  embedding?: number[];
  categories: string[];
  faq: BlogFaqEntry[];
  linksInjected: number;
  createdAt: Date;
};

export type NewBlogPost = Omit<BlogPost, "id" | "createdAt" | "status" | "publishedAt" | "reviewedBy"> & {
  status?: BlogPostStatus;
};

export interface BlogPostRepository {
  create(input: NewBlogPost): Promise<BlogPost>;
  get(id: number): Promise<BlogPost | null>;
  getBySlug(slug: string): Promise<BlogPost | null>;
  update(id: number, patch: Partial<BlogPost>): Promise<void>;
  list(filter?: { status?: BlogPostStatus }): Promise<BlogPost[]>;
}
