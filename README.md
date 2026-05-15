# Hetzel's Workshop — Portfolio Site
A single-page React portfolio with a live Discord presence widget, custom cursor, theme presets, scroll-reveal animations,
i18n support, and a full settings panel.

## 🚀 Deployment to Vercel

This project is optimized for **Vercel** using **Vite 7**. Follow these steps to deploy:

1.  **Push to GitHub**: Ensure your latest code is pushed to a GitHub repository.
2.  **Import to Vercel**:
    - Go to the [Vercel Dashboard](https://vercel.com/new).
    - Click **"Import"** next to your GitHub repository.
3.  **Configure Project**:
    - Vercel should automatically detect **Vite** as the Framework Preset.
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
    - **Install Command**: `npm install`
4.  **Deploy**: Click **"Deploy"**. Vercel will build your app and provide a live URL.

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

## Configuration
### Discord Integration
The site uses **[Lanyard](https://github.com/Phineas/lanyard)** to display live Discord presence.
1. Join the [Lanyard Discord server](https://discord.gg/5W9Y6F9)
2. Verify your Discord user ID is tracked
3. Update `src/lib/site-constants.ts`:
```ts
export const DISCORD_ID = "your_discord_user_id";
```

### Content / Copy
All text lives in `src/i18n/translations.ts`. Each language key maps to a section.

## Customization Persistence
All settings are saved to `localStorage` under the key `hetzel-customization`.

## License
Private — all rights reserved.