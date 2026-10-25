"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeSlash, LockKey } from "@phosphor-icons/react";
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
        setError(data.error ?? "Could not sign in.");
        setPending(false);
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label htmlFor="password" className="text-xs font-mono uppercase tracking-[0.18em] text-muted">
        {label}
      </label>

      <div className="relative">
        <LockKey
          weight="bold"
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted"
        />
        <input
          id="password"
          name="password"
          type={show ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter the access password"
          className={cn(
            "h-13 w-full rounded-[var(--radius-input)] border bg-surface pl-12 pr-12 text-ink",
            "placeholder:text-muted/70 outline-none transition-colors",
            error ? "border-accent" : "border-line-strong focus:border-ink",
          )}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-surface-sunk"
        >
          {show ? <EyeSlash className="size-5" /> : <Eye className="size-5" />}
        </button>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-accent">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-muted">{hint}</p>
      ) : null}

      <Button type="submit" variant="dark" size="lg" disabled={pending} className="w-full">
        {pending ? "Checking…" : "Enter"}
        {!pending && <ArrowRight weight="bold" className="size-4" />}
      </Button>
    </form>
  );
}
