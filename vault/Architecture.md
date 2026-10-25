# Architecture

A single Next.js app does both the front end and the back end. There is no separate server.

```
Browser → proxy.ts (gate) → Page or API route → Data layer → Postgres / Blob
```

## The layers

1. **The gate** — `proxy.ts` runs on every request to a protected path. It reads the
   session cookie and redirects anyone without the right role. See [[Auth & Security]].
2. **Pages** — server components fetch data directly through the [[Data Model|data layer]]
   and hand it to client components for interaction and motion. See [[Pages & Routes]].
3. **API routes** — the dashboard talks to these to create, edit, reorder, and delete.
   They re-check the session, so the gate is never the only line of defence.
4. **Data layer** — `lib/projects.ts` is the one place that reads and writes projects. It
   uses Postgres when configured and falls back to sample data otherwise
   ([[ADR-003 Sample-data fallback]]).

## Why this shape

Hosting the front end and the auth/data together is what [[ADR-001 Host on Vercel|Vercel]]
makes easy and what plain static hosting could not do. The [[Design System]] and
[[Components]] sit on top of this spine.

See the [[System Map]] canvas for a visual version of this.
