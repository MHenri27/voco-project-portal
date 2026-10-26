"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Star } from "@phosphor-icons/react/dist/ssr";
import { Tilt } from "@/components/tilt";
import { shouldOptimize } from "@/lib/images";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/catalog/${project.slug}`} className="cat-card group block [perspective:1000px]" data-animate>
      <Tilt>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-surface-sunk">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized={!shouldOptimize(project.coverImage)}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <span className="font-display text-6xl font-bold text-line-strong">
                {project.title.charAt(0)}
              </span>
            </div>
          )}

          {project.featured && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-bg/90 px-3 py-1 text-xs font-medium text-ink backdrop-blur-sm">
              <Star weight="fill" className="size-3 text-accent" />
              Esiletõstetud
            </span>
          )}

          {!project.published && (
            <span className="absolute right-3 top-3 rounded-full bg-ink px-3 py-1 text-xs font-medium text-bg">
              Mustand
            </span>
          )}

          <span className="absolute bottom-3 right-3 flex size-10 translate-y-2 items-center justify-center rounded-full bg-ink text-bg opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight weight="bold" className="size-5" />
          </span>
        </div>

        <div className="mt-4">
          <h3 className="font-display text-xl font-semibold text-ink transition-colors group-hover:text-accent">
            {project.title}
          </h3>
          <p className="mt-1 text-sm text-muted">
            {project.category}
            {project.year ? <span className="text-muted/70"> {project.year}</span> : null}
          </p>
        </div>

        {project.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-ink-soft">
                {tag}
              </span>
            ))}
          </div>
        )}
      </Tilt>
    </Link>
  );
}
