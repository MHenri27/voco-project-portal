import { asc, eq, sql } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import type { ProjectRow } from "@/lib/db/schema";
import { sampleProjects } from "@/lib/sample-data";
import type { Project, ProjectInput } from "@/lib/types";

// Thrown when a write is attempted while running on sample data.
export class ReadOnlyError extends Error {
  constructor() {
    super("The database is not configured, so the catalog is read-only. Set DATABASE_URL to edit projects.");
    this.name = "ReadOnlyError";
  }
}

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    description: row.description,
    category: row.category,
    tags: row.tags,
    coverImage: row.coverImage,
    gallery: row.gallery,
    links: row.links,
    year: row.year,
    featured: row.featured,
    published: row.published,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listProjects(opts: { includeDrafts?: boolean } = {}): Promise<Project[]> {
  if (!isDbConfigured()) {
    return sampleProjects.filter((p) => opts.includeDrafts || p.published);
  }
  const rows = await getDb().select().from(projects).orderBy(asc(projects.sortOrder), asc(projects.createdAt));
  const all = rows.map(toProject);
  return opts.includeDrafts ? all : all.filter((p) => p.published);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isDbConfigured()) {
    return sampleProjects.find((p) => p.slug === slug) ?? null;
  }
  const rows = await getDb().select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return rows[0] ? toProject(rows[0]) : null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (!isDbConfigured()) {
    return sampleProjects.find((p) => p.id === id) ?? null;
  }
  const rows = await getDb().select().from(projects).where(eq(projects.id, id)).limit(1);
  return rows[0] ? toProject(rows[0]) : null;
}

export async function createProject(input: ProjectInput): Promise<Project> {
  if (!isDbConfigured()) throw new ReadOnlyError();
  const db = getDb();
  const [{ next }] = await db
    .select({ next: sql<number>`coalesce(max(${projects.sortOrder}), -1) + 1` })
    .from(projects);
  const rows = await db
    .insert(projects)
    .values({ ...input, sortOrder: next })
    .returning();
  return toProject(rows[0]);
}

export async function updateProject(id: string, patch: Partial<ProjectInput>): Promise<Project | null> {
  if (!isDbConfigured()) throw new ReadOnlyError();
  const rows = await getDb()
    .update(projects)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();
  return rows[0] ? toProject(rows[0]) : null;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (!isDbConfigured()) throw new ReadOnlyError();
  const rows = await getDb().delete(projects).where(eq(projects.id, id)).returning({ id: projects.id });
  return rows.length > 0;
}

// Persist a new manual order by writing each id's index to sort_order.
export async function reorderProjects(orderedIds: string[]): Promise<void> {
  if (!isDbConfigured()) throw new ReadOnlyError();
  const db = getDb();
  await db.transaction(async (tx) => {
    for (let i = 0; i < orderedIds.length; i++) {
      await tx.update(projects).set({ sortOrder: i }).where(eq(projects.id, orderedIds[i]));
    }
  });
}
