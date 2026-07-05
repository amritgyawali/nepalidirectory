-- V6__seed_prompts_phase2.sql  (prompt sec. 15 + sec. 6.4). Mirrors lib/ai-core/prompts/seed.ts.
-- Idempotent on (key, version).

INSERT INTO prompt_templates (key, version, system_text, user_template, json_schema, model_hint, temperature, active)
VALUES (
  'MERGE_ADJUDICATE_V1',
  1,
  $sys$You decide if two Nepali business records are the same real-world business. Consider name transliteration variants (Nepali/English), branch vs same outlet (different ward = likely branch), phone reuse by owners. Return ONLY valid JSON matching the schema. No markdown, no commentary.$sys$,
  $usr$A:{{a_json}}
B:{{b_json}}
SIGNALS:{{features_json}}$usr$,
  $schema${"type":"object","required":["verdict","confidence","reason"],"properties":{"verdict":{"enum":["same","distinct","branch"]}}}$schema$,
  'gemini',
  0.2,
  true
)
ON CONFLICT (key, version) DO NOTHING;

INSERT INTO prompt_templates (key, version, system_text, user_template, json_schema, model_hint, temperature, active)
VALUES (
  'ATTRIBUTE_EXTRACT_V1',
  1,
  $sys$You extract structured business attributes for {{site_name}} from a business's OWN web page. Use ONLY the provided page text and JSON-LD; never invent facts. Omit anything not present. Return ONLY valid JSON matching the schema. No markdown, no commentary.$sys$,
  $usr$PAGE_TEXT:
{{page_text}}
JSON_LD:
{{json_ld}}$usr$,
  $schema${"type":"object","required":["services","attributes"]}$schema$,
  'gemini',
  0.2,
  true
)
ON CONFLICT (key, version) DO NOTHING;
