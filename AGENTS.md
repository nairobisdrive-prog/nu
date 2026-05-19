# AGENTS.md — Xa'an Real Estate Platform

> This file is intended for AI coding agents. It describes the project structure, technology stack, build process, and development conventions. The project is a premium Mexico real estate search web application called **Xa'an**.

---

## Project Overview

This repository contains the frontend codebase for **Xa'an**, a premium real estate search platform focused on the Mexico market. The project follows a "Clinical Luxury" design philosophy — combining data-driven precision with the warmth of a high-end architectural studio.

The repository currently contains **two parallel Vite + React applications** that represent different iterations of the UI:

- **`Xaan GLM 5/`** — A multi-page routed application with modular components, pages, and mock data. This is the more structured, componentized version.
- **`Xaan GPT 5.5/`** — A single-page landing page application with all UI inline in one large `App.tsx`. This is a showcase/prototype version.

Both apps share the same design system (documented in `DESIGN.md`) but differ in architecture. The `Xaan GLM 5/` app is the primary development target for new features.

Additional directories:
- `reference images/` — Design reference screenshots and exported assets used during development.
- `stitch_xa_an_real_estate_hero/` — Exported Stitch design artifacts (hero promo screens and QR code assets).

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | ^19.2.0 |
| Language | TypeScript | ~5.9.3 |
| Build Tool | Vite | ^7.3.1 |
| Styling | Tailwind CSS | ^4.2.1 (with `@tailwindcss/vite` plugin) |
| Animation | Framer Motion | ^12.35+ |
| Icons | Lucide React | ^0.577.0 |
| Routing | React Router DOM | ^7.13+ |
| Linting | ESLint | ^9.39.1 with `typescript-eslint`, `react-hooks`, `react-refresh` |

### Key Tailwind Configuration Notes
- Tailwind CSS v4 is used with the new `@import "tailwindcss"` syntax (not the legacy `tailwind.config.js`).
- Custom theme values are defined in `src/index.css` using the `@theme` directive.
- Custom CSS utilities (glassmorphism, animations, gradient text, button/card hover effects) are also defined in `src/index.css`.

---

## Project Structure

### `Xaan GLM 5/` (Primary Application)

```
Xaan GLM 5/
├── public/                 # Static assets (favicon, images)
│   └── images/             # Property photos, agent photos, city map background
├── src/
│   ├── main.tsx            # Entry point — renders <App /> in StrictMode
│   ├── App.tsx             # Root router with react-router-dom routes
│   ├── index.css           # Tailwind import, custom theme, animations, utilities
│   ├── components/         # Reusable UI components
│   │   ├── Layout.tsx      # Page shell with Header, Footer, scroll detection
│   │   ├── Header.tsx      # Fixed navigation with mobile hamburger menu
│   │   ├── Footer.tsx      # Site footer
│   │   ├── Hero3D.tsx      # 3D parallax hero with mouse-tracking cards
│   │   ├── SearchBar.tsx   # Main search input with buy/rent/sell tabs
│   │   ├── ListingCard.tsx # Property card with image carousel, save toggle
│   │   └── InfoCard.tsx    # Feature highlight card (Buy/Rent/Sell)
│   ├── pages/              # Route-level page components
│   │   ├── HomePage.tsx
│   │   ├── ListingsPage.tsx
│   │   ├── PropertyDetailsPage.tsx
│   │   ├── FindAgentPage.tsx
│   │   ├── AgentProfilePage.tsx
│   │   └── DashboardPage.tsx
│   └── data/
│       └── mockData.ts     # TypeScript interfaces + mock property/agent data
├── index.html              # HTML entry (loads Google Fonts: Outfit + Plus Jakarta Sans)
├── package.json
├── tsconfig.json           # Project references (app + node)
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts          # Vite + React + Tailwind plugin (+ optional source-tags plugin)
└── eslint.config.js        # Flat ESLint config (TS + React Hooks + Refresh)
```

### `Xaan GPT 5.5/` (Single-Page Showcase)

