"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Brand } from "@/components/brand";
import { LoginForm } from "@/components/login-form";
import { Marquee } from "@/components/marquee";

gsap.registerPlugin(useGSAP);

export function Landing({ projectCount }: { projectCount: number }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) return;

      // Explicit start states + .to() so the intro always resolves to visible,
      // even when dev Strict Mode re-runs the effect.
      gsap.set(".nav-item", { y: -16, opacity: 0 });
      gsap.set(".ln", { yPercent: 118 });
      gsap.set(".hl", { scaleX: 0 });
      gsap.set([".sub", ".meta"], { y: 18, opacity: 0 });
      gsap.set(".card", { y: 34, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.9 } });
      tl.to(".nav-item", { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 }, 0)
        .to(".ln", { yPercent: 0, stagger: 0.12, duration: 1 }, "-=0.3")
        .to(".hl", { scaleX: 1, duration: 0.7, ease: "power3.inOut" }, "-=0.35")
        .to(".sub", { y: 0, opacity: 1 }, "-=0.6")
        .to(".meta", { y: 0, opacity: 1 }, "-=0.65")
        .to(".card", { y: 0, opacity: 1, duration: 1 }, "-=1");

      if (contextSafe && !window.matchMedia("(hover: none)").matches) {
        const cardX = gsap.quickTo(".card", "x", { duration: 0.9, ease: "power3.out" });
        const cardY = gsap.quickTo(".card", "y", { duration: 0.9, ease: "power3.out" });

        const onMove = contextSafe((event: PointerEvent) => {
          const dx = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
          const dy = (event.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
          cardX(dx * 10);
          cardY(dy * 10);
        });
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      }
    },
    { scope: root },
  );

  return (
    <main ref={root} className="relative flex min-h-[100dvh] flex-col overflow-hidden px-5 md:px-10">
      <div
        className="bg-wash pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(60% 55% at 82% 12%, var(--accent-soft), transparent 70%), radial-gradient(45% 45% at 10% 95%, var(--accent-soft), transparent 70%)",
        }}
      />

      <header className="flex items-center justify-between py-6">
        <div className="nav-item">
          <Brand href="/" />
        </div>
        <Link
          href="/admin/login"
          className="nav-item group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          Töölaua ligipääs
          <ArrowUpRight weight="bold" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </header>

      <div className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h1 className="font-display text-5xl font-bold leading-[1.0] tracking-tight text-ink md:text-7xl">
            <span className="block overflow-hidden pb-1">
              <span className="ln block">Tööd, mis olen</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="ln block">
                loonud{" "}
                <span className="relative inline-block text-accent">
                  VOCO
                  <span className="hl absolute inset-x-0 -bottom-1 h-2 origin-left rounded-full bg-accent/20" />
                </span>
                's.
              </span>
            </span>
          </h1>

          <p className="sub mt-7 max-w-lg text-lg leading-relaxed text-ink-soft">
            Privaatne kogu minu koolitöö projektidest. Logi sisse jagatud parooliga, et
            sirvida.
          </p>

          <div className="meta mt-8 flex items-center gap-3 text-sm text-muted">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5">
              <span className="size-1.5 rounded-full bg-accent" />
              {projectCount} {projectCount === 1 ? "projekt" : "projekti"}
            </span>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="card relative mx-auto w-full max-w-md overflow-hidden rounded-[var(--radius-card)] border border-line bg-bg p-7 shadow-[0_40px_90px_-50px_rgba(37,61,180,0.45)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
            <h2 className="font-display text-xl font-semibold text-ink">Sisene kataloogi</h2>
            <p className="mt-1 mb-6 text-sm text-muted">Kasuta antud parooli.</p>
            <LoginForm
              scope="viewer"
              redirectTo="/catalog"
              label="Parool"
              //remved hint parameter bc unnecessary
            />
          </div>
        </div>
      </div>

      <footer className="border-t border-line py-4">
        <Marquee items={["Veeb", "Tarkvara", "Disain", "Süsteemid", "Mängud", "Andmebaasid"]} />
      </footer>
    </main>
  );
}
