# AI Rules & Tech Stack Guidelines

This document outlines the architectural standards and library preferences for the Hetzel's Workshop portfolio project.

## Tech Stack Overview

- **Framework:** React 19 (using Functional Components and Hooks).
- **Build Tool:** Vite 7 for fast development and optimized production builds.
- **Styling:** Tailwind CSS 4 for utility-first styling and layout.
- **Routing:** `wouter` for lightweight, hash-free client-side routing.
- **UI Components:** `shadcn/ui` (Radix UI primitives) for accessible, unstyled components.
- **Icons:** `lucide-react` for a consistent and performant icon set.
- **Animations:** `framer-motion` for complex widget interactions and CSS-only transitions for scroll reveals.
- **SEO:** `react-helmet-async` for managing document head and meta tags.
- **Presence:** Lanyard API (via WebSocket/REST) for real-time Discord status integration.
- **i18n:** Custom translation system managed via `src/i18n/translations.ts`.

## Library Usage Rules

### 1. Routing
- **Library:** `wouter`
- **Rule:** Use `Link` for internal navigation and `useLocation` for route state. Keep all route definitions in `src/App.tsx`.

### 2. Styling & Design
- **Library:** Tailwind CSS 4
- **Rule:** Prefer utility classes over custom CSS. Use the `@theme` block in `src/index.css` for design tokens.
- **Rule:** Use the `glass` utility class for consistent glassmorphism effects.

### 3. UI Components
- **Library:** `shadcn/ui`
- **Rule:** Use existing primitives in `src/components/ui/`. Do not modify these files directly; wrap them in feature-specific components if customization is needed.

### 4. Icons
- **Library:** `lucide-react`
- **Rule:** Always use Lucide icons for UI actions and decorative elements to maintain visual consistency.

### 5. Animations
- **Library:** `framer-motion`
- **Rule:** Use for interactive widgets (Now Playing, Status Banner).
- **Rule:** For page-wide scroll animations, use the `.reveal-on-scroll` CSS class combined with the `useSectionReveal` hook.

### 6. Internationalization (i18n)
- **System:** Custom `LanguageContext`
- **Rule:** Never hardcode strings in components. All text must be added to `src/i18n/translations.ts` and accessed via the `t` object from `useLanguage()`.

### 7. State Management
- **System:** React Context
- **Rule:** Use `CustomizationContext` for any user-facing settings or theme toggles. Use `LanyardContext` for Discord-related data.

### 8. SEO & Meta
- **Library:** `react-helmet-async`
- **Rule:** Every page component should include a `<Helmet>` block to manage titles, descriptions, and Open Graph tags.