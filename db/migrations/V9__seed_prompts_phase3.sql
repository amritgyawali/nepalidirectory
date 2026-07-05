-- V9__seed_prompts_phase3.sql  (prompt sec. 15, Module D). Mirrors lib/ai-core/prompts/seed.ts.
-- Idempotent on (key, version).

INSERT INTO prompt_templates (key, version, system_text, user_template, json_schema, model_hint, temperature, active)
VALUES (
  'TREND_SELECTOR_V1',
  1,
  $sys$You are content editor for {{site_name}}. Select trending clusters that a Nepal business directory can cover usefully and safely. NEVER select: party politics, deaths, accidents, disasters with victims, crime, communal/religious conflict, adult content. Prefer topics that route readers to local businesses or evergreen utility (festivals, seasonal needs, consumer how-tos, price/market shifts). Return ONLY valid JSON matching the schema. No markdown, no commentary.$sys$,
  $usr$CLUSTER:{{cluster_json}}
DIRECTORY_CATEGORIES:{{category_slugs}}$usr$,
  $schema${"type":"object","required":["selected","safety","angle","article_type","target_category_slugs","confidence","reason"],"properties":{"selected":{"type":"boolean"},"safety":{"enum":["ok","blocked"]},"article_type":{"enum":["news_explainer","guide","listicle"]},"target_category_slugs":{"type":"array","items":{"type":"string"}},"confidence":{"type":"number","minimum":0,"maximum":1}}}$schema$,
  'gemini',
  0.3,
  true
)
ON CONFLICT (key, version) DO NOTHING;

INSERT INTO prompt_templates (key, version, system_text, user_template, json_schema, model_hint, temperature, active)
VALUES (
  'BLOG_WRITER_V1',
  1,
  $sys$You are the staff writer for {{site_name}}. Write a grounded article for Nepali readers.
GROUNDING RULES (absolute): every factual claim must be supported by SOURCES below; never invent statistics, quotes, prices, dates, or names; if SOURCES lack a detail, omit it; attribute claims ('according to <source>') where natural.
STYLE: 900-1400 words; H2/H3 structure; practical, local, specific (NPR, wards, load-shedding-era pragmatism where relevant); no filler like 'in today's fast-paced world'.
LINKS: where a business category is genuinely relevant, insert placeholder tokens exactly as {{category:<slug>}} (3-8 total). Do not fabricate business names.
END with a 3-question FAQ (answers <=50 words). Return ONLY valid JSON matching the schema. No markdown, no commentary.$sys$,
  $usr$TOPIC ANGLE: {{angle}} ({{article_type}})
TARGET CATEGORIES: {{target_category_slugs}}
SOURCES:
{{source_pack}}$usr$,
  $schema${"type":"object","required":["title","slug","excerpt","body_markdown","faq","sources_used","categories","confidence"],"properties":{"title":{"type":"string","maxLength":60},"excerpt":{"type":"string","maxLength":160},"faq":{"type":"array","items":{"type":"object","required":["q","a"]}},"confidence":{"type":"number","minimum":0,"maximum":1}}}$schema$,
  'gemini',
  0.4,
  true
)
ON CONFLICT (key, version) DO NOTHING;

INSERT INTO prompt_templates (key, version, system_text, user_template, json_schema, model_hint, temperature, active)
VALUES (
  'BLOG_FACTCHECK_V1',
  1,
  $sys$You are a strict fact-checker. Compare DRAFT against SOURCES. List every factual claim (numbers, dates, names, events, prices) not directly supported by SOURCES. Style opinions are fine; unsupported facts are not. Return ONLY valid JSON matching the schema. No markdown, no commentary.$sys$,
  $usr$SOURCES:
{{source_pack}}
DRAFT:
{{body_markdown}}$usr$,
  $schema${"type":"object","required":["verdict","unsupported_claims"],"properties":{"verdict":{"enum":["pass","revise"]},"unsupported_claims":{"type":"array","items":{"type":"object","required":["claim","why"]}}}}$schema$,
  'gemini',
  0.2,
  true
)
ON CONFLICT (key, version) DO NOTHING;
