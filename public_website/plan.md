# Plan: Admin Panel — Phased Implementation

> **Project:** Aruna Devi Infra Projects  
> **Architecture:** Next.js 16 App Router + Tailwind CSS 4 + Appwrite BaaS  
> **Design Spec:** See `ADMIN-PANEL-UI-UX-DESIGN.md`  
> **Status Legend:** `[ ]` = pending · `[x]` = done · `[-]` = in-progress

---

## TL;DR

Build the full admin panel in **4 phases**, following `ADMIN-PANEL-UI-UX-DESIGN.md` precisely.  
- **Phase 1** sets up Appwrite SDK, auth context, and CRUD API layer (foundation).  
- **Phase 2** builds all shared admin UI components + login page + admin shell layout.  
- **Phase 3** implements all 8 admin CRUD pages + DataTable + StatsCard.  
- **Phase 4** rewires the public website to read from Appwrite and wire form submissions.  
Custom toast + drag-reorder built from scratch. Only external lib addition: `recharts` for dashboard chart. Inter font for admin only; public site keeps Geist.

---

## Phase 1 — Foundation `[ ]`

**Goal:** Appwrite client/server SDK, auth context, CRUD API layer, env config, Next.js image config, and Appwrite database init script. **No UI yet.**

**Files to create/modify:** 7

### Sub-tasks

- `[ ]` **1.1 — Copy `.env` to project root**  
  Copy `../Aruna Devi/.env` → `aruna-devi-website/.env`.  
  Add two missing vars:  
  ```
  NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID=images
  NEXT_PUBLIC_APPWRITE_VIDEOS_BUCKET_ID=videos
  ```

- `[ ]` **1.2 — Create `.env.example`**  
  Template version of `.env` with placeholder values. Documents every variable. Add to `.gitignore`: `.env` (not `.env.example`).

- `[ ]` **1.3 — Create `src/lib/appwrite.ts`**  
  - Instantiate Appwrite `Client` with `NEXT_PUBLIC_APPWRITE_ENDPOINT` + `NEXT_PUBLIC_APPWRITE_PROJECT_ID`.  
  - Export `client`, `account` (Account), `databases` (Databases), `storage` (Storage) singletons.  
  - Export collection/bucket ID constants from env vars in one place (`DB_ID`, `PROJECTS_COL`, `SERVICES_COL`, `TEAM_COL`, `REVIEWS_COL`, `LEADS_COL`, `ABOUT_COL`, `HERO_SLIDES_COL`, `SOFTWARE_COL`, `SITE_SETTINGS_COL`, `IMAGES_BUCKET`, `VIDEOS_BUCKET`).  
  - `getFilePreviewUrl(bucketId, fileId, width?, height?)` helper → returns Appwrite Storage preview URL string.

- `[ ]` **1.4 — Create `src/lib/auth-context.tsx`**  
  `"use client"` React Context.  
  - `AuthProvider` wraps admin layout. On mount calls `account.get()` to restore session.  
  - `useAuth()` hook exposed via export.  
  - State: `{ user: Models.User | null, loading: boolean, error: string | null }`.  
  - Methods: `login(email, password)`, `logout()`, `checkSession()`.  
  - `login()` calls `account.createEmailPasswordSession()` then `account.get()`.  
  - `logout()` calls `account.deleteSession("current")` and clears user state.

- `[ ]` **1.5 — Create `src/lib/api.ts`**  
  CRUD helpers for all 9 collections + storage helpers.  
  For each collection expose: `list{X}(filters?)`, `get{X}(id)`, `create{X}(data)`, `update{X}(id, data)`, `delete{X}(id)`.  
  Collections: `projects`, `services`, `team_members`, `reviews`, `leads`, `about_content`, `hero_slides`, `software_items`, `site_settings`.  
  Storage helpers: `uploadFile(bucketId, file, fileId?)`, `deleteFile(bucketId, fileId)`, `getFileUrl(bucketId, fileId)`.  
  Uses `Query.equal()`, `Query.orderAsc()`, `Query.orderDesc()`, `Query.limit()` from `appwrite`.

- `[ ]` **1.6 — Update `next.config.ts`**  
  Add `images.remotePatterns` for `nyc.cloud.appwrite.io` (hostname from env endpoint) and protocol `https`, pathname `**`.

