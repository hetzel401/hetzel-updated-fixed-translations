# Hetzel's Workshop — Portfolio Site

A single-page React portfolio with live Discord presence, custom cursor, theme presets, scroll-reveal animations,
i18n support (6 languages), full settings panel, real-time status dashboard, and dynamic favicon.

## Feature Overview

| Category              | Features |
| --------------------- | -------- |
| **Discord Live**      | Real-time presence (online/idle/dnd/offline) in nav + status banner, live Spotify now-playing (6 visual styles), custom status, activity display, Lanyard WebSocket auto-refresh |
| **Live Favicon**      | Canvas-rendered favicon updates automatically when Discord status changes (green/amber/red/gray dot) |
| **Theme Engine**      | Dark/light toggle, 9 theme presets (cyberpunk, dracula, nord, gruvbox, catppuccin, tokyo-night, rose-pine, synthwave), custom accent color, glass opacity, border glow |
| **Settings Panel**    | Persistent floating panel with 60+ toggles — cursor, background, effects, layout, fonts, widgets, sounds. Export/import/reset |
| **Custom Cursor**     | 8 styles: default, dot, ring, crosshair, emoji, trail, glow, none. Configurable color, size, blend mode, trail length, ring lag |
| **Backgrounds**       | 9 types: default gradient, solid, particles, matrix, stars, aurora, waves, custom image URL. Adjustable opacity, blur, speed, overlay |
| **Effects Layer**     | Snow, rain, fireflies, scanlines, vignette, glitch, bloom, confetti — all toggleable |
| **Scroll-Reveal**     | CSS-powered fade-up animation on sections via IntersectionObserver. Toggleable in settings |
| **SEO**               | `react-helmet-async` — per-page meta, Open Graph, Twitter cards, JSON+LD schema, canonical URL |
| **Nav**               | Fixed glassmorphism nav with social icon row, anchor links with smooth scroll + 80px offset, mobile drawer, live status dot, language picker, survey CTA |
| **Mobile Responsive** | Hamburger drawer with animated entrance, anchor links close drawer + smooth scroll, responsive breakpoints |
| **Performance**       | `content-visibility: auto` on below-fold sections, `contain-intrinsic-size`, CSS-only scroll-reveal (no JS animation lib) |
| **Dashboard**         | `/admin` route — live Discord presence card, server stats (member/online count), system info, real-time event log |
| **i18n**              | 6 languages: English, Spanish, French, German, Portuguese, Japanese. Full translation tree for all copy |
| **Contact Form**      | Sends to Discord webhook — name, email, message fields with loading/success/error states |
| **Community Survey**  | 5-question multi-step form (rating, radio, textarea) with progress bar, submits to Discord webhook |
| **Widgets**           | Now Playing (6 styles), Status Banner (9 styles), Clock, Quote, Discord Widget, Scroll Progress, Back to Top |
| **Command Palette**   | `Ctrl+K` palette with actions (theme toggle, navigation, etc.) |
| **Font System**       | 8 font families (Inter, JetBrains Mono, Space Grotesk, Fira Code, Poppins, Playfair, Roboto Mono), configurable scale 50-200% |
| **Loading Screen**    | Animated entry screen, toggleable in settings |
| **Custom Scrollbar**  | Styled scrollbar matching theme, toggleable |
| **Click Ripple**      | Animated ripple effect on click, toggleable |
| **Keyboard Shortcuts**| Hook-based shortcut system for power users |

## Tech Stack

| Layer        | Tool                                                   |
| ------------ | ------------------------------------------------------ |
| Framework    | React 19                                               |
| Build Tool   | Vite 7                                                 |
| Styling      | Tailwind CSS 4 + `tw-animate-css`                      |
| Routing      | wouter (hash-free, lightweight)                        |
| UI Primitives| shadcn/ui (New York style) + Radix-based components    |
| Icons        | lucide-react                                           |
| Animation    | framer-motion (widgets) + CSS-only scroll-reveal       |
| SEO          | react-helmet-async                                     |
| Fonts        | Inter (sans), JetBrains Mono (mono), Google Fonts      |

