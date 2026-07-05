/**
 * Generation pass 2 — outline + draft (prompt §8.4.2, BLOG_WRITER_V1).
 */
import type { ProviderRegistry } from "../../ai-core/types";
import type { PromptRegistry } from "../../ai-core/prompts/registry";
import { completeParsedJson } from "../../ai-core/json";

export type WriterDraft = {
  title: string;
  slug: string;
  excerpt: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  bodyMarkdown: string;
  faq: { q: string; a: string }[];
  sourcesUsed: string[];
  categories: string[];
  confidence: number;
};

export type WriterVars = {
  siteName: string;
  angle: string;
  articleType: string;
  targetCategorySlugs: string[];
  sourcePack: string;
};

export async function writeDraft(
  providers: ProviderRegistry,
  prompts: PromptRegistry,
  vars: WriterVars,
  revisionNote?: string,
): Promise<WriterDraft> {
  const template = prompts.get("BLOG_WRITER_V1");
  const rendered = prompts.render("BLOG_WRITER_V1", {
    site_name: vars.siteName,
    angle: vars.angle,
    article_type: vars.articleType,
    target_category_slugs: vars.targetCategorySlugs.join(", "),
    source_pack: vars.sourcePack,
  });

  const user = revisionNote ? `${rendered.user}\n\nREVISION NEEDED: ${revisionNote}` : rendered.user;

  const parsed = (await completeParsedJson(
    providers,
    {
      taskKey: template.key,
      system: rendered.system,
      user,
      temperature: template.temperature,
      maxTokens: 3200,
    },
    template.jsonSchema ?? "{}",
  )) as {
    title?: string;
    slug?: string;
    excerpt?: string;
    seo_title?: string;
    meta_description?: string;
    keywords?: string[];
    body_markdown?: string;
    faq?: { q: string; a: string }[];
    sources_used?: string[];
    categories?: string[];
    confidence?: number;
  };
  const faq = Array.isArray(parsed.faq) ? parsed.faq : [];
  const categories = Array.isArray(parsed.categories) ? parsed.categories : vars.targetCategorySlugs;
  const keywords = Array.isArray(parsed.keywords) ? parsed.keywords : categories;
  const title = polishTitle(cleanString(parsed.title) || vars.angle);
  const excerpt = cleanString(parsed.excerpt) || `A practical NepaliDirectory guide to ${vars.angle.toLowerCase()}.`;
  const bodyMarkdown = ensureBodyMarkdown(parsed.body_markdown, {
    title,
    angle: vars.angle,
    categories,
    sourcePack: vars.sourcePack,
  });

  return {
    title,
    slug: cleanString(parsed.slug),
    excerpt,
    seoTitle: polishTitle(cleanString(parsed.seo_title) || title),
    metaDescription: cleanString(parsed.meta_description) || excerpt,
    keywords: keywords.map(cleanString).filter(Boolean).slice(0, 12),
    bodyMarkdown,
    faq: ensureFaq(faq, vars.angle),
    sourcesUsed: Array.isArray(parsed.sources_used) ? parsed.sources_used.map(cleanString).filter(Boolean) : [],
    categories: categories.filter(Boolean),
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.5,
  };
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function polishTitle(value: string): string {
  const clean = cleanString(value);
  if (!clean) return clean;
  const significantWords = clean.split(/\s+/).filter((word) => /[A-Za-z]/.test(word));
  const lowercaseWords = significantWords.filter((word) => word === word.toLowerCase());
  if (lowercaseWords.length < significantWords.length * 0.6) return clean;
  const small = new Set(["a", "an", "and", "as", "at", "before", "by", "for", "in", "of", "on", "or", "the", "to", "with"]);
  return clean
    .split(/\s+/)
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index > 0 && small.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function ensureBodyMarkdown(
  body: unknown,
  vars: { title: string; angle: string; categories: string[]; sourcePack: string },
): string {
  const text = typeof body === "string" ? body.trim() : "";
  const headingCount = (text.match(/^##\s+/gm) ?? []).length;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (headingCount >= 4 && wordCount >= 650) return text;

  const categoryText = vars.categories.length ? vars.categories.join(", ") : "local businesses";
  const sourceNote = vars.sourcePack.split("\n").slice(0, 8).join(" ").replace(/\s+/g, " ").slice(0, 600);
  return [
    `## ${vars.title}`,
    `Use this guide as a practical checklist for ${vars.angle.toLowerCase()}. It is written for people comparing Nepal businesses through NepaliDirectory, where category fit, location, contact details, service notes and public review signals all matter before making a booking decision.`,
    "",
    "## Start with the search intent",
    `Decide what you need before comparing providers. For ${categoryText}, the best option depends on urgency, location, price expectations, availability and whether the provider clearly explains what they can do. A short list is better than opening many profiles without a decision plan.`,
    "",
    "## Check the public profile details",
    "Look for a phone number, location, service area, opening notes, payment details, photos, website links and a clear description. Missing details do not always mean a business is poor, but they do mean you should confirm more information before travelling, booking or paying.",
    "",
    "## Compare review and quality signals",
    "Read review volume, rating patterns and recent feedback together. A provider with fewer but detailed reviews may be more useful than a profile with many short comments. Check whether complaints are about timing, price, communication, cleanliness, safety or after-service support.",
    "",
    "## Ask direct questions before booking",
    "Contact the provider and ask about current hours, final price, availability, cancellation rules, required documents, parking or access, and what is included. For repair, health, travel or event services, confirm urgency, safety requirements and whether a written estimate is available.",
    "",
    "## Use sources and local context carefully",
    sourceNote || "This article is grounded in NepaliDirectory's local-service comparison rules and public directory context. Always confirm fast-changing details directly with the provider.",
  ].join("\n");
}

function ensureFaq(faq: { q: string; a: string }[], angle: string): { q: string; a: string }[] {
  const normalized = faq
    .filter((item) => cleanString(item.q) && cleanString(item.a))
    .map((item) => ({ q: cleanString(item.q), a: cleanString(item.a) }))
    .slice(0, 5);
  if (normalized.length >= 3) return normalized;
  return [
    ...normalized,
    {
      q: `What should I check first when ${angle.toLowerCase()}?`,
      a: "Start with location, contact details, recent review signals, service scope and final price or availability.",
    },
    {
      q: "Should I rely only on ratings?",
      a: "No. Compare ratings with review text, recency, category fit, photos, response quality and direct confirmation from the provider.",
    },
    {
      q: "What should I confirm before booking?",
      a: "Confirm current hours, exact price, what is included, cancellation terms, safety requirements and the best contact person.",
    },
  ].slice(0, 5);
}
