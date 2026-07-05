import { ImageResponse } from "next/og";
import { getDefaultBlogEngineRuntime } from "@/lib/blog-engine";

/**
 * Deterministic OG image for AI-generated blog posts (prompt §8.6): a brand template rendered
 * with `next/og` (satori) — no AI image API, no external calls. Curated posts keep their existing
 * photo-based OG image from `generateMetadata`; this route only backs the engine's `heroImageUrl`.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getDefaultBlogEngineRuntime().blogPosts.getBySlug(slug);
  const title = post?.title ?? "NepaliDirectory";
  const category = (post?.categories[0] ?? "guide").replace(/-/g, " ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #0f3d2e 0%, #16543f 60%, #1f6b4f 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, fontWeight: 700, letterSpacing: 1 }}>NepaliDirectory</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              textTransform: "uppercase",
              letterSpacing: 2,
              color: "#a9e4c4",
            }}
          >
            {category}
          </div>
          <div style={{ display: "flex", fontSize: 56, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
