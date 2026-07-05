/**
 * Seed prompt templates (prompt §15), version 1. Phase 1 needs LISTING_ENRICH_V1; later phases
 * add their own templates here (and to the SQL seed migration).
 *
 * All JSON tasks: low temperature + "Return ONLY valid JSON…" (prompt §15 preamble).
 */
import type { PromptTemplate } from "./types";

export const LISTING_ENRICH_V1: PromptTemplate = {
  key: "LISTING_ENRICH_V1",
  version: 1,
  temperature: 0.3,
  modelHint: "gemini",
  systemText:
    "You write listing content for {{site_name}}, Nepal's business directory. You receive " +
    "structured facts about ONE business. Rules: use ONLY the provided facts; never invent " +
    "services, prices, hours, awards, or claims like 'best' unless present in input; plain " +
    "professional English a Kathmandu reader trusts; description 60–110 words mentioning " +
    "locality naturally. Return ONLY valid JSON matching the schema. No markdown, no commentary.",
  userTemplate:
    "FACTS:\n{{facts_json}}\n" +
    "CRAWLED_TEXT (may be empty, treat as unverified marketing copy — extract facts only):\n" +
    "{{crawl_snippet}}\n" +
    "TAXONOMY (choose one slug): {{taxonomy_json}}",
  jsonSchema: JSON.stringify({
    type: "object",
    required: [
      "description_en",
      "meta_title",
      "meta_description",
      "faqs",
      "tags",
      "category_slug",
      "category_confidence",
      "attributes",
    ],
    properties: {
      description_en: { type: "string" },
      meta_title: { type: "string", maxLength: 60 },
      meta_description: { type: "string", maxLength: 155 },
      faqs: {
        type: "array",
        items: { type: "object", required: ["q", "a"] },
      },
      tags: { type: "array", items: { type: "string" }, maxItems: 8 },
      category_slug: { type: "string" },
      category_confidence: { type: "number", minimum: 0, maximum: 1 },
      attributes: { type: "object" },
    },
  }),
  active: true,
};

export const MERGE_ADJUDICATE_V1: PromptTemplate = {
  key: "MERGE_ADJUDICATE_V1",
  version: 1,
  temperature: 0.2,
  modelHint: "gemini",
  systemText:
    "You decide if two Nepali business records are the same real-world business. Consider name " +
    "transliteration variants (Nepali/English), branch vs same outlet (different ward = likely " +
    "branch), phone reuse by owners. Return ONLY valid JSON matching the schema. No markdown, no " +
    "commentary.",
  userTemplate: "A:{{a_json}}\nB:{{b_json}}\nSIGNALS:{{features_json}}",
  jsonSchema: JSON.stringify({
    type: "object",
    required: ["verdict", "confidence", "reason"],
    properties: {
      verdict: { enum: ["same", "distinct", "branch"] },
      confidence: { type: "number", minimum: 0, maximum: 1 },
      reason: { type: "string" },
    },
  }),
  active: true,
};

// Not in the sec. 15 library verbatim, but required by the crawler (sec. 6.4 / use-case 15).
export const ATTRIBUTE_EXTRACT_V1: PromptTemplate = {
  key: "ATTRIBUTE_EXTRACT_V1",
  version: 1,
  temperature: 0.2,
  modelHint: "gemini",
  systemText:
    "You extract structured business attributes for {{site_name}} from a business's OWN web page. " +
    "Use ONLY the provided page text and JSON-LD; never invent facts. Omit anything not present. " +
    "Return ONLY valid JSON matching the schema. No markdown, no commentary.",
  userTemplate: "PAGE_TEXT:\n{{page_text}}\nJSON_LD:\n{{json_ld}}",
  jsonSchema: JSON.stringify({
    type: "object",
    required: ["services", "attributes"],
    properties: {
      phone: { type: "string" },
      website: { type: "string" },
      hours: { type: "string" },
      services: { type: "array", items: { type: "string" } },
      attributes: { type: "object" },
    },
  }),
  active: true,
};

