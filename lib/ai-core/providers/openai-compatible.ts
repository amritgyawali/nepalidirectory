/**
 * OpenAiCompatibleAdapter — one adapter for any OpenAI-style `/chat/completions` endpoint
 * (prompt §5.3: "implement Groq/OpenRouter through ONE adapter with configurable base URL").
 * Covers Groq (fast Llama, default fallback) and OpenRouter (`:free` models, second fallback),
 * and future-proofs for any key Amrit supplies.
 *
 * VERIFY at build time (prompt §20.11): current free model IDs and limits per provider.
 */
import type { AiProvider, AiRequest, AiResult } from "../types";
import { ProviderUnavailableError } from "../errors";
import { estimateTokens, since, type FetchFn } from "./http";

export type OpenAiCompatibleConfig = {
  /** Provider id, e.g. "groq" | "openrouter". */
  id: string;
  apiKey: string;
  model: string;
  baseUrl: string; // e.g. https://api.groq.com/openai/v1
  embedModel?: string;
  fetchFn?: FetchFn;
};

type ChatResponse = {
  choices?: { message?: { content?: string } }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
};

type EmbedResponse = { data?: { embedding?: number[] }[] };

export class OpenAiCompatibleAdapter implements AiProvider {
  private readonly cfg: OpenAiCompatibleConfig;
  private readonly fetchFn: FetchFn;

  constructor(cfg: OpenAiCompatibleConfig) {
    this.cfg = cfg;
    this.fetchFn = cfg.fetchFn ?? fetch;
  }

  id(): string {
    return this.cfg.id;
  }

  private async chat(req: AiRequest, jsonMode: boolean): Promise<AiResult> {
    const start = performance.now();
    const res = await this.fetchFn(`${this.cfg.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: this.cfg.model,
        messages: [
          { role: "system", content: req.system },
          { role: "user", content: req.user },
        ],
        temperature: req.temperature,
        max_tokens: req.maxTokens,
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
    });
    if (!res.ok) {
      throw new ProviderUnavailableError(this.cfg.id, res.status === 429 ? "rate_limit" : "error", `${this.cfg.id} HTTP ${res.status}`);
    }
    const data = (await res.json()) as ChatResponse;
    const text = data.choices?.[0]?.message?.content ?? "";
    return {
      text,
      inputTokens: data.usage?.prompt_tokens ?? estimateTokens(req.system + req.user),
      outputTokens: data.usage?.completion_tokens ?? estimateTokens(text),
      provider: this.cfg.id,
      model: this.cfg.model,
      latencyMs: since(start),
      cached: false,
    };
  }

  async complete(req: AiRequest): Promise<AiResult> {
    return this.chat(req, false);
  }

  async completeJson(req: AiRequest): Promise<AiResult> {
    return this.chat(req, true);
  }

  async embed(text: string): Promise<number[]> {
    if (!this.cfg.embedModel) {
      throw new ProviderUnavailableError(this.cfg.id, "error", `${this.cfg.id} has no embed model configured`);
    }
    const res = await this.fetchFn(`${this.cfg.baseUrl}/embeddings`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.cfg.apiKey}`,
      },
      body: JSON.stringify({ model: this.cfg.embedModel, input: text }),
    });
    if (!res.ok) {
      throw new ProviderUnavailableError(this.cfg.id, res.status === 429 ? "rate_limit" : "error", `${this.cfg.id} embed HTTP ${res.status}`);
    }
    const data = (await res.json()) as EmbedResponse;
    return data.data?.[0]?.embedding ?? [];
  }

  async healthy(): Promise<boolean> {
    return Boolean(this.cfg.apiKey);
  }
}
