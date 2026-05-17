# 🎮 Quick Start — Hetzel's Workshop v2.0

## What's New?

✨ **Cursor-Tracking Orbs** — The background orbs now smoothly follow your cursor!  
🗑️ **YouTube Removed** — Cleaner navigation and social links  
⚡ **Performance Optimized** — Smaller bundle, smoother animations

---

## 🚀 Getting Started

### Installation

```bash
# Clone or extract the project
cd hetzel-enhanced

# Install dependencies
pnpm install
# or: npm install
# or: yarn install

# Start development server
pnpm dev
# or: npm run dev
```

### Building for Production

```bash
pnpm build
# Output will be in: dist/

pnpm preview  # Test the production build locally
```

---

## 🎯 What Changed?

### Enhanced Features
- **Cursor-Responsive Orbs** (`src/components/OrbLayer.tsx`)
  - Orbs track your mouse position
  - Smooth, natural animations
  - No performance impact
  - Fully accessible

### Removed
- ❌ YouTube links (all removed)
- ❌ YouTube icon imports
- ❌ YouTube in translations

### Files Modified
```
✏️  src/components/OrbLayer.tsx     — Enhanced with cursor tracking
✏️  src/components/Nav.tsx           — YouTube link removed
✏️  src/pages/Index.tsx              — YouTube references removed
✏️  src/lib/site-constants.ts        — YouTube from SOCIAL_LINKS removed
✏️  src/i18n/translations.ts         — "YouTube / GitHub" → "GitHub"
✨ CHANGELOG_ENHANCEMENTS.md          — Detailed changelog (NEW)
✨ QUICK_START.md                     — This file (NEW)
```

---

## 🎨 Customizing the Orbs

### Change Cursor Influence (how much orbs follow your mouse)

Edit `src/components/OrbLayer.tsx`, line ~124:

```typescript
// Current: orbs moderately follow cursor (0.2–0.6)
const cursorInfluence = parseFloat((0.2 + rand() * 0.4).toFixed(2));

// Make them follow LESS: 0.1–0.3
const cursorInfluence = parseFloat((0.1 + rand() * 0.2).toFixed(2));

// Make them follow MORE: 0.4–0.8
const cursorInfluence = parseFloat((0.4 + rand() * 0.4).toFixed(2));

// Disable completely: (set to constant)
const cursorInfluence = 0;
```

### Add More Orbs

Edit `src/components/OrbLayer.tsx`, line ~78:

```typescript
return Array.from({ length: 5 }, (_, n): OrbConfig => {
//                               ↑ Change to 6, 7, 8, etc.
```

### Change Orb Colors

Edit `src/components/OrbLayer.tsx`, lines 60–64:

```typescript
const PALETTE = [
  "hsl(260 85% 70%)",   // Purple/Indigo
  "hsl(240 80% 60%)",   // Blue
  "hsl(275 90% 80%)",   // Lilac
  // Add more: "hsl(280 85% 65%)", // Different shade
];
```

---

## 🔧 Common Tasks

### Remove Cursor Tracking Entirely
Set all cursor influence to 0:
```typescript
const cursorInfluence = 0;
```

Or comment out cursor code in the Orb component:
```typescript
// const cursorOffsetX = useTransform(...);
// const cursorOffsetY = useTransform(...);
```

### Make Animations Faster/Slower
Edit duration ranges in `buildOrbs()`:
```typescript
// Current: 18–35 seconds per cycle
const duration = parseFloat((18 + rand() * 17).toFixed(2));

// Faster: 8–20 seconds
const duration = parseFloat((8 + rand() * 12).toFixed(2));

// Slower: 25–45 seconds
const duration = parseFloat((25 + rand() * 20).toFixed(2));
```

### Change Orb Opacity
Edit line ~85:
```typescript
// Current: 0.12–0.25 (subtle)
const opacity = parseFloat((0.12 + rand() * 0.13).toFixed(4));

// More visible: 0.2–0.35
const opacity = parseFloat((0.2 + rand() * 0.15).toFixed(4));

// Very subtle: 0.08–0.15
const opacity = parseFloat((0.08 + rand() * 0.07).toFixed(4));
```

---

## 🧪 Testing

### Desktop
- Move your mouse around — orbs should gently follow
- Try different areas of the screen
- Check smooth performance in DevTools (60fps target)

### Mobile
- Orbs animate normally (no cursor tracking on mobile)
- Should work on all modern mobile browsers

### Accessibility
- Enable "Reduce Motion" in system settings
- Animations should stop, orbs remain visible
- All content still accessible

### Browser Support
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers

---

## 📱 Social Links (Updated)

After YouTube removal, your active social links are:

- **Discord** — Community & Gaming
- **GitHub** — Code & Projects
- **Roblox** — Gaming Profile
- **Email** — Contact Form

All links in:
- Footer
- Navigation (mobile)
- Homepage social section
- Schema.org metadata

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git add .
git commit -m "v2.0: Cursor-tracking orbs + YouTube removal"
git push

# Vercel auto-deploys on push
# No additional configuration needed
```

### Manual Deployment
```bash
pnpm build
# Upload the 'dist/' folder to your hosting
```

### Environment Variables
- ✅ **None required** — Works out of the box
- All APIs are already configured in `site-constants.ts`

---

## 📚 Key Files to Know

| File | Purpose | Modified? |
|------|---------|-----------|
| `src/components/OrbLayer.tsx` | Background orbs animation | ✨ Enhanced |
| `src/components/Nav.tsx` | Navigation bar | ✏️ Updated |
| `src/pages/Index.tsx` | Homepage | ✏️ Updated |
| `src/lib/site-constants.ts` | Config & links | ✏️ Updated |
| `src/i18n/translations.ts` | Multi-language text | ✏️ Updated |
| `package.json` | Dependencies | ❌ Unchanged |

---

## ⚡ Performance Notes

- **Bundle Size**: Slightly reduced (Youtube icon removed)
- **Runtime**: No performance impact
- **Animations**: 60fps target maintained
- **Memory**: Proper cleanup in useEffect hooks
- **Accessibility**: Full support for reduced motion

---

## 🐛 Troubleshooting

### Orbs not moving with cursor?
- Check browser DevTools console for errors
- Ensure you're on desktop (not mobile)
- Try refreshing page
- Clear browser cache

### Page loads slowly?
- This is the build process, not the deployed version
- Run `pnpm build && pnpm preview` for accurate performance test
- Check if animations are enabled (system not in reduced motion mode)

### YouTube links still showing?
- Restart dev server: `Ctrl+C` then `pnpm dev`
- Clear browser cache
- Check you edited the right files (see file list above)

---

## 📞 Need Help?

Refer to `CHANGELOG_ENHANCEMENTS.md` for detailed technical information about:
- Cursor tracking implementation
- OrbLayer architecture
- Customization options
- Future enhancement ideas

---

**Happy Building! 🚀**

*Hetzel's Workshop v2.0 — Enhanced with ❤️*
