/**
 * BLOG ARTICLES
 * ─────────────
 * To add a new article, copy the template below, fill in your details,
 * and paste it at the TOP of the `articles` array (newest first).
 *
 * Template:
 * {
 *   slug: "my-new-post",           // URL-safe unique ID (kebab-case, no spaces)
 *   title: "My New Post Title",
 *   date: "2026-05-14",            // ISO date string YYYY-MM-DD
 *   tag: "update",                 // One of: "update" | "project" | "tutorial" | "personal"
 *   summary: "Short one-sentence description shown on the card.",
 *   content: `Write your full post content here using plain text.
 * You can use multiple paragraphs — just leave a blank line between them.
 *
 * Links, bold, etc. are not supported in this simple mode.`,
 * },
 */

export type BlogTag = "update" | "project" | "tutorial" | "personal";

export type BlogArticle = {
  slug: string;
  title: string;
  date: string;
  tag: BlogTag;
  summary: string;
  content: string;
};

export const articles: BlogArticle[] = [
  {
    slug: "welcome-to-my-blog",
    title: "Welcome to My Blog",
    date: "2026-05-14",
    tag: "personal",
    summary: "The first post on my personal site — why I started writing and what you can expect here.",
    content: `Hey! Welcome to my blog section. This is a place where I'll share updates about my projects, tutorials, and whatever else I feel like writing about.

I built this site to have a place that feels like mine — not just a profile page, but somewhere I can actually put my thoughts.

Expect posts about Discord bots, web development, Roblox projects, and community stuff. Stay tuned!`,
  },
  {
    slug: "building-hetzel-workshop",
    title: "How I Built Hetzel's Workshop",
    date: "2026-04-20",
    tag: "project",
    summary: "A behind-the-scenes look at how I designed and launched my Discord server.",
    content: `Hetzel's Workshop started as a small community for friends and grew into something bigger than I expected.

The server uses a custom verification system, automated welcome messages, and a few bots I wrote myself in Node.js.

The hardest part was designing the channel structure — I went through about five different layouts before landing on something that felt clean and easy to navigate.

If you're thinking about starting your own community server, the biggest advice I'd give is: start small and add features as people actually ask for them. Don't try to build everything on day one.`,
  },
  {
    slug: "my-discord-bot-setup",
    title: "My Discord Bot Development Setup",
    date: "2026-03-10",
    tag: "tutorial",
    summary: "The tools and workflow I use to build and deploy Discord bots efficiently.",
    content: `People ask me a lot how I set up my bot development workflow, so here it is.

I write all my bots in Node.js using discord.js. I host them on a VPS (much cheaper than most managed services) with PM2 to keep them running.

For development, I use VS Code with a local test server. I have a separate bot token for development so I never accidentally push breaking changes to a live bot.

My folder structure usually looks like: commands/, events/, utils/, and a single index.js entry point. Simple, readable, and easy to debug.

Version control is just GitHub — push to main, pull on the VPS, restart PM2. Nothing fancy, but it works every time.`,
  },
];
