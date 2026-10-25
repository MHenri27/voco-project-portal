# ADR-002 Custom auth over a provider

**Status:** accepted

## Context

There are only two credentials: one shared viewer password and one admin password. A full
auth provider (accounts, email, OAuth) would be far more than this needs.

## Decision

Check passwords on the server against environment variables and issue a signed JWT in an
`httpOnly` cookie. No user table, no provider.

## Consequences

- Tiny surface area, easy to reason about. See [[Auth & Security]].
- No per-person identity, so a shared password can be passed around. Accepted for now;
  per-person access is on the [[Roadmap]].
- The password check uses `node:crypto`, so it is kept out of the Edge proxy module.

Related: [[ADR-001 Host on Vercel]].
