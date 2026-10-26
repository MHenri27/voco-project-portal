import Link from "next/link";

// Wordmark: a blue badge plus the name. No slashes, no monospace.
export function Brand({ href = "/catalog", label = "Projektid" }: { href?: string; label?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5">
      <span className="grid pr-2 pl-2 pt-1 pb-1 place-items-center rounded-[9px] bg-accent font-display text-sm font-bold text-on-accent">
        Henri Maasik
      </span>
      <span className="font-display text-base font-semibold tracking-tight text-ink">
        VOCO <span className="font-medium text-muted">{label}</span>
      </span>
    </Link>
  );
}
