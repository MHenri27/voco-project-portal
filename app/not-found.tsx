import Link from "next/link";
import { buttonStyles } from "@/components/button";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-[100dvh] flex-col items-center justify-center px-5 text-center">
      <p className="kicker">Viga 404</p>
      <h1 className="font-display mt-4 text-5xl font-bold leading-tight tracking-tight text-ink md:text-7xl">
        Lehte ei leitud
      </h1>
      <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
        Seda lehte pole olemas või on see eemaldatud. Kontrolli aadressi või mine tagasi.
      </p>
      <Link href="/" className={buttonStyles("dark", "md", "mt-8")}>
        Tagasi avalehele
      </Link>
    </main>
  );
}