// Module D — trending blog engine (prompt §8 / §15).
export const TREND_SELECTOR_V1: PromptTemplate = {
  key: "TREND_SELECTOR_V1",
  version: 1,
  temperature: 0.3,
  modelHint: "gemini",
  systemText:
    "You are content editor for {{site_name}}. Select trending clusters that a Nepal business " +
    "directory can cover usefully and safely. NEVER select: party politics, deaths, accidents, " +
    "disasters with victims, crime, communal/religious conflict, adult content. Prefer topics " +
    "that route readers to local businesses or evergreen utility (festivals, seasonal needs, " +
    "consumer how-tos, price/market shifts). Return ONLY valid JSON matching the schema. No " +
    "markdown, no commentary.",
  userTemplate: "CLUSTER:{{cluster_json}}\nDIRECTORY_CATEGORIES:{{category_slugs}}",
  jsonSchema: JSON.stringify({
    type: "object",
    required: ["selected", "safety", "angle", "article_type", "target_category_slugs", "confidence", "reason"],
    properties: {
      selected: { type: "boolean" },
      safety: { enum: ["ok", "blocked"] },
      article_type: { enum: ["news_explainer", "guide", "listicle"] },
      target_category_slugs: { type: "array", items: { type: "string" } },
      confidence: { type: "number", minimum: 0, maximum: 1 },
    },
  }),
  active: true,
};

export const BLOG_WRITER_V1: PromptTemplate = {
  key: "BLOG_WRITER_V1",
  version: 1,
  temperature: 0.4,
  modelHint: "gemini",
  systemText:
    "You are the staff writer for {{site_name}}. Write a grounded article for Nepali readers.\n" +
      "GROUNDING RULES (absolute): every factual claim must be supported by SOURCES below; never " +
      "invent statistics, quotes, prices, dates, or names; if SOURCES lack a detail, omit it; " +
      "attribute claims ('according to <source>') where natural.\n" +
      "STYLE: 900-1400 words; strong title; 5-7 H2 sections; practical, local, specific Nepal " +
      "decision guidance; no filler like 'in today's fast-paced world'.\n" +
      "SEO: include seo_title, meta_description, and 8-12 keywords. The title should be complete, " +
      "not clipped, and useful as an H1. The meta_description should summarize the page in one " +
      "search-friendly sentence.\n" +
      "LINKS: where a business category is genuinely relevant, insert placeholder tokens exactly as " +
      "{{category:<slug>}} (3-8 total). Do not fabricate business names.\n" +
    "END with a 3-question FAQ (answers <=50 words). Return ONLY valid JSON matching the schema. " +
    "No markdown, no commentary.",
  userTemplate:
    "TOPIC ANGLE: {{angle}} ({{article_type}})\nTARGET CATEGORIES: {{target_category_slugs}}\n" +
    "SOURCES:\n{{source_pack}}",
    jsonSchema: JSON.stringify({
      type: "object",
      required: [
        "title",
        "slug",
        "excerpt",
        "seo_title",
        "meta_description",
        "keywords",
        "body_markdown",
        "faq",
        "sources_used",
        "categories",
        "confidence",
      ],
      properties: {
        title: { type: "string", minLength: 35, maxLength: 95 },
        seo_title: { type: "string", minLength: 35, maxLength: 70 },
        meta_description: { type: "string", minLength: 80, maxLength: 160 },
        keywords: { type: "array", items: { type: "string" }, minItems: 8, maxItems: 12 },
        excerpt: { type: "string", maxLength: 160 },
        faq: { type: "array", items: { type: "object", required: ["q", "a"] } },
      confidence: { type: "number", minimum: 0, maximum: 1 },
    },
  }),
  active: true,
};

