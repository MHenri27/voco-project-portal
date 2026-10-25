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

## What this is not

A single shared viewer password can be passed around. That is acceptable here; per-person
access would be a [[Roadmap|later upgrade]].

Related: [[Architecture]], [[Pages & Routes]].
