import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { LoginForm } from "@/components/login-form";

export const metadata = { title: "Owner access" };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink">
          <ArrowLeft weight="bold" className="size-4" />
          Back to entry
        </Link>

        <div className="relative mt-6 overflow-hidden rounded-[var(--radius-card)] border border-line bg-bg p-7 shadow-[0_40px_90px_-50px_rgba(37,61,180,0.45)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
          <p className="kicker">Owner access</p>
          <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-ink">Dashboard</h1>
          <p className="mt-2 mb-6 text-sm text-muted">Sign in to manage the catalog.</p>

          <LoginForm scope="admin" redirectTo="/admin" label="Admin password" />
        </div>
      </div>
    </main>
  );
}
