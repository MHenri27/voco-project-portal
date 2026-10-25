"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FloppyDisk, Trash } from "@phosphor-icons/react";
import { Field, Toggle, TagInput, ImageField, GalleryEditor, LinkEditor, inputClass } from "@/components/editor/fields";
import { MarkdownField } from "@/components/editor/markdown-field";
import { ProjectCard } from "@/components/project-card";
import { Button, buttonStyles } from "@/components/button";
import { slugify } from "@/lib/validate";
import { cn } from "@/lib/cn";
import type { GalleryImage, Project, ProjectInput, ProjectLink } from "@/lib/types";

const CATEGORIES = ["Web", "Design", "Hardware", "Systems", "Games", "Databases", "Other"];

function emptyInput(): ProjectInput {
  return {
    title: "",
    slug: "",
    summary: "",
    description: "",
    category: "Web",
    tags: [],
    coverImage: null,
    gallery: [],
    links: [],
    year: new Date().getFullYear(),
    featured: false,
    published: true,
  };
}

export function ProjectEditor({ project }: { project?: Project }) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectInput>(project ?? emptyInput());
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function set<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onTitle(value: string) {
    setForm((f) => ({ ...f, title: value, slug: slugTouched ? f.slug : slugify(value) }));
  }

  async function save() {
    setError(null);
    if (!form.title.trim()) {
      setError("A title is required.");
      return;
    }
    setPending(true);
    const editing = Boolean(project);
    try {
      const res = await fetch(editing ? `/api/projects/${project!.id}` : "/api/projects", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
      setPending(false);
    }
  }

  async function remove() {
    if (!project) return;
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    setPending(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Delete failed.");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
      setPending(false);
    }
  }

  const previewProject: Project = {
    ...form,
    id: project?.id ?? "preview",
    slug: form.slug || "preview",
    createdAt: "",
    updatedAt: "",
    sortOrder: 0,
  };

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-10 md:px-10 md:py-14">
      <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft weight="bold" className="size-4" />
            Dashboard
          </Link>
          <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
            {project ? "Edit project" : "New project"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {project && (
            <Button variant="ghost" onClick={remove} disabled={pending} className="text-red-600 hover:bg-red-50">
              <Trash className="size-4" /> Delete
            </Button>
          )}
          <Button variant="dark" onClick={save} disabled={pending}>
            <FloppyDisk weight="bold" className="size-4" />
            {pending ? "Saving…" : "Save project"}
          </Button>
        </div>
      </div>

      {error && <p className="mt-5 text-sm text-accent">{error}</p>}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.55fr_1fr]">
        <div className="flex flex-col gap-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Title">
                <input value={form.title} onChange={(e) => onTitle(e.target.value)} placeholder="Project name" className={inputClass} />
              </Field>
            </div>
            <Field label="Slug" hint="Used in the project URL.">
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", slugify(e.target.value));
                }}
                placeholder="project-name"
                className={cn(inputClass, "text-sm")}
              />
            </Field>
            <Field label="Category">
              <input list="category-options" value={form.category} onChange={(e) => set("category", e.target.value)} className={inputClass} />
              <datalist id="category-options">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
            <Field label="Year">
              <input
                type="number"
                value={form.year ?? ""}
                onChange={(e) => set("year", e.target.value ? Number(e.target.value) : null)}
                placeholder="2026"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Summary" hint="One or two sentences shown on the card.">
            <textarea
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
              rows={2}
              placeholder="A short description"
              className={cn(inputClass, "resize-y")}
            />
          </Field>

          <div>
            <span className="text-sm font-medium text-ink">Description</span>
            <div className="mt-2">
              <MarkdownField value={form.description} onChange={(v) => set("description", v)} />
            </div>
          </div>

          <Field label="Tags">
            <TagInput tags={form.tags} onChange={(tags) => set("tags", tags)} />
          </Field>

          <Field label="Cover image">
            <ImageField value={form.coverImage} onChange={(url) => set("coverImage", url)} />
          </Field>

          <div>
            <span className="text-sm font-medium text-ink">Gallery</span>
            <div className="mt-2">
              <GalleryEditor items={form.gallery} onChange={(items: GalleryImage[]) => set("gallery", items)} />
            </div>
          </div>

          <div>
            <span className="text-sm font-medium text-ink">Links</span>
            <div className="mt-2">
              <LinkEditor items={form.links} onChange={(items: ProjectLink[]) => set("links", items)} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Toggle checked={form.featured} onChange={(v) => set("featured", v)} label="Featured" description="Highlight on the catalog." />
            <Toggle checked={form.published} onChange={(v) => set("published", v)} label="Published" description="Visible to viewers." />
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="kicker">Live preview</p>
          <div className="mt-4 rounded-[var(--radius-card)] border border-line bg-surface p-5">
            <div className="pointer-events-none">
              <ProjectCard project={previewProject} />
            </div>
          </div>
          {!project && (
            <Link href="/admin" className={cn(buttonStyles("outline", "sm"), "mt-4")}>
              Cancel
            </Link>
          )}
        </aside>
      </div>
    </section>
  );
}
