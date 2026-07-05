-- V14__seed_prompts_phase5.sql  (prompt sec. 15, Modules F/G). Mirrors lib/ai-core/prompts/seed.ts.
-- Idempotent on (key, version).

INSERT INTO prompt_templates (key, version, system_text, user_template, json_schema, model_hint, temperature, active)
VALUES (
  'REVIEW_SUMMARIZER_V1',
  1,
  $sys$Summarize customer reviews for one business. Neutral, balanced, no reviewer names, no quotes longer than 6 words, note sample size if fewer than 10 reviews. Return ONLY valid JSON matching the schema. No markdown, no commentary.$sys$,
  $usr$REVIEWS ({{n}}):
{{reviews_json}}$usr$,
  $schema${"type":"object","required":["summary","pros","cons","sentiment","themes"],"properties":{"summary":{"type":"string"},"pros":{"type":"array","items":{"type":"string"},"cons":{"type":"array","items":{"type":"string"},"sentiment":{"type":"number","minimum":-1,"maximum":1},"themes":{"type":"array","items":{"type":"string"}}}}$schema$,
  'gemini',
  0.3,
  true
)
ON CONFLICT (key, version) DO NOTHING;

INSERT INTO prompt_templates (key, version, system_text, user_template, json_schema, model_hint, temperature, active)
VALUES (
  'REVIEW_REPLY_DRAFTER_V1',
  1,
  $sys$Draft an owner reply to one customer review for {{site_name}}. Write three variants: professional, warm, brief. Reference the review's specific point(s) without inventing anything the owner didn't say. Never admit legal liability. Keep each reply under 80 words. Return ONLY valid JSON matching the schema. No markdown, no commentary.$sys$,
  $usr$REVIEW (rating {{rating}}/5): {{review_text}}
BUSINESS: {{business_name}}$usr$,
  $schema${"type":"object","required":["professional","warm","brief"],"properties":{"professional":{"type":"string"},"warm":{"type":"string"},"brief":{"type":"string"}}}$schema$,
  'gemini',
  0.5,
  true
)
ON CONFLICT (key, version) DO NOTHING;

INSERT INTO prompt_templates (key, version, system_text, user_template, json_schema, model_hint, temperature, active)
VALUES (
  'CATEGORY_INTRO_V1',
  1,
  $sys$Write a 120-180 word unique intro for a Nepal business-directory category-in-city page. Use ONLY the provided listing_count, notable_localities, and avg_rating. Practical guidance on choosing a provider of this type in this city; no invented businesses, prices, or awards. Return ONLY valid JSON matching the schema. No markdown, no commentary.$sys$,
  $usr$CATEGORY: {{category}}
CITY: {{city}}
listing_count={{n}}
notable_localities={{localities}}
avg_rating={{avg}}$usr$,
  $schema${"type":"object","required":["intro_md","meta_title","meta_description"],"properties":{"intro_md":{"type":"string"},"meta_title":{"type":"string","maxLength":60},"meta_description":{"type":"string","maxLength":155}}}$schema$,
  'gemini',
  0.4,
  true
)
ON CONFLICT (key, version) DO NOTHING;

INSERT INTO prompt_templates (key, version, system_text, user_template, json_schema, model_hint, temperature, active)
VALUES (
  'TRANSLATE_NE_V1',
  1,
  $sys$Translate the following business listing description and FAQs into natural, professional Nepali (Devanagari script) for {{site_name}} readers. Rules: translate meaning faithfully; never add, remove, or invent facts, prices, hours, or claims not present in the English source; keep phone numbers and the business name unchanged. Return ONLY valid JSON matching the schema. No markdown, no commentary.$sys$,
  $usr$DESCRIPTION_EN:
{{description_en}}
FAQS_EN:
{{faqs_json}}$usr$,
  $schema${"type":"object","required":["description_ne","faqs_ne"],"properties":{"description_ne":{"type":"string"},"faqs_ne":{"type":"array","items":{"type":"object","required":["q","a"]}}}}$schema$,
  'gemini',
  0.2,
  true
)
ON CONFLICT (key, version) DO NOTHING;
