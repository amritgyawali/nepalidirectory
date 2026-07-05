/**
 * ai-core provider contracts (prompt §5.1).
 *
 * Ported from the Java interface/records in the build prompt to TypeScript. Methods return
 * Promises so real HTTP adapters (Gemini/Groq/OpenRouter/Ollama, Phase 1) fit the same shape;
 * the MockAiProvider resolves synchronously for deterministic, offline tests.
 */

/** A single AI request. `taskKey` selects the prompt template / mock canned response. */
export type AiRequest = {
  taskKey: string;
  system: string;
  user: string;
  temperature: number;
  maxTokens: number;
  meta?: Record<string, unknown>;
};

/** Result of a completion, plus accounting used by the usage log / budget guard (Phase 1). */
export type AiResult = {
  text: string;
  inputTokens: number;
  outputTokens: number;
  provider: string;
  model: string;
  latencyMs: number;
  cached: boolean;
};

/**
 * Provider-agnostic AI layer. Any supplied free-tier key implements this behind an adapter
 * (prompt §5.3). The decorator chain (cache → budget → rate-limit → fallback, §5.2) wraps
 * adapters that satisfy this same interface.
 */
export interface AiProvider {
  /** "gemini" | "groq" | "openrouter" | "ollama" | "mock" */
  id(): string;
  /** Free-text completion. */
  complete(req: AiRequest): Promise<AiResult>;
  /** Schema-validated JSON completion; `jsonSchema` is the task's expected JSON schema. */
  completeJson(req: AiRequest, jsonSchema: string): Promise<AiResult>;
  /** Embedding vector; length must equal EMBEDDING_DIM (config.embeddingDim). */
  embed(text: string): Promise<number[]>;
  /** Cheap health probe used by the fallback chain. */
  healthy(): Promise<boolean>;
}

/** Registry of configured providers + the composed pipelines used for AI calls. */
export interface ProviderRegistry {
  /** Composed completion pipeline: logging → cache → fallback(rate-limit → budget → adapter). */
  chain(): AiProvider;
  /** Composed embedding pipeline (Ollama-first fallback; prompt §5.3). */
  embedder(): AiProvider;
  /** Raw adapters (health checks / admin), primary first then fallbacks. */
  adapters(): AiProvider[];
  /** The primary raw adapter (prompt env AI_PRIMARY). */
  primary(): AiProvider;
  /** Look up a raw adapter by id, or null. */
  get(id: string): AiProvider | null;
}
