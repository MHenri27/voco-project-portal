import { timingSafeEqual } from "node:crypto";
import type { Role } from "@/lib/auth";

// Constant-time compare against the password stored in the environment.
// Kept separate from auth.ts so the edge middleware never imports node:crypto.
export function verifyPassword(scope: Role, candidate: string): boolean {
  const expected = scope === "admin" ? process.env.ADMIN_PASSWORD : process.env.VIEWER_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
