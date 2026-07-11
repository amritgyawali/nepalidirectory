import { GuideCard } from "@/components/content/GuideCard";
import type { BlogPost } from "@/lib/blog";

export function RelatedGuideLinks({ title, posts }: { title: string; posts: BlogPost[] }) {
  if (!posts.length) return null;
  return (
    <section className="section">
      <div className="container">
        <h2 className="compact-title">{title}</h2>
        <div className="article-grid article-grid--related">
          {posts.map((post) => (
            <GuideCard
              category={post.category}
              excerpt={post.excerpt}
              href={post.href}
              image={post.image}
              imageAlt={post.imageAlt}
              key={post.slug}
              title={post.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
