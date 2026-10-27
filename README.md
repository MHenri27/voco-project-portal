# VOCO Project Portal

A private, password-gated catalog for showcasing schoolwork projects, with an owner-only
dashboard for managing them. Live at **[projektid.mhenri.me](https://projektid.mhenri.me)**.

Two passwords run the whole thing: a shared one lets invited people browse the catalog,
and a private one lets the owner manage it. Everything behind the gate is enforced on the
server, never with client-side tricks.

## Features

- **Viewer catalog** — a filterable, searchable gallery of projects with a featured lead,
  category and tag filters, and animated project pages.
- **Owner dashboard** — add, edit, reorder (drag and drop), feature, publish, and delete
  projects behind a separate admin password.
- **Rich project editor** — a Markdown editor with a full formatting toolbar, direct image
  uploads, and embedded YouTube videos, all with a live preview.
- **Real authentication** — passwords are checked on the server and sessions are signed
  JWTs in `httpOnly` cookies.
- **Secure by default** — a strict Content-Security-Policy, security headers, rate-limited
  logins, validated inputs, and auth re-checked in every route.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind v4** for styling, **GSAP** for motion
- **Drizzle ORM** + **Postgres** for data
- **jose** for JWT sessions, **Vercel Blob** for image uploads
- Hosted on **Vercel**

## Development

```bash
npm install
npm run dev
```

With no `DATABASE_URL` set, the app runs on read-only sample data so you can click around
immediately. A `.env.local` with dev passwords is already in place. See `.env.example` for
the full list of variables.

## Structure

```
app/                routes (landing, catalog, detail, admin, api)
components/          UI and client interactions (GSAP lives here)
components/editor/   the project editor and its fields
lib/                data access, auth, validation, helpers
lib/db/             drizzle schema and client
proxy.ts            route gating (viewer vs admin)
vault/              full documentation (Obsidian vault)
```

## Documentation

The `vault/` folder is an Obsidian vault with the complete picture — architecture, data
model, auth, the design system, and deployment. Start at `vault/Home.md`.
