/**
 * Concierge conversation transcripts (prompt §9.3: kept ~30 days for QA). In-memory default; a
 * real deployment would back this with Postgres + a scheduled prune, same shape.
 */
import type { ConversationRepository, ConversationTurn, NewConversationTurn } from "../types";

export class InMemoryConversationRepository implements ConversationRepository {
  private seq = 0;
  private readonly turns: ConversationTurn[] = [];

  async append(input: NewConversationTurn): Promise<ConversationTurn> {
    const turn: ConversationTurn = { id: ++this.seq, createdAt: new Date(), ...input };
    this.turns.push(turn);
    return { ...turn };
  }

  async listBySession(sessionId: string): Promise<ConversationTurn[]> {
    return this.turns.filter((t) => t.sessionId === sessionId).map((t) => ({ ...t }));
  }

  async pruneOlderThan(days: number): Promise<number> {
    const cutoff = Date.now() - days * 24 * 60 * 60_000;
    const before = this.turns.length;
    let i = 0;
    while (i < this.turns.length) {
      if (this.turns[i].createdAt.getTime() < cutoff) this.turns.splice(i, 1);
      else i++;
    }
    return before - this.turns.length;
  }
}
