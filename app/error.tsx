"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buttonStyles } from "@/components/button";

// Route-level error boundary. Catches render/data errors in the page tree.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="flex min-h-[100dvh] flex-col items-center justify-center px-5 text-center">
      <p className="kicker">Midagi läks valesti</p>
      <h1 className="font-display mt-4 text-4xl font-bold leading-tight tracking-tight text-ink md:text-6xl">
        Tekkis ootamatu viga
      </h1>
      <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
        Vabandust, leht ei suutnud laadida. Proovi uuesti või pöördu tagasi.
      </p>
      {error.digest && <p className="mt-3 text-xs text-muted">Viitekood: {error.digest}</p>}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button onClick={reset} className={buttonStyles("accent", "md")}>
          Proovi uuesti
        </button>
        <Link href="/" className={buttonStyles("outline", "md")}>
          Avalehele
        </Link>
      </div>
    </main>
  );
}
