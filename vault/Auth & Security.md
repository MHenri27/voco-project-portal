# Auth & Security

Two roles, two passwords:

- **viewer** — unlocks the catalog. One shared password for teachers and classmates.
- **admin** — unlocks the dashboard. The owner's private password.

An admin session can see the catalog too.

## How a login works

1. The [[Components|login form]] posts the password and scope to `POST /api/auth/login`.
2. `lib/password.ts` compares it to the environment password in constant time.
3. On a match, `lib/auth.ts` signs a JWT with the role and `lib/session.ts` stores it in an
   `httpOnly` cookie. The browser can neither read nor forge it.

`verifyPassword` lives apart from the rest of `lib/auth.ts` because it uses `node:crypto`,
which cannot run in the Edge [[#The gate|proxy]]. Keeping them separate keeps the proxy
edge-safe.

## The gate

`proxy.ts` verifies the cookie on every request to `/catalog/*` and `/admin/*`:

- No session on a catalog path → back to the entry gate.
- Not an admin on a dashboard path → to the admin login.

Every API route calls `requireAdmin()` again, so a direct request cannot skip the gate.
Drafts are filtered out for anyone who is not an admin, in the [[Data Model|data layer]]
and again on the detail page.

Logging out clears the cookie with its full attributes (a plain delete would not clear a
`__Host-` cookie), so the session really ends.

## Hardening

Beyond the gate, the app ships a few production defences:

- A strict **Content-Security-Policy** and the usual security headers (HSTS, `nosniff`,
  `X-Frame-Options`, a tight `Permissions-Policy`) set in `next.config.ts`.
- **Rate-limited** logins and a same-origin check on `/api/auth/login`.
- The session cookie uses the `__Host-` prefix in production and the JWT is verified with a
  pinned algorithm.
- Uploads go **straight from the browser to Vercel Blob**; the server only hands out a
  scoped, admin-only token and never proxies the file. Images are capped and type-checked.
- Every API route re-validates its input and re-checks the session.

## What this is not

A single shared viewer password can be passed around. That is acceptable here; per-person
access would be a [[Roadmap|later upgrade]].

Related: [[Architecture]], [[Pages & Routes]].
