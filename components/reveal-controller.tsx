"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Drop this once on a static page. It fades and lifts every [data-animate]
// element into view, and reveals anything already on screen at load.
export function RevealController() {
  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = gsap.utils.toArray<HTMLElement>("[data-animate]");
    if (reduce) {
      gsap.set(els, { opacity: 1, y: 0 });
      return;
    }

    els.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    });

    // Recalculate once images have settled so triggers line up.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  });

  return null;
}
