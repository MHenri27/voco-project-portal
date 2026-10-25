import Link from "next/link";
import { SquaresFour } from "@phosphor-icons/react/dist/ssr";
import { Brand } from "@/components/brand";
import { LogoutButton } from "@/components/logout-button";

// Top bar for the gated pages. Pass isAdmin to surface the dashboard link.
export function SiteNav({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-[1400px] items-center justify-between px-5 md:px-10">
        <Brand href="/catalog" label="Projects" />
        <div className="flex items-center gap-6">
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
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
