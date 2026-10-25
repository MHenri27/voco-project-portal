import type { Project, ProjectInput } from "@/lib/types";

// Strip the server-managed fields so a project can be sent back as an update.
export function projectToInput(project: Project): ProjectInput {
  return {
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    description: project.description,
    category: project.category,
    tags: project.tags,
    coverImage: project.coverImage,
    gallery: project.gallery,
    links: project.links,
    year: project.year,
    featured: project.featured,
    published: project.published,
  };
}
