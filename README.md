# Hetzel's Workshop — Portfolio Site
A single-page React portfolio with a live Discord presence widget, custom cursor, theme presets, scroll-reveal animations,
i18n support, and a full settings panel.
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
| Fonts        | Inter (sans), JetBrains Mono (mono), Google Fonts      |
## Project Structure
```
hetzel-updated/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── components.json          # shadcn/ui config
├── package.json
├── public/
│   └── favicon.svg
├── dist/                    # build output
└── src/
    ├── main.tsx             # entry point
    ├── App.tsx              # providers, global widgets, router
    ├── index.css            # Tailwind imports, CSS vars, custom utilities
    ├── context/
    │   ├── CustomizationContext.tsx   # all settings + localStorage persistence
    │   ├── LanguageContext.tsx        # i18n provider
    │   └── LanyardContext.tsx         # Discord presence (Lanyard API)
    ├── components/
    │   ├── Nav.tsx           # top nav + social icon row
    │   ├── SiteFooter.tsx
    │   ├── SettingsPanel.tsx # settings drawer + floating quick-buttons
    │   ├── BackgroundManager.tsx
    │   ├── CustomCursor.tsx
    │   ├── EffectsLayer.tsx  # snow, rain, fireflies, scanlines, vignette, etc.
    │   ├── LoadingScreen.tsx
    │   ├── CommandPalette.tsx
    │   ├── NowPlayingWidget.tsx   # Spotify now-playing via Lanyard
    │   ├── StatusBanner.tsx       # Discord status banner
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
    │   └── ui/               # shadcn/ui primitives (60+ components)
    ├── pages/
    │   └── Index.tsx         # the single page (all content)
    ├── hooks/
    │   ├── use-section-reveal.ts  # IntersectionObserver + `.reveal-on-scroll`
    │   ├── use-lanyard.ts         # Discord Lanyard WebSocket
    │   ├── use-count-up.ts
    │   ├── use-keyboard-shortcuts.ts
    │   ├── use-mobile.tsx
    │   └── use-toast.ts
    ├── i18n/
    │   └── translations.ts   # 6 languages (en, es, fr, de, pt, ja)
    ├── data/
    │   └── blog.ts
    └── lib/
        ├── site-constants.ts # Discord ID, project links, stats
        └── utils.ts          # cn() helper (clsx + tailwind-merge)
```
## Getting Started
### Prerequisites
- **Node.js >= 20.19.0** (Vite 7 requirement)
- npm (ships with Node.js)
### Quick Start
```bash
# 1. Install dependencies
npm install
# 2. Start dev server (hot-reload)
npm run dev
# 3. Open http://localhost:5173
```
### Build for Production
```bash
npm run build     # outputs to dist/
npm run preview   # preview the production build locally
```
## Configuration
### Discord Integration
The site uses **[Lanyard](https://github.com/Phineas/lanyard)** to display live Discord presence
(status, activity, Spotify now-playing, custom status).
1. Join the [Lanyard Discord server](https://discord.gg/5W9Y6F9)
2. Verify your Discord user ID is tracked
3. Update `src/lib/site-constants.ts`:
```ts
export const DISCORD_ID = "your_discord_user_id";
```
### Content / Copy
All text lives in `src/i18n/translations.ts`. Each language key maps to a section.
To edit the hero headline, about bio, services, timeline, FAQ, etc. — edit the `en` block.
Translations for ES, FR, DE, PT, JA are also in the same file.
### Theme Presets
9 built-in presets in `CustomizationContext.tsx`:
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
### Project Links & Stats
Edit `src/lib/site-constants.ts`:
```ts
export const projectHrefs = [
  "https://...",
  "https://...",
];
export const stats = [
  { value: "1.5+", key: "yearsExp" },
  { value: "∞",    key: "ideas" },
  // ...
];
```
The `key` field maps to translation keys in `translations.ts` under `about.stats`.
### Scroll-Reveal
Sections with the class `reveal-on-scroll` fade up when scrolled into view.
- **Toggle:** Settings panel → "Section Animations" toggle (requires page refresh on first load)
- **CSS:** Defined in `src/index.css` — uses `opacity` + `translateY` with a cubic-bezier transition
- **JS:** `useSectionReveal()` hook in `src/hooks/use-section-reveal.ts` — registers an `IntersectionObserver`
  on all `.reveal-on-scroll` elements and adds `.revealed` when visible
To add reveal to a new section, just add the class:
```tsx
<section className="reveal-on-scroll">...</section>
```
### Custom Cursor
Settings panel → Cursor section.
Types: default, dot, ring, crosshair, emoji, trail, glow, none.
Color, size, blend mode, and trail length are all configurable.
### Backgrounds
Settings panel → Background section.
Types: default (gradient), solid, gradient (custom), particles, matrix, stars, aurora, waves, custom image (URL).
### UX Features
| Feature              | Toggle Location            |
| -------------------- | -------------------------- |
| Dark / Light mode    | Floating Sun/Moon button   |
| Scroll progress bar  | Settings → Layout          |
| Back to top button   | Settings → Layout          |
| Click ripple         | Settings → Effects         |
| Loading screen       | Settings → Effects         |
| Command palette (`Ctrl+K`) | Always on           |
| Language switcher    | Settings → Language        |
| Font family / scale  | Settings → Appearance      |
| Card style           | Settings → Layout          |
| Nav style            | Settings → Layout          |
## Customization Persistence
All settings are saved to `localStorage` under the key `hetzel-customization`.
- **Export:** Settings panel → Export (copies JSON to clipboard)
- **Import:** Settings panel → Import (paste JSON and apply)
- **Reset:** Settings panel → Reset All
## Adding / Removing Components
### Add a new UI component (shadcn)
This project uses shadcn/ui. The `components.json` is already configured.
You can add new primitives from the [shadcn registry](https://ui.shadcn.com/docs/components).
### Add a new section to the page
1. Create the component in `src/components/`
2. Import and render it in `src/pages/Index.tsx`
3. Add `reveal-on-scroll` class if you want scroll animation
4. Add its text to all 6 languages in `src/i18n/translations.ts`
### Remove a feature
1. Remove its import from `src/App.tsx` (for global widgets) or `src/pages/Index.tsx` (for sections)
2. Remove the component file itself
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
3. Deploy the `dist/` folder
### Any Static Host
```bash
npm run build
# upload dist/ to any static file server
```
## Environment
No `.env` files are required. The only external API is Lanyard (public WebSocket, no key needed).
## Troubleshooting
| Problem                          | Likely Fix                              |
| -------------------------------- | --------------------------------------- |
| `npm run dev` fails              | Upgrade Node.js to >= 20.19.0           |
| Tailwind classes not applied     | Ensure `@import "tailwindcss"` is in `index.css` |
| Settings don't save              | Check `localStorage` is not blocked     |
| Discord presence not showing     | Verify `DISCORD_ID` in `site-constants.ts` and user is tracked by Lanyard |
| Fonts not loading                | Check Google Fonts link in `index.html` |
| Blank page after build           | Check `dist/` exists and `outDir` in `vite.config.ts` |
## License
Private — all rights reserved.
