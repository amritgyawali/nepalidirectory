/**
 * GeminiAdapter — Google AI Studio REST (prompt §5.3). Best free tier + strongest Nepali → the
 * default primary; also provides embeddings.
 *
 * VERIFY at build time (prompt §20.11): the current free Gemini model IDs, the embedding model,
 * and its dimension (EMBEDDING_DIM must match). Model IDs come from env, never hardcoded.
 */
import type { AiProvider, AiRequest, AiResult } from "../types";
import { ProviderUnavailableError } from "../errors";
import { estimateTokens, since, type FetchFn } from "./http";

export type GeminiConfig = {
  apiKey: string;
  model: string;
  embedModel: string;
  baseUrl?: string;
  fetchFn?: FetchFn;
};

type GeminiGenerateResponse = {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
};

type GeminiEmbedResponse = { embedding?: { values?: number[] } };

const DEFAULT_BASE = "https://generativelanguage.googleapis.com/v1beta";

export class GeminiAdapter implements AiProvider {
  private readonly cfg: GeminiConfig;
  private readonly base: string;
  private readonly fetchFn: FetchFn;

  constructor(cfg: GeminiConfig) {
    this.cfg = cfg;
    this.base = cfg.baseUrl ?? DEFAULT_BASE;
    this.fetchFn = cfg.fetchFn ?? fetch;
  }

  id(): string {
    return "gemini";
  }

  private async generate(req: AiRequest, jsonMode: boolean): Promise<AiResult> {
    const start = performance.now();
    const url = `${this.base}/models/${this.cfg.model}:generateContent?key=${this.cfg.apiKey}`;
    const body = {
      systemInstruction: { parts: [{ text: req.system }] },
      contents: [{ role: "user", parts: [{ text: req.user }] }],
      generationConfig: {
        temperature: req.temperature,
        maxOutputTokens: req.maxTokens,
        ...(jsonMode ? { responseMimeType: "application/json" } : {}),
      },
    };
    const res = await this.fetchFn(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new ProviderUnavailableError("gemini", res.status === 429 ? "rate_limit" : "error", `gemini HTTP ${res.status}`);
    }
    const data = (await res.json()) as GeminiGenerateResponse;
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
    return {
      text,
      inputTokens: data.usageMetadata?.promptTokenCount ?? estimateTokens(req.system + req.user),
      outputTokens: data.usageMetadata?.candidatesTokenCount ?? estimateTokens(text),
      provider: "gemini",
      model: this.cfg.model,
      latencyMs: since(start),
      cached: false,
    };
  }

  async complete(req: AiRequest): Promise<AiResult> {
    return this.generate(req, false);
  }

  async completeJson(req: AiRequest): Promise<AiResult> {
    return this.generate(req, true);
  }

  async embed(text: string): Promise<number[]> {
    const url = `${this.base}/models/${this.cfg.embedModel}:embedContent?key=${this.cfg.apiKey}`;
    const res = await this.fetchFn(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ content: { parts: [{ text }] } }),
    });
    if (!res.ok) {
      throw new ProviderUnavailableError("gemini", res.status === 429 ? "rate_limit" : "error", `gemini embed HTTP ${res.status}`);
    }
    const data = (await res.json()) as GeminiEmbedResponse;
    return data.embedding?.values ?? [];
  }

  async healthy(): Promise<boolean> {
    return Boolean(this.cfg.apiKey);
  }
}
