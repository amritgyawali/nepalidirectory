/**
 * blog_posts store (prompt §8.5/§13). In-memory default; Postgres contract in the migration.
 */
import type { BlogPost, BlogPostRepository, BlogPostStatus, NewBlogPost } from "../types";

export class InMemoryBlogPostRepository implements BlogPostRepository {
  private seq = 0;
  private readonly map = new Map<number, BlogPost>();

  async create(input: NewBlogPost): Promise<BlogPost> {
    const post: BlogPost = {
      id: ++this.seq,
      status: input.status ?? "DRAFT",
      createdAt: new Date(),
      ...input,
    };
    this.map.set(post.id, post);
    return { ...post };
  }

  async get(id: number): Promise<BlogPost | null> {
    const p = this.map.get(id);
    return p ? { ...p } : null;
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const p = [...this.map.values()].find((x) => x.slug === slug);
    return p ? { ...p } : null;
  }

  async update(id: number, patch: Partial<BlogPost>): Promise<void> {
    const p = this.map.get(id);
    if (!p) throw new Error(`blog_posts: no post ${id}`);
    this.map.set(id, { ...p, ...patch, id });
  }

  async list(filter?: { status?: BlogPostStatus }): Promise<BlogPost[]> {
    return [...this.map.values()]
      .filter((p) => (filter?.status ? p.status === filter.status : true))
      .sort((a, b) => b.id - a.id)
      .map((p) => ({ ...p }));
  }
}
