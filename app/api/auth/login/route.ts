import { NextResponse } from "next/server";
import type { Role } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
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