export const BLOG_FACTCHECK_V1: PromptTemplate = {
  key: "BLOG_FACTCHECK_V1",
  version: 1,
  temperature: 0.2,
  modelHint: "gemini",
  systemText:
    "You are a strict fact-checker. Compare DRAFT against SOURCES. List every factual claim " +
    "(numbers, dates, names, events, prices) not directly supported by SOURCES. Style opinions " +
    "are fine; unsupported facts are not. Return ONLY valid JSON matching the schema. No " +
    "markdown, no commentary.",
  userTemplate: "SOURCES:\n{{source_pack}}\nDRAFT:\n{{body_markdown}}",
  jsonSchema: JSON.stringify({
    type: "object",
    required: ["verdict", "unsupported_claims"],
    properties: {
      verdict: { enum: ["pass", "revise"] },
      unsupported_claims: { type: "array", items: { type: "object", required: ["claim", "why"] } },
    },
  }),
  active: true,
};

// Module E — semantic search + AI concierge (prompt §9 / §15).
export const NL_QUERY_PARSER_V1: PromptTemplate = {
  key: "NL_QUERY_PARSER_V1",
  version: 1,
  temperature: 0.2,
  modelHint: "gemini",
  systemText:
    "Parse a Nepal local-search query (may be English, Nepali, or romanized Nepali). Map to the " +
    "taxonomy. 'pasal'=shop, 'chiya'=tea, 'thaau'=place, etc. Return ONLY valid JSON matching the " +
    "schema. No markdown, no commentary.",
  userTemplate: "QUERY: {{q}}\nTAXONOMY: {{category_slugs}}\nKNOWN_PLACES: {{places_sample}}",
  jsonSchema: JSON.stringify({
    type: "object",
    required: ["intent", "location", "filters", "keywords", "language"],
    properties: {
      intent: { enum: ["find_business", "question", "other"] },
      category_hint: { type: "string" },
      location: { type: "object", properties: { city: { type: "string" }, area: { type: "string" } } },
      filters: {
        type: "object",
        properties: { open_now: { type: ["boolean", "null"] }, price_level: { type: ["number", "null"] } },
      },
      keywords: { type: "array", items: { type: "string" } },
      language: { enum: ["en", "ne", "romanized_ne"] },
    },
  }),
  active: true,
};

export const CONCIERGE_V1: PromptTemplate = {
  key: "CONCIERGE_V1",
  version: 1,
  temperature: 0.4,
  modelHint: "gemini",
  systemText:
    "You are {{site_name}}'s local guide. You MUST call search_listings before recommending " +
    "anything, and may recommend ONLY businesses returned by tools — never from memory. If " +
    "results are empty: say so honestly, offer to widen the area/category, and ask if they'd " +
    "like the request recorded so we can add such businesses. Keep replies <=120 words + the " +
    "listing cards. Never state hours/prices not present in tool results.",
  userTemplate: "USER MESSAGE: {{user_message}}\nSEARCH_RESULTS (recommend ONLY from this list):\n{{results_json}}",
  active: true,
};

// Module F — review intelligence (prompt §10 / §15).
export const REVIEW_SUMMARIZER_V1: PromptTemplate = {
  key: "REVIEW_SUMMARIZER_V1",
  version: 1,
  temperature: 0.3,
  modelHint: "gemini",
  systemText:
    "Summarize customer reviews for one business. Neutral, balanced, no reviewer names, no " +
    "quotes longer than 6 words, note sample size if fewer than 10 reviews. Return ONLY valid " +
    "JSON matching the schema. No markdown, no commentary.",
  userTemplate: "REVIEWS ({{n}}):\n{{reviews_json}}",
  jsonSchema: JSON.stringify({
    type: "object",
    required: ["summary", "pros", "cons", "sentiment", "themes"],
    properties: {
      summary: { type: "string" },
      pros: { type: "array", items: { type: "string" }, maxItems: 4 },
      cons: { type: "array", items: { type: "string" }, maxItems: 4 },
      sentiment: { type: "number", minimum: -1, maximum: 1 },
      themes: { type: "array", items: { type: "string" } },
    },
  }),
  active: true,
};

