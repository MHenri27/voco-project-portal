# ADR-003 Sample-data fallback

**Status:** accepted

## Context

The app should be runnable the moment it is cloned, before anyone sets up a database.

## Decision

When `DATABASE_URL` is missing, the [[Data Model|data layer]] serves a built-in sample set
for reads and throws a clear read-only error for writes. The dashboard shows a banner and
hides its write controls in this mode.

## Consequences

- `npm run dev` works immediately and the catalog looks real.
- There is one extra branch in `lib/projects.ts` to maintain.
- Switching to a real database is just setting `DATABASE_URL` and running the
  [[Deployment|db scripts]].

Related: [[Architecture]].
