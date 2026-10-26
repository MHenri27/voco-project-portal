"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight, MagnifyingGlass } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import type { Project } from "@/lib/types";

gsap.registerPlugin(useGSAP);

type Sort = "curated" | "newest" | "az";

export function CatalogView({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Kõik");
  const [sort, setSort] = useState<Sort>("curated");
  const [active, setActive] = useState<Project | null>(null);

  const root = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const api = useRef<{ move: (x: number, y: number) => void; show: () => void; hide: () => void } | null>(null);

  const categories = useMemo(
    () => ["Kõik", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = projects.filter((p) => category === "Kõik" || p.category === category);
    if (q) {
      list = list.filter((p) => [p.title, p.summary, p.category, ...p.tags].join(" ").toLowerCase().includes(q));
    }
    const sorted = [...list];
    if (sort === "newest") {
      sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || b.createdAt.localeCompare(a.createdAt));
    } else if (sort === "az") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  }, [projects, query, category, sort]);

  const filterKey = `${query}|${category}|${sort}`;

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const rows = gsap.utils.toArray<HTMLElement>(".cat-row");
      if (reduce) {
        gsap.set(rows, { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(
          rows,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.05 },
        );
      }

      // Cursor-following cover preview, desktop only.
      const el = previewRef.current;
      if (el && window.matchMedia("(hover: hover)").matches) {
        const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
        const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
        const op = gsap.quickTo(el, "opacity", { duration: 0.3, ease: "power2.out" });
        const sc = gsap.quickTo(el, "scale", { duration: 0.45, ease: "power3.out" });
        gsap.set(el, { opacity: 0, scale: 0.92, xPercent: 0, yPercent: -50 });
        api.current = {
          move: (mx, my) => {
            x(mx);
            y(my);
          },
          show: () => {
            op(1);
            sc(1);
          },
          hide: () => {
            op(0);
            sc(0.92);
          },
        };
      }
    },
    { scope: root, dependencies: [filterKey] },
  );

  function onPointerMove(e: React.PointerEvent) {
    api.current?.move(e.clientX + 26, e.clientY);
  }

  return (
    <main id="main" className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
      <header className="max-w-3xl">
        <h1 className="font-display mt-3 text-5xl font-bold leading-[0.95] tracking-tight text-ink md:text-8xl">
          Valitud
          <br />
          <span className="text-accent">tööd.</span>
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
          {projects.length} VOCO's loodud projekti. Otsi, filteeri või ava projekt, et selle kohta täpsemalt lugeda.
        </p>
      </header>

      <div className="mt-12 flex flex-col gap-4 border-b border-line pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "relative w-24 text-center text-sm transition-colors",
                category === c ? "font-semibold text-ink" : "text-muted hover:text-ink",
              )}
            >
              {c}
              {category === c && <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-accent" />}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 lg:flex-none">
            <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Otsi"
              className="h-9 w-full rounded-full border border-line bg-surface pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-accent lg:w-44"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-9 rounded-full border border-line bg-surface px-3 text-sm text-ink-soft outline-none transition-colors focus:border-accent"
            aria-label="Sorteeri projekte"
          >
            <option value="curated">Valitud järjestus</option>
            <option value="newest">Uuemad</option>
            <option value="az">Tähestikuliselt</option>
          </select>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <p className="font-display text-2xl text-ink">Midagi ei leitud</p>
          <p className="mt-2 max-w-sm text-sm text-muted">Proovi teist otsingut või tühjenda filter.</p>
        </div>
      ) : (
        <div ref={root} onPointerMove={onPointerMove}>
          {visible.map((project) => (
            <Link
              key={project.id}
              href={`/catalog/${project.slug}`}
              className="cat-row group block border-b border-line"
              onMouseEnter={() => {
                setActive(project);
                api.current?.show();
              }}
              onMouseLeave={() => api.current?.hide()}
            >
              <div className="flex items-center gap-5 py-6 transition-[padding] duration-300 group-hover:lg:pl-4 md:gap-8 md:py-8">
                {/* Inline cover for touch devices, hidden where the hover preview works. */}
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-surface-sunk lg:hidden">
                  {project.coverImage && (
                    <Image src={project.coverImage} alt="" fill sizes="56px" className="object-cover" />
                  )}
                </div>

                <h2 className="font-display flex-1 text-2xl font-semibold tracking-tight text-ink transition-colors duration-300 group-hover:text-accent sm:text-3xl lg:text-5xl">
                  {project.title}
                </h2>

                <div className="hidden shrink-0 items-center gap-8 md:flex">
                  <span className="hidden text-sm text-muted lg:block">{project.tags[0]}</span>
                  <span className="w-24 text-sm text-ink-soft">{project.category}</span>
                  <span className="w-12 text-sm text-muted">{project.year}</span>
                </div>

                <ArrowUpRight
                  weight="bold"
                  className="size-6 shrink-0 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
                />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Floating preview that follows the cursor on desktop. */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-30 hidden aspect-[4/3] w-72 overflow-hidden rounded-2xl bg-surface-sunk shadow-[0_30px_70px_-30px_rgba(37,61,180,0.5)] lg:block"
      >
        {active?.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={active.coverImage} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center font-display text-5xl text-line-strong">
            {active?.title.charAt(0)}
          </div>
        )}
      </div>
    </main>
  );
}
