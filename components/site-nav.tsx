import Link from "next/link";
import { SquaresFour } from "@phosphor-icons/react/dist/ssr";
import { Brand } from "@/components/brand";
import { LogoutButton } from "@/components/logout-button";

// Top bar for the gated pages. The dashboard link goes straight to the admin
// area for an admin, or to the owner login for a viewer.
export function SiteNav({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-[1400px] items-center justify-between px-5 md:px-10">
        <Brand href="/catalog" label="Projektid" />
        <div className="flex items-center gap-6">
          <Link
            href={isAdmin ? "/admin" : "/admin/login"}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <SquaresFour weight="bold" className="size-4" />
            Töölaud
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
