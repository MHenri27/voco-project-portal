# Pages & Routes

## Pages

| Path | Who | What |
|---|---|---|
| `/` | public | The entry gate: animated landing with the viewer login |
| `/catalog` | viewer+ | The gallery, with filter, search, sort, and a featured lead |
| `/catalog/[slug]` | viewer+ | A project: cover, Markdown body, gallery, prev/next |
| `/admin/login` | public | The owner login |
| `/admin` | admin | The dashboard: stats, reorder, feature, publish, delete |
| `/admin/projects/new` | admin | The editor, empty |
| `/admin/projects/[id]` | admin | The editor, loaded with a project |

Gating is done in `proxy.ts`. See [[Auth & Security]].

## API routes

| Route | Method | Who |
|---|---|---|
| `/api/auth/login` | POST | public |
| `/api/auth/logout` | POST | any |
| `/api/projects` | GET, POST | admin |
| `/api/projects/[id]` | GET, PATCH, DELETE | admin |
| `/api/projects/reorder` | POST | admin |
| `/api/upload` | POST | admin |

The catalog pages read through the [[Data Model|data layer]] directly; the API routes
exist for the dashboard. Every write route validates its body and re-checks the session.

Related: [[Architecture]], [[Components]], [[Design System]].
