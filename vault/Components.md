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

- `dashboard-view` — the management list; projects reorder by dragging a handle
- `editor/project-editor` — the form plus a live card and description preview
- `editor/fields` — tags, toggles, image, gallery, and link inputs; gallery images and
  links reorder by dragging (shared `useDragReorder` helper)
- `editor/markdown-field` — the rich Markdown editor (see below)
- `editor/upload` — uploads images straight to Vercel Blob from the browser

## The Markdown editor

`editor/markdown-field` is a toolbar-driven editor over a small, safe Markdown subset
(`lib/markdown.ts`). It supports headings, bold / italic / strikethrough, inline code and
fenced code blocks, ordered and unordered lists, blockquotes, rules, links, inline images,
and YouTube embeds. Images upload directly from the toolbar; `Ctrl/⌘ + B / I / K` are
wired as shortcuts; a write / preview toggle renders the result live.

The renderer escapes all HTML first and only emits tags it builds itself — links are
limited to `http(s)`, images to `http(s)` and `data:image/`, and a video embed is only ever
built from a validated 11-character YouTube id. So pasted content can never inject markup.

See [[Design System]] for the look and [[Pages & Routes]] for where each is used.