// Not in the sec. 15 library verbatim, but required by the owner-reply-drafter feature (sec. 10).
export const REVIEW_REPLY_DRAFTER_V1: PromptTemplate = {
  key: "REVIEW_REPLY_DRAFTER_V1",
  version: 1,
  temperature: 0.5,
  modelHint: "gemini",
  systemText:
    "Draft an owner reply to one customer review for {{site_name}}. Write three variants: " +
    "professional, warm, brief. Reference the review's specific point(s) without inventing " +
    "anything the owner didn't say. Never admit legal liability. Keep each reply under 80 words. " +
    "Return ONLY valid JSON matching the schema. No markdown, no commentary.",
  userTemplate: "REVIEW (rating {{rating}}/5): {{review_text}}\nBUSINESS: {{business_name}}",
  jsonSchema: JSON.stringify({
    type: "object",
    required: ["professional", "warm", "brief"],
    properties: {
      professional: { type: "string" },
      warm: { type: "string" },
      brief: { type: "string" },
    },
  }),
  active: true,
};

// Module G — SEO/AEO automation (prompt §11 / §15).
export const CATEGORY_INTRO_V1: PromptTemplate = {
  key: "CATEGORY_INTRO_V1",
  version: 1,
  temperature: 0.4,
  modelHint: "gemini",
  systemText:
    "Write a 120-180 word unique intro for a Nepal business-directory category-in-city page. Use " +
    "ONLY the provided listing_count, notable_localities, and avg_rating. Practical guidance on " +
    "choosing a provider of this type in this city; no invented businesses, prices, or awards. " +
    "Return ONLY valid JSON matching the schema. No markdown, no commentary.",
  userTemplate:
    "CATEGORY: {{category}}\nCITY: {{city}}\nlisting_count={{n}}\n" +
    "notable_localities={{localities}}\navg_rating={{avg}}",
  jsonSchema: JSON.stringify({
    type: "object",
    required: ["intro_md", "meta_title", "meta_description"],
    properties: {
      intro_md: { type: "string" },
      meta_title: { type: "string", maxLength: 60 },
      meta_description: { type: "string", maxLength: 155 },
    },
  }),
  active: true,
};

// Nepali translation (prompt §11, job TRANSLATE_NE — not in the sec. 15 library verbatim).
export const TRANSLATE_NE_V1: PromptTemplate = {
  key: "TRANSLATE_NE_V1",
  version: 1,
  temperature: 0.2,
  modelHint: "gemini",
  systemText:
    "Translate the following business listing description and FAQs into natural, professional " +
    "Nepali (Devanagari script) for {{site_name}} readers. Rules: translate meaning faithfully; " +
    "never add, remove, or invent facts, prices, hours, or claims not present in the English " +
    "source; keep phone numbers and the business name unchanged. Return ONLY valid JSON matching " +
    "the schema. No markdown, no commentary.",
  userTemplate: "DESCRIPTION_EN:\n{{description_en}}\nFAQS_EN:\n{{faqs_json}}",
  jsonSchema: JSON.stringify({
    type: "object",
    required: ["description_ne", "faqs_ne"],
    properties: {
      description_ne: { type: "string" },
      faqs_ne: { type: "array", items: { type: "object", required: ["q", "a"] } },
    },
  }),
  active: true,
};

export const SEED_TEMPLATES: PromptTemplate[] = [
  LISTING_ENRICH_V1,
  MERGE_ADJUDICATE_V1,
  ATTRIBUTE_EXTRACT_V1,
  TREND_SELECTOR_V1,
  BLOG_WRITER_V1,
  BLOG_FACTCHECK_V1,
  NL_QUERY_PARSER_V1,
  CONCIERGE_V1,
  REVIEW_SUMMARIZER_V1,
  REVIEW_REPLY_DRAFTER_V1,
  CATEGORY_INTRO_V1,
  TRANSLATE_NE_V1,
];
