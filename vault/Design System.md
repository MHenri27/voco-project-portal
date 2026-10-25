# Design System

Bright white with soft blue, locked to light mode, one accent and one radius system.
Tokens live in `app/globals.css`.

## Tokens

- **Canvas** `--bg` pure white, `--surface` / `--surface-sunk` faint blue tints
- **Ink** `--ink` deep navy-black, `--ink-soft`, `--muted` (cool gray)
- **Lines** `--line`, `--line-strong` soft blue-gray hairlines
- **Accent** `--accent` soft blue, used as a solid fill only, never as a glow;
  `--accent-soft` for pale blue washes. Red is used only for destructive actions and errors.
- **Radius** cards 20px, inputs 12px, interactive elements are pills

## Type

- **Display** Space Grotesk — headlines
- **Body & UI** Figtree — everything else
- No monospace in the UI. The old mono eyebrows are replaced by the `.kicker` label
  (sans, small, tracked, used sparingly).

## Motion

GSAP drives everything; CSS handles micro-transitions. See [[Components]] for each piece.

- The landing intro is a deterministic `gsap.set` + `.to()` timeline: a masked headline
  reveal, an accent underline that wipes in, a staggered entrance, and a soft-blue wash.
- Catalog and detail reveal on scroll (`reveal-controller` / per-grid stagger).
- A `scroll-progress` bar, a parallax cover, and a 3D card tilt.
- A single seamless marquee (two repeated halves shifting by one half-width).
- Everything collapses to static under `prefers-reduced-motion`.

No decorative orbits, no middots or em dashes, no generic mono labels. Related: [[Architecture]].
