# SPEC.md — Tier Ranking App

## 1. Overview

A web app for creating personal tier lists (S/A/B/C/D) of text-based items. Users sign in with Google, create multiple lists, drag items into tiers, and can optionally make a list publicly viewable through an unguessable read-only link. Viewers of a shared link do not need an account.

**v1 target:** desktop/laptop browsers only, light theme only, text items only.

## 2. Tech Stack

| Concern | Choice |
|---|---|
| UI | React 19 (functional components + hooks only) |
| Build | Vite |
| Styling | Tailwind CSS |
| Backend / DB | Supabase (Postgres + Auth + RLS) |
| Auth | Google OAuth via Supabase Auth |
| Drag and drop | dnd-kit (`@dnd-kit/core`, `@dnd-kit/sortable`), multi-container pattern |
| Routing | React Router |

No global state library in v1. Use React state, context for the auth session, and custom hooks for data access.

## 3. Core Concepts

- **List**: a titled tier list owned by one user. Private by default.
- **Tier**: one of exactly five rows per list (S, A, B, C, D). Name and background color are editable. Tiers cannot be added, removed, or reordered in v1.
- **Item**: a text-only chip with a name. An item is either in the **unranked pool** or in exactly one tier.
- **Unranked pool**: the area at the top of the editor where new items land.
- **Share link**: `/s/:shareId`, a public read-only view of a list, active only while the list's sharing toggle is on.

## 4. Features (v1)

### 4.1 Authentication
- Google sign-in only.
- Logged-out visitors see a landing page: centered app name/logo and a "Sign in with Google" button. No other navigation.
- Header (when logged in) shows the user's Google name, avatar, and a "Sign out" button.
- Protected routes redirect logged-out users to `/`.

### 4.2 My Lists dashboard (`/lists`)
- Shows all of the user's lists, titles only, each linking to its editor.
- "Create list" action prompts for a title, then creates the list with its five default tiers and opens the editor.
- Rename and delete actions per list. Delete requires a confirmation popup. No duplicate action.
- Empty state: "No lists yet. Create your first one!"

### 4.3 List editor (`/lists/:listId`)
- Header area: list title (renameable), "Share" button, back link to dashboard.
- **Unranked pool** at the top, with an add-item input (Enter or an "Add" button submits). New items are appended to the pool.
- Five tier rows below the pool.
- Empty pool state: "No items yet. Add an item to get started."
- Items:
  - Drag from pool to a tier.
  - Drag from a tier back to the pool.
  - Drag directly between tiers.
  - Reorder left-to-right within a tier (and within the pool).
  - Click an item (without dragging) to open an Edit Item modal with a name input, Save, and Delete. Delete requires a confirmation popup.
- Tiers:
  - Click a tier's colored label block to open an Edit Tier modal with a name text input and a fixed preset color palette (no free color picker). Save is disabled when the name is blank.
- Everything autosaves; there is no Save button.

### 4.4 Sharing
- "Share" button in the editor header opens a modal containing:
  - An on/off toggle for sharing.
  - The generated link (`{origin}/s/{share_id}`) with a "Copy to clipboard" button.
- Lists are private by default (`is_shared = false`).
- `share_id` is generated once at list creation and never changes. Turning sharing off and on again reuses the same link.
- When sharing is off, the link is shown disabled or hidden, and the shared URL shows the "not available" page.

### 4.5 Shared view (`/s/:shareId`)
- Accessible without login.
- Shows the list title, the owner's name, the pool-less tier rows with their items. Unranked items are not shown.
- Fully read-only: no drag and drop, no editing, no sign-in prompt.
- If the `share_id` does not exist or sharing is off: a clean page reading "This tier list is not available."

## 5. UI / Layout

Light theme only. Classic TierMaker-style layout, described in text (no wireframe exists for this project):

