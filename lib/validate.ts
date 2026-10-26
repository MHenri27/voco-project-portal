import type { GalleryImage, ProjectInput, ProjectLink } from "@/lib/types";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

// Keep stored text within sane bounds so one request can't bloat the table.
function cap(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => cap(asString(v), 50))
    .filter(Boolean)
    .slice(0, 30);
}

function asGallery(value: unknown): GalleryImage[] {
  if (!Array.isArray(value)) return [];
  const out: GalleryImage[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const url = cap(asString((item as Record<string, unknown>).url), 2000);
    if (!url) continue;
    const caption = cap(asString((item as Record<string, unknown>).caption), 300);
    out.push(caption ? { url, caption } : { url });
  }
  return out.slice(0, 60);
}

function asLinks(value: unknown): ProjectLink[] {
  if (!Array.isArray(value)) return [];
  const out: ProjectLink[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const url = cap(asString((item as Record<string, unknown>).url), 2000);
    const label = cap(asString((item as Record<string, unknown>).label), 120) || url;
    if (!url) continue;
    out.push({ label, url });
  }
  return out.slice(0, 30);
}

// Validate and normalise an untrusted request body into a ProjectInput.
export function parseProjectInput(body: unknown): ProjectInput {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Oodati projekti objekti.");
  }
  const raw = body as Record<string, unknown>;

  const title = asString(raw.title);
  if (!title) throw new ValidationError("Pealkiri on nõutud.");

  const slug = asString(raw.slug) ? slugify(asString(raw.slug)) : slugify(title);
  if (!slug) throw new ValidationError("Pealkirjast ei õnnestunud slug'i luua.");

  let year: number | null = null;
  if (raw.year !== null && raw.year !== undefined && raw.year !== "") {
    const n = Number(raw.year);
    if (!Number.isInteger(n) || n < 1980 || n > 2100) {
      throw new ValidationError("Aasta peab olema täisarv vahemikus 1980 kuni 2100.");
    }
    year = n;
  }

  return {
    title: cap(title, 200),
    slug: cap(slug, 200),
    summary: cap(asString(raw.summary), 500),
    description: cap(asString(raw.description), 20000),
    category: cap(asString(raw.category), 80) || "Other",
    tags: asStringArray(raw.tags),
    coverImage: cap(asString(raw.coverImage), 2000) || null,
    gallery: asGallery(raw.gallery),
    links: asLinks(raw.links),
    year,
    featured: Boolean(raw.featured),
    published: raw.published === undefined ? true : Boolean(raw.published),
  };
}