- `[ ]` **1.7 — Create `src/scripts/init-appwrite.ts`**  
  Node script using `node-appwrite` server SDK + `APPWRITE_API_KEY`.  
  - Creates DB `aruna_devi_db` if it does not exist.  
  - Creates all 9 collections with attributes matching §2 schema (string, integer, boolean, enum types).  
  - Creates 2 Storage buckets: `images` (max 10MB, allow image/*) and `videos` (max 100MB, allow video/*).  
  - Sets permissions per Appendix B: guests read, authenticated users write.  
  - **Idempotent** — catches "already exists" errors and continues.  
  - Run via: `npx tsx src/scripts/init-appwrite.ts`

### Verification
- `[ ]` Run `npx tsx src/scripts/init-appwrite.ts` → all collections + buckets visible in Appwrite console  
- `[ ]` TypeScript compiles with no errors on `src/lib/` files  
- `[ ]` `useAuth()` importable without error  

---

## Phase 2 — Shared Components + Login + Admin Layout `[ ]`

**Goal:** All reusable admin UI building blocks, admin shell layout, and login page. After this phase, `/admin/login` shows a working login form and authenticated routes render the sidebar + header shell.

**Files to create/modify:** 10

### Sub-tasks

- `[ ]` **2.1 — Install `recharts`**  
  `npm install recharts` — only external lib addition. Also confirm `lucide-react` already installed.

- `[ ]` **2.2 — Update `src/app/globals.css`**  
  Add admin CSS custom properties under `:root` and `[data-admin]` scope:  
  slate color palette (`--slate-50` … `--slate-900`), blue accent (`--blue-600`), status badge colors (green/yellow/red), `--font-inter` variable.  
  Do **not** break existing dark theme tokens for the public site.

- `[ ]` **2.3 — Create `src/components/admin/Toast.tsx`**  
  Custom toast system (no library).  
  - `ToastProvider` context + `useToast()` hook.  
  - `ToastContainer` renders stack top-right.  
  - Types: `success | error | info`. Left border color matches type.  
  - Auto-dismiss: 3 s success, 5 s error/info. Dismiss on click.  
  - Slide-in from right animation (CSS transform).

- `[ ]` **2.4 — Create `src/components/admin/Modal.tsx`**  
  Per §6.3.  
  - Props: `isOpen`, `onClose`, `title`, `size: "sm"|"md"|"lg"|"xl"`, `children`, `footer?`.  
  - Scale + fade animation on open/close.  
  - Backdrop click → `onClose`. Escape key → `onClose`.  
  - `useEffect` to lock body scroll when open.  
  - `z-50`.

- `[ ]` **2.5 — Create `src/components/admin/ConfirmDialog.tsx`**  
  Per §6.6. Uses `Modal` (sm size).  
  - Props: `isOpen`, `onClose`, `onConfirm`, `title`, `message`, `confirmLabel?`, `loading?`.  
  - Warning icon (lucide `AlertTriangle`). Cancel (gray) + Confirm (red) buttons.  
  - Loading spinner on Confirm button when `loading=true`.  
  - `z-60` (stacks above regular modals).

- `[ ]` **2.6 — Create `src/components/admin/ImageUpload.tsx`**  
  Per §6.4.  
  - Props: `value?: string` (current file ID), `bucketId`, `onChange(fileId)`, `accept?`, `maxSize?`, `shape?: "rect"|"circle"`, `label?`.  
  - Dashed border drag-drop zone. Accepts click-to-browse as well.  
  - Upload progress bar (0–100%).  
  - Preview thumbnail after upload. Circle preview for `shape="circle"`.  
  - Replace / Remove buttons on hover overlay.  
  - Client-side file size validation before upload.

- `[ ]` **2.7 — Create `src/components/admin/Sidebar.tsx`**  
  Per §6.1.  
  - 256 px width, `bg-slate-900`.  
  - 9 nav items: Dashboard, Leads, Projects, Services, About, Team, Reviews, Settings + Logout at bottom.  
  - Icons from `lucide-react`.  
  - Active: left blue border + blue text + `bg-blue-50/10`.  
  - Leads badge: unread count, blue pill.  
  - Mobile: `isOpen` prop → slide-in overlay with semi-transparent backdrop.  
  - Desktop collapse: 64 px icon-only mode with tooltip on hover.

- `[ ]` **2.8 — Create `src/components/admin/AdminHeader.tsx`**  
  Per §6.2.  
  - 64 px height, `bg-white`, border-bottom.  
  - Left: hamburger (mobile) + page `title` prop + optional breadcrumb.  
  - Right: bell icon with count badge + admin avatar circle + dropdown (Profile, Logout).  
  - Dropdown closes on outside click.

- `[ ]` **2.9 — Create `src/app/admin/layout.tsx`**  
  Admin shell.  
  - Wraps all `/admin/*` routes with `AuthProvider` and `ToastProvider`.  
  - **Auth guard**: if `!user && !loading && pathname !== "/admin/login"` → `redirect("/admin/login")`.  
  - Login page renders WITHOUT sidebar/header (early return).  
  - Other pages: `Sidebar` (left) + flex column `AdminHeader` + scrollable `<main>`.  
  - Root element: `bg-slate-50 text-slate-900 font-inter` (overrides root layout dark theme).  
  - Loads `Inter` from `next/font/google`.  
  - Mobile sidebar open/close state managed here.

- `[ ]` **2.10 — Create `src/app/admin/login/page.tsx`**  
  Per §7.1.  
  - `bg-slate-100` full-screen centered card.  
  - Logo text + "Admin Panel" subtitle.  
  - Email + password fields. Show/hide password toggle (eye icon).  
  - "Remember me" checkbox (cosmetic).  
  - Blue "Sign In" button. Spinner during auth.  
  - Shake animation on error. Inline error message.  
  - On success → `router.push("/admin")`.  
  - Validation: email format, password min 8 chars.

### Verification
- `[ ]` `/admin/login` renders without error  
- `[ ]` Login with valid credentials → redirects to `/admin`  
- `[ ]` Unauthenticated `/admin/*` → redirects to `/admin/login`  
- `[ ]` Sidebar hamburger works on mobile  
- `[ ]` No TypeScript errors in any Phase 2 file  

---

## Phase 3 — Admin CRUD Pages `[ ]`

**Goal:** All 8 admin CRUD pages, DataTable, and StatsCard. Every page is fully wired to Appwrite via `api.ts`.

**Files to create:** 11

### Sub-tasks

- `[ ]` **3.1 — Create `src/components/admin/StatsCard.tsx`**  
  Per §6.5.  
  - Props: `icon`, `value`, `label`, `trend?: { direction: "up"|"down", value: string }`, `href?`.  
  - White card, `rounded-xl shadow-sm`. Value `text-3xl font-bold`.  
  - Trend arrow: green = up, red = down.  
  - Entire card is clickable link if `href` provided.

- `[ ]` **3.2 — Create `src/components/admin/DataTable.tsx`**  
  Per §6.7.  
  - Generic: `DataTable<T>`. Props: `columns: ColumnDef<T>[]`, `data: T[]`, `loading?`, `pagination?`, `onPageChange?`, `selectable?`, `emptyMessage?`.  
  - Checkbox column for bulk selection.  
  - Sortable column headers (local sort).  
  - Pagination bar: page numbers, "Showing X–Y of Z".  
  - Loading: skeleton rows.  
  - Mobile: card-based layout (each row becomes a card).

- `[ ]` **3.3 — Create `src/app/admin/page.tsx` (Dashboard)**  
  Per §7.2.  
  - 4 `StatsCard` in a row (Total Leads, Projects, Team Members, Reviews) — counts from `api.ts`.  
  - Recent Leads table (last 5) with name, type badge, relative time, status dot.  
  - Quick Actions: 4 buttons → Add Project, Add Service, Add Team Member, Manage Leads.  
  - Recharts `BarChart` — weekly lead count, two bars (consulting=orange, community=blue).  
  - Content Status panel: published projects, active services, active team, approved reviews.

- `[ ]` **3.4 — Create `src/app/admin/leads/page.tsx`**  
  Per §7.3.  
  - `DataTable` with columns: name, phone, type badge, location, date, status.  
  - Filter tabs: All | Consulting | Community.  
  - Status dropdown filter. Search (debounced 300 ms).  
  - Export CSV button.  
  - Row click → 420 px slide-out right panel: contact info, message, editable status, admin notes (auto-save on blur).  
  - Bulk select → bulk status change / bulk delete.

- `[ ]` **3.5 — Create `src/app/admin/projects/page.tsx`**  
  Per §7.4.  
  - Card grid 3/2/1 col.  
  - Category filter tabs, status dropdown, search.  
  - Add/Edit Modal (xl): Basic Info, Content, Media (thumbnail + hero + 6-slot gallery with drag-reorder).  
  - Auto-slug from title.  
  - Key outcomes: dynamic list (add/remove rows).  
  - Save as Draft / Publish buttons.  
  - Delete with `ConfirmDialog`.

- `[ ]` **3.6 — Create `src/app/admin/services/page.tsx`**  
  Per §7.5.  
  - Vertical drag-to-reorder list (HTML5 Drag API, no library).  
  - Each row: thumbnail 80×80, title, truncated description, status badge, sort order.  
  - Add/Edit Modal (md): title, short description (200-char counter), extended description, `ImageUpload`, status, sort order.  
  - Sort order auto-recalculates on drop.  
  - Delete with confirm.

- `[ ]` **3.7 — Create `src/app/admin/about/page.tsx`**  
  Per §7.6.  
  - Single-document editor (no list).  
  - Fields: section label, heading, description (6-row textarea), about image (`ImageUpload`).  
  - Stats section: dynamic add/remove (value + label per stat, max 6).  
  - Footer: Discard Changes (confirm) + Save & Publish.  
  - `beforeunload` guard for unsaved changes.

- `[ ]` **3.8 — Create `src/app/admin/team/page.tsx`**  
  Per §7.7.  
  - Card grid with circle photos. Drag-to-reorder (HTML5 Drag API).  
  - Each card: 120 px circle photo, name, role, status badge, sort order, Edit/Delete buttons.  
  - Add/Edit Modal (sm): `ImageUpload` `shape="circle"`, name, role, sort order, status.

- `[ ]` **3.9 — Create `src/app/admin/reviews/page.tsx`**  
  Per §7.8.  
  - Filter tabs: All | Pending | Approved | Hidden (with counts).  
  - Review card: 60 px circle photo (initials fallback), name, gold stars, review text, status badge, date.  
  - Quick actions: Approve, Hide, Edit, Delete.  
  - Add/Edit Modal (md): name, `ImageUpload` circle, star rating (1–5 clickable), text (500-char counter), status.

- `[ ]` **3.10 — Create `src/app/admin/settings/page.tsx`**  
  Per §7.9. Tabbed (fade 150 ms):  
  - **Hero Slides**: drag-reorder list, Add/Edit Modal (md): category, title, media upload (image+video up to 100 MB), status.  
  - **Contact**: phone, email, address fields. Save.  
  - **Social**: 6 URL fields (Facebook, Instagram, YouTube, LinkedIn, X, Discord). Save.  
  - **Software**: drag-reorder grid, Add/Edit Modal (sm): name, logo `ImageUpload`.  
  - **SEO**: site title (60c), meta description (160c warning), keywords, OG image, GA ID. Save.

### Verification
- `[ ]` Create project → visible in Appwrite console  
- `[ ]` Lead status change in slide-out panel → saves  
- `[ ]` Drag-reorder services → `sort_order` updates in Appwrite  
- `[ ]` Upload image → file appears in Appwrite Storage bucket  
- `[ ]` All admin pages render on mobile without layout breaks  
- `[ ]` No TypeScript errors across all Phase 3 files  

---

## Phase 4 — Public Website Appwrite Integration `[ ]`

**Goal:** All public components read from Appwrite instead of static data. Form submissions write to the `leads` collection.

**Files to modify:** 12

### Sub-tasks

- `[ ]` **4.1 — Update `src/components/Hero.tsx`**  
  `useEffect` → `listHeroSlides()` (filter `status = "active"`, sort `sort_order`).  
  Map `media_id` → `getFileUrl()`. Loading skeleton. Graceful fallback to hardcoded slides on error.

- `[ ]` **4.2 — Update `src/components/Services.tsx`**  
  Fetch from `listServices()` (filter `status = "published"`, sort `sort_order`).  
  Map `image_id` → Storage URL. Keep `ServiceCard` + popup behavior.

- `[ ]` **4.3 — Update `src/components/Team.tsx`**  
  Fetch from `listTeamMembers()` (filter `status = "active"`, sort `sort_order`).  
  Map `image_id` → circle preview. Display `role` below name.

- `[ ]` **4.4 — Update `src/components/Reviews.tsx`**  
  Fetch from `listReviews()` (filter `status = "approved"`, sort `sort_order`).  
  Map `client_image_id` → Storage URL (fallback: initials avatar).  
  Add gold star rating display. Keep carousel behavior.

- `[ ]` **4.5 — Update `src/components/About.tsx`**  
  Fetch from `getAboutContent()` (single document).  
  Parse `stats` JSON array → `{value, label}[]`. Map `image_id` → Storage URL.

- `[ ]` **4.6 — Update `src/components/SoftwareBar.tsx`**  
  Fetch from `listSoftwareItems()` (filter `status = "active"`, sort `sort_order`).  
  Map `image_id` → Storage URL.

- `[ ]` **4.7 — Update `src/components/Footer.tsx`**  
  Fetch `site_settings` where `group = "contact"` for phone/email/address.  
  Fetch `group = "social"` for social links. Hide icons where URL is empty.

- `[ ]` **4.8 — Update `src/components/ConsultingPopup.tsx`**  
  Replace stub `handleSubmit` with `createLead({ type: "consulting", ... })`.  
  Disable form during submission. Show success/error inline. Clear on success.

- `[ ]` **4.9 — Update `src/components/CommunityPopup.tsx`**  
  Same pattern but `type: "community"` with `role`, `skills` fields.  
  Wire into `Header.tsx` "Join Community" button (currently a dead `#community` link).

- `[ ]` **4.10 — Update `src/components/Header.tsx`**  
  Import `CommunityPopup`. Add state `communityOpen`. "Join Community" button sets `communityOpen = true`.

- `[ ]` **4.11 — Update `src/app/projects/[id]/page.tsx` + `ProjectDetailClient.tsx`**  
  Remove `generateStaticParams`. Fetch project by `slug` from Appwrite.  
  Map all `*_id` fields → Storage URLs.  
  Update sub-components (`ProjectDetailHero`, `ProjectInfoBar`, `ProjectChallengesOutcomes`, `ProjectGallery`, `RelatedProjects`) to accept Appwrite data shape.  
  Related projects: same category, exclude current, limit 3.

- `[ ]` **4.12 — Update `src/app/layout.tsx`**  
  Fetch SEO settings (`group = "seo"`) for dynamic `metadata.title` + `metadata.description`.  
  Admin routes handled by `src/app/admin/layout.tsx` — no conflict.

### Verification
- `[ ]` Public homepage loads all sections from Appwrite  
- `[ ]` Consulting form submit → lead visible in admin  
- `[ ]` Community form submit → lead visible in admin  
- `[ ]` "Join Community" header button → opens popup  
- `[ ]` New project created in admin → visible at `/projects/[slug]`  
- `[ ]` Review `hidden` in admin → disappears from public site  
- `[ ]` Footer phone/email/social match `site_settings` values  
- `[ ]` `next build` compiles with 0 errors  

---

## Key Decisions

| Decision | Choice |
|---|---|
| Toast system | Custom (no lib) — `ToastProvider` + React Context |
| Drag-reorder | Custom — HTML5 Drag API + `onDragStart/Over/End` handlers |
| Dashboard chart | `recharts` — only external lib addition |
| Admin font | `Inter` via `next/font/google` in admin layout only |
| Public font | `Geist` — unchanged |
| Admin styling | Tailwind utility classes |
| Public styling | Keep existing `<style>` CSS-in-JS blocks |
| `.env` location | Project root `aruna-devi-website/.env` |
| Appwrite storage domain | `nyc.cloud.appwrite.io` (from endpoint env var) |
| Graceful degradation | Public components fall back to static data on Appwrite error |
| Phase order | Strict — each phase depends on the previous |