```
┌──────────────────────────────────────────────────────────┐
│ Header: App name        [Share]     Avatar  Name  Sign out │
├──────────────────────────────────────────────────────────┤
│ List title (editable)                                    │
│                                                          │
│ ┌ Unranked pool ───────────────────────────────────────┐ │
│ │ [Add item input............] [Add]                    │ │
│ │ [item] [item] [item] ...                              │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌─────┬────────────────────────────────────────────────┐ │
│ │  S  │ [item] [item] [item]                            │ │
│ ├─────┼────────────────────────────────────────────────┤ │
│ │  A  │ [item] [item]                                   │ │
│ ├─────┼────────────────────────────────────────────────┤ │
│ │  B  │                                                 │ │
│ ├─────┼────────────────────────────────────────────────┤ │
│ │  C  │                                                 │ │
│ ├─────┼────────────────────────────────────────────────┤ │
│ │  D  │                                                 │ │
│ └─────┴────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

- Tier row: a colored label block on the left showing the tier name (fixed width, clickable in the editor), and a horizontally wrapping drop area on the right.
- Each tier row keeps a minimum height so empty rows remain valid drop targets.
- Item chips: plain text, auto-width, visible border and background so they read as draggable, `cursor-grab`.
- Default tier colors: S red, A orange, B yellow, C green, D blue. Palette offers roughly 8–10 preset colors, stored as hex values.
- Show a visual drop indicator or highlight on the hovered container while dragging.

## 6. Data Model (Supabase / Postgres)

### 6.1 Tables

```sql
-- Mirrors auth.users so owner name/avatar can be shown safely.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text
);

create table lists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 60),
  is_shared boolean not null default false,
  share_id text not null unique
    default substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
  created_at timestamptz not null default now()
);

create table tiers (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references lists(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 20),
  color text not null,
  position int not null check (position between 0 and 4),
  unique (list_id, position)
);

create table items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references lists(id) on delete cascade,
  tier_id uuid references tiers(id) on delete set null,  -- null = unranked pool
  name text not null check (char_length(btrim(name)) between 1 and 50),
  position int not null default 0                          -- order within its container
);

