# Deployment

Target: **Vercel**. See [[ADR-001 Host on Vercel]] for why.

## Steps

1. Push to GitHub, import the repo in Vercel.
2. Add a Postgres store (Neon or Vercel Postgres) and a Blob store. These set
   `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN`.
3. Add `AUTH_SECRET`, `VIEWER_PASSWORD`, `ADMIN_PASSWORD` in project settings.
4. Run `npm run db:push` once against the production database to create the table, then
   optionally `npm run db:seed`.

## Environment variables

| Key | Purpose |
|---|---|
| `AUTH_SECRET` | signs session cookies ([[Auth & Security]]) |
| `VIEWER_PASSWORD` | the shared catalog password |
| `ADMIN_PASSWORD` | the owner dashboard password |
| `DATABASE_URL` | Postgres connection ([[Data Model]]) |
| `BLOB_READ_WRITE_TOKEN` | image uploads; optional, paste URLs instead |

## Local

`.env.local` ships with dev passwords and no database, so the app runs on sample data out
of the box. Add `DATABASE_URL` locally to develop against a real database.

Related: [[Architecture]], [[ADR-003 Sample-data fallback]].
