import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Star } from "@phosphor-icons/react/dist/ssr";
import type { Project } from "@/lib/types";

// The hero slot at the top of the catalog: one project, shown large.
export function FeaturedLead({ project }: { project: Project }) {
  return (
    <Link
      href={`/catalog/${project.slug}`}
      data-animate
      className="cat-card group grid items-center gap-6 rounded-[var(--radius-card)] border border-line bg-surface p-4 lg:grid-cols-[1.5fr_1fr] lg:p-5"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-surface-sunk">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <span className="font-display text-7xl font-bold text-line-strong">{project.title.charAt(0)}</span>
          </div>
        )}
        <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-bg/90 px-3 py-1 text-xs font-medium text-ink backdrop-blur-sm">
          <Star weight="fill" className="size-3 text-accent" />
          Featured
        </span>
      </div>

      <div className="px-2 lg:px-6">
        <p className="kicker">
          {project.category}
          {project.year ? <span className="ml-3 text-muted/70">{project.year}</span> : null}
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-ink transition-colors group-hover:text-accent md:text-4xl">
          {project.title}
        </h2>
        <p className="mt-4 line-clamp-3 text-ink-soft">{project.summary}</p>

        {project.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-ink-soft">
                {tag}
              </span>
            ))}
          </div>
        )}

        <span className="mt-6 inline-flex items-center gap-1.5 font-medium text-ink">
          View project
          <ArrowUpRight weight="bold" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
