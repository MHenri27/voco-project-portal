import { cookies } from "next/headers";
import { SESSION_COOKIE, MAX_AGE_SECONDS, signSession, verifySession, type Role } from "@/lib/auth";

// Reads and verifies the current session from the request cookies.
export async function getSession() {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

export async function createSession(role: Role) {
  const token = await signSession(role);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

// For route handlers that must be admin-only. Returns the session or null.
export async function requireAdmin() {
  const session = await getSession();
  return session?.role === "admin" ? session : null;
}
