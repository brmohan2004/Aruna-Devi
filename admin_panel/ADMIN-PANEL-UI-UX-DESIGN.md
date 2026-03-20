# Admin Panel — UI/UX Design Specification

> **Project:** Aruna Devi Infra Projects  
> **Document:** Admin Panel Design & Wireframe Reference  
> **Version:** 1.0  
> **Date:** February 22, 2026  
> **Backend:** Appwrite (BaaS)  
> **Frontend:** Next.js 16 (App Router) + Tailwind CSS 4  

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Appwrite Database Schema](#2-appwrite-database-schema)
3. [Data Flow Diagram](#3-data-flow-diagram)
4. [File Structure](#4-file-structure)
5. [Design System & Tokens](#5-design-system--tokens)
6. [Shared Components](#6-shared-components)
7. [Page Wireframes & UX](#7-page-wireframes--ux)
   - [Login Page](#71-login-page)
   - [Dashboard](#72-dashboard)
   - [Leads / Enquiries](#73-leads--enquiries)
   - [Projects](#74-projects)
   - [Services](#75-services)
   - [About](#76-about)
   - [Team](#77-team)
   - [Reviews](#78-reviews)
   - [Settings](#79-settings)
8. [Popup / Modal Specifications](#8-popup--modal-specifications)
9. [Responsive Behavior](#9-responsive-behavior)
10. [Interaction & Animation Guide](#10-interaction--animation-guide)
11. [Public Website ↔ Admin Data Mapping](#11-public-website--admin-data-mapping)

---

## 1. System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    🌐 PUBLIC WEBSITE (Next.js SSR)               │
│                                                                  │
│  ┌──────┐ ┌───────┐ ┌────────┐ ┌────────┐ ┌──────┐ ┌────────┐  │
│  │ Hero │ │Softwr │ │Services│ │Projects│ │About │ │  Team  │  │
│  │      │ │  Bar  │ │        │ │        │ │      │ │        │  │
│  └──┬───┘ └───┬───┘ └───┬────┘ └───┬────┘ └──┬───┘ └───┬────┘  │
│     │         │         │          │          │         │        │
│  ┌──┴───┐ ┌───┴────┐ ┌──┴───┐  ┌──┴──────┐                     │
│  │Review│ │ Footer │ │Conslt│  │Community│                      │
│  │      │ │        │ │Popup │  │ Popup   │                      │
│  └──────┘ └────────┘ └──┬───┘  └──┬──────┘                      │
│                          │        │                              │
│        ┌─────────────────┴────────┘                              │
│        │ Form Submissions (leads)                                │
└────────┼─────────────────────────────────────────────────────────┘
         │
         ▼ READ (fetch) / WRITE (submit)
┌──────────────────────────────────────────────────────────────────┐
│                 ☁️  APPWRITE BACKEND (BaaS)                      │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐          │
│  │  🔐 Auth     │  │  🗄️ Database │  │  📁 Storage   │          │
│  │  Service     │  │              │  │   (Buckets)   │          │
│  │              │  │  9 collectns │  │  images       │          │
│  │  Email/Pass  │  │  (see §2)   │  │  videos       │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬────────┘          │
│         │                 │                 │                    │
└─────────┼─────────────────┼─────────────────┼────────────────────┘
          │                 │                 │
          ▼ Auth            ▼ CRUD            ▼ Upload/Serve
┌──────────────────────────────────────────────────────────────────┐
│                 ⚙️  ADMIN PANEL (/admin/*)                       │
│                                                                  │
│  ┌────────┐ ┌──────┐ ┌────────┐ ┌────────┐ ┌───────┐           │
│  │ Login  │ │Dashbd│ │ Leads  │ │Projects│ │Service│           │
│  └────────┘ └──────┘ └────────┘ └────────┘ └───────┘           │
│  ┌────────┐ ┌──────┐ ┌────────┐ ┌────────────────────┐          │
│  │ About  │ │ Team │ │Reviews │ │     Settings       │          │
│  └────────┘ └──────┘ └────────┘ └────────────────────┘          │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Appwrite Database Schema

### Database: `aruna_devi_db`

#### 2.1 `projects` Collection

| Attribute           | Type       | Required | Description                                        |
| ------------------- | ---------- | -------- | -------------------------------------------------- |
| `slug`              | `string`   | ✅       | URL-safe identifier (e.g. `skyline-residential`)   |
| `title`             | `string`   | ✅       | Project name                                       |
| `location`          | `string`   | ✅       | City name                                          |
| `category`          | `string`   | ✅       | `Residential` \| `Commercial` \| `Villa`           |
| `client`            | `string`   | ✅       | Client/company name                                |
| `area`              | `string`   | ✅       | Square footage (e.g. `120,000 sq ft`)              |
| `duration`          | `string`   | ✅       | Build duration (e.g. `24 Months`)                  |
| `description`       | `string`   | ✅       | Summary paragraph                                  |
| `challenges`        | `string`   | ✅       | Challenges text                                    |
| `solutions`         | `string`   | ✅       | Solutions text                                     |
| `key_outcomes`      | `string`   | ✅       | JSON-encoded `string[]`                            |
| `image_id`          | `string`   | ✅       | Appwrite Storage file ID (card thumbnail)          |
| `hero_media_id`     | `string`   | ❌       | Storage file ID (hero image/video, falls to image) |
| `gallery_ids`       | `string`   | ❌       | JSON-encoded array of Storage file IDs             |
| `is_featured`       | `boolean`  | ✅       | Show on homepage carousel                          |
| `sort_order`        | `integer`  | ✅       | Display ordering                                   |
| `status`            | `string`   | ✅       | `draft` \| `published`                             |
| `created_at`        | `datetime` | ✅       | Auto-set on create                                 |
| `updated_at`        | `datetime` | ✅       | Auto-set on update                                 |

#### 2.2 `services` Collection

| Attribute              | Type       | Required | Description                     |
| ---------------------- | ---------- | -------- | ------------------------------- |
| `title`                | `string`   | ✅       | Service name                    |
| `description`          | `string`   | ✅       | Short description (card)        |
| `extended_description` | `string`   | ✅       | Full description (popup detail) |
| `image_id`             | `string`   | ✅       | Storage file ID                 |
| `sort_order`           | `integer`  | ✅       | Display ordering                |
| `status`               | `string`   | ✅       | `draft` \| `published`         |
| `created_at`           | `datetime` | ✅       | Auto-set                        |

#### 2.3 `team_members` Collection

| Attribute    | Type       | Required | Description                      |
| ------------ | ---------- | -------- | -------------------------------- |
| `name`       | `string`   | ✅       | Full name                        |
| `role`       | `string`   | ❌       | Job title / designation          |
| `image_id`   | `string`   | ✅       | Storage file ID (photo)          |
| `sort_order` | `integer`  | ✅       | Display ordering                 |
| `status`     | `string`   | ✅       | `active` \| `inactive`          |
| `created_at` | `datetime` | ✅       | Auto-set                         |

#### 2.4 `reviews` Collection

| Attribute         | Type       | Required | Description                            |
| ----------------- | ---------- | -------- | -------------------------------------- |
| `client_name`     | `string`   | ✅       | Client display name                    |
| `client_image_id` | `string`   | ❌       | Storage file ID (client photo)         |
| `review_text`     | `string`   | ✅       | Testimonial text                       |
| `rating`          | `integer`  | ✅       | 1–5 star rating                        |
| `sort_order`      | `integer`  | ✅       | Display ordering                       |
| `status`          | `string`   | ✅       | `pending` \| `approved` \| `hidden`   |
| `created_at`      | `datetime` | ✅       | Auto-set                               |

#### 2.5 `leads` Collection

| Attribute    | Type       | Required | Description                                      |
| ------------ | ---------- | -------- | ------------------------------------------------ |
| `type`       | `string`   | ✅       | `consulting` \| `community`                      |
| `name`       | `string`   | ✅       | Lead's full name                                 |
| `phone`      | `string`   | ✅       | Phone number                                     |
| `location`   | `string`   | ❌       | City (consulting leads only)                     |
| `role`       | `string`   | ❌       | `student` \| `professional` (community only)     |
| `skills`     | `string`   | ❌       | Skills text (community only)                     |
| `message`    | `string`   | ❌       | Free-form message                                |
| `status`     | `string`   | ✅       | `new` \| `contacted` \| `converted` \| `closed` |
| `admin_note` | `string`   | ❌       | Internal follow-up notes                         |
| `created_at` | `datetime` | ✅       | Auto-set                                         |

#### 2.6 `hero_slides` Collection

| Attribute    | Type       | Required | Description                     |
| ------------ | ---------- | -------- | ------------------------------- |
| `category`   | `string`   | ✅       | Label text (e.g. `Projects`)    |
| `title`      | `string`   | ✅       | Slide headline                  |
| `media_id`   | `string`   | ✅       | Storage file ID (image or video)|
| `media_type` | `string`   | ✅       | `image` \| `video`             |
| `sort_order` | `integer`  | ✅       | Carousel order                  |
| `status`     | `string`   | ✅       | `active` \| `inactive`         |
| `created_at` | `datetime` | ✅       | Auto-set                        |

#### 2.7 `about_content` Collection (Single Document)

| Attribute       | Type       | Required | Description                              |
| --------------- | ---------- | -------- | ---------------------------------------- |
| `section_label` | `string`   | ✅       | e.g. `Our Story`                         |
| `heading`       | `string`   | ✅       | e.g. `Building Dreams`                   |
| `description`   | `string`   | ✅       | Multi-paragraph about text               |
| `image_id`      | `string`   | ❌       | Storage file ID (about section image)    |
| `stats`         | `string`   | ✅       | JSON-encoded `{value, label}[]`          |
| `updated_at`    | `datetime` | ✅       | Auto-set on save                         |

#### 2.8 `site_settings` Collection (Key-Value)

| Attribute    | Type       | Required | Description                                       |
| ------------ | ---------- | -------- | ------------------------------------------------- |
| `key`        | `string`   | ✅       | Setting key (e.g. `phone`, `facebook_url`)        |
| `value`      | `string`   | ✅       | Setting value                                     |
| `group`      | `string`   | ✅       | `contact` \| `social` \| `seo` \| `general`      |
| `updated_at` | `datetime` | ✅       | Auto-set                                          |

#### 2.9 `software_items` Collection

| Attribute    | Type      | Required | Description               |
| ------------ | --------- | -------- | ------------------------- |
| `name`       | `string`  | ✅       | Software name (e.g. `AutoCAD`) |
| `image_id`   | `string`  | ✅       | Storage file ID (logo)    |
| `sort_order` | `integer` | ✅       | Display ordering          |
| `status`     | `string`  | ✅       | `active` \| `inactive`   |

### Storage Buckets

| Bucket   | Allowed Types                           | Max Size | Purpose               |
| -------- | --------------------------------------- | -------- | --------------------- |
| `images` | `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`| 10 MB    | All image uploads      |
| `videos` | `.mp4`, `.webm`, `.mov`, `.ogg`         | 100 MB   | Hero slide videos      |

---

## 3. Data Flow Diagram

### 3.1 Write Flow (Admin → Appwrite)

```
Admin Dashboard                     Appwrite
─────────────────                   ────────────────
                                    
┌─────────────┐   createDocument()  ┌──────────────┐
│ Add Project │ ──────────────────▶ │  projects    │
│ Form Modal  │   + uploadFile()    │  collection  │
└─────────────┘                     └──────────────┘
                                    
┌─────────────┐   updateDocument()  ┌──────────────┐
│ Edit About  │ ──────────────────▶ │ about_content│
│ Page        │                     │  collection  │
└─────────────┘                     └──────────────┘
                                    
┌─────────────┐   updateDocument()  ┌──────────────┐
│ Change Lead │ ──────────────────▶ │   leads      │
│ Status      │                     │  collection  │
└─────────────┘                     └──────────────┘
```

### 3.2 Read Flow (Appwrite → Public Website)

```
Appwrite                            Public Website
────────────────                    ─────────────────
                                    
┌──────────────┐  listDocuments()   ┌──────────────┐
│  projects    │  status=published  │ Projects     │
│  collection  │ ─────────────────▶ │ Section +    │
│              │  orderBy sort_order│ Detail Pages │
└──────────────┘                    └──────────────┘
                                    
┌──────────────┐  listDocuments()   ┌──────────────┐
│ hero_slides  │  status=active     │ Hero         │
│  collection  │ ─────────────────▶ │ Carousel     │
└──────────────┘                    └──────────────┘
                                    
┌──────────────┐  listDocuments()   ┌──────────────┐
│  services    │  status=published  │ Services     │
│  collection  │ ─────────────────▶ │ Section      │
└──────────────┘                    └──────────────┘
                                    
┌──────────────┐  listDocuments()   ┌──────────────┐
│ team_members │  status=active     │ Team         │
│  collection  │ ─────────────────▶ │ Section      │
└──────────────┘                    └──────────────┘
                                    
┌──────────────┐  listDocuments()   ┌──────────────┐
│  reviews     │  status=approved   │ Reviews      │
│  collection  │ ─────────────────▶ │ Carousel     │
└──────────────┘                    └──────────────┘
                                    
┌──────────────┐  getDocument()     ┌──────────────┐
│about_content │ ─────────────────▶ │ About        │
│  (single)    │                    │ Section      │
└──────────────┘                    └──────────────┘
                                    
┌──────────────┐  listDocuments()   ┌──────────────┐
│site_settings │  by group          │ Header +     │
│  collection  │ ─────────────────▶ │ Footer +     │
│              │                    │ Meta Tags    │
└──────────────┘                    └──────────────┘
```

### 3.3 Submit Flow (Public Forms → Appwrite → Admin)

```
Public Website                  Appwrite              Admin Panel
──────────────                  ────────               ───────────
                                
┌──────────────┐ createDoc()    ┌──────────┐           ┌──────────┐
│ Consulting   │ type=consulting│  leads   │  listDocs │  Leads   │
│ Popup Form   │ ─────────────▶ │collection│ ────────▶ │  Table   │
│ (name,phone, │ status=new     │          │           │  Page    │
│  location,   │                │          │           │          │
│  message)    │                └──────────┘           └──────────┘
└──────────────┘                
                                
┌──────────────┐ createDoc()    ┌──────────┐           ┌──────────┐
│ Community    │ type=community │  leads   │  listDocs │  Leads   │
│ Popup Form   │ ─────────────▶ │collection│ ────────▶ │  Table   │
│ (role,name,  │ status=new     │          │           │  Page    │
│  phone,skills│                │          │           │          │
│  message)    │                └──────────┘           └──────────┘
└──────────────┘                
```

---

## 4. File Structure

```
src/
├── lib/
│   ├── appwrite.ts               # Appwrite SDK client init (endpoint, projectId, DB IDs)
│   ├── auth-context.tsx           # React Context: AuthProvider + useAuth() hook
│   └── api.ts                    # CRUD helper functions for all 9 collections
│
├── components/
│   └── admin/
│       ├── Sidebar.tsx            # Left navigation sidebar
│       ├── AdminHeader.tsx        # Top header bar (page title, avatar, notifications)
│       ├── Modal.tsx              # Reusable modal/popup wrapper
│       ├── ImageUpload.tsx        # Drag-drop file uploader with preview
│       ├── DataTable.tsx          # Reusable sortable data table
│       ├── StatsCard.tsx          # Dashboard metric card
│       └── ConfirmDialog.tsx      # Delete/destructive action confirmation
│
├── app/
│   └── admin/
│       ├── layout.tsx             # Admin shell: auth guard + Sidebar + Header
│       ├── page.tsx               # Dashboard (stats, recent leads, quick actions)
│       ├── login/
│       │   └── page.tsx           # Login form (email + password)
│       ├── leads/
│       │   └── page.tsx           # Leads table with filters + detail panel
│       ├── projects/
│       │   └── page.tsx           # Projects grid + add/edit modal
│       ├── services/
│       │   └── page.tsx           # Services list + add/edit modal
│       ├── about/
│       │   └── page.tsx           # About section editor (single doc)
│       ├── team/
│       │   └── page.tsx           # Team cards + add/edit modal
│       ├── reviews/
│       │   └── page.tsx           # Reviews list + approval workflow
│       └── settings/
│           └── page.tsx           # Tabbed settings (5 tabs)
│
└── scripts/
    └── init-appwrite.ts           # One-time setup: create DB, collections, buckets
```

---

## 5. Design System & Tokens

### 5.1 Color Palette

```
Background
├── Sidebar:        #0F172A (slate-900)       Dark navy
├── Main content:   #F8FAFC (slate-50)        Light gray
├── Cards:          #FFFFFF                    White
├── Header bar:     #FFFFFF                    White with bottom border
└── Hover states:   #F1F5F9 (slate-100)       Subtle highlight

Text
├── Primary:        #0F172A (slate-900)       Headings, labels
├── Secondary:      #475569 (slate-500)       Descriptions, meta
├── Muted:          #94A3B8 (slate-400)       Placeholders, disabled
└── Sidebar text:   #CBD5E1 (slate-300)       Nav items
    └── Active:     #FFFFFF                    Active nav item

Accent / Brand
├── Primary:        #2563EB (blue-600)        Buttons, links, active states
├── Primary hover:  #1D4ED8 (blue-700)        Button hover
├── Primary light:  #EFF6FF (blue-50)         Active nav background
└── Primary ring:   #93C5FD (blue-300)        Focus ring

Status Colors
├── Success:        #16A34A (green-600)       Published, approved, converted
├── Warning:        #F59E0B (amber-500)       Pending, contacted, draft
├── Error:          #DC2626 (red-600)         Delete, reject, errors
├── Info:           #0EA5E9 (sky-500)         New, informational
└── Neutral:        #6B7280 (gray-500)        Closed, inactive, hidden

Status Dot / Badge Backgrounds
├── New:            bg-blue-100  text-blue-700
├── Contacted:      bg-amber-100 text-amber-700
├── Converted:      bg-green-100 text-green-700
├── Closed:         bg-gray-100  text-gray-600
├── Published:      bg-green-100 text-green-700
├── Draft:          bg-amber-100 text-amber-700
├── Pending:        bg-yellow-100 text-yellow-700
├── Approved:       bg-green-100 text-green-700
├── Hidden:         bg-gray-100  text-gray-600
├── Active:         bg-green-100 text-green-700
├── Inactive:       bg-gray-100  text-gray-600
├── Consulting:     bg-orange-100 text-orange-700
└── Community:      bg-blue-100  text-blue-700
```

### 5.2 Typography

```
Font Family:       Inter (Google Fonts) — clean sans-serif for admin
Fallback:          system-ui, -apple-system, sans-serif

Scale:
├── Page title:    text-2xl  (24px)  font-bold     tracking-tight
├── Section title: text-lg   (18px)  font-semibold
├── Card title:    text-base (16px)  font-semibold
├── Body:          text-sm   (14px)  font-normal
├── Meta/Caption:  text-xs   (12px)  font-medium   text-slate-500
├── Badge:         text-xs   (12px)  font-medium   uppercase tracking-wide
└── Input label:   text-sm   (14px)  font-medium   text-slate-700
```

### 5.3 Spacing & Layout

```
Sidebar width:     w-64      (256px)    — collapses to w-16 (64px icons only) on mobile
Header height:     h-16      (64px)
Content padding:   p-6       (24px)
Card padding:      p-5       (20px)
Card gap:          gap-6     (24px)
Card border:       rounded-xl border border-slate-200
Card shadow:       shadow-sm
Button padding:    px-4 py-2.5
Input height:      h-10      (40px)
Modal max-width:   max-w-2xl (672px)    — projects modal: max-w-4xl (896px)
```

### 5.4 Border Radius

```
Buttons:           rounded-lg   (8px)
Cards:             rounded-xl   (12px)
Badges:            rounded-full (pill)
Inputs:            rounded-lg   (8px)
Modals:            rounded-2xl  (16px)
Avatars:           rounded-full (circle)
Image thumbnails:  rounded-lg   (8px)
```

---

## 6. Shared Components

### 6.1 Sidebar (`Sidebar.tsx`)

```
┌──────────────────────────┐
│                          │
│   🏗️  ARUNA DEVI         │   ← Logo + Brand name
│   Admin Panel            │   ← Subtitle (text-xs)
│                          │
│ ─────────────────────────│   ← Divider
│                          │
│   📊  Dashboard          │   ← Active: bg-blue-50 text-blue-600
│   📩  Leads              │     border-l-3 border-blue-600
│   🏢  Projects           │
│   ⚙️  Services           │   ← Each item: py-2.5 px-4
│   📖  About              │     hover: bg-slate-800
│   👥  Team               │     text-slate-300 → text-white
│   ⭐  Reviews            │
│   🔧  Settings           │
│                          │
│                          │
│                          │
│ ─────────────────────────│
│                          │
│   🚪  Logout             │   ← Bottom-fixed, text-red-400
│                          │
└──────────────────────────┘
Width: 256px
Background: #0F172A (slate-900)
```

**UX Behavior:**
- Active page has left blue border + blue text + light blue background
- Hover lifts opacity from 0.7 to 1.0 with subtle bg change
- Sidebar shows lead count badge (unread) next to "Leads" item
- On mobile (< `lg`): sidebar becomes a slide-in overlay with backdrop, triggered by hamburger icon in header
- Collapse button at bottom reduces to icon-only mode (64px wide)

---

### 6.2 Admin Header (`AdminHeader.tsx`)

```
┌────────────────────────────────────────────────────────────────────┐
│  📄 Page Title                            🔔 (3)   👤 Admin ▾    │
│  Dashboard                                                        │
└────────────────────────────────────────────────────────────────────┘
Height: 64px
Background: white
Border-bottom: 1px slate-200
```

**Elements:**
- **Left:** Page title (dynamic, passed via context/prop), optional breadcrumb (`Dashboard / Projects / Edit`)
- **Right:** 
  - Notification bell with unread count badge (red dot or number)
  - Admin avatar (circle 36px) + name + dropdown (Profile, Logout)
- **Mobile:** Hamburger icon (☰) on left to toggle sidebar

---

### 6.3 Modal (`Modal.tsx`)

```
┌─ Backdrop (bg-black/50) ─────────────────────────────────────────┐
│                                                                   │
│          ┌──────────────────────────────────────┐                 │
│          │  Modal Title                    ✕    │  ← Header      │
│          │ ─────────────────────────────────── │                  │
│          │                                      │                 │
│          │  { children content }                │  ← Body         │
│          │                                      │  ← scrollable   │
│          │                                      │                 │
│          │ ─────────────────────────────────── │                  │
│          │              [Cancel]  [Save]        │  ← Footer       │
│          └──────────────────────────────────────┘                 │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg" | "xl";   // max-w-sm / md / 2xl / 4xl
  children: React.ReactNode;
  footer?: React.ReactNode;            // Custom footer or default cancel/save
}
```

**UX Behavior:**
- **Enter animation:** Scale from 0.95 + fade in (200ms ease-out)
- **Exit animation:** Scale to 0.95 + fade out (150ms ease-in)
- **Backdrop:** Click to close
- **Esc key:** Close modal
- **Body scroll:** Locked while open
- **Stacking:** `z-50` for modals, `z-60` for confirm dialogs on top

---

### 6.4 ImageUpload (`ImageUpload.tsx`)

```
┌──────────────────────────────────────────┐
│                                          │
│         ┌────────────────────┐           │
│         │   ☁️ Upload        │           │  ← No image state
│         │   Drag & drop or   │           │     Dashed border
│         │   click to browse  │           │     border-2 border-dashed
│         │                    │           │     border-slate-300
│         │   PNG, JPG, WebP   │           │     rounded-lg
│         │   Max 10MB         │           │     bg-slate-50
│         └────────────────────┘           │
│                                          │
│  OR (after upload):                      │
│                                          │
│  ┌─────────────┐                         │
│  │  🖼️ preview │  filename.jpg           │  ← Has image state
│  │  (150x150)  │  1.2 MB                 │     Shows thumbnail
│  │             │  [Replace] [Remove]     │     with file info
│  └─────────────┘                         │
│                                          │
└──────────────────────────────────────────┘
```

**Props:**
```typescript
interface ImageUploadProps {
  value?: string;               // Current file ID or URL
  onChange: (fileId: string | null) => void;
  accept?: string;              // "image/*" | "video/*" | "image/*,video/*"
  maxSize?: number;             // In bytes (default 10MB)
  bucket?: "images" | "videos"; // Target Appwrite bucket
  label?: string;
  shape?: "rect" | "circle";   // Circle for avatars
}
```

**UX Behavior:**
- Drag enters → border solid blue, bg-blue-50
- Upload progress → progress bar below image
- Error state → red border, error message below
- Circle shape crops preview to circle (team member photos)

---

### 6.5 StatsCard (`StatsCard.tsx`)

```
┌────────────────────────────────┐
│  📩                            │  ← Icon (24px, text-blue-600)
│                                │
│  42                            │  ← Value (text-3xl font-bold)
│  Total Leads                   │  ← Label (text-sm text-slate-500)
│                                │
│  ↑ 12% from last month        │  ← Trend (text-xs, green=up red=down)
└────────────────────────────────┘
```

**Props:**
```typescript
interface StatsCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: { value: string; direction: "up" | "down" | "neutral" };
  onClick?: () => void;         // Navigate to section on click
}
```

---

### 6.6 ConfirmDialog (`ConfirmDialog.tsx`)

```
┌──────────────────────────────────────┐
│                                      │
│         ⚠️                            │
│                                      │
│   Are you sure you want to delete    │
│   "Skyline Residential"?             │
│                                      │
│   This action cannot be undone.      │
│                                      │
│          [Cancel]   [Delete]         │
│                      ↑ red bg        │
└──────────────────────────────────────┘
```

**Props:**
```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;         // Default: "Delete"
  variant?: "danger" | "warning"; // Controls button color
  loading?: boolean;
}
```

---

### 6.7 DataTable (`DataTable.tsx`)

```
┌──────────────────────────────────────────────────────────────┐
│ ☐  │ Name        │ Type       │ Status  │ Date     │ Actions│
│────┼─────────────┼────────────┼─────────┼──────────┼────────│
│ ☐  │ John Doe    │ Consulting │ 🟢 New  │ Feb 20   │ 👁️ ✏️ 🗑️│
│ ☐  │ Priya S     │ Community  │ 🟡 Cont │ Feb 19   │ 👁️ ✏️ 🗑️│
│ ☐  │ Raj Kumar   │ Consulting │ 🔵 Conv │ Feb 18   │ 👁️ ✏️ 🗑️│
│────┼─────────────┼────────────┼─────────┼──────────┼────────│
│                        ← 1 2 3 ... 10 →                     │
│                        Showing 1-10 of 42                    │
└──────────────────────────────────────────────────────────────┘
```

**Props:**
```typescript
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  selectable?: boolean;
  pagination?: { page: number; total: number; perPage: number };
  onPageChange?: (page: number) => void;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}
```

---

## 7. Page Wireframes & UX

---

### 7.1 Login Page

**Route:** `/admin/login`  
**Auth:** Public (no auth required)  
**Layout:** No sidebar/header — standalone centered page

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│              Background: slate-100 (full page)                   │
│                                                                  │
│          ┌──────────────────────────────────────┐                │
│          │                                      │                │
│          │        🏗️  ARUNA DEVI               │                │
│          │       Infra Projects                 │                │
│          │                                      │                │
│          │       ─── Admin Panel ───            │                │
│          │                                      │                │
│          │  Email                               │                │
│          │  ┌──────────────────────────────┐    │                │
│          │  │ admin@arunadevi.com          │    │                │
│          │  └──────────────────────────────┘    │                │
│          │                                      │                │
│          │  Password                            │                │
│          │  ┌──────────────────────────────┐    │                │
│          │  │ ••••••••                  👁️ │    │                │
│          │  └──────────────────────────────┘    │                │
│          │                                      │                │
│          │  ☐ Remember me                       │                │
│          │                                      │                │
│          │  ┌──────────────────────────────┐    │                │
│          │  │         Sign In              │    │  ← blue-600    │
│          │  └──────────────────────────────┘    │     full-width  │
│          │                                      │                │
│          │  ❌ Invalid email or password         │  ← Hidden by   │
│          │     (error message area)             │     default     │
│          │                                      │                │
│          └──────────────────────────────────────┘                │
│               Card: white, rounded-2xl, shadow-lg                │
│               max-w-sm (384px), p-8                              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**UX Flow:**
1. User visits any `/admin/*` route → middleware checks for Appwrite session
2. No valid session → redirect to `/admin/login`
3. User enters email + password → calls `account.createEmailPasswordSession()`
4. On success → redirect to `/admin` (dashboard)
5. On failure → show inline error message with shake animation
6. "Remember me" → configurable session expiry (7 days vs 1 hour)
7. Password field has eye icon toggle (show/hide)

**Validation:**
- Email: required, valid email format
- Password: required, min 8 characters
- Show spinner on submit button while authenticating
- Disable form inputs during auth request

---

### 7.2 Dashboard

**Route:** `/admin`  
**Auth:** Protected  
**Purpose:** At-a-glance overview of all site content + recent activity

```
┌─────────┬───────────────────────────────────────────────────────────┐
│         │  📊 Dashboard                              🔔 (3) 👤 ▾  │
│ SIDEBAR │──────────────────────────────────────────────────────────│
│         │                                                          │
│ 📊 ●    │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────│
│ 📩      │  │ 📩          │ │ 🏢          │ │ 👥          │ │ ⭐   │
│ 🏢      │  │             │ │             │ │             │ │      │
│ ⚙️      │  │  42         │ │  6          │ │  3          │ │  4   │
│ 📖      │  │ Total Leads │ │ Projects    │ │ Team Members│ │Revie │
│ 👥      │  │ ↑12% month  │ │ 4 published │ │ All active  │ │1 pen │
│ ⭐      │  └─────────────┘ └─────────────┘ └─────────────┘ └─────│
│ 🔧      │                                                          │
│         │  ┌──────────────────────────────┐ ┌─────────────────────│
│         │  │ 📩 Recent Leads              │ │ ⚡ Quick Actions    │
│         │  │                              │ │                     │
│         │  │ • John Doe                   │ │ ┌─────────────────┐ │
│         │  │   Consulting · 2h ago · 🟢   │ │ │ ➕ Add Project  │ │
│         │  │                              │ │ └─────────────────┘ │
│         │  │ • Priya S                    │ │ ┌─────────────────┐ │
│         │  │   Community · 5h ago · 🟡    │ │ │ ➕ Add Service  │ │
│         │  │                              │ │ └─────────────────┘ │
│         │  │ • Raj Kumar                  │ │ ┌─────────────────┐ │
│         │  │   Consulting · 1d ago · 🔵   │ │ │ ➕ Add Member   │ │
│         │  │                              │ │ └─────────────────┘ │
│         │  │ View All Leads →             │ │ ┌─────────────────┐ │
│         │  └──────────────────────────────┘ │ │ 📝 Edit About   │ │
│         │                                   │ └─────────────────┘ │
│         │  ┌──────────────────────────────┐ └─────────────────────│
│         │  │ 📈 Leads This Month          │                       │
│         │  │                              │ ┌─────────────────────│
│         │  │  ██                          │ │ 🔔 Content Status   │
│         │  │  ██ ██                       │ │                     │
│         │  │  ██ ██    ██                 │ │ Hero Slides: 4 ●    │
│         │  │  ██ ██ ██ ██                 │ │ Services: 3 ●       │
│         │  │ ─────────────                │ │ Software: 6 ●       │
│         │  │ W1  W2  W3  W4              │ │ Last edit: 2d ago   │
│ 🚪      │  └──────────────────────────────┘ └─────────────────────│
│         │                                                          │
└─────────┴───────────────────────────────────────────────────────────┘
```

**Sections:**

1. **Stats Row** (4 cards, equal width)
   - Total Leads — count from `leads` collection, trend vs. last month
   - Projects — count from `projects`, breakdown by status
   - Team Members — count from `team_members`, all active indicator
   - Reviews — count from `reviews`, pending approval count
   - Each card is clickable → navigates to respective page

2. **Recent Leads** (left column, 60% width)
   - Last 5 leads, sorted by `created_at` desc
   - Shows: name, type badge, relative time, status badge
   - "View All Leads →" link to `/admin/leads`

3. **Quick Actions** (right column, 40% width)
   - 4 shortcut buttons with icons
   - Each navigates to the create action on respective page

4. **Leads Chart** (left column)
   - Simple bar chart showing lead submissions per week (last 4 weeks)
   - Split by consulting (orange) vs community (blue)

5. **Content Status** (right column)
   - Quick overview of active content counts
   - Last updated timestamp

---

### 7.3 Leads / Enquiries

**Route:** `/admin/leads`  
**Auth:** Protected  
**Purpose:** View, filter, and manage all form submissions from the public website

```
┌─────────┬───────────────────────────────────────────────────────────┐
│         │  📩 Leads & Enquiries                      🔔 (3) 👤 ▾  │
│ SIDEBAR │──────────────────────────────────────────────────────────│
│         │                                                          │
│         │  ┌─────────────────────────────────────────────────────┐ │
│         │  │ [All] [Consulting] [Community]    │ Status: [All ▾] │ │
│         │  │                                   │                 │ │
│ 📊      │  │ 🔍 Search by name or phone...     │ [📥 Export CSV] │ │
│ 📩 ●    │  └─────────────────────────────────────────────────────┘ │
│ 🏢      │                                                          │
│ ⚙️      │  ┌─────────────────────────────────────────────────────┐ │
│ 📖      │  │☐│ Name       │ Phone      │ Type      │ Loc/Role   │ │
│ 👥      │  │──┼────────────┼────────────┼───────────┼────────────│ │
│ ⭐      │  │☐│ John Doe   │ +91 98765  │ 🟠Consult │ Chennai    │ │
│ 🔧      │  │  │            │            │           │            │ │
│         │  │──┼────────────┼────────────┼───────────┼────────────│ │
│         │  │☐│ Priya S    │ +91 87654  │ 🔵Commun  │ Student    │ │
│         │  │  │            │            │           │            │ │
│         │  │──┼────────────┼────────────┼───────────┼────────────│ │
│         │  │☐│ Raj Kumar  │ +91 76543  │ 🟠Consult │ Madurai    │ │
│         │  │  │            │            │           │            │ │
│         │  │──┼────────────┼────────────┼───────────┼────────────│ │
│         │  │☐│ Arun P     │ +91 65432  │ 🔵Commun  │ Profession │ │
│         │  │  │            │            │           │            │ │
│         │  └─────────────────────────────────────────────────────┘ │
│         │   Table continues with columns:                          │
│         │   ... │ Message (truncated) │ Status │ Date │ Actions   │
│         │                                                          │
│         │  ← Prev   1  2  3 ... 10   Next →   Showing 1-10 of 42 │
│         │                                                          │
└─────────┴───────────────────────────────────────────────────────────┘
```

**Table Columns:**

| Column      | Width | Content                                               |
| ----------- | ----- | ----------------------------------------------------- |
| ☐           | 40px  | Checkbox for bulk actions                             |
| Name        | 15%   | Lead's name                                           |
| Phone       | 12%   | Phone number (click to call)                          |
| Type        | 10%   | Badge: 🟠 `Consulting` or 🔵 `Community`             |
| Loc / Role  | 12%   | Location (consulting) or Role (community)             |
| Message     | 25%   | Truncated to 50 chars with `...`                      |
| Status      | 10%   | Badge: `New` `Contacted` `Converted` `Closed`         |
| Date        | 8%    | Relative time (e.g. `2h ago`, `Feb 18`)               |
| Actions     | 8%    | View 👁️ / Edit ✏️ / Delete 🗑️ icon buttons            |

**Filters:**
- **Type tabs:** All | Consulting | Community — horizontal toggle buttons
- **Status dropdown:** All | New | Contacted | Converted | Closed
- **Search:** Real-time search by name or phone number
- **Export:** Download all filtered leads as CSV file

**Lead Detail Slide-out Panel** (opens when clicking View 👁️ or row click):

```
┌──────────── Slide-out (right side, 420px) ──────────────┐
│                                                          │
│  ← Back                                          ✕      │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  👤 John Doe                                       │  │
│  │  📩 Consulting Lead                                │  │
│  │  Submitted: February 20, 2026 at 3:45 PM          │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  Contact Information                                     │
│  ─────────────────────                                   │
│  📱 Phone:     +91 9876543210        [📋 Copy]          │
│  📍 Location:  Chennai                                   │
│                                                          │
│  Message                                                 │
│  ─────────────────────                                   │
│  "Need 3D visualization for my new villa project.       │
│   Looking for premium quality renders for a 3-story      │
│   residential building."                                 │
│                                                          │
│  Status                                                  │
│  ─────────────────────                                   │
│  ┌──────────────────────────────────────┐               │
│  │ New ▾                                │               │
│  └──────────────────────────────────────┘               │
│                                                          │
│  Admin Notes                                             │
│  ─────────────────────                                   │
│  ┌──────────────────────────────────────┐               │
│  │ Called on Feb 21. Client wants to    │               │
│  │ discuss next week.                   │               │
│  │                                      │               │
│  └──────────────────────────────────────┘               │
│                                                          │
│  ┌──────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │  Save    │ │Mark Contacted│ │   Delete     │        │
│  │  ✓       │ │   📞         │ │   🗑️ (red)   │        │
│  └──────────┘ └──────────────┘ └──────────────┘        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**UX Behavior:**
- Slide-out opens from right with 300ms ease-out slide animation
- Backdrop (bg-black/20) behind slide-out
- Status change → immediate save with toast notification
- Bulk select leads → bulk status change or bulk delete
- New leads show a pulsing blue dot in sidebar nav badge
- Phone number is clickable (`tel:`) and has copy button
- Admin notes auto-save on blur (debounced)

---

### 7.4 Projects

**Route:** `/admin/projects`  
**Auth:** Protected  
**Purpose:** Full CRUD for construction projects displayed on the public website

```
┌─────────┬───────────────────────────────────────────────────────────┐
│         │  🏢 Projects                               🔔 (3) 👤 ▾  │
│ SIDEBAR │──────────────────────────────────────────────────────────│
│         │                                                          │
│         │  ┌─────────────────────────────────────────────────────┐ │
│ 📊      │  │ [All] [Residential] [Commercial] [Villa]           │ │
│ 📩      │  │                                                     │ │
│ 🏢 ●    │  │ Status: [All ▾]   🔍 Search...   [＋ Add Project] │ │
│ ⚙️      │  └─────────────────────────────────────────────────────┘ │
│ 📖      │                                                          │
│ 👥      │  ┌──────────────────┐ ┌──────────────────┐ ┌───────────│
│ ⭐      │  │ ┌──────────────┐ │ │ ┌──────────────┐ │ │ ┌─────── │
│ 🔧      │  │ │ 📸           │ │ │ │ 📸           │ │ │ │ 📸     │
│         │  │ │  Thumbnail   │ │ │ │  Thumbnail   │ │ │ │  Thumb │
│         │  │ │  Image       │ │ │ │  Image       │ │ │ │  Image │
│         │  │ │              │ │ │ │              │ │ │ │        │
│         │  │ └──────────────┘ │ │ └──────────────┘ │ │ └─────── │
│         │  │                  │ │                  │ │           │
│         │  │ Skyline          │ │ Tech Park Tower  │ │ Commercia│
│         │  │ Residential      │ │                  │ │ Complex  │
│         │  │                  │ │                  │ │           │
│         │  │ 🏷️ Residential   │ │ 🏷️ Commercial   │ │ 🏷️ Commer│
│         │  │ 📍 Coimbatore    │ │ 📍 Chennai       │ │ 📍 Madur │
│         │  │                  │ │                  │ │           │
│         │  │ 🟢 Published     │ │ 🟢 Published     │ │ 📝 Draft │
│         │  │ ⭐ Featured      │ │                  │ │           │
│         │  │                  │ │                  │ │           │
│         │  │ [✏️ Edit] [👁️]   │ │ [✏️ Edit] [👁️]   │ │ [✏️ Edit]│
│         │  │ [🗑️ Delete]      │ │ [🗑️ Delete]      │ │ [🗑️ Dele│
│         │  └──────────────────┘ └──────────────────┘ └───────────│
│         │                                                          │
│         │  ┌──────────────────┐ ┌──────────────────┐ ┌───────────│
│         │  │  (3 more cards)  │ │                  │ │           │
│         │  └──────────────────┘ └──────────────────┘ └───────────│
│         │                                                          │
└─────────┴───────────────────────────────────────────────────────────┘
```

**Project Card Structure:**
```
┌──────────────────────────────┐
│  ┌────────────────────────┐  │
│  │                        │  │  ← Thumbnail (aspect-video, rounded-t-xl)
│  │      Project Image     │  │     Object-fit: cover
│  │                        │  │     On hover: slight scale(1.02)
│  └────────────────────────┘  │
│                              │
│  Skyline Residential         │  ← Title (font-semibold)
│                              │
│  🏷️ Residential              │  ← Category badge (rounded-full)
│  📍 Coimbatore               │  ← Location (text-sm text-slate-500)
│                              │
│  🟢 Published  ⭐ Featured   │  ← Status badge + featured star
│                              │
│  ┌────────┐ ┌────┐ ┌──────┐ │
│  │✏️ Edit │ │ 👁️ │ │ 🗑️   │ │  ← Action buttons row
│  └────────┘ └────┘ └──────┘ │     Edit: blue, View: gray, Delete: red
│                              │
└──────────────────────────────┘
   Card: white, rounded-xl, shadow-sm, border slate-200
   Width: 1/3 of grid (responsive: 1/2 on md, 1/1 on sm)
```

**Add/Edit Project Modal** (size: `xl` — 896px):

```
┌─── Add New Project ────────────────────────────────── ✕ ──────────┐
│                                                                    │
│  ┌─ Basic Info ──────────────────────────────────────────────────┐ │
│  │                                                                │ │
│  │  Title *                          Slug (auto-generated)       │ │
│  │  ┌────────────────────────┐       ┌────────────────────────┐  │ │
│  │  │ Skyline Residential    │       │ skyline-residential     │  │ │
│  │  └────────────────────────┘       └────────────────────────┘  │ │
│  │                                                                │ │
│  │  Category *              Location *           Client *        │ │
│  │  ┌──────────────┐        ┌──────────────┐     ┌────────────┐  │ │
│  │  │ Residential ▾│        │ Coimbatore   │     │ Global Tech│  │ │
│  │  └──────────────┘        └──────────────┘     └────────────┘  │ │
│  │                                                                │ │
│  │  Area *                  Duration *           Status          │ │
│  │  ┌──────────────┐        ┌──────────────┐     ┌────────────┐  │ │
│  │  │ 120,000 sq ft│        │ 24 Months    │     │ Published ▾│  │ │
│  │  └──────────────┘        └──────────────┘     └────────────┘  │ │
│  │                                                                │ │
│  │  ☐ Featured — Show this project on homepage hero carousel     │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌─ Content ─────────────────────────────────────────────────────┐ │
│  │                                                                │ │
│  │  Description *                                                │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ We combine technical expertise with creative vision to   │  │ │
│  │  │ deliver architectural solutions that are both innovative │  │ │
│  │  │ and practical...                                         │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  Challenges *                   Solutions *                    │ │
│  │  ┌────────────────────────┐     ┌────────────────────────┐    │ │
│  │  │ Technical challenges   │     │ Engineering solutions  │    │ │
│  │  │ faced during project   │     │ implemented by team    │    │ │
│  │  │ ...                    │     │ ...                    │    │ │
│  │  └────────────────────────┘     └────────────────────────┘    │ │
│  │                                                                │ │
│  │  Key Outcomes *                                               │ │
│  │  ┌──────────────────────────────────────────────── ➕ Add ──┐  │ │
│  │  │ 1. Creative vision to deliver solutions          ✕      │  │ │
│  │  │ 2. Seamless coordination between design           ✕      │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌─ Media ───────────────────────────────────────────────────────┐ │
│  │                                                                │ │
│  │  Card Thumbnail *              Hero Media (optional)          │ │
│  │  ┌──────────────────┐          ┌──────────────────┐           │ │
│  │  │  ☁️ Upload        │          │  ☁️ Upload        │           │ │
│  │  │  image            │          │  image or video   │           │ │
│  │  └──────────────────┘          └──────────────────┘           │ │
│  │                                                                │ │
│  │  Gallery Images (up to 6)                                     │ │
│  │  ┌────────────────────────────────────────────────────────┐   │ │
│  │  │  🖼️ 1    🖼️ 2    🖼️ 3    🖼️ 4    🖼️ 5    🖼️ 6       │   │ │
│  │  │                                                        │   │ │
│  │  │  Drag to reorder   •   Click ✕ to remove              │   │ │
│  │  │                    •   [📁 Add More Images]            │   │ │
│  │  └────────────────────────────────────────────────────────┘   │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ──────────────────────────────────────────────────────────────── │
│                                                                    │
│                    [Cancel]   [Save as Draft]   [✓ Publish]       │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**UX Details:**
- **Slug auto-generation:** As user types title, slug auto-generates (lowercase, hyphens, no special chars). Slug is editable but shows warning if manually changed.
- **Category dropdown:** `Residential` | `Commercial` | `Villa`
- **Key Outcomes:** Dynamic list. Each item has text input + ✕ remove button. ➕ button adds new empty item. Min 1, max 10.
- **Gallery:** Grid of 6 slots. Drag-and-drop to reorder. Click to upload/replace. ✕ to remove. Shows upload progress per image.
- **Save as Draft:** Saves with `status: "draft"` — not visible on public site
- **Publish:** Saves with `status: "published"` — immediately visible on public site
- **View button (👁️):** Opens project detail page on public site in new tab
- **Delete:** Shows ConfirmDialog before deletion

**Validation Rules:**
- Title: required, min 3 chars, max 100
- Location: required
- Category: required (select)
- Client: required
- Area: required
- Duration: required
- Description: required, min 20 chars
- Challenges: required, min 20 chars
- Solutions: required, min 20 chars
- Key Outcomes: at least 1 item
- Card Thumbnail: required image
- Gallery: optional, max 6 images

---

### 7.5 Services

**Route:** `/admin/services`  
**Auth:** Protected  
**Purpose:** Manage the 3 service offerings shown on the public website

```
┌─────────┬───────────────────────────────────────────────────────────┐
│         │  ⚙️ Services                               🔔 (3) 👤 ▾  │
│ SIDEBAR │──────────────────────────────────────────────────────────│
│         │                                                          │
│ 📊      │  ┌─────────────────────────────────────────────────────┐ │
│ 📩      │  │ Services (3)                    [＋ Add Service]    │ │
│ 🏢      │  └─────────────────────────────────────────────────────┘ │
│ ⚙️ ●    │                                                          │
│ 📖      │  ┌──────────────────────────────────────────────────── │
│ 👥      │  │ ≡  ┌──────┐  From 2D Plans to 3D Reality            │
│ ⭐      │  │    │ 🖼️   │  Experience your project before const.. │
│ 🔧      │  │    │      │  🟢 Published  │  Sort: 1               │
│         │  │    └──────┘                 [✏️ Edit]  [🗑️ Delete]  │
│         │  │─────────────────────────────────────────────────────│
│         │  │ ≡  ┌──────┐  Architectural Planning                 │
│         │  │    │ 🖼️   │  Innovative architectural designs that.. │
│         │  │    │      │  🟢 Published  │  Sort: 2               │
│         │  │    └──────┘                 [✏️ Edit]  [🗑️ Delete]  │
│         │  │─────────────────────────────────────────────────────│
│         │  │ ≡  ┌──────┐  Structural Design                      │
│         │  │    │ 🖼️   │  Complete structural analysis and des.. │
│         │  │    │      │  🟢 Published  │  Sort: 3               │
│         │  │    └──────┘                 [✏️ Edit]  [🗑️ Delete]  │
│         │  └──────────────────────────────────────────────────── │
│         │                                                          │
│         │  ℹ️ Drag ≡ to reorder services. Changes save             │
│         │    automatically.                                        │
│         │                                                          │
└─────────┴───────────────────────────────────────────────────────────┘
```

**Service Card (List Item) Structure:**
```
┌──────────────────────────────────────────────────────────────────┐
│  ≡    ┌────────┐   Title: From 2D Plans to 3D Reality            │
│ drag  │  img   │   Description: Experience your project before.. │
│ handle│ 80x80  │   Status: 🟢 Published  │  Sort Order: 1       │
│       └────────┘                                                  │
│                                    [✏️ Edit]   [🗑️ Delete]       │
└──────────────────────────────────────────────────────────────────┘
```

**Add/Edit Service Modal** (size: `md` — 672px):

```
┌─── Edit Service ─────────────────────────────────── ✕ ────────────┐
│                                                                    │
│  Title *                                                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ From 2D Plans to 3D Reality                                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Short Description * (shown on card)                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Experience your project before construction begins with our  │  │
│  │ advanced 3D visualization services.                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  Characters: 92/200                                               │
│                                                                    │
│  Extended Description * (shown in detail popup)                   │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Experience your project before construction begins with our  │  │
│  │ advanced 3D visualization services. We combine technical     │  │
│  │ expertise with creative vision to deliver architectural      │  │
│  │ solutions that are both innovative and practical...          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Service Image *                                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  ┌─────────────┐                                             │  │
│  │  │  🖼️ preview  │  3d-visualization.png                      │  │
│  │  │   (150px)    │  245 KB                                    │  │
│  │  │              │  [Replace]  [Remove]                       │  │
│  │  └─────────────┘                                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Status                             Sort Order                    │
│  ┌────────────────────┐             ┌────────────────────┐        │
│  │ Published ▾        │             │ 1 ▾                │        │
│  └────────────────────┘             └────────────────────┘        │
│                                                                    │
│  ───────────────────────────────────────────────────────────────  │
│                                          [Cancel]    [✓ Save]    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**UX Details:**
- **Drag-to-reorder:** Grab ≡ handle to rearrange services. Sort order updates automatically on drop.
- **Character count** on short description (200 char limit for clean card display)
- **Image preview** shows current uploaded image with replace/remove options
- **Delete** shows ConfirmDialog

---

### 7.6 About

**Route:** `/admin/about`  
**Auth:** Protected  
**Purpose:** Edit the single "About / Our Story" section on the homepage

```
┌─────────┬───────────────────────────────────────────────────────────┐
│         │  📖 About Section                          🔔 (3) 👤 ▾  │
│ SIDEBAR │──────────────────────────────────────────────────────────│
│         │                                                          │
│ 📊      │  ┌─── Content ─────────────────────────────────────────┐ │
│ 📩      │  │                                                      │ │
│ 🏢      │  │  Section Label                                      │ │
│ ⚙️      │  │  ┌──────────────────────────────────────────────┐    │ │
│ 📖 ●    │  │  │ Our Story                                    │    │ │
│ 👥      │  │  └──────────────────────────────────────────────┘    │ │
│ ⭐      │  │                                                      │ │
│ 🔧      │  │  Section Heading                                    │ │
│         │  │  ┌──────────────────────────────────────────────┐    │ │
│         │  │  │ Building Dreams                              │    │ │
│         │  │  └──────────────────────────────────────────────┘    │ │
│         │  │                                                      │ │
│         │  │  Description                                        │ │
│         │  │  ┌──────────────────────────────────────────────┐    │ │
│         │  │  │ We combine technical expertise with creative │    │ │
│         │  │  │ vision to deliver architectural solutions    │    │ │
│         │  │  │ that are both innovative and practical. Our  │    │ │
│         │  │  │ integrated approach ensures seamless         │    │ │
│         │  │  │ coordination between design and execution.   │    │ │
│         │  │  │                                              │    │ │
│         │  │  │ At Aruna Devi Infra Projects, we believe     │    │ │
│         │  │  │ every structure tells a story...             │    │ │
│         │  │  └──────────────────────────────────────────────┘    │ │
│         │  │                                                      │ │
│         │  │  About Image                                        │ │
│         │  │  ┌──────────────────────┐                            │ │
│         │  │  │   ┌─────────────┐    │                            │ │
│         │  │  │   │ 🖼️ Current   │    │                            │ │
│         │  │  │   │  about.png  │    │                            │ │
│         │  │  │   │             │    │                            │ │
│         │  │  │   └─────────────┘    │                            │ │
│         │  │  │ [Replace] [Remove]   │                            │ │
│         │  │  └──────────────────────┘                            │ │
│         │  │                                                      │ │
│         │  └──────────────────────────────────────────────────────┘ │
│         │                                                          │
│         │  ┌─── Stats ───────────────────────────────────────────┐ │
│         │  │                                                      │ │
│         │  │  📊 Statistics               [➕ Add Stat]           │ │
│         │  │                                                      │ │
│         │  │  ┌──────────────┐ ┌───────────────────────────┐ ┌─┐ │ │
│         │  │  │ Value: 5+    │ │ Label: Projects           │ │✕│ │ │
│         │  │  └──────────────┘ └───────────────────────────┘ └─┘ │ │
│         │  │                                                      │ │
│         │  │  ┌──────────────┐ ┌───────────────────────────┐ ┌─┐ │ │
│         │  │  │ Value: 100+  │ │ Label: Community Members  │ │✕│ │ │
│         │  │  │              │ │ Across Tamil Nadu         │ │ │ │ │
│         │  │  └──────────────┘ └───────────────────────────┘ └─┘ │ │
│         │  │                                                      │ │
│         │  └──────────────────────────────────────────────────────┘ │
│         │                                                          │
│         │  ┌──────────────────────────────────────────────────────┐ │
│         │  │                [Discard Changes]   [✓ Save & Publish]│ │
│         │  └──────────────────────────────────────────────────────┘ │
│         │                                                          │
└─────────┴───────────────────────────────────────────────────────────┘
```

**UX Details:**
- **Single document** — no add/delete, only edit the one about section
- **Stats are dynamic** — can add/remove stat items (min 1, max 6)
- **Each stat** has a `value` field (short, like `5+`) and a `label` field (like `Projects`)
- **Discard Changes** resets form to last saved state (with confirmation)
- **Save & Publish** saves immediately — changes reflect on public site
- **Unsaved changes warning** — if user navigates away with unsaved changes, show confirm dialog
- **Description** is a multi-line textarea (min 6 rows) — later can upgrade to rich text editor

---

### 7.7 Team

**Route:** `/admin/team`  
**Auth:** Protected  
**Purpose:** Manage team member cards displayed on the public website

```
┌─────────┬───────────────────────────────────────────────────────────┐
│         │  👥 Team Members                           🔔 (3) 👤 ▾  │
│ SIDEBAR │──────────────────────────────────────────────────────────│
│         │                                                          │
│ 📊      │  ┌─────────────────────────────────────────────────────┐ │
│ 📩      │  │ Team Members (3)               [＋ Add Member]     │ │
│ 🏢      │  └─────────────────────────────────────────────────────┘ │
│ ⚙️      │                                                          │
│ 📖      │  ┌──────────────────┐ ┌──────────────────┐ ┌───────────│
│ 👥 ●    │  │                  │ │                  │ │           │
│ ⭐      │  │    ┌────────┐    │ │    ┌────────┐    │ │    ┌─────│
│ 🔧      │  │    │  👤    │    │ │    │  👤    │    │ │    │  👤 │
│         │  │    │ Photo  │    │ │    │ Photo  │    │ │    │ Phot│
│         │  │    │(circle)│    │ │    │(circle)│    │ │    │(circ│
│         │  │    └────────┘    │ │    └────────┘    │ │    └─────│
│         │  │                  │ │                  │ │           │
│         │  │ Er. NISHANTH.K   │ │ MOHAN B R        │ │ Community│
│         │  │ Founder & CEO    │ │ Co-founder       │ │ Members  │
│         │  │                  │ │                  │ │           │
│         │  │ 🟢 Active        │ │ 🟢 Active        │ │ 🟢 Active│
│         │  │ Sort: 1          │ │ Sort: 2          │ │ Sort: 3  │
│         │  │                  │ │                  │ │           │
│         │  │ [✏️ Edit]        │ │ [✏️ Edit]        │ │ [✏️ Edit]│
│         │  │ [🗑️ Delete]      │ │ [🗑️ Delete]      │ │ [🗑️ Del]│
│         │  └──────────────────┘ └──────────────────┘ └───────────│
│         │                                                          │
│         │  ℹ️ Drag cards to reorder team members.                   │
│         │                                                          │
└─────────┴───────────────────────────────────────────────────────────┘
```

**Team Card Structure:**
```
┌──────────────────────────────┐
│                              │
│       ┌──────────────┐       │  ← Circle photo (120px)
│       │              │       │     Object-fit: cover
│       │   👤 Photo   │       │     rounded-full
│       │              │       │     border-4 border-slate-100
│       └──────────────┘       │
│                              │
│    Er. NISHANTH.K            │  ← Name (font-semibold, center)
│    Founder & CEO             │  ← Role (text-sm text-slate-500)
│                              │
│    🟢 Active  │  Sort: 1     │  ← Status badge + sort order
│                              │
│    [✏️ Edit]  [🗑️ Delete]    │  ← Action buttons
│                              │
└──────────────────────────────┘
```

**Add/Edit Team Member Modal** (size: `sm` — 480px):

```
┌─── Add Team Member ──────────────────────────── ✕ ────────────────┐
│                                                                    │
│  Photo *                                                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                                                              │  │
│  │              ┌──────────┐                                    │  │
│  │              │  ☁️       │                                    │  │
│  │              │  Upload   │   Circle preview                  │  │
│  │              │  photo    │   (128px circle)                  │  │
│  │              └──────────┘                                    │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Full Name *                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Er. NISHANTH.K                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Role / Designation                                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Founder & CEO                                                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Sort Order                          Status                       │
│  ┌────────────────────┐              ┌────────────────────┐       │
│  │ 1 ▾                │              │ Active ▾           │       │
│  └────────────────────┘              └────────────────────┘       │
│                                                                    │
│  ───────────────────────────────────────────────────────────────  │
│                                          [Cancel]    [✓ Save]    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**UX Details:**
- **Photo upload** shows circle-cropped preview (matches public site display)
- **Drag-to-reorder** cards on the grid (updates `sort_order`)
- **Status toggle** — `Active` shows on public site, `Inactive` hides
- **Delete** shows ConfirmDialog with member's name
- **Role field is optional** — current data doesn't use role, but the admin allows adding it for future use

---

### 7.8 Reviews

**Route:** `/admin/reviews`  
**Auth:** Protected  
**Purpose:** Manage client testimonials with approval workflow

```
┌─────────┬───────────────────────────────────────────────────────────┐
│         │  ⭐ Client Reviews                         🔔 (3) 👤 ▾  │
│ SIDEBAR │──────────────────────────────────────────────────────────│
│         │                                                          │
│ 📊      │  ┌─────────────────────────────────────────────────────┐ │
│ 📩      │  │ [All (4)] [Pending (1)] [Approved (2)] [Hidden (1)]│ │
│ 🏢      │  │                                                     │ │
│ ⚙️      │  │                                   [＋ Add Review]  │ │
│ 📖      │  └─────────────────────────────────────────────────────┘ │
│ 👥      │                                                          │
│ ⭐ ●    │  ┌──────────────────────────────────────────────────── │
│ 🔧      │  │                                                      │
│         │  │  ┌──────┐  Client 1                                  │
│         │  │  │ 🖼️   │  ⭐⭐⭐⭐⭐ (5/5)                          │
│         │  │  │      │                                            │
│         │  │  └──────┘  "Our team of experienced architects       │
│         │  │            and engineers brings together decades      │
│         │  │            of expertise to deliver exceptional        │
│         │  │            results for every project."                │
│         │  │                                                      │
│         │  │            🟢 Approved                                │
│         │  │                                                      │
│         │  │            [✏️ Edit]  [👁️ Hide]  [🗑️ Delete]         │
│         │  │                                                      │
│         │  │──────────────────────────────────────────────────────│
│         │  │                                                      │
│         │  │  ┌──────┐  Client 2                                  │
│         │  │  │ 🖼️   │  ⭐⭐⭐⭐ (4/5)                            │
│         │  │  │      │                                            │
│         │  │  └──────┘  "Our team of experienced architects       │
│         │  │            and engineers..."                          │
│         │  │                                                      │
│         │  │            🟡 Pending                                 │
│         │  │                                                      │
│         │  │            [✅ Approve]  [✏️ Edit]  [🗑️ Delete]      │
│         │  │                                                      │
│         │  └──────────────────────────────────────────────────── │
│         │                                                          │
└─────────┴───────────────────────────────────────────────────────────┘
```

**Review Card (List Item) Structure:**
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌────────┐   Client 1                                           │
│  │  🖼️    │   ⭐⭐⭐⭐⭐  (5 out of 5)                            │
│  │ Client │                                                      │
│  │ Photo  │   "Our team of experienced architects and engineers  │
│  │ 60x60  │    brings together decades of expertise to deliver   │
│  │ circle │    exceptional results for every project."           │
│  └────────┘                                                      │
│                                                                  │
│               🟢 Approved  │  Added: Feb 15, 2026               │
│                                                                  │
│               [✏️ Edit]  [👁️ Hide]  [🗑️ Delete]                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Add/Edit Review Modal** (size: `md` — 672px):

```
┌─── Add Review ───────────────────────────────── ✕ ────────────────┐
│                                                                    │
│  Client Name *                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Client 1                                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Client Photo                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │   ┌──────┐                                                   │  │
│  │   │  ☁️  │  Upload client photo (circle crop)                │  │
│  │   └──────┘                                                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Rating *                                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  ⭐ ⭐ ⭐ ⭐ ☆   (4 out of 5)                                │  │
│  │  Click stars to set rating                                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Review Text *                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Our team of experienced architects and engineers brings      │  │
│  │ together decades of expertise to deliver exceptional results │  │
│  │ for every project.                                           │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  Characters: 120/500                                              │
│                                                                    │
│  Status                                                           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Approved ▾                                                   │  │
│  │ ├── Pending    (not visible on public site)                  │  │
│  │ ├── Approved   (visible on public site)                      │  │
│  │ └── Hidden     (hidden from public site)                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ───────────────────────────────────────────────────────────────  │
│                                          [Cancel]    [✓ Save]    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Approval Workflow:**
```
                    ┌─────────┐
        New Review  │ Pending │
        ───────────▶│         │
                    └────┬────┘
                         │
                    ┌────▼────┐
        Admin       │Approved │  ← Visible on public site
        approves    │         │
                    └────┬────┘
                         │
                    ┌────▼────┐
        Admin       │ Hidden  │  ← Removed from public site
        hides       │         │     but kept in DB
                    └─────────┘
```

**UX Details:**
- **Star rating** — Click to set (1-5). Stars fill in gold on hover. Half-stars not supported.
- **Quick approve** — Pending reviews show an `✅ Approve` button directly on the card
- **Quick hide** — Approved reviews show `👁️ Hide` to remove from public
- **Filter tabs** show count per status
- **Client photo** is optional — falls back to initials avatar on public site
- **Character count** on review text (500 char limit)

---

### 7.9 Settings

**Route:** `/admin/settings`  
**Auth:** Protected  
**Purpose:** Manage site-wide configuration (hero, contact, social, software, SEO)

```
┌─────────┬───────────────────────────────────────────────────────────┐
│         │  🔧 Settings                               🔔 (3) 👤 ▾  │
│ SIDEBAR │──────────────────────────────────────────────────────────│
│         │                                                          │
│ 📊      │  ┌─────────────────────────────────────────────────────┐ │
│ 📩      │  │  [🎠 Hero] [📞 Contact] [🔗 Social] [💻 Software]  │ │
│ 🏢      │  │  [🔍 SEO]                                          │ │
│ ⚙️      │  └─────────────────────────────────────────────────────┘ │
│ 📖      │                                                          │
│ 👥      │   (Tab content changes based on selection)               │
│ ⭐      │                                                          │
│ 🔧 ●    │                                                          │
└─────────┴───────────────────────────────────────────────────────────┘
```

#### Tab 1: Hero Slides

```
│  ┌─── 🎠 Hero Slides ───────────────────────────────────────────┐ │
│  │                                                                │ │
│  │  Hero Carousel Slides (4)                [＋ Add Slide]       │ │
│  │                                                                │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ ≡  ┌──────────┐  Category: Projects                     │  │ │
│  │  │    │ 🎬       │  Title: Skyline Residential in           │  │ │
│  │  │    │ slide-1  │        Coimbatore                        │  │ │
│  │  │    │ .mp4     │  Media: 🎬 Video (2.4 MB)               │  │ │
│  │  │    │ (thumb)  │  Status: 🟢 Active  │  Sort: 1          │  │ │
│  │  │    └──────────┘                                          │  │ │
│  │  │                         [✏️ Edit]  [🗑️ Delete]           │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ ≡  ┌──────────┐  Category: Projects                     │  │ │
│  │  │    │ 🎬       │  Title: Tech Park Tower in Chennai      │  │ │
│  │  │    │ slide-2  │  Media: 🎬 Video (3.1 MB)               │  │ │
│  │  │    │ .mp4     │  Status: 🟢 Active  │  Sort: 2          │  │ │
│  │  │    └──────────┘                                          │  │ │
│  │  │                         [✏️ Edit]  [🗑️ Delete]           │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ ≡  ┌──────────┐  Category: Projects                     │  │ │
│  │  │    │ 🖼️       │  Title: Luxury Villas in Kodaikanal     │  │ │
│  │  │    │ slide-3  │  Media: 🖼️ Image (890 KB)               │  │ │
│  │  │    │ .webp    │  Status: 🟢 Active  │  Sort: 3          │  │ │
│  │  │    └──────────┘                                          │  │ │
│  │  │                         [✏️ Edit]  [🗑️ Delete]           │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  ℹ️ Drag ≡ to reorder slides. Active slides appear in the     │ │
│  │    hero carousel on the homepage.                              │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
```

**Hero Slide Form Modal** (size: `md`):

```
┌─── Edit Hero Slide ──────────────────────────── ✕ ────────────────┐
│                                                                    │
│  Category Label *                                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Projects                                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Slide Title *                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Skyline Residential in Coimbatore                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Media * (Image or Video)                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │   ┌──────────────┐                                           │  │
│  │   │  🎬 Current   │  slide-1.mp4                              │  │
│  │   │  video thumb  │  2.4 MB  •  Video                        │  │
│  │   │              │  [Replace]  [Remove]                      │  │
│  │   └──────────────┘                                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  Accepted: .mp4, .webm, .mov, .jpg, .png, .webp (max 100MB)      │
│                                                                    │
│  Status                                                           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Active ▾                                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ───────────────────────────────────────────────────────────────  │
│                                          [Cancel]    [✓ Save]    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

#### Tab 2: Contact Information

```
│  ┌─── 📞 Contact Information ────────────────────────────────────┐ │
│  │                                                                │ │
│  │  Phone Number                                                 │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ +91 1234567890                                           │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  Email Address                                                │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ infoad20@gmail.com                                       │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  Office Address                                               │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ 3/1275D, Anna Nagar, Chennai - 603202                   │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  ────────────────────────────────────────────────────────────  │ │
│  │                                        [✓ Save Contact Info]  │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
```

#### Tab 3: Social Links

```
│  ┌─── 🔗 Social Media Links ─────────────────────────────────────┐ │
│  │                                                                │ │
│  │  Facebook URL                                                 │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ https://facebook.com/arunadevi                           │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  Instagram URL                                                │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ https://instagram.com/arunadevi                          │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  YouTube URL                                                  │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ https://youtube.com/@arunadevi                           │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  LinkedIn URL                                                 │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ https://linkedin.com/company/arunadevi                   │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  X (Twitter) URL                                              │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ https://x.com/arunadevi                                  │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  Discord URL                                                  │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ https://discord.gg/arunadevi                             │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  ℹ️ Leave a field empty to hide that social icon from the      │ │
│  │    website footer.                                            │ │
│  │                                                                │ │
│  │  ────────────────────────────────────────────────────────────  │ │
│  │                                       [✓ Save Social Links]   │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
```

#### Tab 4: Software Bar

```
│  ┌─── 💻 Software Bar Items ─────────────────────────────────────┐ │
│  │                                                                │ │
│  │  Software Logos (6)                     [＋ Add Software]     │ │
│  │                                                                │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──┐│ │
│  │  │AutoCAD │ │ Revit  │ │ V-Ray  │ │STAAD.Pr│ │ ETABS  │ │Te││ │
│  │  │  🖼️    │ │  🖼️    │ │  🖼️    │ │  🖼️    │ │  🖼️    │ │🖼️││ │
│  │  │        │ │        │ │        │ │        │ │        │ │  ││ │
│  │  │  ✏️ ✕  │ │  ✏️ ✕  │ │  ✏️ ✕  │ │  ✏️ ✕  │ │  ✏️ ✕  │ │✏️ ││ │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └──┘│ │
│  │                                                                │ │
│  │  ℹ️ Drag to reorder. These logos scroll in the software bar    │ │
│  │    on the homepage.                                           │ │
│  │                                                                │ │
│  │  ────────────────────────────────────────────────────────────  │ │
│  │                                              [✓ Save Order]   │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
```

**Software Item Form Modal** (size: `sm`):

```
┌─── Add Software ─────────────────────────────── ✕ ────────────────┐
│                                                                    │
│  Software Name *                                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ AutoCAD                                                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Logo Image *                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │               ┌──────────┐                                   │  │
│  │               │  ☁️       │                                   │  │
│  │               │  Upload   │                                   │  │
│  │               │  logo     │                                   │  │
│  │               └──────────┘                                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Status                                                           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Active ▾                                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ───────────────────────────────────────────────────────────────  │
│                                          [Cancel]    [✓ Save]    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

#### Tab 5: SEO & Meta Tags

```
│  ┌─── 🔍 SEO & Meta Tags ───────────────────────────────────────┐ │
│  │                                                                │ │
│  │  Site Title                                                   │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ Aruna Devi Infra Projects - Architecture & Construction │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │  Characters: 55/60                                            │ │
│  │                                                                │ │
│  │  Meta Description                                             │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ Aruna Devi Infra Projects offers 3D visualization,      │  │ │
│  │  │ architectural planning, and structural design services   │  │ │
│  │  │ for residential, commercial, and villa projects across   │  │ │
│  │  │ Tamil Nadu.                                              │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │  Characters: 178/160 ⚠️ (recommended < 160)                   │ │
│  │                                                                │ │
│  │  Meta Keywords                                                │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ architecture, construction, 3D visualization,           │  │ │
│  │  │ structural design, Tamil Nadu, Coimbatore, Chennai      │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  OG Image (Social sharing preview)                            │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │   ┌────────────────────────┐                              │  │ │
│  │  │   │   🖼️ og-image.png      │  Recommended: 1200×630px    │  │ │
│  │  │   │   (preview 16:9)      │  [Replace] [Remove]         │  │ │
│  │  │   └────────────────────────┘                              │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  Google Analytics ID                                          │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ G-XXXXXXXXXX                                             │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  ────────────────────────────────────────────────────────────  │ │
│  │                                     [✓ Save SEO Settings]     │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
```

---

## 8. Popup / Modal Specifications

### 8.1 All Modals Summary

| Modal                | Trigger               | Size   | Fields                                                                                    |
| -------------------- | --------------------- | ------ | ----------------------------------------------------------------------------------------- |
| **Project Form**     | `＋ Add` / `✏️ Edit`  | `xl`   | Title, slug, category, location, client, area, duration, status, featured, description, challenges, solutions, key_outcomes, thumbnail, hero_media, gallery |
| **Service Form**     | `＋ Add` / `✏️ Edit`  | `md`   | Title, short description, extended description, image, status, sort_order                  |
| **Team Form**        | `＋ Add` / `✏️ Edit`  | `sm`   | Name, role, photo, sort_order, status                                                     |
| **Review Form**      | `＋ Add` / `✏️ Edit`  | `md`   | Client name, client photo, rating (stars), review text, status                            |
| **Hero Slide Form**  | `＋ Add` / `✏️ Edit`  | `md`   | Category, title, media (image/video), status                                              |
| **Software Form**    | `＋ Add` / `✏️ Edit`  | `sm`   | Name, logo image, status                                                                  |
| **Confirm Dialog**   | `🗑️ Delete` clicks   | `sm`   | Title, message, cancel/confirm buttons                                                    |
| **Lead Detail**      | `👁️ View` / row click| Slide  | Read-only lead info + editable status + admin notes                                       |

### 8.2 Modal Sizes

| Size | Tailwind Class | Width  | Use Case                    |
| ---- | -------------- | ------ | --------------------------- |
| `sm` | `max-w-sm`     | 384px  | Team, Software, Confirm     |
| `md` | `max-w-2xl`    | 672px  | Service, Review, Hero Slide |
| `lg` | `max-w-3xl`    | 768px  | (Reserved)                  |
| `xl` | `max-w-4xl`    | 896px  | Project Form                |

### 8.3 Modal Animation

```
Opening:
  backdrop:  opacity 0 → 1     (200ms ease-out)
  panel:     opacity 0 → 1     (200ms ease-out)
             scale 0.95 → 1    (200ms ease-out)
             translateY 8px → 0 (200ms ease-out)

Closing:
  backdrop:  opacity 1 → 0     (150ms ease-in)
  panel:     opacity 1 → 0     (150ms ease-in)
             scale 1 → 0.95    (150ms ease-in)
```

### 8.4 Form Validation Behavior

```
Field States:
  Default:     border-slate-300
  Focus:       border-blue-500, ring-2 ring-blue-500/20
  Error:       border-red-500, ring-2 ring-red-500/20
  Disabled:    bg-slate-100, cursor-not-allowed

Error Display:
  ┌──────────────────────────────────┐
  │ Title *                          │
  │ ┌──────────────────────────────┐ │
  │ │                              │ │  ← border-red-500
  │ └──────────────────────────────┘ │
  │ ⚠️ Title is required              │  ← text-red-500 text-xs mt-1
  └──────────────────────────────────┘

Submit:
  - Validate all fields on submit
  - Show first error field with scroll-into-view
  - Disable submit button while saving (show spinner)
  - On success: close modal + show success toast
  - On error: show error toast + keep modal open
```

---

## 9. Responsive Behavior

### 9.1 Breakpoints

| Breakpoint | Width       | Layout Changes                                        |
| ---------- | ----------- | ----------------------------------------------------- |
| `sm`       | 640px+      | Stack all cards single column                         |
| `md`       | 768px+      | Project cards 2-column, stats 2×2                     |
| `lg`       | 1024px+     | Show sidebar, project cards 3-column, stats 4-column  |
| `xl`       | 1280px+     | Full layout as designed                               |

### 9.2 Sidebar Behavior

```
Desktop (≥ 1024px):
  ┌────────┬───────────────────────────────┐
  │SIDEBAR │     MAIN CONTENT              │
  │  256px │                               │
  │        │                               │
  └────────┴───────────────────────────────┘

Mobile (< 1024px):
  ┌────────────────────────────────────────┐
  │ ☰ Page Title           🔔 👤          │  ← Hamburger icon
  │────────────────────────────────────────│
  │                                        │
  │     MAIN CONTENT (full width)          │
  │                                        │
  └────────────────────────────────────────┘

  Sidebar opens as overlay on hamburger click:
  ┌──────────┬─────────────────────────────┐
  │ SIDEBAR  │  Backdrop (bg-black/40)     │
  │ (slide in│                             │
  │  300ms)  │  ← Click to close           │
  │          │                             │
  └──────────┴─────────────────────────────┘
```

### 9.3 Table Behavior (Mobile)

```
Desktop: Full data table with all columns
Tablet:  Hide Message and Date columns
Mobile:  Convert to card-based layout

  ┌──────────────────────────────────┐
  │  John Doe                🟢 New │
  │  📱 +91 9876543210              │
  │  🟠 Consulting  │  📍 Chennai   │
  │  2 hours ago                    │
  │                    [👁️] [✏️] [🗑️]│
  └──────────────────────────────────┘
```

---

## 10. Interaction & Animation Guide

### 10.1 Transitions

| Element            | Property              | Duration | Easing                    |
| ------------------ | --------------------- | -------- | ------------------------- |
| Button hover       | `background`, `color` | 200ms    | `ease-in-out`             |
| Card hover         | `shadow`, `transform` | 200ms    | `ease-out`                |
| Sidebar nav hover  | `background`, `color` | 150ms    | `ease-in-out`             |
| Modal open/close   | `opacity`, `scale`    | 200ms    | `ease-out` / `ease-in`    |
| Slide-out panel    | `translateX`          | 300ms    | `cubic-bezier(0.16,1,0.3,1)` |
| Tab switch         | Content fade          | 150ms    | `ease-in-out`             |
| Status badge       | `background`          | 200ms    | `ease-in-out`             |
| Drag & drop        | `transform`, `shadow` | 200ms    | `ease-out`                |

### 10.2 Micro-interactions

```
Button Click:
  → Scale down to 0.97 → spring back to 1.0 (100ms)

Card Hover:
  → Lift shadow: shadow-sm → shadow-md
  → Optional: translateY(-2px)

Delete Button Hover:
  → bg-transparent → bg-red-50, text-red-600
  → Shows tooltip "Delete"

Drag Item:
  → Picked up item: scale(1.02), shadow-lg, opacity(0.9)
  → Drop zone: dashed border blue, bg-blue-50
  → Drop: spring animation to final position

Toast Notification:
  → Slide in from top-right
  → Auto-dismiss after 3s
  → Success: green left border
  → Error: red left border
  → Click to dismiss

Loading States:
  → Skeleton placeholders on initial page load
  → Button spinner while saving
  → Optimistic UI updates for status changes
```

### 10.3 Toast Notifications

```
Success:
  ┌───────────────────────────────────┐
  │ ✅  Project published            ×│
  │     successfully                  │
  └───────────────────────────────────┘
  Position: top-right, stack vertically
  Auto-dismiss: 3 seconds
  Border-left: 4px green

Error:
  ┌───────────────────────────────────┐
  │ ❌  Failed to save changes.      ×│
  │     Please try again.            │
  └───────────────────────────────────┘
  Auto-dismiss: 5 seconds
  Border-left: 4px red
```

---

## 11. Public Website ↔ Admin Data Mapping

This table maps every public-facing component to its admin panel data source.

### 11.1 Homepage Section Mapping

| Public Component          | Admin Page       | Collection       | Query Filter                              |
| ------------------------- | ---------------- | ---------------- | ----------------------------------------- |
| **Hero Carousel**         | Settings → Hero  | `hero_slides`    | `status = "active"`, order by `sort_order` |
| **Software Bar**          | Settings → Softw | `software_items` | `status = "active"`, order by `sort_order` |
| **Services Section**      | Services         | `services`       | `status = "published"`, order by `sort_order` |
| **Service Detail Popup**  | Services         | `services`       | Same doc, uses `extended_description`     |
| **Projects Section**      | Projects         | `projects`       | `status = "published"`, order by `sort_order` |
| **About Section**         | About            | `about_content`  | Single document (get by ID)               |
| **About Stats**           | About            | `about_content`  | `stats` field (JSON array)                |
| **Team Section**          | Team             | `team_members`   | `status = "active"`, order by `sort_order` |
| **Reviews Carousel**      | Reviews          | `reviews`        | `status = "approved"`, order by `sort_order` |
| **Footer Contact**        | Settings → Contact | `site_settings` | `group = "contact"`                      |
| **Footer Social Icons**   | Settings → Social  | `site_settings` | `group = "social"`                       |
| **Meta Tags**             | Settings → SEO     | `site_settings` | `group = "seo"`                          |
| **Header Nav**            | *(hardcoded)*    | —                | Navigation links remain static in code    |

### 11.2 Project Detail Mapping (`/projects/[slug]`)

| Component                 | Admin Page    | Collection  | Field(s) Used                                      |
| ------------------------- | ------------- | ----------- | -------------------------------------------------- |
| **Project Detail Hero**   | Projects      | `projects`  | `title`, `hero_media_id` (fallback to `image_id`)  |
| **Project Info Bar**      | Projects      | `projects`  | `client`, `location`, `area`, `duration`, `category`|
| **Challenges & Outcomes** | Projects      | `projects`  | `challenges`, `solutions`, `key_outcomes`          |
| **Photo Gallery**         | Projects      | `projects`  | `gallery_ids` (array of Storage file IDs)          |
| **Related Projects**      | Projects      | `projects`  | Same category, exclude current, limit 3            |

### 11.3 Form Submission Mapping

| Public Form               | Admin Page  | Collection | Fields Mapped                                           |
| ------------------------- | ----------- | ---------- | ------------------------------------------------------- |
| **Consulting Popup**      | Leads       | `leads`    | `type:"consulting"`, `name`, `phone`, `location`, `message`, `status:"new"` |
| **Community Popup**       | Leads       | `leads`    | `type:"community"`, `name`, `phone`, `role`, `skills`, `message`, `status:"new"` |

### 11.4 Image Resolution from Storage

```
Public website displays images via Appwrite Storage URLs:

  GET {APPWRITE_ENDPOINT}/storage/buckets/{BUCKET_ID}/files/{FILE_ID}/view

  For optimized thumbnails (projects grid):
  GET .../files/{FILE_ID}/preview?width=400&height=300&output=webp

  For full-size (hero, gallery):
  GET .../files/{FILE_ID}/view

  For team photos (circle crop):
  GET .../files/{FILE_ID}/preview?width=256&height=256&output=webp
```

---

## Appendix: Appwrite Setup Summary

### A. Environment Variables Required

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=aruna_devi_db
NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID=images
NEXT_PUBLIC_APPWRITE_VIDEOS_BUCKET_ID=videos
```

### B. Collection Permission Rules

| Collection       | Public (Any)             | Authenticated (Admin)          |
| ---------------- | ------------------------ | ------------------------------ |
| `projects`       | Read ✅                  | Read ✅ / Create ✅ / Update ✅ / Delete ✅ |
| `services`       | Read ✅                  | Read ✅ / Create ✅ / Update ✅ / Delete ✅ |
| `team_members`   | Read ✅                  | Full CRUD ✅                    |
| `reviews`        | Read ✅ (approved only)  | Full CRUD ✅                    |
| `leads`          | Create ✅ (submit only)  | Full CRUD ✅                    |
| `hero_slides`    | Read ✅                  | Full CRUD ✅                    |
| `about_content`  | Read ✅                  | Read ✅ / Update ✅              |
| `site_settings`  | Read ✅                  | Read ✅ / Update ✅              |
| `software_items` | Read ✅                  | Full CRUD ✅                    |

### C. Admin Authentication

- **Method:** Appwrite Email/Password Authentication
- **Users:** Single admin user (created manually in Appwrite Console)
- **Session:** Persistent cookie-based session (7 days default)
- **Protection:** All `/admin/*` routes (except `/admin/login`) are behind auth guard
- **Auth Guard Flow:**
  1. Check for active Appwrite session via `account.get()`
  2. If no session → redirect to `/admin/login`
  3. If session exists → render admin layout + page content
  4. Logout → `account.deleteSession('current')` → redirect to `/admin/login`

---

*End of Admin Panel UI/UX Design Specification*
