import { SignJWT, jwtVerify } from "jose";

export type Role = "viewer" | "admin";

export const SESSION_COOKIE = "voco_session";
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function signSession(role: Role): Promise<string> {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

// Returns the session payload, or null for a missing, expired, or tampered token.
export async function verifySession(token: string | undefined): Promise<{ role: Role } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const role = payload.role;
    if (role === "viewer" || role === "admin") return { role };
    return null;
  } catch {
    return null;
  }
}