```
Xaan GPT 5.5/
├── public/images/          # Same image assets as GLM 5
├── src/
│   ├── main.tsx            # Entry point
│   ├── App.tsx             # Single 559-line component with all sections inline
│   └── index.css           # Minimal Tailwind import + base styles
├── index.html              # Loads Inter font from Google Fonts
└── ... (same config files as GLM 5)
```

---

## Build and Development Commands

Both applications use identical npm scripts. Run from within either subdirectory:

```bash
cd "Xaan GLM 5"    # or "Xaan GPT 5.5"

npm install          # Install dependencies
npm run dev          # Start Vite dev server (default port 5173)
npm run build        # Type-check + production build (outputs to dist/)
npm run preview      # Preview production build locally
npm run lint         # Run ESLint on all TS/TSX files
```

### Important Notes
- The build command runs `tsc -b && vite build`. Type errors will block the build.
- There is **no test suite** currently configured in either app.
- `dist/` is gitignored (see `gitignore` at repo root).

---

## Design System

The full design system is documented in `DESIGN.md` at the repository root. Key rules agents must follow:

### Color Palette (Strict)
| Token | Hex | Usage |
|-------|-----|-------|
| Pure Canvas | `#FFFFFF` | Primary background |
| Lavender Wash | `#F2E7F6` | Secondary backgrounds, soft accents |
| Ink Navy | `#141821` | Primary text, buttons, dark sections |
| Muted Amethyst | `#756791` | Secondary text, descriptions |
| Deep Orchid | `#523575` | Functional accents, focus states |
| Vibrant Plum | `#50267A` | Primary CTA background |
| Whisper Border | `#CCC2ED` | Borders, dividers |

### Typography
- **Display/Headlines:** `Outfit` (GLM 5) or `Inter` (GPT 5.5) — `font-semibold`, `tracking-[-0.075em]`
- **Body:** `Plus Jakarta Sans` (GLM 5) or `Inter` (GPT 5.5) — `leading-8`
- **Labels:** Uppercase, `tracking-[0.22em]` for section headers

### Component Styling Rules
- **Buttons:** Minimum `rounded-2xl` (1rem) or `rounded-full`. Primary uses Ink Navy or Vibrant Plum with `shadow-[#523575]/20`.
- **Cards:** `rounded-[30px]`, subtle border `border-[#f2e7f6]`, soft shadows that expand on hover.
- **Inputs:** Glassmorphism style (`bg-white/70`, `backdrop-blur-xl`), integrated icons.
- **Containers:** Large radii (`rounded-[44px]`), internal nesting for layered depth.

### Anti-Patterns (Banned)
- NO pure black (`#000000`) — use Ink Navy (`#141821`).
- NO sharp corners — minimum radius is `0.5rem` unless it's a structural divider.
- NO generic AI blue/purple neon glows.
- NO overlapping text — ensure clean spatial separation.
- NO filler copywriting (e.g., "Unleash your potential"). Be literal and data-focused.

### Motion & Animation
- **Spring Physics:** `stiffness: 110, damping: 22` for premium feel.
- **Scroll-Linked Parallax:** Use `useScroll` + `useTransform` from Framer Motion.
- **Staggered Reveals:** Cascade delays of `0.08s` increments for lists/grids.
- **Micro-interactions:** Hover includes subtle Y-axis translation (`y: -8`) and shadow expansion.

---

## Code Style Guidelines

### File Organization
- Components are co-located in `src/components/`.
- Pages are co-located in `src/pages/`.
- All shared TypeScript interfaces and mock data live in `src/data/mockData.ts`.

### Naming Conventions
- Components use PascalCase file names (e.g., `ListingCard.tsx`).
- Hooks and utility functions use camelCase.
- CSS custom properties in `index.css` use kebab-case.

### TypeScript Practices
- All components are written as `.tsx` files.
- Props are typed with inline interfaces (e.g., `interface ListingCardProps { ... }`).
- The `type` keyword is used for simple unions (e.g., `type Tab = 'saved' | 'searches' | ...`).
- `ReturnType<typeof setInterval>` is used for interval refs.

