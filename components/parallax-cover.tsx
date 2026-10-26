"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { shouldOptimize } from "@/lib/images";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// A cover image that drifts slightly slower than the scroll, inside a fixed frame.
export function ParallaxCover({ src, alt }: { src: string; alt: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.to(inner.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: frame.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-surface-sunk">
      <div ref={inner} className="absolute inset-0 -top-[6%] h-[112%]">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1000px"
          unoptimized={!shouldOptimize(src)}
          className="object-cover"
        />
      </div>
    </div>
  );
}
