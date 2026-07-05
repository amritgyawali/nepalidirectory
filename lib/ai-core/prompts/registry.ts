/**
 * Prompt template registry (prompt §15). Backed by the code seed; a DB-backed variant can read
 * `prompt_templates` when Postgres exists. Resolves the active (highest) version of a key.
 */
import type { PromptTemplate } from "./types";
import { renderTemplate } from "./types";
import { SEED_TEMPLATES } from "./seed";

export type RenderedPrompt = {
  template: PromptTemplate;
  system: string;
  user: string;
};

export class PromptRegistry {
  private readonly byKey = new Map<string, PromptTemplate>();

  constructor(templates: PromptTemplate[] = SEED_TEMPLATES) {
    for (const t of templates) {
      const existing = this.byKey.get(t.key);
      if (t.active && (!existing || t.version > existing.version)) this.byKey.set(t.key, t);
    }
  }

  get(key: string): PromptTemplate {
    const t = this.byKey.get(key);
    if (!t) throw new Error(`prompt_templates: no active template for key ${key}`);
    return t;
  }

  /** Fill both the system and user templates with `vars`. */
  render(key: string, vars: Record<string, string>): RenderedPrompt {
    const template = this.get(key);
    return {
      template,
      system: renderTemplate(template.systemText, vars),
      user: renderTemplate(template.userTemplate, vars),
    };
  }
}
