"use client";

import { useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { ProjectCard } from "@/components/project-card";
import { FeaturedLead } from "@/components/featured-lead";
import { cn } from "@/lib/cn";
import type { Project } from "@/lib/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Sort = "curated" | "newest" | "az";

export function CatalogView({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<Sort>("curated");
  const gridRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  }, [projects]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = projects.filter((p) => category === "All" || p.category === category);
    if (q) {
      list = list.filter((p) => {
        const haystack = [p.title, p.summary, p.category, ...p.tags].join(" ").toLowerCase();
        return haystack.includes(q);
      });
    }
    const sorted = [...list];
    if (sort === "newest") {
      sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || b.createdAt.localeCompare(a.createdAt));
    } else if (sort === "az") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  }, [projects, query, category, sort]);

  const showLead = sort === "curated" && category === "All" && query.trim() === "";
  const lead = showLead ? visible.find((p) => p.featured) ?? null : null;
  const gridItems = lead ? visible.filter((p) => p.id !== lead.id) : visible;

  const filterKey = `${query}|${category}|${sort}`;

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cards = gsap.utils.toArray<HTMLElement>(".cat-card");
      if (reduce) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            delay: (i % 3) * 0.06,
            scrollTrigger: { trigger: card, start: "top 92%", once: true },
          },
        );
      });
    },
    { scope: gridRef, dependencies: [filterKey] },
  );

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="kicker">The collection</p>
          <h1 className="font-display mt-3 text-4xl font-bold leading-[1.02] tracking-tight text-ink md:text-6xl">
            Everything I have
            <br />
            built at <span className="text-accent">VOCO.</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            Coursework, side projects, and experiments. Filter by discipline or search for something specific.
          </p>
        </div>
        <p className="shrink-0 text-sm text-muted">
          {visible.length} {visible.length === 1 ? "project" : "projects"}
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                category === c ? "bg-accent text-on-accent" : "text-ink-soft hover:bg-surface-sunk",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects"
              className="h-10 w-full rounded-full border border-line bg-surface pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-accent lg:w-56"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-10 rounded-full border border-line bg-surface px-4 text-sm text-ink-soft outline-none transition-colors focus:border-accent"
            aria-label="Sort projects"
          >
            <option value="curated">Curated</option>
            <option value="newest">Newest</option>
            <option value="az">A to Z</option>
          </select>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <p className="font-display text-2xl text-ink">Nothing here yet</p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            No projects match that search. Try a different term or clear the filters.
          </p>
        </div>
      ) : (
        <div ref={gridRef} className="mt-10">
          {lead && <FeaturedLead project={lead} />}
          {gridItems.length > 0 && (
            <div
              className={cn(
                "grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3",
                lead && "mt-12",
              )}
            >
              {gridItems.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
