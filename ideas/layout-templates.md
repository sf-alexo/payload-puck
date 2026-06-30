# Layout Templates Plan

## Goal
Add pre-ready layout templates that users can select from, both **at page-creation time** and **inside the Puck editor** (Templates button).

## Current State
- Pages store layout as Puck JSON (`content` array + `root`) in the `layout` field
- Layout is edited in `src/app/(frontend)/edit/[slug]/EditorClient.tsx`
- Available blocks: `Hero`, `CTA`, `RichText`, `Carousel`, `Bars`, `Table` (defined in `src/puck/puck.config.tsx`)
- Pages created via the Payload admin panel

## Concept
A "layout template" is just a predefined Puck `Data` object (a `content` array of pre-configured blocks) that gets loaded into the editor or page.

## Implementation Plan

### 1. Shared template definitions — `src/puck/templates.ts` (new)
Plain JSON data (no React), safe to import on both server and client:

```ts
import type { PuckData } from './puck.config'

export type LayoutTemplate = {
  id: string
  name: string
  description: string
  data: PuckData
}

export const layoutTemplates: LayoutTemplate[] = [
  { id: 'blank',     name: 'Blank',        description: 'Empty canvas',                  data: { root: {}, content: [] } },
  { id: 'landing',   name: 'Landing Page', description: 'Hero + CTA',                    data: { /* Hero, CTA */ } },
  { id: 'marketing', name: 'Marketing',    description: 'Hero + Bars + Carousel + CTA',  data: { /* ... */ } },
  { id: 'content',   name: 'Content',      description: 'Hero + Rich Text + Table',      data: { /* ... */ } },
]
```

**Note:** Each block needs a unique `props.id` (Puck requires it) — generate these.

### 2. In-editor "Templates" button — `src/app/(frontend)/edit/[slug]/EditorClient.tsx`
- Move `data` into React state
- Add a **Templates** dropdown to the existing `headerActions` override
- On select → `window.confirm('Replace current layout?')` → set state + bump a `key` on `<Puck>` so it reloads the new data cleanly (Puck's `data` prop is only read on mount)

### 3. At page-creation time — `src/collections/Pages.ts`
- Add a `template` **select field** (options generated from `layoutTemplates`), shown via `admin.condition` only when creating (no existing layout)
- Extend the existing `beforeChange` hook: on **create**, if `layout` is empty and a `template` is chosen, populate `layout` with that template's `data`
- Result: a new page opens in Puck already pre-built

## Files to Modify
1. `src/puck/templates.ts` — new (shared template definitions)
2. `src/app/(frontend)/edit/[slug]/EditorClient.tsx` — Templates dropdown + state/remount
3. `src/collections/Pages.ts` — `template` field + hook logic
4. `src/app/(payload)/admin/importMap.js` — regenerate via `pnpm payload generate:importmap` (collection gains an admin field)

## Default Template Set
- **Blank** — empty canvas
- **Landing Page** — Hero + CTA
- **Marketing** — Hero + Bars + Carousel + CTA
- **Content** — Hero + RichText + Table

## Technical Considerations
- Templates are plain JSON (no React components), so they can be imported server-side for the creation hook
- Puck requires unique `props.id` on each block — must be generated
- Puck's `data` prop is only read on mount, so applying a template in-editor requires a `key` bump to remount
- Confirm before overwriting existing layout in the editor

## Testing Checklist
- [ ] Templates appear in creation flow
- [ ] Selecting a template at creation pre-populates the layout
- [ ] Templates button appears in the editor toolbar
- [ ] Selecting a template in editor prompts for confirmation
- [ ] Selecting a template in editor replaces the canvas correctly
- [ ] Each block renders with unique IDs (no Puck errors)
- [ ] Blank template produces an empty canvas
