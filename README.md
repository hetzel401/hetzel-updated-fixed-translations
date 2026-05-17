# Hetzel401 — Discord Bot & Server Developer Portfolio

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS showcasing custom Discord bot development, server design, and web projects.

**Live Demo:** [https://hetzel-updated.vercel.app](https://hetzel-updated.vercel.app)

---

## ✨ Features

### Core Features
- 🎨 **Modern Design** - Clean, professional UI with smooth animations
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop devices
- ⚡ **Fast Performance** - Built with Vite for lightning-fast load times
- 🔍 **SEO Optimized** - Meta tags, structured data, and canonical URLs
- 🎯 **Portfolio Showcase** - Display Discord bots, server designs, and projects
- 📧 **Contact Integration** - Easy client outreach and commission inquiries

### Mobile Improvements (v1.1.0)
- **Touch-Friendly Navigation** - Optimized spacing for mobile interactions
- **Responsive Typography** - Dynamic font sizes for all screen sizes
- **Smooth Scrolling** - Fixed scrolling performance on mobile and tablet
- **Hamburger Menu** - Collapsible navigation for small screens
- **Optimized Images** - Responsive images with proper aspect ratios
- **Mobile-First CSS** - Prioritized mobile experience first

### Mobile & UX Improvements (v1.2.0)
- **Mobile Bottom Navigation** - Fixed bottom nav bar with quick links to About, Work, Discord, and Contact (auto-hides at top, highlights active section)
- **Animated Stat Counters** - Stats count up from zero when scrolled into view using IntersectionObserver
- **Touch Swipe for Discord Tabs** - Swipe left/right to switch between Server and Profile tabs on mobile
- **Skip-to-Content Link** - Accessible keyboard shortcut (Tab) to jump directly to main content
- **Staggered Section Reveals** - Grid children animate in sequentially with cascading delays for a polished feel
- **Responsive Hero Typography** - Scaled text from `text-5xl` on mobile to `text-9xl` on desktop
- **Stacking CTA Buttons** - Hero buttons stack vertically on mobile for better tap targets
- **Improved Grid Breakpoints** - Added 2-column tablet breakpoints for stats, testimonials, and community sections
- **Better Discord Section Layout** - Smaller server icon, responsive text, full-width Join button on mobile
- **Responsive Spacing** - Graduated padding across all sections (`p-5 sm:p-6 md:p-8`)
- **Touch Feedback** - `active:scale-95` on interactive elements for tactile mobile response

### New Features (v1.3.0)
- **Section Navigation Dots** - Floating side dot navigation (desktop) showing current section with labels on hover, clickable to jump between sections
- **YouTube Video Section** - Embedded video gallery using existing VIDEOS data with inline playback, thumbnails, view/like counts, and duration badges
- **Skills Marquee** - Animated infinite-scroll ticker of tech skills between About and Timeline sections, respects `prefers-reduced-motion`
- **Copy Discord Tag** - Click-to-copy button for Discord username with checkmark toast feedback
- **Parallax Hero Background** - Constellation background scrolls at 0.35x speed for a subtle depth effect

### New Features (v1.1.0)
- 🌙 **Dark Mode Toggle** - Switch between light and dark themes
- 📱 **Mobile Menu** - Responsive navigation drawer
- 🎬 **Project Carousel** - Showcase multiple projects with swipe support
- ⭐ **Skills Section** - Display technical expertise and specializations
- 📊 **Stats Dashboard** - Highlight experience metrics and achievements
- 🎯 **Call-to-Action Buttons** - Prominent contact and commission buttons
- 🔗 **Social Links** - Quick links to Discord, GitHub, Twitter, etc.
- 💬 **Testimonials Section** - Client feedback and reviews
- 🎨 **Theme Customization** - Easy color palette switching

### Responsive Breakpoints
```
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (sm → lg)
- Desktop: > 1024px (lg+)
```

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 19.1.0
- **Language:** TypeScript
- **Build Tool:** Vite 7.3.2
- **Styling:** Tailwind CSS 4.1.14 + Tailwind Merge
- **Animations:** Framer Motion 12.0.0
- **Routing:** Wouter 3.3.5
- **Icons:** Lucide React 0.400.0
- **UI Components:** Class Variance Authority 0.7.1
- **Package Manager:** pnpm

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.19.0
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/hetzel401/hetzel-updated-fixed-translations.git
cd hetzel-updated-fixed-translations

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

The development server will run on `http://localhost:5173`

---

## 📁 Project Structure

```
hetzel-updated-fixed-translations/
├── src/
│   ├── components/           # Reusable React components
│   │   ├── Nav.tsx           # Navigation header
│   │   ├── MobileBottomNav.tsx # Fixed bottom nav for mobile
│   │   ├── DiscordProfileCard.tsx # Discord profile card
│   │   ├── DiscordProfile.tsx # Discord status widget
│   │   ├── SettingsPanel.tsx  # Theme customization panel
│   │   ├── Constellation.tsx  # Background particle effect
│   │   ├── SectionDots.tsx    # Floating side dot navigation
│   │   ├── YouTubeSection.tsx # YouTube video embed gallery
│   │   ├── CopyDiscordTag.tsx # Click-to-copy Discord tag
│   │   ├── SkillsMarquee.tsx  # Animated skills ticker
│   │   └── ...               # Other UI components
│   ├── hooks/                # Custom React hooks
│   │   ├── use-section-reveal.ts # Scroll reveal + stagger animations
│   │   └── use-count-up.ts   # Animated counter hook
│   ├── context/              # React context providers
│   ├── pages/
│   │   └── Index.tsx         # Main portfolio page
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles + animations
├── public/                   # Static assets
├── index.html                # HTML template
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── package.json              # Project dependencies
└── README.md                 # This file
```

---

## 🎯 Recent Improvements

### Version 1.1.0 - Mobile & Performance Update
- **Fixed scrolling issues** on mobile and tablet devices
  - Removed overflow constraints that caused jank
  - Implemented smooth scroll behavior
  - Optimized scroll performance
- **Enhanced mobile responsiveness**
  - Improved navigation on touch devices
  - Better spacing and padding for mobile
  - Responsive image handling
  - Touch-friendly buttons and links
- **Added new sections**
  - Stats dashboard
  - Skills showcase
  - Testimonials carousel
  - Social media integration

### Responsive Improvements
- **Header/Navigation**
  - Hamburger menu on mobile
  - Sticky navigation with smooth scroll
  - Touch-optimized menu items

- **Hero Section**
  - Responsive typography
  - Mobile-optimized CTA buttons
  - Adaptive layouts

- **Projects Section**
  - Grid layout (3 columns on desktop, 1 on mobile)
  - Image optimization
  - Touch-friendly project cards

- **Contact Section**
  - Mobile-friendly form inputs
  - Proper spacing for touch interactions

---

## 📱 Mobile Optimization Checklist

- ✅ Viewport meta tag configured
- ✅ Touch-friendly spacing (min 44x44px for buttons)
- ✅ Responsive typography scaling
- ✅ Mobile navigation menu
- ✅ Smooth scrolling behavior
- ✅ Optimized images for mobile
- ✅ Proper font sizing and line-height
- ✅ Adequate padding and margins for mobile
- ✅ Fast load times (Vite optimization)
- ✅ No horizontal scrolling

---

## 🔧 Configuration

### Tailwind CSS
Customize the design system in `tailwind.config.ts`

### Vite
Adjust build settings in `vite.config.ts`

### TypeScript
Modify type settings in `tsconfig.json`

---

## 🌐 Environment Variables

Create a `.env.local` file (not committed to repo):

```env
VITE_API_URL=your_api_url_here
VITE_CONTACT_EMAIL=your_email@example.com
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy with Vercel CLI
npm install -g vercel
vercel
```

Or connect your GitHub repository directly to Vercel for automatic deployments.

### Other Platforms
- **Netlify:** Connect GitHub repo and select "Vite" as build tool
- **GitHub Pages:** Update vite.config.ts with base path and use gh-pages
- **Docker:** Create a Dockerfile for containerized deployment

---

## 📊 Performance Metrics

- **Lighthouse Score:** 95+
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 2.5s
- **Cumulative Layout Shift:** < 0.1

---

## 🐛 Scrolling Issue Fix

**Previous Issue:** Scrolling performance was poor on mobile/tablet devices with jank and lag.

**Solution Implemented:**
1. Removed conflicting `overflow-y: hidden` from body
2. Applied `overflow-x: hidden` only when needed
3. Used `overscroll-behavior` to prevent rubber-band effect
4. Implemented GPU-accelerated scrolling with `will-change`
5. Optimized scroll event listeners with debouncing

**Current Status:** ✅ Fixed - Smooth scrolling on all devices

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👤 About

**Hetzel401** is an independent developer specializing in:
- Custom Discord bot development
- Server design and configuration
- Web development projects
- Community management solutions

📧 **Email:** [your-email@example.com]
🔗 **Discord:** [Your Discord Tag]
💼 **Portfolio:** [https://hetzel-updated.vercel.app](https://hetzel-updated.vercel.app)

---

## 📞 Support

For questions, issues, or commission inquiries:
- Open an issue on GitHub
- Contact via email
- DM on Discord

---

**Last Updated:** May 2026  
**Version:** 1.3.0
