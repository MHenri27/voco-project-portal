import { NextResponse } from "next/server";
import type { Role } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/session";
import { clientIp, rateLimit, sweep } from "@/lib/rate-limit";

// Block cross-site posts to the login. sameSite=lax already covers most of it
// but this stops a forged submit from another origin outright.
function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // same-origin fetches may omit it
  const host = req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ error: "Vigane päritolu." }, { status: 403 });
  }

  // Throttle guesses: 8 tries per minute per ip.
  sweep();
  const limited = rateLimit(`login:${clientIp(req)}`, 8, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Liiga palju katseid. Proovi hetke pärast uuesti." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Vigane päringu keha." }, { status: 400 });
  }

  const raw = (body ?? {}) as Record<string, unknown>;
  const scope: Role = raw.scope === "admin" ? "admin" : "viewer";
  const password = typeof raw.password === "string" ? raw.password : "";

  if (!password) {
    return NextResponse.json({ error: "Parool on nõutud." }, { status: 400 });
  }

  if (!verifyPassword(scope, password)) {
    return NextResponse.json({ error: "Parool ei sobinud." }, { status: 401 });
  }

  try {
    await createSession(scope);
  } catch {
    return NextResponse.json({ error: "Autentimine pole serveris seadistatud." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, role: scope });
}
