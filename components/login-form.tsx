"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeSlash } from "@phosphor-icons/react";
import { Button } from "@/components/button";
import { cn } from "@/lib/cn";
import type { Role } from "@/lib/auth";

type Props = {
  scope: Role;
  redirectTo: string;
  label: string;
  hint?: string;
};

export function LoginForm({ scope, redirectTo, label, hint }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Sisselogimine ebaõnnestus.");
        setPending(false);
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Võrguviga. Palun proovi uuesti.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label htmlFor="password" className="text-sm font-medium text-ink">
        {label}
      </label>

      <div className="relative">
        <input
          id="password"
          name="password"
          type={show ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Sisesta ligipääsu parool"
          className={cn(
            "h-13 w-full rounded-[var(--radius-input)] border bg-bg pl-4 pr-12 text-ink",
            "placeholder:text-muted/70 outline-none transition-colors",
            error ? "border-red-400" : "border-line-strong focus:border-accent",
          )}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Peida parool" : "Näita parooli"}
          className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-surface-sunk"
        >
          {show ? <EyeSlash className="size-5" /> : <Eye className="size-5" />}
        </button>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-muted">{hint}</p>
      ) : null}

      <Button type="submit" variant="accent" size="lg" disabled={pending} className="mt-1 w-full">
        {pending ? "Kontrollin…" : "Sisene"}
        {!pending && <ArrowRight weight="bold" className="size-4" />}
      </Button>
    </form>
  );
}
