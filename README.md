# VOCO Project Portal

A private, password-gated catalog for showcasing schoolwork projects, with an
owner-only dashboard for managing them. Built to run on Vercel.

- **Viewer gate** — one shared password unlocks the catalog for teachers and classmates.
- **Owner dashboard** — a separate admin password unlocks adding, editing, reordering,
  featuring, and deleting projects, with image uploads and a Markdown editor.
- **Real auth** — passwords are checked on the server and sessions are signed JWTs in
  `httpOnly` cookies. Nothing is gated with client-side tricks.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind v4** for styling, **GSAP** for motion
- **Drizzle ORM** + **Postgres** (Neon / Vercel Postgres) for data
- **jose** for JWT sessions, **Vercel Blob** for image uploads

## Running locally

```bash
npm install
npm run dev
```

A `.env.local` is already set up with a generated `AUTH_SECRET` and dev passwords, and
with no `DATABASE_URL` the app runs on **read-only sample data** so you can click around
immediately.

- Viewer password: `voco2026`
- Admin password: `henri-dashboard`

Change these in `.env.local`. See `.env.example` for every variable.

## Connecting a database

The catalog is read-only until a Postgres database is connected.

1. Create a free Postgres database (Neon or Vercel Postgres) and copy its connection string.
2. Put it in `.env.local` as `DATABASE_URL=...`
3. Create the table and seed the sample projects:

```bash
npm run db:push    # creates the projects table from the schema
npm run db:seed    # loads the sample projects (optional)
```

Now the dashboard can create, edit, reorder, and delete projects.

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Add a Postgres store (Neon integration or Vercel Postgres) and a Blob store. These set
   `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` for you.
3. Add the remaining environment variables in the Vercel project settings:
   `AUTH_SECRET`, `VIEWER_PASSWORD`, `ADMIN_PASSWORD`.
4. Run `npm run db:push` once against the production database (locally with the production
   `DATABASE_URL`, or from the Vercel CLI) to create the table.

Image uploads need a Blob store. Without one, you can still add images by pasting URLs.

## How it is organised

```
app/                 routes (landing, catalog, detail, admin, api)
components/          UI and client interactions (GSAP lives here)
components/editor/   the project editor and its fields
lib/                data access, auth, validation, helpers
lib/db/             drizzle schema and client
db/seed.ts          sample-data seeder
proxy.ts            route gating (viewer vs admin)
vault/              Obsidian documentation vault
```

## Security notes

- The viewer catalog and the admin dashboard are both gated in `proxy.ts` and re-checked
  in every API route. Drafts are never served to viewers.
- A single shared viewer password means anyone who has it can pass it on. That is fine for
  a school portfolio; per-person access would be a later upgrade.
- `AUTH_SECRET` signs session cookies. Use a long random value and keep it out of git.
