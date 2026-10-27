# Deployment

Target: **Vercel**. See [[ADR-001 Host on Vercel]] for why. Live at
`projektid.mhenri.me`.

## Steps

1. Push to GitHub, import the repo in Vercel.
2. Add a Postgres store (Neon or Vercel Postgres) — this sets `DATABASE_URL`.
3. Add a **Public** Blob store — this sets `BLOB_READ_WRITE_TOKEN`. The access mode is
   fixed at creation and cannot be changed later, so it must be Public: image uploads
   request public access and the catalog serves the URLs directly.
4. Add `AUTH_SECRET`, `VIEWER_PASSWORD`, `ADMIN_PASSWORD`, and `NEXT_PUBLIC_SITE_URL` in
   project settings. `NEXT_PUBLIC_SITE_URL` is a plain (Config) variable, not Sensitive.
5. Run `npm run db:push` once against the production database to create the table, then
   optionally `npm run db:seed`.

## Environment variables

| Key | Purpose |
|---|---|
| `AUTH_SECRET` | signs session cookies ([[Auth & Security]]) |
| `VIEWER_PASSWORD` | the shared catalog password |
| `ADMIN_PASSWORD` | the owner dashboard password |
| `DATABASE_URL` | Postgres connection ([[Data Model]]) |
| `BLOB_READ_WRITE_TOKEN` | image uploads; from a **public** Blob store |
| `NEXT_PUBLIC_SITE_URL` | canonical site url for metadata and OG tags |

Without a Blob store you can still add images by pasting URLs. A blank
`NEXT_PUBLIC_SITE_URL` falls back to Vercel's project URL.

## Custom domain

`projektid.mhenri.me` is a CNAME pointing at Vercel. Add the domain in the project's
Domains settings, create the matching CNAME at the registrar, then set
`NEXT_PUBLIC_SITE_URL` to the final `https://` address and redeploy. HTTPS is issued
automatically, which the `__Host-` session cookie relies on.

## Local

`.env.local` ships with dev passwords and no database, so the app runs on sample data out
of the box. Add `DATABASE_URL` locally to develop against a real database, and a
`BLOB_READ_WRITE_TOKEN` from a public store if you want uploads to work locally too.

Related: [[Architecture]], [[ADR-003 Sample-data fallback]].
