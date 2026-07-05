/**
 * OllamaAdapter — local `OLLAMA_BASE_URL` (prompt §5.3). Zero-cost embeddings (`bge-m3` handles
 * Nepali/romanized well) and dev completions. Preferred embedder to keep API spend at ~$0 (§19).
 *
 * NOTE: bge-m3 emits 1024-dim vectors — set EMBEDDING_DIM and the migration's vector(N) to match.
 */
import type { AiProvider, AiRequest, AiResult } from "../types";
import { ProviderUnavailableError } from "../errors";
import { estimateTokens, since, type FetchFn } from "./http";

export type OllamaConfig = {
  baseUrl: string; // http://localhost:11434
  model?: string; // completion model (optional; dev only)
  embedModel: string; // e.g. bge-m3
  fetchFn?: FetchFn;
};

type OllamaGenerate = { response?: string; prompt_eval_count?: number; eval_count?: number };
type OllamaEmbed = { embedding?: number[] };

export class OllamaAdapter implements AiProvider {
  private readonly cfg: OllamaConfig;
  private readonly fetchFn: FetchFn;

  constructor(cfg: OllamaConfig) {
    this.cfg = cfg;
    this.fetchFn = cfg.fetchFn ?? fetch;
  }

  id(): string {
    return "ollama";
  }

  private async generate(req: AiRequest): Promise<AiResult> {
    if (!this.cfg.model) {
      throw new ProviderUnavailableError("ollama", "error", "ollama has no completion model configured");
    }
    const start = performance.now();
    const res = await this.fetchFn(`${this.cfg.baseUrl}/api/generate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: this.cfg.model,
        prompt: `${req.system}\n\n${req.user}`,
        stream: false,
        options: { temperature: req.temperature },
      }),
    });
    if (!res.ok) throw new ProviderUnavailableError("ollama", "error", `ollama HTTP ${res.status}`);
    const data = (await res.json()) as OllamaGenerate;
    const text = data.response ?? "";
    return {
      text,
      inputTokens: data.prompt_eval_count ?? estimateTokens(req.system + req.user),
      outputTokens: data.eval_count ?? estimateTokens(text),
      provider: "ollama",
      model: this.cfg.model,
      latencyMs: since(start),
      cached: false,
    };
  }

  async complete(req: AiRequest): Promise<AiResult> {
    return this.generate(req);
  }

  async completeJson(req: AiRequest): Promise<AiResult> {
    return this.generate(req);
  }

  async embed(text: string): Promise<number[]> {
    const res = await this.fetchFn(`${this.cfg.baseUrl}/api/embeddings`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ model: this.cfg.embedModel, prompt: text }),
    });
    if (!res.ok) throw new ProviderUnavailableError("ollama", "error", `ollama embed HTTP ${res.status}`);
    const data = (await res.json()) as OllamaEmbed;
    return data.embedding ?? [];
  }

  async healthy(): Promise<boolean> {
    return Boolean(this.cfg.baseUrl);
  }
}
