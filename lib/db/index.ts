import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

// True once a DATABASE_URL exists, otherwise the app falls back to sample data.
export function isDbConfigured() {
  return Boolean(url);
}

// Lazily build the client so a missing env var never breaks the build.
export function getDb() {
  if (!url) {
    throw new Error("DATABASE_URL is not set. Add it to run against a real database.");
  }
  if (!db) {
    // prepare:false keeps us compatible with the Neon/pgbouncer pooler on Vercel.
    const client = postgres(url, { prepare: false });
    db = drizzle(client, { schema });
  }
  return db;
}