## Project Structure

```
hetzel-updated/
├── index.html              # SEO meta, OG tags, canonical, preconnect
├── vite.config.ts
├── tsconfig.json
├── components.json         # shadcn/ui config
├── package.json
├── SETUP.md
├── public/
│   └── favicon.svg
├── dist/                   # build output
└── src/
    ├── main.tsx
    ├── App.tsx              # providers, global widgets, router (/ + /admin + 404)
    ├── index.css            # Tailwind, CSS vars, custom utilities, keyframes
    ├── context/
    │   ├── CustomizationContext.tsx  # 60+ settings, localStorage, export/import
    │   ├── LanguageContext.tsx       # i18n provider
    │   └── LanyardContext.tsx        # Discord presence (Lanyard API polling)
    ├── components/
    │   ├── Nav.tsx           # glass nav + live status dot + anchor links + mobile drawer
    │   ├── LiveFavicon.tsx   # canvas favicon that updates with Discord status
    │   ├── SiteFooter.tsx
    │   ├── SettingsPanel.tsx # settings drawer + floating quick-buttons (dark/light, etc.)
    │   ├── BackgroundManager.tsx
    │   ├── CustomCursor.tsx
    │   ├── EffectsLayer.tsx  # snow, rain, fireflies, scanlines, vignette, glitch, etc.
    │   ├── LoadingScreen.tsx
    │   ├── CommandPalette.tsx
    │   ├── NowPlayingWidget.tsx   # 6 visual styles, progress, visualizer, quick actions
    │   ├── StatusBanner.tsx       # 9 styles (ribbon, hud, orbit, pill, minimal, etc.)
    │   ├── DiscordWidget.tsx
    │   ├── DiscordProfile.tsx
    │   ├── ClockWidget.tsx
    │   ├── QuoteWidget.tsx
    │   ├── ScrollProgress.tsx
    │   ├── BackToTop.tsx
    │   ├── Constellation.tsx
    │   ├── ClickRipple.tsx
    │   ├── OrbLayer.tsx
    │   ├── SkillsMarquee.tsx
    │   ├── Typewriter.tsx
    │   ├── Questionnaire.tsx
    │   ├── PageLayout.tsx
    │   └── SectionLabel.tsx
    │   └── ui/               # 60+ shadcn/ui primitives
    ├── pages/
    │   ├── Index.tsx         # main single page (all content sections)
    │   ├── DashboardPage.tsx # /admin — live status monitoring
    │   └── not-found.tsx
    ├── hooks/
    │   ├── use-section-reveal.ts  # IntersectionObserver + `.reveal-on-scroll`
    │   ├── use-lanyard.ts         # Discord Lanyard REST polling (30s)
    │   ├── use-count-up.ts
    │   ├── use-keyboard-shortcuts.ts
    │   ├── use-mobile.tsx
    │   └── use-toast.ts
    ├── i18n/
    │   └── translations.ts   # 6 languages (en, es, fr, de, pt, ja)
    ├── data/
    │   └── blog.ts
    └── lib/
        ├── site-constants.ts # DISCORD_ID, project links, stats
        └── utils.ts          # cn() helper (clsx + tailwind-merge)
```

## Getting Started

### Prerequisites

- **Node.js >= 20.19.0** (Vite 7 requirement)
- npm (ships with Node.js)

### Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
```

### Build for Production

```bash
npm run build      # outputs to dist/
npm run preview    # preview production build locally
```

## Routes

| Path      | Page              | Description                        |
| --------- | ----------------- | ---------------------------------- |
| `/`       | Index             | Main portfolio (all sections)      |
| `/admin`  | DashboardPage     | Live status dashboard (noindex)    |
| `*`       | NotFound          | 404 page with back-to-home link    |

## Discord Integration

Uses **[Lanyard](https://github.com/Phineas/lanyard)** REST API (polled every 30s) to display live Discord presence.

1. Join the [Lanyard Discord server](https://discord.gg/5W9Y6F9)
2. Verify your Discord user ID is tracked
3. Update `src/lib/site-constants.ts`:

```ts
export const DISCORD_ID = "your_discord_user_id";
```

Components consuming Lanyard data:
- **Nav.tsx** — status dot in the top bar (online/idle/dnd/offline with ping animation)
- **LiveFavicon.tsx** — canvas favicon with colored status dot
- **StatusBanner.tsx** — 9 configurable styles showing presence + activity + Spotify
- **NowPlayingWidget.tsx** — 6 visual styles for Spotify (default, vinyl, minimal, fullart, neon, dock)
- **DashboardPage.tsx** — full presence card with activity + Spotify details
- **DiscordProfile.tsx** — hero section avatar with decoration + status ring

## Content / Copy

All text in `src/i18n/translations.ts`. Edit the `en` block for hero, about, services,
timeline, FAQ, etc. Translations for ES, FR, DE, PT, JA are in the same file.

## Theme Presets

9 presets in `CustomizationContext.tsx`:

| Preset        | Vibe                |
| ------------- | ------------------- |
| custom        | Default purple      |
| cyberpunk     | Neon yellow         |
| dracula       | Dark purple         |
| nord          | Frosty blue         |
| gruvbox       | Warm orange         |
| catppuccin    | Muted pastel        |
| tokyo-night   | Deep blue           |
| rose-pine     | Rosy mauve          |
| synthwave     | Hot pink / retro    |

## Project Links & Stats

Edit `src/lib/site-constants.ts`:

```ts
export const projectHrefs = ["https://..."];
export const stats = [
  { value: "1.5+", key: "yearsExp" },
];
```

The `key` field maps to `translations.ts` → `about.stats.{key}`.

## Scroll-Reveal

Sections with `class="reveal-on-scroll"` fade up when scrolled into view.

- **CSS:** `opacity` + `translateY` with cubic-bezier transition in `src/index.css`
- **JS:** `useSectionReveal()` hook uses `IntersectionObserver` → adds `.revealed` class
- **Toggle:** Settings → Layout → Section Animations

To add reveal to any element:

```tsx
<section className="reveal-on-scroll">...</section>
```

## Customization Persistence

All settings saved to `localStorage` key `hetzel-customization`.

- **Export:** Settings → Export (copies JSON)
- **Import:** Settings → Import (paste JSON)
- **Reset:** Settings → Reset All

## Adding / Removing Components

### Add UI primitive (shadcn)

`components.json` is configured. Run `npx shadcn@latest add <component>` from the registry.

### Add a section to the page

1. Create component in `src/components/`
2. Import + render in `src/pages/Index.tsx`
3. Add `reveal-on-scroll` for animation
4. Add text to all 6 languages in `translations.ts`

### Remove a feature

1. Remove import from `src/App.tsx` (global widgets) or `src/pages/Index.tsx` (sections)
2. Delete the component file
3. Clean up related CSS in `src/index.css`

## Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel --prod
```

Or connect the GitHub repo to Vercel for auto-deploy.

### GitHub Pages

1. Set `base: "/your-repo-name/"` in `vite.config.ts`
2. `npm run build`
3. Deploy `dist/` folder

### Any Static Host

```bash
npm run build
# upload dist/ to any static file server
```

## Environment

No `.env` files required. The only external API is Lanyard (public endpoint, no key).

## Troubleshooting

| Problem                          | Likely Fix                              |
| -------------------------------- | --------------------------------------- |
| `npm run dev` fails              | Upgrade Node.js to >= 20.19.0           |
| Tailwind classes not applied     | Ensure `@import "tailwindcss"` in `index.css` |
| Settings don't save              | Check `localStorage` is not blocked     |
| Discord presence not showing     | Verify `DISCORD_ID` in `site-constants.ts`, user tracked by Lanyard |
| Fonts not loading                | Check Google Fonts link in `index.html` |
| Blank page after build           | Check `dist/` exists and `outDir` in `vite.config.ts` |
| Anchor links not scrolling       | Ensure `handleAnchorClick` `preventDefault()`s — wouter may intercept hash changes |
| Favicon not updating             | `LiveFavicon` needs Lanyard data — check Discord presence is available |

## License

Private — all rights reserved.
