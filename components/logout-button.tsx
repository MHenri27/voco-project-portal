"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignOut } from "@phosphor-icons/react";

export function LogoutButton({ to = "/" }: { to?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(to);
    router.refresh();
  }

  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink disabled:opacity-50"
    >
      <SignOut weight="bold" className="size-4" />
      {pending ? "Väljumine…" : "Logi välja"}
    </button>
  );
}
