# ADR-001 Host on Vercel

**Status:** accepted

## Context

The original plan was GitHub Pages. But a password gate and an editing dashboard both need
server-side logic and a place to store data, which static hosting cannot provide. Any auth
done purely in the browser is bypassable.

## Decision

Host the whole app on Vercel as a Next.js project. One deploy gives us the front end,
serverless API routes, secrets, a Postgres database, and Blob storage.

## Consequences

- Real server-side [[Auth & Security|auth]] becomes possible.
- The [[Data Model|data layer]] can persist edits.
- Deploys come straight from GitHub. See [[Deployment]].

Related: [[Architecture]], [[ADR-002 Custom auth over a provider]].
