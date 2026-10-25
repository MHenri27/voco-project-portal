// Seeds the database with the sample projects. Run with: npm run db:seed
const loadEnvFile = (process as { loadEnvFile?: (path?: string) => void }).loadEnvFile;
try {
  loadEnvFile?.(".env.local");
} catch {}

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { projects } from "@/lib/db/schema";
import { sampleProjects } from "@/lib/sample-data";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local or your environment first.");
  process.exit(1);
}

const sql = postgres(url, { prepare: false });
const db = drizzle(sql);

async function main() {
  await db.delete(projects);
  await db.insert(projects).values(
    sampleProjects.map((p, i) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      description: p.description,
      category: p.category,
      tags: p.tags,
      coverImage: p.coverImage,
      gallery: p.gallery,
      links: p.links,
      year: p.year,
      featured: p.featured,
      published: p.published,
      sortOrder: i,
    })),
  );
  console.log(`Seeded ${sampleProjects.length} projects.`);
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
