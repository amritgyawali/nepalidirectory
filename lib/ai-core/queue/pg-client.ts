/**
 * Shared `pg` connection pool -> `SqlExecutor` adapter (prompt §5.4 / §18). One pool per
 * `DATABASE_URL` value, reused across factories (`createJobRepository`, `createListingRepository`,
 * acquisition store factories) so a process opens exactly one pool against Supabase Postgres.
 */
import { Pool } from "pg";
import type { SqlExecutor } from "./pg-repo";

const pools = new Map<string, Pool>();

function getPool(databaseUrl: string): Pool {
  let pool = pools.get(databaseUrl);
  if (!pool) {
    pool = new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
    pools.set(databaseUrl, pool);
  }
  return pool;
}

/** Build a parametrized-query executor backed by a pooled `pg` client. */
export function createPgSqlExecutor(databaseUrl: string): SqlExecutor {
  const pool = getPool(databaseUrl);
  return async <Row = Record<string, unknown>>(text: string, params?: unknown[]) => {
    const res = await pool.query(text, params);
    return res.rows as Row[];
  };
}
