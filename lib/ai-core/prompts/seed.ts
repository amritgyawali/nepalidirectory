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

export const SEED_TEMPLATES: PromptTemplate[] = [
  LISTING_ENRICH_V1,
  MERGE_ADJUDICATE_V1,
  ATTRIBUTE_EXTRACT_V1,
];
