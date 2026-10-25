# VOCO Project Portal — Documentation

This is the living documentation for the portal. Open the `vault/` folder as an
Obsidian vault to get the graph view and the [[System Map]] canvas.

## Start here

- [[Architecture]] — how the pieces fit together
- [[Auth & Security]] — the gate, sessions, and what protects what
- [[Data Model]] — the project record and where it lives
- [[Pages & Routes]] — every page and API route
- [[Design System]] — the visual language and motion
- [[Components]] — the reusable building blocks
- [[Deployment]] — getting it onto Vercel
- [[Roadmap]] — what could come next

## Decisions

- [[ADR-001 Host on Vercel]]
- [[ADR-002 Custom auth over a provider]]
- [[ADR-003 Sample-data fallback]]

## The idea in one line

Two passwords: one lets invited people **browse** the catalog, the other lets the owner
**manage** it. Everything behind the gate is enforced on the server, not in the browser.
