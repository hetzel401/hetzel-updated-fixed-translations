export type Language = "en" | "es" | "fr" | "de" | "pt" | "ja";

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English",    flag: "🇬🇧" },
  { code: "es", label: "Español",    flag: "🇪🇸" },
  { code: "fr", label: "Français",   flag: "🇫🇷" },
  { code: "de", label: "Deutsch",    flag: "🇩🇪" },
  { code: "pt", label: "Português",  flag: "🇧🇷" },
  { code: "ja", label: "日本語",      flag: "🇯🇵" },
];

export const translations = {
  en: {
    nav: {
      home:         "home",
      about:        "about",
      services:     "services",
      work:         "work",
      timeline:     "timeline",
      testimonials: "testimonials",
      faq:          "faq",
      discord:      "discord",
      contact:      "contact",
      blog:         "blog",
      available:    "available",
    },
    hero: {
      description:   "Independent student making projects, tools, Discord bots & Discord servers!",
      seeWork:       "See selected work",
      startProject:  "Start a project",
      scroll:        "scroll to descend",
    },
    home: {
      sectionLabel: "OVERVIEW",
      heading:      "Go deeper.",
      subheading:   "Story, work, and contact — each on its own page.",
      readMore:     "Open page",
    },
    about: {
      sectionLabel: "ABOUT ME",
      heading:      "Hey, I'm",
      bio1: "I'm a server designer, web developer, and Discord bot developer. I love making visual designs with clean code — high tier systems & polished interfaces, and bots that feel considered down to the last detail.",
      bio2: "Right now I'm focused on creating more advanced Discord bots for my servers, fun games and custom tooling for communities — things that stay out of the way and just feel good to use.",
      badges: ["Developer", "Designer", "Student"],
      stats: {
        yearsExp: "Years Exp.",
        ideas:    "Ideas",
        servers:  "Servers",
        members:  "Members",
      },
    },
    blog: {
      sectionLabel: "JOURNAL",
      heading: "Latest thoughts.",
      description: "Updates, tutorials, and behind-the-scenes looks at my projects.",
      readMore: "Read article",
      backToBlog: "Back to blog",
      publishedOn: "Published on",
    },
    services: {
      sectionLabel: "WHAT I OFFER",
      heading:      "Things I build",
      headingHighlight: "for you.",
      items: [
        {
          title:       "Discord Bots",
          description: "Custom bots tailored to your server — moderation, games, utilities, economy systems, and more. Built in Node.js with discord.js.",
          tags:        ["Node.js", "discord.js", "Custom commands"],
        },
        {
          title:       "Discord Server Design",
          description: "Full server setup: channel structure, roles, permissions, bots, verification, onboarding flows, and aesthetic branding.",
          tags:        ["Channel structure", "Roles & perms", "Branding"],
        },
        {
          title:       "Web Development",
          description: "Personal sites, portfolio pages, landing pages, and small web tools. Clean code, fast performance, and polished design.",
          tags:        ["React", "Vite", "Tailwind CSS"],
        },
        {
          title:       "Community Tools",
          description: "Custom tooling for Discord communities — welcome systems, reaction roles, ticket bots, levelling, and leaderboards.",
          tags:        ["Automation", "Community", "Engagement"],
        },
      ],
    },
    work: {
      sectionLabel: "FEATURED WORK",
      live:         "LIVE",
      upcoming:     "UPCOMING",
      projects: [
        {
          name:  "My Roblox Account",
          blurb: "My Roblox account.",
          cta:   "Visit Site",
        },
        {
          name:  "Hetzel's Workshop Roblox group",
          blurb: "A Roblox group for my friends and me to receive donations and to have fun!",
          cta:   "Preview",
        },
        {
          name:  "Hetzel's Workshop!",
          blurb: "My personal corner of the web — a server for fun, work, and making friends with glassy surfaces and subtle motion.",
          cta:   "View Website",
        },
      ],
    },
    timeline: {
      sectionLabel: "MY JOURNEY",
      heading:      "How I got here.",
      items: [
        {
          year:        "2023",
          title:       "First Discord Server",
          description: "Launched my first community server and started learning server design from scratch.",
        },
        {
          year:        "2024",
          title:       "Started Programming",
          description: "Wrote my first Discord bot in Node.js. It was messy but it worked — and I was hooked.",
        },
        {
          year:        "2025",
          title:       "Web Development",
          description: "Started building personal sites and web tools. Learned React, Vite, and Tailwind CSS.",
        },
        {
          year:        "Late 2025",
          title:       "Building Bots",
          description: "Went deeper into Discord bot development — economy systems, moderation tools, and custom community tooling.",
        },
        {
          year:        "Jan 2026",
          title:       "Hetzel's Workshop",
          description: "Launched Hetzel's Workshop in January 2026. Grew the community quickly and built custom bots and tools specifically for the server.",
        },
        {
          year:        "Now",
          title:       "Open for Work",
          description: "Taking on projects for communities and individuals. Always happy to build something new.",
        },
      ],
    },
    testimonials: {
      sectionLabel: "TESTIMONIALS",
      heading:      "What people say.",
      items: [
        {
          quote:  "Hetzel built us a bot that completely transformed how our server runs. Super fast turnaround and actually listened to what we needed.",
          author: "MIAQ",
          role:   "Server Owner",
          stars: 5,
        },
        {
          quote:  "Great bots — especially for tickets and carries. And an awesome server with cool people and a genuinely great community.",
          author: "nightshade",
          role:   "Executive @ Hetzel's Workshop",
          stars: 5,
        },
        {
          quote:  "Really impressed by the attention to detail. Every feature was thought through properly and the bot has been running flawlessly for months.",
          author: "badgy",
          role:   "Head of Administration @ Hetzel's Workshop",
          stars: 5,
        },
      ],
    },
    faq: {
      sectionLabel: "FAQ",
      heading:      "Common questions.",
      items: [
        {
          question: "How do I commission a Discord bot?",
          answer:   "Reach out via Discord or email with a description of what you need. I'll reply within 24 hours with a plan and timeline. Most bots take 1–3 days depending on complexity.",
        },
        {
          question: "Do you offer server setup services?",
          answer:   "Yes! I can set up your server from scratch or redesign an existing one. This includes channel structure, roles, permissions, bots, and branding. Message me to get started.",
        },
        {
          question: "What's your typical turnaround time?",
          answer:   "Small projects (single bot commands, quick fixes) are usually done same-day or next-day. Larger projects (full bot, server redesign) typically take 2–5 days.",
        },
        {
          question: "Do you do revisions?",
          answer:   "Absolutely. I work iteratively and want you to be happy with the result. I'll revise until it's right.",
        },
        {
          question: "Can I request something not listed in your services?",
          answer:   "Yes! If you have an idea, just ask. I enjoy building new things and will let you know if it's something I can do.",
        },
        {
          question: "Do you take payment?",
          answer:   "Some work I do for free, especially for community servers or interesting projects. For larger commissions, we can discuss compensation. I'm flexible.",
        },
      ],
    },
    discord: {
      sectionLabel: "DISCORD",
      heading:      "Join the server.",
      description:  "Hetzel's Workshop is my community server — a place for fun, gaming, and making friends. Everyone's welcome.",
    },
    stack: {
      sectionLabel: "STACK",
      heading:      "Tools I reach for.",
      items: [
        { label: "Code",                      note: "Node.js" },
        { label: "Personal learning tools",   note: "YouTube / GitHub" },
        { label: "VPS · Vercel",              note: "What I use to host" },
        { label: "VS CODE",                   note: "Coding platform" },
        { label: "Made by hetzel401!",        note: "Made by me!" },
        { label: "Made",                      note: "For you!" },
      ],
    },
    footer: {
      crafted: "crafted in the dark",
      status:  "system nominal",
      brandDescription: "Independent student building Discord bots, servers, and web projects with passion and precision.",
      statusTitle: "Status",
      statusItems: [
        { label: "Available for commissions", ok: true  },
        { label: "Discord bots — open",       ok: true  },
        { label: "Server design — open",      ok: true  },
        { label: "Web dev — limited slots",   ok: false },
      ],
      contactTitle: "Contact",
      builtWith: "Built with React & Tailwind CSS",
      allOperational: "All systems operational",
    },
    productsExtra: {
      sectionLabel: "FEATURED PRODUCTS",
      heading: "What I build & offer",
      description: "From Discord bots to full server setups — here's what's in Hetzel's Workshop.",
      items: [
        { name: "Hetzel's Workshop Discord", description: "A welcoming community server for gaming, bots, and fun. Over 1,500+ members strong with active channels and events.", badge: "Community", tags: ["Discord", "1500+ Members", "Active"] },
        { name: "Custom Discord Bots", description: "Fully tailored bots built from scratch — moderation, games, economy systems, reaction roles, levelling, and much more.", badge: "Service", tags: ["Node.js", "discord.js", "Custom"] },
        { name: "EFT Community Tools", description: "Tools, guides, and resources for Escape from Tarkov players and community members — all crafted with passion.", badge: "Gaming", tags: ["EFT", "Gaming", "Tools"] },
        { name: "Server Design Service", description: "End-to-end Discord server setup — channels, roles, bots, branding, and onboarding flows. Polished and professional.", badge: "Service", tags: ["Setup", "Design", "Branding"] },
      ],
    },
    stats: {
      sectionLabel: "COMMUNITY STATS",
      heading: "By the numbers",
      description: "Real figures from across Hetzel's Workshop and its projects.",
      items: [
        { label: "Discord Members", sub: "and growing" },
        { label: "Custom Bots Made", sub: "deployed & running" },
        { label: "Servers Designed", sub: "active communities" },
        { label: "Years Experience", sub: "since 2023" },
        { label: "Passion", sub: "all side projects" },
        { label: "Bot Uptime", sub: "on key servers" },
      ],
    },
    survey: {
      sectionLabel: "COMMUNITY SURVEY",
      heading: "Share your feedback",
      description: "5 quick questions to help me improve Hetzel's Workshop. Takes under 2 minutes.",
      introTitle: "Before we start\u2026",
      introText: "What should I call you? (Optional \u2014 you can stay anonymous)",
      nicknamePlaceholder: "Your Discord name / nickname",
      start: "Start survey",
      questionOf: "Question {step} of {total}",
      back: "\u2190 Back",
      next: "Next \u2192",
      submit: "Submit feedback \ud83d\ude80",
      submitting: "Submitting\u2026",
      skip: "Skip",
      thanks: "Thanks, {name}!",
      successText: "Your feedback has been sent to Hetzel's Workshop. I read every single response \u2014 thank you for helping me improve!",
      joinDiscord: "Join the Discord server",
      typeSuggestion: "Type your suggestions here\u2026",
      error: "Failed to submit. Check your connection and try again.",
    },
    contact: {
      sectionLabel: "CONTACT",
      heading: "Let's work together",
      description: "Have a project in mind? Send a message and I'll get back to you ASAP.",
      formName: "Your name",
      formEmail: "Email address",
      formMessage: "Message",
      namePlaceholder: "Hetzel401",
      emailPlaceholder: "you@example.com",
      messagePlaceholder: "Tell me about your project, server, or bot idea...",
      sendMessage: "Send Message",
      sending: "Sending\u2026",
      or: "or",
      dmOnDiscord: "DM on Discord",
      findMeOn: "Find me on",
      successTitle: "Message sent!",
      successText: "I'll get back to you as soon as possible.",
      sendAnother: "Send another",
      errorText: "Something went wrong. Try again or DM me on Discord.",
    },
    typewriter: [
      "I build websites, Discord bots & Discord servers.",
      "I handle multiple things at 1 time.",
      "I design software used in day-to-day lives.",
    ],
  },
  // ... (other languages would follow same structure, omitted for brevity)
} as const;

export type Translations = typeof translations.en;