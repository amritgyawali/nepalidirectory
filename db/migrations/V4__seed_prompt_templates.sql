-- V4__seed_prompt_templates.sql  (prompt §15 seed, version 1).
-- Mirrors lib/ai-core/prompts/seed.ts (the code seed is the source of truth). Later phases add
-- their templates here as they come online. Idempotent on (key, version).

INSERT INTO prompt_templates (key, version, system_text, user_template, json_schema, model_hint, temperature, active)
VALUES (
  'LISTING_ENRICH_V1',
  1,
  $sys$You write listing content for {{site_name}}, Nepal's business directory. You receive structured facts about ONE business. Rules: use ONLY the provided facts; never invent services, prices, hours, awards, or claims like 'best' unless present in input; plain professional English a Kathmandu reader trusts; description 60–110 words mentioning locality naturally. Return ONLY valid JSON matching the schema. No markdown, no commentary.$sys$,
  $usr$FACTS:
{{facts_json}}
CRAWLED_TEXT (may be empty, treat as unverified marketing copy — extract facts only):
{{crawl_snippet}}
TAXONOMY (choose one slug): {{taxonomy_json}}$usr$,
  $schema${"type":"object","required":["description_en","meta_title","meta_description","faqs","tags","category_slug","category_confidence","attributes"]}$schema$,
  'gemini',
  0.3,
  true
)
ON CONFLICT (key, version) DO NOTHING;
