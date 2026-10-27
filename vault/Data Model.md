# Data Model

One table: `projects`. Defined in `lib/db/schema.ts`, typed in `lib/types.ts`.

| Field | Notes |
|---|---|
| `id` | uuid, generated |
| `slug` | unique, used in the URL |
| `title`, `summary`, `description` | text; description is rich Markdown (images, embeds) |
| `category` | free text, e.g. Web, Hardware, Design |
| `tags` | string array (jsonb) |
| `coverImage` | url or null |
| `gallery` | array of `{ url, caption }` (jsonb) |
| `links` | array of `{ label, url }` (jsonb) |
| `year`, `featured`, `published` | metadata and flags |
| `sortOrder` | drives the manual curated order |
| `createdAt`, `updatedAt` | timestamps |

Using `jsonb` for tags, gallery, and links keeps the editor flexible without extra tables.

## The one access point

`lib/projects.ts` is the only module that touches the table: list, get, create, update,
delete, and reorder. Input is normalised and validated by `lib/validate.ts` before it is
written.

If `DATABASE_URL` is missing, reads return the sample set and writes throw a friendly
read-only error. See [[ADR-003 Sample-data fallback]].

## Reorder

The dashboard sends the full ordered list of ids to `POST /api/projects/reorder`, which
writes each id's index back to `sortOrder` in a transaction.

Related: [[Architecture]], [[Pages & Routes]], [[Deployment]].
