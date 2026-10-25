"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

// Wraps an interactive element so it drifts toward the cursor on hover.
// Driven through gsap.quickTo, so it never touches React state per frame.
export function Magnetic({ children, strength = 0.4 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (window.matchMedia("(hover: none)").matches) return;

      const moveX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const moveY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

      const onMove = contextSafe((event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        moveX(x * strength);
        moveY(y * strength);
      });

      const onLeave = contextSafe(() => {
        moveX(0);
        moveY(0);
      });

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className="inline-block">
      {children}
    </span>
  );
}
