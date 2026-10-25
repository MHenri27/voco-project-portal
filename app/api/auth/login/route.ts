import { NextResponse } from "next/server";
import { verifyPassword, type Role } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const raw = (body ?? {}) as Record<string, unknown>;
  const scope: Role = raw.scope === "admin" ? "admin" : "viewer";
  const password = typeof raw.password === "string" ? raw.password : "";

  if (!password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  if (!verifyPassword(scope, password)) {
    return NextResponse.json({ error: "That password did not match." }, { status: 401 });
  }

  try {
    await createSession(scope);
  } catch {
    return NextResponse.json({ error: "Auth is not configured on the server." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, role: scope });
}
