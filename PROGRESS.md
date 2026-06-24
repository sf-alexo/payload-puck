# Project Progress — SNF Payload PoC

_Last updated: 2026-06-17 (end of day)_

Payload CMS + Next.js + Puck proof-of-concept. Goal per `SPEC.md`: validate editor experience (Puck), content modeling (Payload), and rendering flow. MCP/AI layer is a later phase.

## Stack
- **Payload** 3.85.1 embedded in **Next.js** 16.2.6 (App Router), **React** 19.
- **DB:** SQLite (`@payloadcms/db-sqlite`), file `snf-payload-poc.db` (gitignored).
- **Visual editor:** `@puckeditor/core` 0.21.3 (the maintained successor to deprecated `@measured/puck`).
- **Package manager:** pnpm 10. Run with `pnpm dev` → http://localhost:3000.
- Env in `.env` (gitignored): `DATABASE_URL=file:./snf-payload-poc.db`, `PAYLOAD_SECRET=...`.

## What's done
- **Scaffolded** Payload app; original spec preserved as `SPEC.md` (template owns `README.md`).
- **Collections** (`src/collections/`): `Users` (auth), `Media` (uploads), `Pages`, `CaseStudies` (tags, coverImage, hasMany testimonials), `Testimonials`.
- **Pages** has a `layout` JSON field that stores the Puck layout tree.
- **Shared Puck config** `src/puck/puck.config.tsx`: components Hero / CTA / RichText. Exports `puckConfig` and typed `PuckData`.
- **Puck editor route** `src/app/(frontend)/edit/[slug]/`:
  - `page.tsx` (server, auth-gated; redirects to `/admin/login` if not logged in; fetches Page by slug).
  - `EditorClient.tsx` (`<Puck>` + save status).
  - `actions.ts` (server action `savePageLayout`, re-checks auth, `payload.update`).
- **Public renderer** `src/app/(frontend)/[slug]/page.tsx`: server component, renders published Page layout via `@puckeditor/core/rsc` `Render` with the same config. 404 if no published page; hint if empty layout.
- **Admin custom components** (`src/components/`):
  - `LogoutButton.tsx` — header action (`admin.components.actions`).
  - `EditInPuckButton.tsx` — "Edit visually" button in Pages doc header (`admin.components.edit.beforeDocumentControls`); links to `/edit/{slug}`; only shows when page is saved + has slug.
- **.gitignore**: ignores `*.db*` and `node_modules`. `.env.example` committed, `.env` not.

## Editor/render flow
1. `/admin` → create a Page, set **slug** + **status = Published**.
2. In the Page doc, click **Edit visually** (or go to `/edit/{slug}`) → build with Puck → **Publish** (saves to `layout`).
3. Visit `/{slug}` → public renderer shows the layout. Only **published** pages render publicly (drafts 404).

## Git state
- Remote `origin` = https://github.com/speedandfunction/snf-payload-poc, branch `main`.
- Pushed up to commit `e8e58f8` "Add Puck visual editor with save-to-Payload".
- **UNCOMMITTED** (created after the push): public renderer `src/app/(frontend)/[slug]/`, `EditInPuckButton.tsx`, `Pages.ts` (beforeDocumentControls), `puck.config.tsx` (PuckData export), regenerated `importMap.js`. → commit + push next session.
- HTTPS push needs a GitHub PAT as the password (account password won't work).

## MCP (AI layer) — working
- Installed **`@payloadcms/plugin-mcp` 3.85.1**; registered `mcpPlugin` in `src/payload.config.ts`.
- Exposes `POST /api/mcp` (HTTP transport). **`pages`** enabled with find/create/update (delete blocked to protect the home page). **`media`, `case-studies`, `testimonials`, `project-types`, `industries`, `techstacks`, `users`** enabled with full CRUD. Each collection `description` documents intent for the LLM (pages describes the Puck `layout.content` reorder workflow).
- Plugin adds **`payload-mcp-api-keys`** collection (admin group "MCP"); requires a Bearer API key on every request even in dev. **Each person creates their own key.**
- Migrations applied (push:false): `20260624_132754_add_mcp_api_keys` + `20260624_141550_add_mcp_capabilities`. Both files + `migrations/index.ts` committed so a fresh clone gets the full schema from `pnpm payload migrate`.
- **Verified end-to-end:** connected Windsurf/Cascade over HTTP; `tools/list`, `findPages`, and a real `createCaseStudies` (Acme Logistics, cover = media #16) all succeeded.
- **Docs:** `.claude/setup.md` has a fresh-clone migration step + full Claude Desktop connection guide; `README.md` has an MCP section + migration step. Onboarding flow: pull → `pnpm install` → `cp .env.example .env` → `pnpm payload migrate` → `pnpm dev` → create MCP key → connect client.
- **TODO next:** custom tools per plan (`list_puck_components`, `save_landing_page`, `draft_case_study`, etc.), optional Anthropic Mode B; consider a `status` field on case-studies for publish parity.

## Next steps / TODO
- **Commit + push** the uncommitted renderer + Edit-visually button.
- Frontend rendering for **Case Studies** / **Testimonials** (list + detail pages).
- Optional: draft **preview mode** (auth-gated) for unpublished pages.
- Optional: home page (`/`) currently shows template starter — could list published pages.
- Consider connecting Media uploads into Hero/Puck (currently Hero uses a plain image URL string).
- Later phase: MCP AI layer (per SPEC §6).

## Gotchas learned
- After adding/removing admin custom components, run `pnpm payload generate:importmap` (dev watcher usually does it).
- After changing collection fields, run `pnpm payload generate:types`.
- Puck `Render` needs the component-typed `Data` (`PuckData`), not the default-generic `Data`.
- No root `app/layout.tsx`; each route group (`(payload)`, `(frontend)`) owns its `<html>`. New public/editor routes live under `(frontend)`.
