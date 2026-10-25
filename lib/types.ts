// Shapes shared across the data layer, API routes, and UI.

export type GalleryImage = {
  url: string;
  caption?: string;
};

export type ProjectLink = {
  label: string;
  url: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  tags: string[];
  coverImage: string | null;
  gallery: GalleryImage[];
  links: ProjectLink[];
  year: number | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

// What the editor sends when creating or updating a project.
export type ProjectInput = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  tags: string[];
  coverImage: string | null;
  gallery: GalleryImage[];
  links: ProjectLink[];
  year: number | null;
  featured: boolean;
  published: boolean;
};
