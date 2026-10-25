import Link from "next/link";
import { SquaresFour } from "@phosphor-icons/react/dist/ssr";
import { LogoutButton } from "@/components/logout-button";

// Top bar for the gated pages. Pass isAdmin to surface the dashboard link.
export function SiteNav({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-[1400px] items-center justify-between px-5 md:px-10">
        <Link href="/catalog" className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-ink">
          <span className="size-2 rounded-full bg-accent" />
          VOCO / Portal
        </Link>
        <div className="flex items-center gap-6">
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
            >
              <SquaresFour weight="bold" className="size-4" />
              Dashboard
            </Link>
          )}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
