"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight } from "@phosphor-icons/react";
import { LoginForm } from "@/components/login-form";
import { Marquee } from "@/components/marquee";

gsap.registerPlugin(useGSAP);

export function Landing({ projectCount }: { projectCount: number }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!reduce) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.9 } });
        tl.from(".ln-nav", { y: -16, opacity: 0 })
          .from(".ghost", { opacity: 0, duration: 1.6 }, 0)
          .from(".ln-eyebrow", { y: 20, opacity: 0 }, "-=0.5")
          .from(".ln-title", { yPercent: 115, opacity: 0, stagger: 0.12, duration: 1 }, "-=0.4")
          .from(".ln-sub", { y: 20, opacity: 0 }, "-=0.7")
          .from(".ln-card", { y: 28, opacity: 0 }, "-=0.6")
          .from(".ln-visual", { opacity: 0, scale: 0.9, duration: 1.3 }, "-=1.3");

        gsap.to(".ring-rotate", { rotation: 360, transformOrigin: "center", repeat: -1, duration: 64, ease: "none" });
        gsap.to(".ring-counter", { rotation: -360, transformOrigin: "center", repeat: -1, duration: 90, ease: "none" });
        gsap.to(".orbit", { rotation: 360, transformOrigin: "center", repeat: -1, duration: 16, ease: "none" });
        gsap.to(".orbit-slow", { rotation: -360, transformOrigin: "center", repeat: -1, duration: 28, ease: "none" });
      }

      // Pointer-reactive drift on the visual and the ghost wordmark.
      if (!reduce && contextSafe && !window.matchMedia("(hover: none)").matches) {
        const driftVisual = gsap.quickTo(".ln-visual", "x", { duration: 0.8, ease: "power3.out" });
        const driftVisualY = gsap.quickTo(".ln-visual", "y", { duration: 0.8, ease: "power3.out" });
        const driftGhost = gsap.quickTo(".ghost", "x", { duration: 1.2, ease: "power3.out" });

        const onMove = contextSafe((event: PointerEvent) => {
          const cx = window.innerWidth / 2;
          const cy = window.innerHeight / 2;
          const dx = (event.clientX - cx) / cx;
          const dy = (event.clientY - cy) / cy;
          driftVisual(dx * 24);
          driftVisualY(dy * 24);
          driftGhost(dx * -40);
        });
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      }
    },
    { scope: root },
  );

  return (
    <main ref={root} className="relative flex min-h-[100dvh] flex-col overflow-hidden px-5 md:px-10">
      <span
        aria-hidden="true"
        className="ghost pointer-events-none absolute -right-[4vw] top-[14vh] select-none font-display text-[30vw] font-extrabold leading-none tracking-tighter text-ink/[0.035] md:text-[24vw]"
      >
        WORK
      </span>

      <header className="ln-nav relative z-10 flex items-center justify-between py-6">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-ink">
          <span className="size-2 rounded-full bg-accent" />
          VOCO / Portal
        </div>
        <Link
          href="/admin/login"
          className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          Owner access
          <ArrowUpRight weight="bold" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </header>

      <div className="relative z-10 grid flex-1 items-center gap-12 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-xl">
          <p className="ln-eyebrow font-mono text-xs uppercase tracking-[0.2em] text-muted">
            A private project catalog
          </p>

          <h1 className="font-display mt-5 text-5xl font-extrabold leading-[1.02] tracking-tight text-ink md:text-7xl">
            <span className="block overflow-hidden pb-1">
              <span className="ln-title block">Built at VOCO.</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="ln-title block">
                Kept in <span className="text-accent">one place.</span>
              </span>
            </span>
          </h1>

          <p className="ln-sub mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            A catalog of my schoolwork projects. Enter the password to browse the full collection.
          </p>

          <div className="ln-card group relative mt-9 max-w-md overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[0_30px_80px_-50px_rgba(20,19,14,0.6)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ink/15 to-transparent" />
            <div className="mb-5 flex items-baseline justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Enter</span>
              <span className="font-mono text-xs text-muted">
                {projectCount} {projectCount === 1 ? "project" : "projects"} inside
              </span>
            </div>
            <LoginForm
              scope="viewer"
              redirectTo="/catalog"
              label="Access password"
              hint="Ask Henri for the password if you do not have it."
            />
          </div>
        </div>

        <div className="ln-visual relative hidden aspect-square w-full max-w-md justify-self-center lg:flex">
          <svg viewBox="0 0 400 400" className="size-full" fill="none">
            <g className="ring-rotate">
              <circle cx="200" cy="200" r="184" stroke="var(--line-strong)" strokeWidth="1" />
              <circle cx="200" cy="20" r="4" fill="var(--ink)" />
            </g>
            <g className="ring-counter">
              <circle cx="200" cy="200" r="138" stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="2 10" />
            </g>
            <g className="ring-rotate">
              <circle cx="200" cy="200" r="92" stroke="var(--line-strong)" strokeWidth="1" />
            </g>
            <g className="orbit">
              <circle cx="200" cy="62" r="7" fill="var(--accent)" />
            </g>
            <g className="orbit-slow">
              <circle cx="108" cy="200" r="4" fill="var(--ink)" />
            </g>
            <circle cx="200" cy="200" r="24" fill="var(--ink)" />
            <circle cx="200" cy="200" r="7" fill="var(--bg)" />
          </svg>
        </div>
      </div>

      <footer className="relative z-10 border-t border-line py-6">
        <Marquee items={["Web", "Hardware", "Design", "Systems", "Games", "Databases"]} />
      </footer>
    </main>
  );
}
