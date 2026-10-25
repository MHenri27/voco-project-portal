import { defineConfig } from "drizzle-kit";

// Load local env when present so `drizzle-kit push` finds DATABASE_URL.
const loadEnvFile = (process as { loadEnvFile?: (path?: string) => void }).loadEnvFile;
try {
  loadEnvFile?.(".env.local");
} catch {}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
