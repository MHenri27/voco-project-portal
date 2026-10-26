"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DotsSixVertical,
  Eye,
  EyeSlash,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Star,
  Trash,
  Warning,
} from "@phosphor-icons/react";
import { buttonStyles } from "@/components/button";
import { projectToInput } from "@/lib/to-input";
import { shouldOptimize } from "@/lib/images";
import { cn } from "@/lib/cn";
import type { Project } from "@/lib/types";

type Status = "all" | "published" | "draft";

const STATUS_LABELS: Record<Status, string> = {
  all: "Kõik",
  published: "Avaldatud",
  draft: "Mustandid",
};

export function DashboardView({ initialProjects, canWrite }: { initialProjects: Project[]; canWrite: boolean }) {
  const [projects, setProjects] = useState(initialProjects);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("all");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const stats = useMemo(
    () => ({
      total: projects.length,
      published: projects.filter((p) => p.published).length,
      drafts: projects.filter((p) => !p.published).length,
      featured: projects.filter((p) => p.featured).length,
    }),
    [projects],
  );

  const manualOrder = query.trim() === "" && status === "all";

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (status === "published" && !p.published) return false;
      if (status === "draft" && p.published) return false;
      if (q) return [p.title, p.category, ...p.tags].join(" ").toLowerCase().includes(q);
      return true;
    });
  }, [projects, query, status]);

  async function persistField(project: Project, change: Partial<Project>) {
    setBusyId(project.id);
    setMessage(null);
    const previous = projects;
    const updated = projects.map((p) => (p.id === project.id ? { ...p, ...change } : p));
    setProjects(updated);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectToInput({ ...project, ...change })),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Uuendamine ebaõnnestus.");
      }
    } catch (err) {
      setProjects(previous);
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Uuendamine ebaõnnestus." });
    } finally {
      setBusyId(null);
    }
  }

  async function commitOrder(next: Project[], previous: Project[]) {
    setProjects(next);
    setMessage(null);
    try {
      const res = await fetch("/api/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: next.map((p) => p.id) }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Ümberjärjestamine ebaõnnestus.");
      }
    } catch (err) {
      setProjects(previous);
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Ümberjärjestamine ebaõnnestus." });
    }
  }

  // Drag a row onto another to splice it into that position, then persist.
  function onDrop(targetIndex: number) {
    const from = dragIndex;
    setDragIndex(null);
    setOverIndex(null);
    if (from === null || from === targetIndex) return;
    const previous = projects;
    const next = [...projects];
    const [moved] = next.splice(from, 1);
    next.splice(targetIndex, 0, moved);
    commitOrder(next, previous);
  }

  async function remove(project: Project) {
    if (!window.confirm(`Kustuta "${project.title}"? Seda ei saa tagasi võtta.`)) return;
    setBusyId(project.id);
    setMessage(null);
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Kustutamine ebaõnnestus.");
      }
      setProjects((list) => list.filter((p) => p.id !== project.id));
      setMessage({ type: "success", text: `Kustutatud "${project.title}".` });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Kustutamine ebaõnnestus." });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main id="main" className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-ink md:text-5xl">Projektid</h1>
        </div>
        {canWrite && (
          <Link href="/admin/projects/new" className={buttonStyles("accent", "md")}>
            <Plus weight="bold" className="size-4" />
            Uus projekt
          </Link>
        )}
      </div>

      {!canWrite && (
        <div className="mt-8 flex items-start gap-3 rounded-[var(--radius-card)] border border-accent/30 bg-accent/5 p-4 text-sm text-ink-soft">
          <Warning weight="fill" className="mt-0.5 size-5 shrink-0 text-accent" />
          <p>
            Vaatad ainult-loetavaid näidisandmeid. Pärisprojektide lisamiseks ja muutmiseks sea{" "}
            <code className="font-mono">DATABASE_URL</code> ja täida andmebaas.
          </p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Kokku" value={stats.total} />
        <Stat label="Avaldatud" value={stats.published} />
        <Stat label="Mustandid" value={stats.drafts} />
        <Stat label="Esiletõstetud" value={stats.featured} />
      </div>

      <div className="mt-8 flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          {(["all", "published", "draft"] as Status[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                status === s ? "bg-accent text-on-accent" : "text-ink-soft hover:bg-surface-sunk",
              )}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="relative">
          <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Otsi projekte"
            aria-label="Otsi projekte"
            className="h-10 w-full rounded-full border border-line bg-surface pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-ink lg:w-64"
          />
        </div>
      </div>

      {message && (
        <p className={cn("mt-5 text-sm", message.type === "error" ? "text-accent" : "text-ink-soft")}>
          {message.text}
        </p>
      )}

      {canWrite && (
        <p className="mt-5 text-xs text-muted">
          {manualOrder
            ? "Lohista projekte käepidemest, et neid ümber järjestada."
            : "Tühjenda otsing ja filter, et projekte lohistades ümber järjestada."}
        </p>
      )}

      <div className="mt-6 divide-y divide-line border-y border-line">
        {visible.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted">Ükski projekt ei vasta.</p>
        ) : (
          visible.map((project) => {
            const index = projects.findIndex((p) => p.id === project.id);
            const busy = busyId === project.id;
            const draggable = manualOrder && canWrite;
            return (
              <div
                key={project.id}
                onDragOver={(e) => {
                  if (!draggable || dragIndex === null) return;
                  e.preventDefault();
                  if (overIndex !== index) setOverIndex(index);
                }}
                onDrop={(e) => {
                  if (!draggable) return;
                  e.preventDefault();
                  onDrop(index);
                }}
                className={cn(
                  "flex items-center gap-4 py-4 transition-colors",
                  dragIndex === index && "opacity-40",
                  overIndex === index && dragIndex !== index && "bg-accent/5",
                )}
              >
                {draggable && (
                  <button
                    draggable
                    onDragStart={() => setDragIndex(index)}
                    onDragEnd={() => {
                      setDragIndex(null);
                      setOverIndex(null);
                    }}
                    aria-label={`Lohista ümberjärjestamiseks: ${project.title}`}
                    title="Lohista ümber järjestamiseks"
                    className="flex size-7 shrink-0 cursor-grab items-center justify-center rounded text-muted hover:bg-surface-sunk hover:text-ink active:cursor-grabbing"
                  >
                    <DotsSixVertical weight="bold" className="size-5" />
                  </button>
                )}

                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-sunk">
                  {project.coverImage ? (
                    <Image src={project.coverImage} alt="" fill sizes="56px" unoptimized={!shouldOptimize(project.coverImage)} className="object-cover" />
                  ) : (
                    <span className="flex size-full items-center justify-center font-display text-lg text-line-strong">
                      {project.title.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{project.title}</p>
                  <p className="truncate text-xs text-muted">
                    {project.category}
                    {project.year ? ` ${project.year}` : ""}{" "}
                    <span className="text-muted/60">/{project.slug}</span>
                  </p>
                </div>

                <div className="hidden items-center gap-1 sm:flex">
                  <IconToggle
                    active={project.featured}
                    disabled={!canWrite || busy}
                    onClick={() => persistField(project, { featured: !project.featured })}
                    label={project.featured ? "Eemalda esiletõst" : "Tõsta esile"}
                  >
                    <Star weight={project.featured ? "fill" : "regular"} className="size-4" />
                  </IconToggle>
                  <IconToggle
                    active={project.published}
                    disabled={!canWrite || busy}
                    onClick={() => persistField(project, { published: !project.published })}
                    label={project.published ? "Võta maha" : "Avalda"}
                  >
                    {project.published ? <Eye className="size-4" /> : <EyeSlash className="size-4" />}
                  </IconToggle>
                </div>

                <span
                  className={cn(
                    "hidden rounded-full px-2.5 py-0.5 text-xs md:inline",
                    project.published ? "bg-surface-sunk text-ink-soft" : "bg-ink text-bg",
                  )}
                >
                  {project.published ? "Avaldatud" : "Mustand"}
                </span>

                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    aria-label="Muuda"
                    className="flex size-9 items-center justify-center rounded-full text-muted hover:bg-surface-sunk hover:text-ink"
                  >
                    <PencilSimple className="size-4" />
                  </Link>
                  {canWrite && (
                    <button
                      onClick={() => remove(project)}
                      disabled={busy}
                      aria-label="Kustuta"
                      className="flex size-9 items-center justify-center rounded-full text-muted hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                    >
                      <Trash className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
      <p className="font-display text-4xl font-bold text-ink">{value}</p>
      <p className="kicker mt-1">{label}</p>
    </div>
  );
}

function IconToggle({
  active,
  disabled,
  onClick,
  label,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "flex size-9 items-center justify-center rounded-full transition-colors disabled:opacity-40",
        active ? "text-accent" : "text-muted hover:bg-surface-sunk hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
