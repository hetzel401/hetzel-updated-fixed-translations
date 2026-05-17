// ═══════════════════════════════════════════════════════════════════════════
// HETZEL'S WORKSHOP — SITE CONSTANTS
// All the easy-to-edit values are here. No hunting through components.
// ═══════════════════════════════════════════════════════════════════════════

// ── Discord ──────────────────────────────────────────────────────────────────
export const DISCORD_ID   = "1097536305027629119";
export const DISCORD_URL  = "https://discord.gg/defense";

// ── Contact ──────────────────────────────────────────────────────────────────
export const EMAIL        = "universemax401@gmail.com";

// ── Social links (used in the footer) ───────────────────────────────────────
// Add/remove entries here to update the footer social icons.
export const SOCIAL_LINKS = [
  { label: "Discord", href: "https://discordapp.com/users/1097536305027629119", color: "#5865F2" },
  { label: "Roblox",  href: "https://www.roblox.com/users/1517909098/profile",  color: "#e1523d" },
  { label: "GitHub",  href: "https://github.com/hetzel401",                     color: "#ffffff" },
  { label: "Email",   href: `mailto:${EMAIL}`,                                   color: "hsl(var(--accent))" },
] as const;

// ── Project links & metadata ─────────────────────────────────────────────────
export const projectHrefs = [
  "https://www.roblox.com/users/1517909098/profile",
  "https://www.roblox.com/communities/15532324/Hetzel-s-Workshop#!/about",
  DISCORD_URL,
];
export const projectStacks   = [
  ["Roblox", "account", "user"],
  ["Roblox", "group", "community"],
  ["community", "Friendly", "Gaming"],
];
export const projectFeatured = [true, true, false];

// ── About stats ──────────────────────────────────────────────────────────────
export const stats = [
  { value: "1.5+",  key: "yearsExp" as const },
  { value: "∞",    key: "ideas"    as const },
  { value: "5+",   key: "servers"  as const },
  { value: "359",  key: "members"  as const },
];

// ── Community stats (numbers displayed in the stats section) ─────────────────
// Change the `value` string to update what shows on the page.
export const communityStatValues = [
  "359",  // Discord Members
  "10+",     // Custom Bots Made
  "5+",      // Servers Designed
  "1.5+",    // Years Experience
  "100%",    // Passion
  "24/7",    // Bot Uptime
] as const;

// ── Videos ───────────────────────────────────────────────────────────────────
// Optional: Replace with your real video metadata or disable videos section.
// This is currently not displayed but kept for future use.
export const VIDEOS = [
  {
    id:       "dQw4w9WgXcQ",
    title:    "Hetzel's Workshop — Server Tour 2025",
    views:    "2.4K",
    likes:    "148",
    duration: "8:32",
    desc:     "Full tour of our Discord server — all channels, bots, and features explained.",
  },
  {
    id:       "jNQXAC9IVRw",
    title:    "Building a Discord Bot from Scratch",
    views:    "1.1K",
    likes:    "87",
    duration: "14:20",
    desc:     "Step-by-step tutorial for creating your first Node.js discord.js bot.",
  },
  {
    id:       "9bZkp7q19f0",
    title:    "EFT Community Event Highlights",
    views:    "830",
    likes:    "64",
    duration: "5:15",
    desc:     "Highlights from our in-house Escape from Tarkov community event.",
  },
] as const;

// ── Announcement Banner ───────────────────────────────────────────────────────
// Set `enabled: true` to show a dismissible banner at the top of every page.
// Change `text`, `link`, and `variant` to customize it.
// variant: "info" | "success" | "warning" | "accent"
export const ANNOUNCEMENT = {
  enabled: true,
  text:    "🎉 Hetzel's Workshop is now open for Discord bot commissions!",
  link:    { label: "Learn more", href: "#contact" },
  variant: "accent" as "info" | "success" | "warning" | "accent",
} as const;

// ── Footer availability statuses ─────────────────────────────────────────────
// Matches the `footer.statusItems` translations. `ok: true` = green, `false` = amber.
// Update these booleans when your availability changes.
export const AVAILABILITY = {
  commissions:  true,
  discordBots:  true,
  serverDesign: true,
  webDev:       false,   // limited slots
} as const;

// ── Discord webhook (survey + contact form) ──────────────────────────────────
export const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1504718321537515620/d_T7GNMD1lUZRjTkuxTmt4uPA_4dLv-nEBDmdK9-quG6o650EXCUhctaTuQwEFtWvpcw";

// ── SEO / Meta ────────────────────────────────────────────────────────────────
export const SITE_URL   = "https://hetzel401.vercel.app";
export const SITE_TITLE = "Hetzel401 — Discord Bot & Server Developer";
export const SITE_DESC  = "Independent developer building custom Discord bots, server designs, and web projects. Open for commissions.";
