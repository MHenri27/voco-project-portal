# Components

Reusable UI lives in `components/`. Motion is isolated in client components with `useGSAP`
so cleanup is automatic.

## Shared

- `button` — one pill button with accent / dark / outline / ghost variants
- `login-form` — used by both the viewer gate and the admin login via a `scope` prop
- `site-nav`, `admin-header`, `logout-button` — the top bars
- `marquee` — the one looping strip on the landing

## Motion pieces

- `reveal-controller` — fades `[data-animate]` elements in on scroll
- `scroll-progress` — the accent bar at the top
- `magnetic` — a CTA that drifts toward the cursor
- `tilt` — the 3D tilt on catalog cards
- `parallax-cover` — the slow-drifting cover on a project page

## Catalog

- `catalog-view` — filter, search, sort, and the grid (client)
- `project-card`, `featured-lead` — the gallery tiles

## Dashboard & editor

- `dashboard-view` — the management list
- `editor/project-editor` — the form plus a live preview
- `editor/fields` — tags, toggles, image, gallery, and link inputs
- `editor/markdown-field` — the Markdown editor with a live preview

See [[Design System]] for the look and [[Pages & Routes]] for where each is used.
