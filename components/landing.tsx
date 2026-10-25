"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight } from "@phosphor-icons/react";
import { LoginForm } from "@/components/login-form";
import { Marquee } from "@/components/marquee";

gsap.registerPlugin(useGSAP);

export function Landing() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.9 } });
      tl.from(".ln-nav", { y: -16, opacity: 0 })
        .from(".ln-eyebrow", { y: 20, opacity: 0 }, "-=0.5")
        .from(".ln-title", { yPercent: 115, opacity: 0, stagger: 0.12, duration: 1 }, "-=0.4")
        .from(".ln-sub", { y: 20, opacity: 0 }, "-=0.7")
        .from(".ln-card", { y: 28, opacity: 0 }, "-=0.6")
        .from(".ln-visual", { opacity: 0, scale: 0.9, duration: 1.3 }, "-=1.3");

      gsap.to(".ring-rotate", {
        rotation: 360,
        transformOrigin: "center",
        repeat: -1,
        duration: 64,
        ease: "none",
      });
      gsap.to(".orbit", {
        rotation: 360,
        transformOrigin: "center",
        repeat: -1,
        duration: 16,
        ease: "none",
      });
    },
    { scope: root },
  );

  return (
    <main ref={root} className="relative flex min-h-[100dvh] flex-col px-5 md:px-10">
      <header className="ln-nav flex items-center justify-between py-6">
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

      <div className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[1.1fr_0.9fr]">
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

          <div className="ln-card mt-9 max-w-md rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[0_24px_60px_-40px_rgba(20,19,14,0.5)]">
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
              <circle cx="200" cy="200" r="180" stroke="var(--line-strong)" strokeWidth="1" />
              <circle cx="200" cy="200" r="132" stroke="var(--line-strong)" strokeWidth="1" />
              <circle cx="200" cy="200" r="84" stroke="var(--line-strong)" strokeWidth="1" />
              <circle cx="200" cy="20" r="4" fill="var(--ink)" />
            </g>
            <g className="orbit">
              <circle cx="200" cy="68" r="7" fill="var(--accent)" />
            </g>
            <circle cx="200" cy="200" r="22" fill="var(--ink)" />
            <circle cx="200" cy="200" r="7" fill="var(--bg)" />
          </svg>
        </div>
      </div>

      <footer className="border-t border-line py-6">
        <Marquee items={["Web", "Hardware", "Design", "Systems", "Games", "Databases"]} />
      </footer>
    </main>
  );
}
