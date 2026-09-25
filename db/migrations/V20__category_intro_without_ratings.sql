-- Retire the legacy category-intro prompt that treated unsupported aggregate ratings as input.
-- Version 2 uses only reviewed listing count, observed localities and internal completeness score.

UPDATE prompt_templates
SET active = false
WHERE key = 'CATEGORY_INTRO_V1';

INSERT INTO prompt_templates
  (key, version, system_text, user_template, json_schema, model_hint, temperature, active)
VALUES (
  'CATEGORY_INTRO_V1',
  2,
  $system$Write a 120-180 word unique intro for a Nepal business-directory category-in-city page. Use ONLY the provided listing_count, notable_localities, and average_quality_score. Provide practical guidance on comparing this service type in this city; do not mention ratings and do not invent businesses, prices, awards, facts or localities. Return ONLY valid JSON matching the schema. No markdown, no commentary.$system$,
  $user$CATEGORY: {{category}}
CITY: {{city}}
listing_count={{n}}
notable_localities={{localities}}
average_quality_score={{avg_quality}}$user$,
  $schema${"type":"object","required":["intro_md","meta_title","meta_description"],"properties":{"intro_md":{"type":"string"},"meta_title":{"type":"string","maxLength":60},"meta_description":{"type":"string","maxLength":155}}}$schema$,
  'gemini',
  0.4,
  true
)
ON CONFLICT (key, version) DO UPDATE SET
  system_text = EXCLUDED.system_text,
  user_template = EXCLUDED.user_template,
  json_schema = EXCLUDED.json_schema,
  model_hint = EXCLUDED.model_hint,
  temperature = EXCLUDED.temperature,
  active = true;
