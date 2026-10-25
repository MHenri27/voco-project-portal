import Link from "next/link";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { Brand } from "@/components/brand";
import { LogoutButton } from "@/components/logout-button";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-[1400px] items-center justify-between px-5 md:px-10">
        <Brand href="/admin" label="Dashboard" />
        <div className="flex items-center gap-6">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <ArrowSquareOut weight="bold" className="size-4" />
            View catalog
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
