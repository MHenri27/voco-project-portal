# Design System

A warm gallery-white theme locked to light mode, with one accent and one radius system.
Tokens live in `app/globals.css`.

## Tokens

- **Canvas** `--bg` warm off-white, `--surface` lighter cards
- **Ink** `--ink` warm near-black, `--ink-soft`, `--muted`
- **Lines** `--line`, `--line-strong` hairlines
- **Accent** `--accent` vermillion, used as a solid fill only, never as a glow
- **Radius** cards 18px, inputs 12px, interactive elements are pills

## Type

- **Display** Bricolage Grotesque — headlines
- **Sans** Geist — body and UI
- **Mono** Geist Mono — labels, metadata, slugs

## Motion

GSAP drives everything. CSS handles micro-transitions. See [[Components]] for each piece.

- Reveal on scroll (`reveal-controller`, and the catalog's own stagger)
- Pointer drift and orbiting rings on the [[Pages & Routes|landing]]
- A `scroll-progress` bar on catalog and detail
- Parallax cover and 3D card tilt
- Everything collapses to static under `prefers-reduced-motion`

The grain overlay and the `[data-animate]` reveal primitive are defined once in
`globals.css`. Related: [[Architecture]].
