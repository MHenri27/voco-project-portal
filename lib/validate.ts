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

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => asString(v)).filter(Boolean);
}

function asGallery(value: unknown): GalleryImage[] {
  if (!Array.isArray(value)) return [];
  const out: GalleryImage[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const url = asString((item as Record<string, unknown>).url);
    if (!url) continue;
    const caption = asString((item as Record<string, unknown>).caption);
    out.push(caption ? { url, caption } : { url });
  }
  return out;
}

function asLinks(value: unknown): ProjectLink[] {
  if (!Array.isArray(value)) return [];
  const out: ProjectLink[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const url = asString((item as Record<string, unknown>).url);
    const label = asString((item as Record<string, unknown>).label) || url;
    if (!url) continue;
    out.push({ label, url });
  }
  return out;
}

// Validate and normalise an untrusted request body into a ProjectInput.
export function parseProjectInput(body: unknown): ProjectInput {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Expected a project object.");
  }
  const raw = body as Record<string, unknown>;

  const title = asString(raw.title);
  if (!title) throw new ValidationError("Title is required.");

  const slug = asString(raw.slug) ? slugify(asString(raw.slug)) : slugify(title);
  if (!slug) throw new ValidationError("Could not build a slug from the title.");

  let year: number | null = null;
  if (raw.year !== null && raw.year !== undefined && raw.year !== "") {
    const n = Number(raw.year);
    if (!Number.isInteger(n) || n < 1980 || n > 2100) {
      throw new ValidationError("Year must be a whole number between 1980 and 2100.");
    }
    year = n;
  }

  return {
    title,
    slug,
    summary: asString(raw.summary),
    description: asString(raw.description),
    category: asString(raw.category) || "Other",
    tags: asStringArray(raw.tags),
    coverImage: asString(raw.coverImage) || null,
    gallery: asGallery(raw.gallery),
    links: asLinks(raw.links),
    year,
    featured: Boolean(raw.featured),
    published: raw.published === undefined ? true : Boolean(raw.published),
  };
}