### Tailwind Usage
- Prefer Tailwind utility classes over custom CSS.
- Custom animations and complex utilities belong in `index.css`.
- Use arbitrary values for design-system-specific radii and colors (e.g., `rounded-[30px]`, `text-[#141821]`).
- Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `max-lg:`, `max-xl:`.

### React Patterns
- Functional components with hooks.
- `useState`, `useEffect`, `useRef`, `useMemo` are used throughout.
- `useNavigate` and `useSearchParams` from `react-router-dom` for navigation and query params.
- `useScroll` / `useTransform` from Framer Motion for scroll-linked animations.
- `AnimatePresence` for mount/unmount animations (mobile menu, etc.).

---

## Routing (GLM 5 App Only)

The `Xaan GLM 5` app uses `BrowserRouter` with the following routes:

| Path | Page Component | Description |
|------|---------------|-------------|
| `/` | `HomePage` | Landing with 3D hero, search, recent listings |
| `/listings` | `ListingsPage` | Filterable grid/map view of properties |
| `/property/:id` | `PropertyDetailsPage` | Full property detail with image accordion |
| `/find-agent` | `FindAgentPage` | Agent directory |
| `/agent/:id` | `AgentProfilePage` | Individual agent profile |
| `/dashboard` | `DashboardPage` | User dashboard (saved, searches, alerts) |

All pages are wrapped in `<Layout>` which provides the fixed `Header` and `Footer`.

---

## Mock Data

The `src/data/mockData.ts` file exports:
- `Property` interface — full property schema (price, beds, baths, images, agent, coordinates, etc.)
- `Agent` interface — agent schema (name, photo, rating, listings, specialties, etc.)
- `properties: Property[]` — array of mock listings
- `agents: Agent[]` — array of mock agents
- `formatPrice(price: number): string` — utility to format MXN/USD prices

Images in mock data use Unsplash URLs or local `/images/` paths.

---

## Testing

- **There is currently no test framework configured.**
- No Jest, Vitest, Playwright, or Cypress setup exists.
- If adding tests, prefer **Vitest** (aligns with the Vite ecosystem) and **React Testing Library** for component tests.

---

## Deployment

- Both apps are static SPAs. Build output goes to `dist/`.
- No server-side rendering (SSR) or API backend is present.
- The `index.html` files contain injected analytics/recording scripts from DesignArena (`data-arena-recording`, `data-arena-views`). These are third-party telemetry snippets and should be preserved unless explicitly asked to remove.
- The GPT 5.5 `index.html` also contains an `element-picker` script for DesignArena's inspect mode.

---

## Security Considerations

- No API keys or secrets are stored in the repository.
- No `.env` files are committed (see `gitignore`).
- All images are either local static assets or public Unsplash URLs.
- The analytics scripts in `index.html` communicate with `https://www.designarena.ai/api/agon/page-views` and load `rrweb` from a CDN. Be aware of this external dependency.

---

## Agent Quick Reference

| Task | Command / Location |
|------|-------------------|
| Start dev server | `cd "Xaan GLM 5" && npm run dev` |
| Build for production | `cd "Xaan GLM 5" && npm run build` |
| Add a new page | Create file in `Xaan GLM 5/src/pages/`, add route in `App.tsx` |
| Add a new component | Create file in `Xaan GLM 5/src/components/`, import where needed |
| Update design tokens | Edit `Xaan GLM 5/src/index.css` (`@theme` block) |
| Add mock data | Edit `Xaan GLM 5/src/data/mockData.ts` |
| Run linter | `cd "Xaan GLM 5" && npm run lint` |

---

## Decision Log

- **Two apps exist** because they were generated by different AI models (GLM-5 vs GPT-5.5) during a design tournament. The GLM 5 version is the modular, multi-page implementation and should be treated as the canonical codebase.
- **No backend** — this is a frontend-only prototype. All data is mocked.
- **Tailwind v4** — uses the new CSS-first configuration (`@theme` in CSS) rather than a JS config file.
