/**
 * Generation pass 2 — outline + draft (prompt §8.4.2, BLOG_WRITER_V1).
 */
import type { AiRequest, ProviderRegistry } from "../../ai-core/types";
import type { PromptRegistry } from "../../ai-core/prompts/registry";
import { completeParsedJson, parseJsonResponse } from "../../ai-core/json";

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

  const parsed = (await completeWriterJson(
    providers,
    {
      taskKey: template.key,
      system: rendered.system,
      user,
      temperature: template.temperature,
      // The prompt targets 900-1400 words; 3200 tokens can truncate a full article mid-JSON (→ parse
      // failure → template fallback). 4096 gives the model room to finish the JSON it was asked for.
      maxTokens: 4096,
    },
    template.jsonSchema ?? "{}",
  )) as Record<string, unknown>;
  const faq = coerceFaq(parsed.faq);
  const categories = toStringArray(parsed.categories) ?? vars.targetCategorySlugs;
  const keywords = toStringArray(parsed.keywords) ?? categories;
  const title = polishTitle(cleanString(parsed.title) || vars.angle);
  const excerpt = cleanString(parsed.excerpt) || `A practical NepaliDirectory guide to ${vars.angle.toLowerCase()}.`;
  // The fast free-tier model rarely returns the flat `body_markdown` string the schema asks for — it
  // renames the key (content/body/article/markdown), nests the article as `{h2:[{title,text}]}`, or
  // returns sections as an array. coerceBodyMarkdown normalizes any of those shapes to markdown so we
  // publish the model's real prose instead of silently falling back to the deterministic scaffold.
  const bodyMarkdown = ensureBodyMarkdown(coerceBodyMarkdown(parsed), {
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

/**
 * Long-form articles are where model choice matters most: the fast primary (Groq Llama-8B) reliably
 * returns valid JSON but writes terse ~250-word drafts, while Gemini writes 700-1400 words for the
 * same prompt. So the writer prefers a long-form model (BLOG_WRITER_PROVIDER, default "gemini") and
 * falls back to the standard provider chain the instant it errors or is overloaded (503) — keeping
 * article quality high without making generation depend on the flakier provider. Everything else
 * (selector, fact-check: short JSON tasks) still runs on the normal chain.
 */
async function completeWriterJson(
  providers: ProviderRegistry,
  request: AiRequest,
  jsonSchema: string,
): Promise<unknown> {
  const preferredId = process.env.BLOG_WRITER_PROVIDER ?? "gemini";
  const preferred = providers.get(preferredId);
  if (preferred && preferred.id() !== providers.primary().id()) {
    // The long-form model's 503/429s are usually transient (free-tier demand spikes), so retry a few
    // times with short backoff before giving up — its 700-1400 word output is far better than the
    // fast chain's terse drafts. Only after it stays unavailable do we fall back to the chain.
    const attempts = Math.max(1, Number(process.env.BLOG_WRITER_RETRIES ?? 4));
    for (let i = 0; i < attempts; i++) {
      try {
        const result = await preferred.completeJson(request, jsonSchema);
        return parseJsonResponse(result.text);
      } catch {
        if (i < attempts - 1) await delay(1200 * (i + 1));
      }
    }
  }
  return completeParsedJson(providers, request, jsonSchema);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

/** A string[] from an array, a delimited string, or undefined when neither yields anything. */
function toStringArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const out = value.map(cleanString).filter(Boolean);
    return out.length ? out : undefined;
  }
  if (typeof value === "string" && value.trim()) {
    const out = value.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
    return out.length ? out : undefined;
  }
  return undefined;
}

// Keys the model uses for the article body; and top-level metadata keys to exclude when we have to
// fall back to walking the whole object for prose.
const BODY_KEYS = ["body_markdown", "content", "body", "article", "markdown", "body_md", "article_markdown"];
const META_KEYS = new Set([
  "title", "slug", "excerpt", "seo_title", "seotitle", "meta_description", "metadescription",
  "keywords", "faq", "faqs", "questions", "sources_used", "sources", "categories", "confidence", "tags",
]);
// Object keys the model uses for a heading vs a body paragraph, including numbered variants like
// `h2_1` / `p3` / `section2`. This is what makes coercion shape-agnostic: every free-tier model
// invents a slightly different JSON layout, so we classify keys instead of matching fixed structures.
const HEADING_KEY = /^(h[1-6]|heading|title|subtitle|header|section|section_title)(_?\d+)?$/i;
const SECTION_HEADING_KEYS = ["title", "heading", "h2", "header", "name", "section", "subtitle"];
const SECTION_BODY_KEYS = ["text", "content", "body", "paragraph", "paragraphs", "description"];

/**
 * Normalize the model's article to markdown regardless of the shape it returned — a flat markdown
 * string, a `{h2:[{title,text}]}` container, a bare section array, or a flat object of numbered
 * keys like `{h1,h2_1,p1,p2,h2_2,p3}`. Small free-tier models almost never honor the flat
 * `body_markdown` contract, so this is what keeps real AI prose from being discarded for the
 * deterministic scaffold in `ensureBodyMarkdown`.
 */
function coerceBodyMarkdown(parsed: Record<string, unknown>): string {
  for (const key of BODY_KEYS) {
    const v = parsed[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  for (const key of BODY_KEYS) {
    const md = walkToMarkdown(parsed[key]);
    if (md.split(/\s+/).filter(Boolean).length >= 40) return md;
  }
  // Last resort: some models drop the article at the top level (h1/p1/… as sibling keys of the SEO
  // fields). Walk everything except the known metadata keys.
  const rest = Object.fromEntries(Object.entries(parsed).filter(([k]) => !META_KEYS.has(k.toLowerCase())));
  return walkToMarkdown(rest);
}

/** Recursively render an arbitrary JSON body into markdown, preserving document order. */
function walkToMarkdown(node: unknown): string {
  const out: string[] = [];
  walk(node, out);
  return out.join("\n\n").trim();
}

function walk(node: unknown, out: string[]): void {
  if (typeof node === "string") {
    const s = node.trim();
    if (s) out.push(s);
    return;
  }
  if (Array.isArray(node)) {
    for (const el of node) {
      const section = sectionToMarkdown(el);
      if (section) out.push(section);
      else walk(el, out);
    }
    return;
  }
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      // Never let nested metadata (categories/keywords/faq/…) leak into the article body.
      if (META_KEYS.has(key.toLowerCase())) continue;
      if (typeof value === "string") {
        const s = value.trim();
        if (!s) continue;
        out.push(HEADING_KEY.test(key) ? `## ${s}` : s);
      } else if (value && typeof value === "object") {
        walk(value, out);
      }
    }
  }
}

/** Render an array element that is a `{heading, text}`- or `{type, content}`-style block; else "". */
function sectionToMarkdown(node: unknown): string {
  if (typeof node === "string") return node.trim();
  if (!node || typeof node !== "object" || Array.isArray(node)) return "";
  const o = node as Record<string, unknown>;
  // Typed-block form: `{type:"H2"|"paragraph"|…, content|text:"…"}` (a common list-of-blocks layout).
  const blockType = typeof o.type === "string" ? o.type.toLowerCase() : "";
  const blockText = cleanString(o.content ?? o.text ?? o.value);
  if (blockType && blockText) {
    return /^h[1-6]$|head|title/.test(blockType) ? `## ${blockText}` : blockText;
  }
  const heading = cleanString(firstOf(o, SECTION_HEADING_KEYS));
  const bodyVal = firstDefined(o, SECTION_BODY_KEYS);
  let text = "";
  if (typeof bodyVal === "string") text = bodyVal.trim();
  else if (Array.isArray(bodyVal)) {
    text = bodyVal.map((p) => (typeof p === "string" ? p.trim() : sectionToMarkdown(p))).filter(Boolean).join("\n\n");
  }
  if (!heading && !text) return "";
  return heading ? `## ${heading}\n${text}`.trim() : text;
}

function firstOf(o: Record<string, unknown>, keys: string[]): unknown {
  for (const k of keys) if (typeof o[k] === "string") return o[k];
  return undefined;
}
function firstDefined(o: Record<string, unknown>, keys: string[]): unknown {
  for (const k of keys) if (o[k] !== undefined) return o[k];
  return undefined;
}

/** Normalize FAQ from `{q,a}[]` / `{question,answer}[]` or an object like `{q1,a1,q2,a2,…}`. */
function coerceFaq(value: unknown): { q: string; a: string }[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const o = item as Record<string, unknown>;
        const q = cleanString(o.q ?? o.question ?? o.Q);
        const a = cleanString(o.a ?? o.answer ?? o.A);
        return q && a ? { q, a } : null;
      })
      .filter((x): x is { q: string; a: string } => x !== null);
  }
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    // Common wrapper: {questions:[{q,a}]} / {faqs:[...]} / {items:[...]}.
    for (const key of ["questions", "faqs", "faq", "items"]) {
      if (Array.isArray(o[key])) return coerceFaq(o[key]);
    }
    const paired: { q: string; a: string }[] = [];
    for (let i = 1; i <= 10; i++) {
      const q = cleanString(o[`q${i}`] ?? o[`question${i}`]);
      const a = cleanString(o[`a${i}`] ?? o[`answer${i}`]);
      if (q && a) paired.push({ q, a });
    }
    if (paired.length) return paired;
    const entries = Object.entries(o).filter(([, v]) => typeof v === "string");
    if (entries.length) return entries.map(([k, v]) => ({ q: cleanString(k), a: cleanString(v) })).filter((x) => x.q && x.a);
  }
  return [];
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
  // Keep the model's own article whenever it is a genuine piece: either substantial by length (even
  // if the model returned no `##` structure) or clearly sectioned. A unique AI article beats the
  // deterministic scaffold below, which is near-identical across posts (duplicate content is worse
  // for SEO than thin content). Only truly thin output (a short, structureless blob) falls through.
  if (wordCount >= 350 || (headingCount >= 3 && wordCount >= 180)) return text;

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
