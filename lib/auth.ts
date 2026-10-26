import { SignJWT, jwtVerify } from "jose";

export type Role = "viewer" | "admin";

// The __Host- prefix locks the cookie to this exact host over https with path /,
// which blocks subdomain cookie injection. It needs Secure, so only in prod.
export const SESSION_COOKIE =
  process.env.NODE_ENV === "production" ? "__Host-voco_session" : "voco_session";
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
    // Pin the algorithm so a token can't ask to be verified a different way.
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    const role = payload.role;
    if (role === "viewer" || role === "admin") return { role };
    return null;
  } catch {
    return null;
  }
}
