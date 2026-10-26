import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { LoginForm } from "@/components/login-form";

export const metadata = { title: "Omaniku ligipääs" };

export default function AdminLoginPage() {
  return (
    <main id="main" className="flex min-h-[100dvh] flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink">
          <ArrowLeft weight="bold" className="size-4" />
          Tagasi kataloogi
        </Link>

        <div className="relative mt-6 overflow-hidden rounded-[var(--radius-card)] border border-line bg-bg p-7 shadow-[0_40px_90px_-50px_rgba(37,61,180,0.45)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
          <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-ink">Töölaud</h1>
          <p className="mt-2 mb-6 text-sm text-muted">Logi sisse, et kataloogi hallata.</p>

          <LoginForm scope="admin" redirectTo="/admin" label="Administraatori parool" />
        </div>
      </div>
    </main>
  );
}
