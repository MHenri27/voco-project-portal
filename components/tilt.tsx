"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

// Tilts its content toward the cursor in 3D. The parent provides perspective.
// Driven by gsap.quickTo, so it stays off the React render path.
export function Tilt({ children, max = 6, className }: { children: ReactNode; max?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const el = ref.current;
      const parent = el?.parentElement;
      if (!el || !parent || !contextSafe) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (window.matchMedia("(hover: none)").matches) return;

      const rotX = gsap.quickTo(el, "rotationX", { duration: 0.4, ease: "power3.out" });
      const rotY = gsap.quickTo(el, "rotationY", { duration: 0.4, ease: "power3.out" });

      const onMove = contextSafe((event: PointerEvent) => {
        const rect = parent.getBoundingClientRect();
        const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        rotY(dx * max);
        rotX(-dy * max);
      });
      const onLeave = contextSafe(() => {
        rotX(0);
        rotY(0);
      });

      parent.addEventListener("pointermove", onMove);
      parent.addEventListener("pointerleave", onLeave);
      return () => {
        parent.removeEventListener("pointermove", onMove);
        parent.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}
