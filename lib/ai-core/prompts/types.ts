/**
 * Versioned prompt templates (prompt §15, table `prompt_templates`).
 * The code seed (`seed.ts`) is the source of truth; it is also mirrored into a SQL seed
 * migration for the DB path.
 */

export type PromptTemplate = {
  key: string;
  version: number;
  systemText: string;
  userTemplate: string;
  /** Documentation of the expected JSON shape (also drives the per-task validator). */
  jsonSchema?: string;
  modelHint?: string;
  temperature: number;
  active: boolean;
};

/** Replace `{{var}}` placeholders. Missing vars become empty strings (prompt allows blanks). */
export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_m, name: string) => vars[name] ?? "");
}
