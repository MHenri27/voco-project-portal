import Link from "next/link";

// Wordmark: a blue badge plus the name. No slashes, no monospace.
export function Brand({ href = "/catalog", label = "Projects" }: { href?: string; label?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5">
      <span className="grid size-7 place-items-center rounded-[9px] bg-accent font-display text-sm font-bold text-on-accent">
        V
      </span>
      <span className="font-display text-base font-semibold tracking-tight text-ink">
        VOCO <span className="font-medium text-muted">{label}</span>
      </span>
    </Link>
  );
}