create index on lists (owner_id);
create index on tiers (list_id);
create index on items (list_id, tier_id, position);
```

### 6.2 Triggers / functions
- **On `auth.users` insert:** create a `profiles` row from Google metadata (name, avatar URL).
- **On `lists` insert:** create five `tiers` rows (S, A, B, C, D) with default colors and positions 0–4.
- **`get_shared_list(p_share_id text)`**: a `security definer` Postgres function, callable by `anon`, that returns JSON `{ title, owner_name, tiers: [...], items: [...] }` only when a list matches the `share_id` and `is_shared = true`; otherwise returns null. The shared view page uses only this function.

### 6.3 Row Level Security
- Enable RLS on all tables.
- `profiles`: users can select and update only their own row.
- `lists`: owner can select, insert, update, delete where `owner_id = auth.uid()`.
- `tiers` and `items`: owner can select, insert, update, delete where the parent list's `owner_id = auth.uid()`.
- `anon` has **no** direct table access. Public access goes only through `get_shared_list`.
- Tier rows cannot be inserted or deleted by clients (only updated: `name`, `color`).

### 6.4 Ordering strategy
`items.position` is an integer within its container (a tier, or the pool when `tier_id` is null). On any drop, reindex the affected container(s) to `0..n-1` and persist the changed rows in a single upsert. New items get `position = (max in pool) + 1`.

## 7. Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Landing with "Sign in with Google"; redirects to `/lists` if logged in |
| `/lists` | Auth | My Lists dashboard |
| `/lists/:listId` | Auth, owner only | List editor |
| `/s/:shareId` | Public | Read-only shared view |
| `*` | Public | Simple not-found page |

A list ID that doesn't exist or belongs to another user shows the same "not available" style page.

## 8. Validation Rules

| Field | Max length | Rule |
|---|---|---|
| List title | 60 | Required, non-blank after trim |
| Tier name | 20 | Required, non-blank after trim |
| Item name | 50 | Required, non-blank after trim |

- Disable the Save/Add/Create button while the value is blank. Trim values before saving.
- Duplicate item names within a list are allowed.
- No caps on number of lists per user or items per list.
- Enforce the same limits client-side (`maxLength`) and in the database (check constraints).

## 9. Autosave and Error Handling

- Every change (drop, rename, color change, add, delete, share toggle) saves to Supabase immediately.
- **Optimistic UI:** update local state first, then persist.
- **On failure:** do not revert the UI. Show a small inline toast, "Couldn't save", with a "Retry" button that re-attempts the failed write.
- Auth/session errors send the user back to the landing page.

## 10. Drag and Drop Behavior (dnd-kit)

- Containers: the pool plus five tiers (six total), each a sortable context over its item IDs.
- Sensors: `PointerSensor` only (mouse), with an activation distance of about 5px so a plain click opens the Edit Item modal instead of starting a drag. No touch sensor in v1.
- Use a `DragOverlay` for the dragged chip.
- Collision detection must handle dropping onto an empty container.
- Item list state: a single map of `containerId -> itemId[]` held in the editor hook, derived from the fetched items, and written back on drag end.
- The shared view renders the same row and chip components with drag disabled.

## 11. Component Architecture (component-first, DRY)

Suggested structure:

```
src/
  main.jsx
  App.jsx
  lib/
    supabaseClient.js
  context/
    AuthContext.jsx            // session + user, sign in / sign out
  hooks/
    useLists.js                // fetch/create/rename/delete lists
    useTierList.js             // fetch list + tiers + items; move/add/edit/delete item; edit tier
    useSharedList.js           // calls get_shared_list RPC
    useSaveStatus.js           // toast + retry state for failed saves
  utils/
    validation.js              // trim + length checks, shared by all forms
    reorder.js                 // reindex helpers for containers
    constants.js               // default tiers, color palette, limits
  components/
    layout/
      Header.jsx
      ProtectedRoute.jsx
    ui/
      Modal.jsx
      ConfirmDialog.jsx
      Toast.jsx
      TextInputForm.jsx        // single input + submit, with validation (reused for list title, tier name, item name)
      ColorPalette.jsx
    tierlist/
      TierList.jsx             // DndContext + pool + tiers
      TierRow.jsx              // label block + item drop area (read-only variant via prop)
      ItemChip.jsx             // single chip used everywhere an item renders
      UnrankedPool.jsx
      AddItemForm.jsx
      EditItemModal.jsx
      EditTierModal.jsx
      ShareModal.jsx
  pages/
    LandingPage.jsx
    ListsPage.jsx
    ListEditorPage.jsx
    SharedListPage.jsx
    NotAvailablePage.jsx
```

Rules:
- One `ItemChip` and one `TierRow` component, reused in both the editor and the shared view (a `readOnly` prop disables dragging and click-to-edit).
- Data access lives in hooks, never inline in components. Formatting and validation live in `utils`.
- React 19 idioms only: no class components, no `defaultProps` (use default parameter values), no `PropTypes`, `ref` passed as a normal prop, `use()` for reading promises/context where relevant.

## 12. Environment and Setup

- `.env` (Vite): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- Supabase project with Google provider enabled; configure the OAuth redirect URLs for local dev and production.
- All schema, triggers, the `get_shared_list` function, and RLS policies kept as SQL migration files in `/supabase/migrations`.

## 13. Out of Scope for v1

- Image items (stretch goal)
- Copying a shared list into your own account (stretch goal)
- Touch / mobile drag and drop
- Dark mode
- Adding, removing, or reordering tiers
- Free color picker
- Item descriptions or extra fields
- List descriptions or categories
- Duplicating lists
- Bulk item import
- Per-user caps on lists or items
- Viewer analytics, comments, or likes

## 14. Assumptions Made in This Spec

These were not explicitly decided and can be changed:

1. Clicking an item chip (without dragging) opens the Edit Item modal for rename and delete.
2. Shared view hides the unranked pool; it only shows ranked items.
3. Default tier colors are red, orange, yellow, green, blue for S through D.
4. Share link stays the same when sharing is toggled off and on.
5. `/` redirects logged-in users to `/lists`.
6. Failed-save toast includes a Retry button.
7. A `profiles` table plus a `get_shared_list` RPC is used so anonymous viewers can see the owner's name without exposing other tables.
8. The `blueprint`'s "view wireframe.png" instruction does not apply to this project; layout is defined in Section 5 instead.
