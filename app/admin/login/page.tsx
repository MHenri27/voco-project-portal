import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { LoginForm } from "@/components/login-form";

export const metadata = { title: "Owner access — VOCO Portal" };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink">
          <ArrowLeft weight="bold" className="size-4" />
          Back to entry
        </Link>

        <div className="mt-6 rounded-[var(--radius-card)] border border-line bg-surface p-7 shadow-[0_24px_60px_-40px_rgba(20,19,14,0.5)]">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Owner access</p>
          <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-ink">Dashboard</h1>
          <p className="mt-2 text-sm text-muted">Sign in to manage the catalog.</p>

          <div className="mt-6">
            <LoginForm scope="admin" redirectTo="/admin" label="Admin password" />
          </div>
        </div>
      </div>
    </main>
  );
}
