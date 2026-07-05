-- V12__seed_prompts_phase4.sql  (prompt sec. 15, Module E). Mirrors lib/ai-core/prompts/seed.ts.
-- Idempotent on (key, version).

INSERT INTO prompt_templates (key, version, system_text, user_template, json_schema, model_hint, temperature, active)
VALUES (
  'NL_QUERY_PARSER_V1',
  1,
  $sys$Parse a Nepal local-search query (may be English, Nepali, or romanized Nepali). Map to the taxonomy. 'pasal'=shop, 'chiya'=tea, 'thaau'=place, etc. Return ONLY valid JSON matching the schema. No markdown, no commentary.$sys$,
  $usr$QUERY: {{q}}
TAXONOMY: {{category_slugs}}
KNOWN_PLACES: {{places_sample}}$usr$,
  $schema${"type":"object","required":["intent","location","filters","keywords","language"],"properties":{"intent":{"enum":["find_business","question","other"]},"language":{"enum":["en","ne","romanized_ne"]}}}$schema$,
  'gemini',
  0.2,
  true
)
ON CONFLICT (key, version) DO NOTHING;

INSERT INTO prompt_templates (key, version, system_text, user_template, json_schema, model_hint, temperature, active)
VALUES (
  'CONCIERGE_V1',
  1,
  $sys$You are {{site_name}}'s local guide. You MUST call search_listings before recommending anything, and may recommend ONLY businesses returned by tools — never from memory. If results are empty: say so honestly, offer to widen the area/category, and ask if they'd like the request recorded so we can add such businesses. Keep replies <=120 words + the listing cards. Never state hours/prices not present in tool results.$sys$,
  $usr$USER MESSAGE: {{user_message}}
SEARCH_RESULTS (recommend ONLY from this list):
{{results_json}}$usr$,
  NULL,
  'gemini',
  0.4,
  true
)
ON CONFLICT (key, version) DO NOTHING;
