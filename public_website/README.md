# Aruna Devi Infra Projects — Website Documentation

> **Architectural Design & Construction** — Structural and architectural design services combining technical excellence with creative innovation. Serving clients across South India.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Pages](#pages)
   - [Home Page](#1-home-page--srcapppagetsxx)
   - [Project Detail Page](#2-project-detail-page--srcappprojectsidpagetsx)
5. [Components](#components)
   - [Header](#header)
   - [Hero](#hero)
   - [SoftwareBar](#softwarebar)
   - [Services](#services)
   - [Projects (Featured Projects)](#projects-featured-projects)
   - [About](#about)
   - [Team](#team)
   - [Reviews](#reviews)
   - [Footer](#footer)
   - [BottomFooter](#bottomfooter)
   - [ConsultingPopup](#consultingpopup)
   - [CommunityPopup](#communitypopup)
   - [AnimatedText](#animatedtext)
6. [Project Detail Components](#project-detail-components)
   - [ProjectDetailHero](#projectdetailhero)
   - [ProjectInfoBar](#projectinfobar)
   - [ProjectChallengesOutcomes](#projectchallengesoutcomes)
   - [ProjectGallery](#projectgallery)
   - [RelatedProjects](#relatedprojects)
7. [Data Layer](#data-layer)
8. [Public Assets](#public-assets)

---

## Tech Stack

| Technology     | Version  | Purpose                          |
| -------------- | -------- | -------------------------------- |
| Next.js        | 16.1.6   | React framework (App Router)     |
| React          | 19.2.3   | UI library                       |
| TypeScript     | ^5       | Type safety                      |
| Tailwind CSS   | ^4       | Utility-first styling            |
| Lucide React   | ^0.575.0 | Icon library                     |
| Geist Font     | built-in | Typography (Sans & Mono)         |

---

## Project Structure

```
aruna-devi-website/
├── public/                          # Static assets
│   ├── logo.png                     # Company logo
│   ├── hero/                        # Hero carousel media
│   │   ├── slide-1.mp4              # Hero slide 1 (video)
│   │   └── slide-3.webp             # Hero slide 3 (image)
│   ├── projects/                    # Project images
│   │   ├── skyline-residential.png
│   │   ├── tech-park-tower.png
│   │   ├── commercial-complex.png
│   │   ├── luxury-villas.png
│   │   ├── modern-apartments.png
│   │   └── hillside-villa.png
│   ├── services/                    # Service card images
│   │   ├── 3d-visualization.png
│   │   ├── architectural-planning.png
│   │   └── structural-design.png
│   └── software/                    # Software logo images
│       ├── autocad.png
│       ├── etabs.png
│       ├── revit.png
│       ├── staadpro.png
│       ├── tekla.png
│       └── vray.png
│
├── src/
│   ├── app/                         # Next.js App Router pages
│   │   ├── layout.tsx               # Root layout (fonts, metadata)
│   │   ├── page.tsx                 # Home page
│   │   ├── globals.css              # Global styles & animations
│   │   └── projects/
│   │       └── [id]/                # Dynamic project detail route
│   │           ├── page.tsx         # Server component (data + SEO)
│   │           └── ProjectDetailClient.tsx  # Client component (UI)
│   │
│   ├── components/                  # Reusable UI components
│   │   ├── Header.tsx               # Navigation header
│   │   ├── Hero.tsx                 # Hero carousel section
│   │   ├── SoftwareBar.tsx          # Software logos marquee
│   │   ├── Services.tsx             # Services section + popup
│   │   ├── Projects.tsx             # Featured projects section
│   │   ├── About.tsx                # About section
│   │   ├── Team.tsx                 # Team section
│   │   ├── Reviews.tsx              # Reviews/testimonials
│   │   ├── Footer.tsx               # Main footer
│   │   ├── BottomFooter.tsx         # Bottom footer bar
│   │   ├── ConsultingPopup.tsx      # "Get Free Consulting" form popup
│   │   ├── CommunityPopup.tsx       # "Join Community" form popup
│   │   ├── AnimatedText.tsx         # Word-by-word animated text
│   │   └── project-details/         # Project detail page components
│   │       ├── ProjectDetailHero.tsx
│   │       ├── ProjectInfoBar.tsx
│   │       ├── ProjectChallengesOutcomes.tsx
│   │       ├── ProjectGallery.tsx
│   │       └── RelatedProjects.tsx
│   │
│   └── data/
│       └── projects.ts              # Centralized project data
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The development server runs at **http://localhost:3000**

---

## Pages

### 1. Home Page — `src/app/page.tsx`

**Route:** `/`

The main landing page that showcases all sections of the website.

**Section Rendering Order:**

| Order | Component        | Section ID          | Description                        |
| ----- | ---------------- | ------------------- | ---------------------------------- |
| 1     | `<Header />`     | —                   | Fixed navigation header            |
| 2     | `<Hero />`       | `#projects`         | Full-screen hero carousel          |
| 3     | `<SoftwareBar />`| —                   | Infinite-scroll software logos     |
| 4     | `<Services />`   | `#services`         | Service cards with popup           |
| 5     | `<Projects />`   | `#projects-section` | Featured project cards grid        |
| 6     | `<About />`      | `#about`            | Company about section              |
| 7     | `<Team />`       | `#team`             | Team members section               |
| 8     | `<Reviews />`    | `#reviews`          | Client testimonials                |
| 9     | `<Footer />`     | `#footer`           | Main footer with links             |
| 10    | `<BottomFooter />`| —                  | Bottom copyright bar               |

---

### 2. Project Detail Page — `src/app/projects/[id]/page.tsx`

**Route:** `/projects/:id`

Dynamic page for each project. Uses `generateStaticParams` for static pre-rendering and `generateMetadata` for dynamic SEO.

**Available Project IDs:**
- `/projects/skyline-residential`
- `/projects/tech-park-tower`
- `/projects/commercial-complex`
- `/projects/luxury-villas`
- `/projects/modern-apartments`
- `/projects/hillside-villa`

**Section Rendering Order (via `ProjectDetailClient.tsx`):**

| Order | Component                     | Description                          |
| ----- | ----------------------------- | ------------------------------------ |
| 1     | `<ProjectDetailHero />`       | Full-viewport hero with back button  |
| 2     | `<ProjectInfoBar />`          | Client, Location, Area, Duration bar |
| 3     | `<ProjectChallengesOutcomes />`| Challenges, outcomes, solutions     |
| 4     | `<ProjectGallery />`          | Image carousel gallery               |
| 5     | `<RelatedProjects />`         | Other projects horizontal scroll     |
| 6     | `<Footer />`                  | Main footer                          |
| 7     | `<BottomFooter />`            | Bottom copyright bar                 |

> **Note:** The project detail page does NOT include the Header component. Navigation is done via the "Back to Projects" button in the hero section.

---

## Components

### Header
**File:** `src/components/Header.tsx`

| Feature                  | Description                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| **Fixed navigation**     | Stays at the top of the viewport                                                               |
| **Glassmorphism**        | Blurred glass effect on scroll (`backdrop-filter: blur(20px)`)                                 |
| **Logo**                 | Company logo, links to home                                                                    |
| **Navigation links**     | Projects, Services, Featured Projects, About, Team, Reviews — smooth scroll on home page       |
| **Get Free Consulting**  | Appears on scroll (animated entrance), opens `ConsultingPopup`                                |
| **Join Community**       | Always visible button, opens `CommunityPopup`                                                 |
| **Mobile sidebar**       | Hamburger menu → slide-in sidebar with navigation links                                        |

**Image paths:** `/logo.png`

---

### Hero
**File:** `src/components/Hero.tsx`

| Feature              | Description                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| **Full-screen**      | 100vh carousel with auto-advance (5s interval)                           |
| **Video + Image**    | Supports both `.mp4`/`.webm` videos and image backgrounds                |
| **Parallax scroll**  | Background shifts on scroll (`translateY(scrollY * 0.5)`)                |
| **Swipe gestures**   | Touch swipe navigation on mobile                                         |
| **Play/Pause**       | Bottom-right button to control auto-advance                              |
| **Get Free Consulting** | Opens `ConsultingPopup` on click                                      |
| **Dot navigation**   | Bottom-left carousel dots                                                |

**Image/video paths:**
- `/hero/slide-1.mp4`
- `/hero/slide-2.mp4` (referenced in code)
- `/hero/slide-3.webp`
- `/hero/slide-4.png` (referenced in code)

---

### SoftwareBar
**File:** `src/components/SoftwareBar.tsx`

| Feature              | Description                                      |
| -------------------- | ------------------------------------------------ |
| **Infinite scroll**  | CSS marquee animation for software logos          |
| **Custom styling**   | CSS transforms for logo positioning               |

**Image paths:**
- `/software/autocad.png`
- `/software/etabs.png`
- `/software/revit.png`
- `/software/staadpro.png`
- `/software/tekla.png`
- `/software/vray.png`

---

### Services
**File:** `src/components/Services.tsx`

| Feature              | Description                                                      |
| -------------------- | ---------------------------------------------------------------- |
| **Section ID**       | `#services`                                                      |
| **Cards grid**       | 2-column grid (2+1 layout)                                       |
| **Hover effects**    | Image zoom, overlay darken, CTA shift                            |
| **Service popup**    | "Learn more" button opens modal with extended description         |
| **Scroll animation** | Cards fade in with intersection observer                          |

**Image paths:**
- `/services/3d-visualization.png`
- `/services/architectural-planning.png`
- `/services/structural-design.png`

**Service Data:**

| ID                     | Title                        |
| ---------------------- | ---------------------------- |
| `3d-visualization`     | From 2D Plans to 3D Reality  |
| `architectural-planning`| Architectural Planning      |
| `structural-design`    | Structural Design            |

---

### Projects (Featured Projects)
**File:** `src/components/Projects.tsx`

| Feature              | Description                                                      |
| -------------------- | ---------------------------------------------------------------- |
| **Section ID**       | `#projects-section`                                               |
| **Category filter**  | All, Residential, Commercial, Villa                               |
| **Card links**       | Each card links to `/projects/:id` detail page                    |
| **Scroll animation** | Fade-in with intersection observer                                |

**Image paths:** Uses images from `src/data/projects.ts`:
- `/projects/skyline-residential.png`
- `/projects/tech-park-tower.png`
- `/projects/commercial-complex.png`
- `/projects/luxury-villas.png`
- `/projects/modern-apartments.png`
- `/projects/hillside-villa.png`

---

### About
**File:** `src/components/About.tsx`

| Feature              | Description                                      |
| -------------------- | ------------------------------------------------ |
| **Section ID**       | `#about`                                          |
| **Scroll animation** | Content fades in on scroll                        |
| **Responsive**       | Adapts layout for mobile/desktop                  |

---

### Team
**File:** `src/components/Team.tsx`

| Feature              | Description                                      |
| -------------------- | ------------------------------------------------ |
| **Section ID**       | `#team`                                           |
| **Team cards**       | Member information display                        |
| **Scroll animation** | Cards animate on scroll                           |

---

### Reviews
**File:** `src/components/Reviews.tsx`

| Feature              | Description                                      |
| -------------------- | ------------------------------------------------ |
| **Section ID**       | `#reviews`                                        |
| **Testimonials**     | Client review cards                               |
| **Scroll animation** | Reviews fade in on scroll                         |

---

### Footer
**File:** `src/components/Footer.tsx`

| Feature              | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| **Section ID**       | `#footer`                                                      |
| **Quick Actions**    | Links to all home page sections (use `/#section` for routing) |
| **Community links**  | Student Community, Working Professional, Career                |
| **Resource links**   | Blogs & news, Terms, Privacy                                   |
| **Contact info**     | Phone, Email, Address                                          |
| **Social icons**     | Facebook, Instagram, YouTube, LinkedIn, X, Discord             |

---

### BottomFooter
**File:** `src/components/BottomFooter.tsx`

| Feature              | Description                          |
| -------------------- | ------------------------------------ |
| **Copyright bar**    | Bottom copyright and branding info   |
| **Background images**| Overlay with background imagery      |

---

### ConsultingPopup
**File:** `src/components/ConsultingPopup.tsx`

| Feature              | Description                                              |
| -------------------- | -------------------------------------------------------- |
| **Trigger**          | "Get Free Consulting" buttons (Header + Hero)            |
| **Title**            | "Ready to start planning? let's talk"                    |
| **Form fields**      | Your Name, Phone number, Project Location, Brief Message |
| **Desktop layout**   | Name + Phone side-by-side, Location half-width           |
| **Mobile layout**    | All fields stacked vertically                            |
| **Actions**          | Close button + Submit Request button                     |
| **UX features**      | Body scroll lock, Escape key, backdrop click, animations |

---

### CommunityPopup
**File:** `src/components/CommunityPopup.tsx`

| Feature              | Description                                              |
| -------------------- | -------------------------------------------------------- |
| **Trigger**          | "Join Community" button (Header)                         |
| **Title**            | "Ready to start work together? let's Join Our community" |
| **Role toggle**      | Student/Freelancer ↔ Working professional                |
| **Form fields**      | Your Name, Phone number, Known Skills, Brief Message     |
| **Actions**          | Close + Submit Request + "*Submit request for joining community" note |
| **UX features**      | Body scroll lock, Escape key, backdrop click, animations |

---

### AnimatedText
**File:** `src/components/AnimatedText.tsx`

| Feature              | Description                                  |
| -------------------- | -------------------------------------------- |
| **Word-by-word**     | Animates text word by word on scroll          |
| **Configurable**     | `delayOffset`, `wordDelay`, `wordClassName`   |
| **Used in**          | Services header, section headings             |

---

## Project Detail Components

### ProjectDetailHero
**File:** `src/components/project-details/ProjectDetailHero.tsx`

| Feature              | Description                                                      |
| -------------------- | ---------------------------------------------------------------- |
| **Full viewport**    | 100vh height, covers entire screen                                |
| **Video + Image**    | Supports `heroMedia` (video/image) or falls back to `image`     |
| **Back button**      | "Back to Projects" → navigates to `/#projects-section`           |
| **Gradient overlays**| Top + bottom gradients for text readability                       |
| **Scroll indicator** | Bouncing chevron (desktop only)                                  |
| **Entrance animation**| Scale + fade-in on load                                         |

**Image paths:** Dynamic from project data (`project.heroMedia` or `project.image`)

---

### ProjectInfoBar
**File:** `src/components/project-details/ProjectInfoBar.tsx`

| Feature              | Description                                        |
| -------------------- | -------------------------------------------------- |
| **Overlapping**      | Floats over hero with `-60px` negative margin       |
| **Stats display**    | Client, Location, Area, Duration                    |
| **Scroll animation** | Fades in with intersection observer                 |
| **Card design**      | Rounded card with shadow and dividers               |
| **Mobile layout**    | 2×2 grid on mobile                                  |

---

### ProjectChallengesOutcomes
**File:** `src/components/project-details/ProjectChallengesOutcomes.tsx`

| Feature              | Description                                        |
| -------------------- | -------------------------------------------------- |
| **Two-column**       | Challenges + Key Outcomes side by side              |
| **Solutions**        | Full-width section below                            |
| **Scroll animation** | Staggered fade-in on scroll                         |

---

### ProjectGallery
**File:** `src/components/project-details/ProjectGallery.tsx`

| Feature              | Description                                        |
| -------------------- | -------------------------------------------------- |
| **Carousel**         | Two images per slide (desktop)                      |
| **Auto-advance**     | Automatic slide progression                         |
| **Dot navigation**   | Manual slide selection                              |
| **Hover zoom**       | Images zoom on hover                                |

**Image paths:** Dynamic from `project.gallery[]` array

---

### RelatedProjects
**File:** `src/components/project-details/RelatedProjects.tsx`

| Feature              | Description                                        |
| -------------------- | -------------------------------------------------- |
| **Horizontal scroll**| Scrollable row of project cards                     |
| **Filtering**        | Excludes the current project                        |
| **Card links**       | Each card links to its project detail page           |

**Image paths:** Dynamic from `projects` data array

---

## Data Layer

### `src/data/projects.ts`

Centralized project data powering both the Featured Projects section and all project detail pages.

**Interface:**

```typescript
interface ProjectDetail {
  id: string;           // URL slug (e.g., "skyline-residential")
  title: string;        // Display name
  location: string;     // City name
  category: Category;   // "Residential" | "Commercial" | "Villa"
  image: string;        // Card thumbnail image path
  heroMedia?: string;   // Optional hero media (video or image URL)
  client: string;       // Client name
  area: string;         // Project area
  duration: string;     // Project duration
  description: string;  // Short description
  challenges: string;   // Project challenges
  keyOutcomes: string[];// Key outcomes (array)
  solutions: string;    // Solutions applied
  gallery: string[];    // Gallery image paths (array)
}
```

**Helper function:**
```typescript
isVideoUrl(url: string): boolean
// Detects video files by extension: .mp4, .webm, .ogg, .mov
```

**Available projects:**

| ID                     | Title                | Location   | Category     | Image Path                          |
| ---------------------- | -------------------- | ---------- | ------------ | ----------------------------------- |
| `skyline-residential`  | Skyline Residential  | Coimbatore | Residential  | `/projects/skyline-residential.png` |
| `tech-park-tower`      | Tech Park Tower      | Coimbatore | Commercial   | `/projects/tech-park-tower.png`     |
| `commercial-complex`   | Commercial Complex   | Madurai    | Commercial   | `/projects/commercial-complex.png`  |
| `luxury-villas`        | Luxury Villas        | Kodaikanal | Villa        | `/projects/luxury-villas.png`       |
| `modern-apartments`    | Modern Apartments    | Chennai    | Residential  | `/projects/modern-apartments.png`   |
| `hillside-villa`       | Hillside Villa       | Ooty       | Villa        | `/projects/hillside-villa.png`      |

---

## Public Assets

### All Image & Media Paths

```
public/
├── logo.png                              # Company logo (Header)
│
├── hero/
│   ├── slide-1.mp4                       # Hero carousel slide 1 (video)
│   ├── slide-2.mp4                       # Hero carousel slide 2 (video) *
│   ├── slide-3.webp                      # Hero carousel slide 3 (image)
│   └── slide-4.png                       # Hero carousel slide 4 (image) *
│
├── projects/
│   ├── skyline-residential.png           # Skyline Residential project
│   ├── tech-park-tower.png               # Tech Park Tower project
│   ├── commercial-complex.png            # Commercial Complex project
│   ├── luxury-villas.png                 # Luxury Villas project
│   ├── modern-apartments.png             # Modern Apartments project
│   └── hillside-villa.png               # Hillside Villa project
│
├── services/
│   ├── 3d-visualization.png              # 3D Visualization service card
│   ├── architectural-planning.png        # Architectural Planning service card
│   └── structural-design.png             # Structural Design service card
│
└── software/
    ├── autocad.png                       # AutoCAD logo
    ├── etabs.png                         # ETABS logo
    ├── revit.png                         # Revit logo
    ├── staadpro.png                      # STAAD.Pro logo
    ├── tekla.png                         # Tekla logo
    └── vray.png                          # V-Ray logo
```

> \* Files referenced in code but may need to be added to the `public/hero/` directory.

---

## Key Design Decisions

1. **Component-scoped styles** — Each component uses inline `<style>` tags with scoped CSS classes (BEM naming) for full encapsulation.
2. **Scroll animations** — All sections use `IntersectionObserver` for performant scroll-triggered entrance animations.
3. **Glassmorphism** — Header uses `backdrop-filter: blur()` for a premium transparent glass effect on scroll.
4. **Video + Image support** — Hero carousel and project detail hero both support video (`.mp4`, `.webm`) and image backgrounds.
5. **Popup modals** — Consulting and Community forms use body scroll lock, Escape key dismiss, backdrop click close, and CSS animations.
6. **Route-safe navigation** — Footer Quick Action links use `/#section` format to work from any page, not just the home page.
7. **Static generation** — Project detail pages use `generateStaticParams` for optimal performance and SEO.
