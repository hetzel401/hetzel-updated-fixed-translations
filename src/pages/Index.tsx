import { useEffect, useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import Constellation from "@/components/Constellation";
import Nav from "@/components/Nav";
import DiscordProfileCard from "@/components/DiscordProfileCard";
import { SectionLabel } from "@/components/SectionLabel";
import DiscordProfile from "@/components/DiscordProfile";
import Typewriter from "@/components/Typewriter";
import { useLanguage } from "@/context/LanguageContext";
import { useCustomization } from "@/context/CustomizationContext";
import { DISCORD_ID, DISCORD_URL, stats, communityStatValues, DISCORD_WEBHOOK, SOCIAL_LINKS } from "@/lib/site-constants";
import useSectionReveal from "@/hooks/use-section-reveal";
import { useCountUp } from "@/hooks/use-count-up";
import MobileBottomNav from "@/components/MobileBottomNav";
import SectionDots from "@/components/SectionDots";
import YouTubeSection from "@/components/YouTubeSection";
import CopyDiscordTag from "@/components/CopyDiscordTag";
import SkillsMarquee from "@/components/SkillsMarquee";
import {
  ArrowUpRight, Bot, Globe, Wrench, Users, Terminal, Server, Cpu, Boxes, Sparkles, Send,
  Star, ChevronDown, ChevronUp, Github, Clock, Youtube,
  Zap, Gamepad2, Code2, Swords
} from "lucide-react";

const SECTION_OFFSET = { scrollMarginTop: 80 };
const BELOW_FOLD = "content-visibility-auto";

// ── Section: Hero ─────────────────────────────────────────────────────────

function HeroSection() {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 pt-28 pb-16 overflow-hidden">
      <div style={{ transform: `translateY(${scrollY * 0.35}px)`, willChange: "transform" }} className="absolute inset-0">
        <Constellation />
      </div>
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center animate-fade-up">
        <div className="mb-8">
          <DiscordProfile userId={DISCORD_ID} />
        </div>
        <h1 className="font-feminine text-5xl tracking-[0.14em] sm:text-7xl md:text-9xl">
          <span className="text-shimmer">Hetzel401</span>
        </h1>
        <div className="mt-6 terminal-chip">
          <Typewriter />
        </div>
        <p className="mx-auto mt-6 max-w-xl text-balance text-muted-foreground md:text-lg">
          {t.hero.description}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          <a
            href="#products"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-all hover:bg-foreground/90 hover:scale-105 sm:w-auto"
          >
            {t.hero.seeWork} <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="#contact"
            className="btn-grad-border inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary/50 px-6 py-3.5 text-sm font-semibold backdrop-blur transition-all hover:scale-105 sm:w-auto"
          >
            <Send className="h-4 w-4" /> {t.hero.startProject}
          </a>
        </div>
        <div className="mt-16 flex items-center gap-2 font-mono text-xs text-muted-foreground animate-bounce">
          <ChevronDown className="h-4 w-4" /> {t.hero.scroll}
        </div>
      </div>
    </section>
  );
}

// ── Animated Stat Card ──────────────────────────────────────────────────

function AnimatedStatCard({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const numericPart = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
  const suffix = value.replace(/[0-9.]/g, "");
  const isNumeric = numericPart > 0 && !["∞", "100%", "24/7"].includes(value);
  const animated = useCountUp(numericPart, 1200, visible);
  const hasDecimal = value.includes(".");

  const displayValue = !visible
    ? "0"
    : isNumeric
      ? (hasDecimal ? animated.toFixed(1) : Math.round(animated).toString()) + suffix
      : value;

  return (
    <div ref={ref} className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-5 card-hover sm:p-6 md:p-8">
      <div className="card-inner-glow" />
      <div className="relative">
        <div className="font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
          {displayValue}
        </div>
        <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
          {label}
        </div>
      </div>
    </div>
  );
}

// ── Section: About Me ────────────────────────────────────────────────────

const stackIcons = [Terminal, Boxes, Server, Cpu, Sparkles, Send];

function AboutSection() {
  const { t } = useLanguage();
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-28 reveal-on-scroll" style={SECTION_OFFSET}>
      <SectionLabel label={t.about.sectionLabel} />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {/* Bio card */}
        <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-card/60 p-6 shadow-[0_0_60px_-20px_hsl(var(--accent)/0.6)] backdrop-blur sm:p-8 md:p-10">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
          <h2 className="font-display text-2xl font-semibold sm:text-3xl md:text-4xl">
            {t.about.heading} <span className="text-accent">Hetzel401</span>.
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">{t.about.bio1}</p>
          <p className="mt-4 text-muted-foreground leading-relaxed">{t.about.bio2}</p>

          {/* Badges */}
          <div className="mt-6 flex flex-wrap gap-2">
            {t.about.badges.map((b) => (
              <span key={b} className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {stats.map((s) => (
            <AnimatedStatCard key={s.key} value={s.value} label={t.about.stats[s.key]} />
          ))}
        </div>
      </div>

      {/* Stack */}
      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {t.stack.items.map(({ label, note }, idx) => {
          const Icon = stackIcons[idx];
          return (
            <div key={label} className="stagger-child group flex items-center gap-4 rounded-xl border border-border bg-card/40 p-5 transition-all card-hover">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-accent transition-colors group-hover:bg-accent/20">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate">{label}</div>
                <div className="font-mono text-xs text-muted-foreground truncate">{note}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Section: My Journey / Timeline ───────────────────────────────────────

function TimelineSection() {
  const { t } = useLanguage();
  return (
    <section id="journey" className="relative mx-auto max-w-4xl px-6 py-28 reveal-on-scroll" style={SECTION_OFFSET}>
      <SectionLabel label={t.timeline.sectionLabel} />
      <h2 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        {t.timeline.heading}
      </h2>
      <div className="mt-12 space-y-6 border-l border-border pl-8">
        {t.timeline.items.map((item, idx) => (
          <div key={idx} className="relative">
            <span className="absolute -left-[33px] top-1.5 h-3 w-3 rounded-full bg-accent ring-4 ring-background" />
            <div className="font-mono text-xs text-accent tracking-wider">{item.year}</div>
            <h3 className="mt-1 font-display text-xl font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-xl">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Section: Featured Products ───────────────────────────────────────────

const serviceIcons = [Bot, Globe, Wrench, Users];

function FeaturedProductsSection() {
  const { t } = useLanguage();
  const productData = t.productsExtra;
  const productMeta = [
    { icon: Users, href: "https://discord.gg/defense", gradient: "from-[#5865F2]/20 via-transparent to-transparent" },
    { icon: Bot, href: "#contact", gradient: "from-accent/20 via-transparent to-transparent" },
    { icon: Swords, href: "#contact", gradient: "from-[#f59e0b]/20 via-transparent to-transparent" },
    { icon: Wrench, href: "#contact", gradient: "from-[#34d399]/20 via-transparent to-transparent" },
  ];

  return (
    <section id="products" className="relative mx-auto max-w-6xl px-6 py-28 reveal-on-scroll" style={SECTION_OFFSET}>
      <SectionLabel label={productData.sectionLabel} />
      <h2 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        {productData.heading}
      </h2>
      <p className="mt-3 max-w-xl text-muted-foreground">
        {productData.description}
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {productData.items.map((p, idx) => {
          const Icon = productMeta[idx].icon;
          const { href, gradient } = productMeta[idx];
          return (
            <a
              key={p.name}
              href={href}
              target={href.startsWith("http") ? "_blank" : "_self"}
              rel="noreferrer noopener"
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-7 card-hover transition-all flex flex-col"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />
              <div className="card-inner-glow" />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
                    {p.badge}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <span key={tag} className="rounded-md border border-border bg-secondary/60 px-3 py-1 font-mono text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-5 inline-flex items-center gap-1.5 font-medium text-sm text-accent">
                  {t.home.readMore} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

// ── Section: Community Stats ─────────────────────────────────────────────

// Values live in site-constants.ts — easy to update without touching JSX
const communityStatIcons = [Users, Bot, Server, Clock, Star, Zap];

function CommunityStatsSection() {
  const { t } = useLanguage();
  const s = t.stats;
  return (
    <section id="stats" className={`relative mx-auto max-w-6xl px-6 py-28 reveal-on-scroll ${BELOW_FOLD}`} style={SECTION_OFFSET}>
      <SectionLabel label={s.sectionLabel} />
      <h2 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        {s.heading}
      </h2>
      <p className="mt-3 max-w-xl text-muted-foreground">
        {s.description}
      </p>

      <div className="mt-12 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
        {communityStatIcons.map((Icon, idx) => (
          <div key={idx} className="stagger-child group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-7 card-hover">
            <div className="card-inner-glow" />
            <div className="relative flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <div className="font-display text-3xl font-bold tracking-tight text-foreground">{communityStatValues[idx]}</div>
                <div className="font-medium text-sm mt-0.5">{s.items[idx]?.label}</div>
                <div className="font-mono text-xs text-muted-foreground mt-0.5">{s.items[idx]?.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Section: Testimonials ────────────────────────────────────────────────

function TestimonialsSection() {
  const { t } = useLanguage();
  const testimonialData = t.testimonials;

  return (
    <section id="testimonials" className={`relative mx-auto max-w-6xl px-6 py-28 reveal-on-scroll ${BELOW_FOLD}`} style={SECTION_OFFSET}>
      <SectionLabel label={testimonialData.sectionLabel} />
      <h2 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        {testimonialData.heading}
      </h2>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
        {testimonialData.items.map((item, idx) => (
          <div key={idx} className="stagger-child group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-5 card-hover flex flex-col sm:p-7">
            <div className="card-inner-glow" />
            <div className="relative flex flex-col h-full">
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: item.stars }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="mb-4 font-display text-4xl leading-none text-accent/30 select-none">"</div>
              <p className="flex-1 text-sm text-muted-foreground leading-relaxed italic">{item.quote}</p>
              <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 font-display font-bold text-accent text-sm">
                  {item.author[0]}
                </div>
                <div>
                  <div className="font-medium text-sm">{item.author}</div>
                  <div className="font-mono text-xs text-muted-foreground">{item.role}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Section: FAQ ─────────────────────────────────────────────────────────

function FAQSection() {
  const { t } = useLanguage();
  const faqData = t.faq;

  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section id="faq" className={`relative mx-auto max-w-3xl px-6 py-28 reveal-on-scroll ${BELOW_FOLD}`} style={SECTION_OFFSET}>
      <SectionLabel label={faqData.sectionLabel} />
      <h2 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        {faqData.heading}
      </h2>

      <div className="mt-12 space-y-3">
        {faqData.items.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`overflow-hidden rounded-2xl border transition-all ${isOpen ? "border-accent/40 bg-card/70" : "border-border bg-card/40"}`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="flex w-full items-center justify-between gap-4 p-6 text-left"
              >
                <span className="font-medium">{item.question}</span>
                <span className="shrink-0 text-accent">
                  {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-border/60 px-6 pb-6 pt-4 text-sm text-muted-foreground leading-relaxed animate-fade-in">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Section: Contact Form ────────────────────────────────────────────────

function ContactSection() {
  const { t } = useLanguage();
  const c = t.contact;
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "📬 Contact Form",
          avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
          embeds: [
            {
              title: "📨 New Contact Form Submission",
              color: 0x8b5cf6,
              fields: [
                { name: "👤 Name",    value: form.name    || "Not provided", inline: true  },
                { name: "📧 Email",   value: form.email   || "Not provided", inline: true  },
                { name: "💬 Message", value: form.message || "Not provided", inline: false },
              ],
              footer: { text: "Hetzel's Workshop · Contact Form" },
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className={`relative mx-auto max-w-4xl px-6 py-28 reveal-on-scroll ${BELOW_FOLD}`} style={SECTION_OFFSET}>
      <SectionLabel label={c.sectionLabel} />
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card/60 p-6 sm:p-10 md:p-16 sm:rounded-3xl relative">
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
          {c.heading}
        </h2>
        <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base md:text-lg">
          {c.description}
        </p>

        {status === "sent" ? (
          <div className="mt-10 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
            <div className="text-4xl mb-3">✅</div>
            <div className="font-display text-xl font-semibold text-emerald-400">{c.successTitle}</div>
            <p className="mt-2 text-sm text-muted-foreground">{c.successText}</p>
            <button onClick={() => setStatus("idle")} className="mt-4 font-mono text-xs text-muted-foreground underline underline-offset-2">
              {c.sendAnother}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs text-muted-foreground">{c.formName}</label>
                <input
                  type="text" required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder={c.namePlaceholder}
                  className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs text-muted-foreground">{c.formEmail}</label>
                <input
                  type="email" required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder={c.emailPlaceholder}
                  className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/20"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs text-muted-foreground">{c.formMessage}</label>
              <textarea
                required rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder={c.messagePlaceholder}
                className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/20"
              />
            </div>

            {status === "error" && (
              <p className="font-mono text-xs text-rose-400">{c.errorText}</p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit" disabled={status === "sending"}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background transition-all hover:bg-foreground/90 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "sending" ? (
                  <><span className="animate-spin">⏳</span> {c.sending}</>
                ) : (
                  <><Send className="h-4 w-4" /> {c.sendMessage}</>
                )}
              </button>
              <span className="font-mono text-xs text-muted-foreground">{c.or}</span>
              <a
                href="https://discordapp.com/users/1097536305027629119"
                target="_blank" rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full bg-[#5865F2]/90 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#5865F2] hover:scale-105"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.7 19.7 0 0 0 3.677 4.37.077.077 0 0 0 3.65 4.487c.72 10.795 5.098 16.793 9.3 17.773.5.084 1.002.084 1.501 0 4.203-.98 8.581-6.978 9.3-17.773.015-.12-.005-.243-.05-.36z" />
                </svg>
                {c.dmOnDiscord}
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border/60 pt-6 sm:gap-3">
              <span className="font-mono text-xs text-muted-foreground w-full sm:w-auto">{c.findMeOn}</span>
              <a href="https://www.youtube.com/@Hetzel401" target="_blank" rel="noreferrer noopener" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary/40 text-[#FF0000] transition-all hover:scale-110 active:scale-95">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="https://www.roblox.com/users/1517909098/profile" target="_blank" rel="noreferrer noopener" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary/40 text-[#e1523d] transition-all hover:scale-110 active:scale-95">
                <Gamepad2 className="h-5 w-5" />
              </a>
              <a href="https://github.com/hetzel401" target="_blank" rel="noreferrer noopener" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary/40 text-white transition-all hover:scale-110 active:scale-95">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://discordapp.com/users/1097536305027629119" target="_blank" rel="noreferrer noopener" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary/40 text-[#5865F2] transition-all hover:scale-110 active:scale-95">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.7 19.7 0 0 0 3.677 4.37.077.077 0 0 0 3.65 4.487c.72 10.795 5.098 16.793 9.3 17.773.5.084 1.002.084 1.501 0 4.203-.98 8.581-6.978 9.3-17.773.015-.12-.005-.243-.05-.36z" />
                </svg>
              </a>
              <a href="mailto:universemax401@gmail.com" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary/40 text-accent transition-all hover:scale-110 active:scale-95">
                <Send className="h-5 w-5" />
              </a>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

// ── Section: Questionnaire ───────────────────────────────────────────────

type QuestionType = "rating" | "radio" | "textarea";

interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options?: string[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What do you think of Hetzel's Workshop overall?",
    type: "rating",
  },
  {
    id: 2,
    text: "Which of my projects do you like the most?",
    type: "radio",
    options: ["Hetzel's Workshop Discord", "My Discord bots", "EFT-related work", "My web projects", "All equally!"],
  },
  {
    id: 3,
    text: "What feature or improvement would you most like to see added to my Discord bots?",
    type: "radio",
    options: ["Economy system improvements", "Better moderation tools", "Mini-games & fun commands", "Custom levelling & XP", "Music / media commands", "Something else (tell me below!)"],
  },
  {
    id: 4,
    text: "What do you think is the best part of Hetzel's Workshop?",
    type: "radio",
    options: ["The community vibe", "The Discord bots", "The EFT section", "The events & activities", "The web presence", "Everything!"],
  },
  {
    id: 5,
    text: "What suggestions do you have to help me improve my projects and community?",
    type: "textarea",
  },
];

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const { t } = useLanguage();
  const labels = t.survey.ratingLabels as readonly string[];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(s)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className="h-9 w-9 transition-colors"
              style={{
                fill: s <= (hovered || value) ? "#fbbf24" : "transparent",
                color: s <= (hovered || value) ? "#fbbf24" : "hsl(var(--border))",
              }}
            />
          </button>
        ))}
        {(hovered || value) > 0 && (
          <span className="ml-2 font-mono text-sm text-amber-400">{labels[hovered || value]}</span>
        )}
      </div>
    </div>
  );
}

function QuestionnaireSection() {
  const { t } = useLanguage();
  const sv = t.survey;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [sending, setSending] = useState(false);
  const [nickname, setNickname] = useState("");

  const current = QUESTIONS[step - 1];
  const progress = step === 0 ? 0 : (step / QUESTIONS.length) * 100;

  const setAnswer = (id: number, val: string) => setAnswers((a) => ({ ...a, [id]: val }));
  const canNext = step === 0
    ? true
    : current?.type === "rating"
      ? !!answers[current.id]
      : !!answers[current.id];

  const handleFinish = async () => {
    setSending(true);
    try {
      const fields = QUESTIONS.map((q) => ({
        name: `Q${q.id}: ${q.text}`,
        value: answers[q.id]
          ? (q.type === "rating" ? `${"⭐".repeat(Number(answers[q.id]))} (${answers[q.id]}/5)` : answers[q.id])
          : "Not answered",
        inline: false,
      }));

      await fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "📊 Survey Bot",
          avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
          embeds: [
            {
              title: "📋 New Survey Response",
              description: `Submitted by **${nickname || sv.anonymous}**`,
              color: 0x8b5cf6,
              fields,
              footer: { text: "Hetzel's Workshop · Community Survey" },
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });
      setStep(6);
    } catch {
      alert(sv.error);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="questionnaire" className={`relative mx-auto max-w-2xl px-6 py-28 reveal-on-scroll ${BELOW_FOLD}`} style={SECTION_OFFSET}>
      <SectionLabel label={sv.sectionLabel} />
      <h2 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        {sv.heading}
      </h2>
      <p className="mt-3 text-muted-foreground">
        {sv.description}
      </p>

      <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card/60 backdrop-blur">
        {step > 0 && step < 6 && (
          <div className="h-1 bg-secondary/60">
            <div
              className="h-1 transition-all duration-500"
              style={{ width: `${progress}%`, background: "hsl(var(--accent))" }}
            />
          </div>
        )}

        <div className="p-8 md:p-10">
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <div className="text-4xl">👋</div>
              <div>
                <h3 className="font-display text-2xl font-semibold">{sv.introTitle}</h3>
                <p className="mt-2 text-muted-foreground">
                  {sv.introText}
                </p>
              </div>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={sv.nicknamePlaceholder}
                className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/20"
              />
              <button
                onClick={() => setStep(1)}
                className="self-start inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background transition-all hover:bg-foreground/90 hover:scale-105"
              >
                {sv.start} <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {step >= 1 && step <= 5 && current && (
            <div className="flex flex-col gap-6">
              <div>
                <div className="font-mono text-xs text-muted-foreground mb-2">
                  {sv.questionOf.replace("{step}", String(step)).replace("{total}", String(QUESTIONS.length))}
                </div>
                <h3 className="font-display text-xl font-semibold leading-snug">{current.text}</h3>
              </div>

              {current.type === "rating" && (
                <StarRating
                  value={Number(answers[current.id] ?? 0)}
                  onChange={(v) => setAnswer(current.id, String(v))}
                />
              )}

              {current.type === "radio" && current.options && (
                <div className="flex flex-col gap-2.5">
                  {current.options.map((opt) => {
                    const selected = answers[current.id] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAnswer(current.id, opt)}
                        className="flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all"
                        style={
                          selected
                            ? {
                                borderColor: "hsl(var(--accent) / 0.8)",
                                background: "hsl(var(--accent) / 0.1)",
                                color: "hsl(var(--foreground))",
                              }
                            : {
                                borderColor: "hsl(var(--border))",
                                background: "hsl(var(--card) / 0.4)",
                                color: "hsl(var(--muted-foreground))",
                              }
                        }
                      >
                        <span
                          className="h-4 w-4 rounded-full border-2 shrink-0 transition-colors"
                          style={{
                            borderColor: selected ? "hsl(var(--accent))" : "hsl(var(--border))",
                            background: selected ? "hsl(var(--accent))" : "transparent",
                          }}
                        />
                        <span className="text-sm">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {current.type === "textarea" && (
                <textarea
                  rows={5}
                  value={answers[current.id] ?? ""}
                  onChange={(e) => setAnswer(current.id, e.target.value)}
                  placeholder={sv.typeSuggestion}
                  className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/20"
                />
              )}

              <div className="flex items-center gap-3">
                {step > 1 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                  >
                    {sv.back}
                  </button>
                )}
                {step < QUESTIONS.length ? (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canNext}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-2.5 text-sm font-semibold text-background transition-all hover:bg-foreground/90 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sv.next}
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    disabled={sending || !canNext}
                    className="inline-flex items-center gap-2 rounded-full px-7 py-2.5 text-sm font-semibold text-background transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: "hsl(var(--accent))" }}
                  >
                    {sending ? sv.submitting : sv.submit}
                  </button>
                )}

                {!canNext && current.type !== "rating" && (
                  <button
                    onClick={() => step < QUESTIONS.length ? setStep((s) => s + 1) : handleFinish()}
                    className="font-mono text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                  >
                    {sv.skip}
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="flex flex-col items-center gap-4 text-center py-6">
              <div className="text-6xl animate-bounce">🎉</div>
              <h3 className="font-display text-2xl font-semibold">{sv.thanks.replace("{name}", nickname || "friend")}</h3>
              <p className="text-muted-foreground max-w-sm">
                {sv.successText}
              </p>
              <a
                href="https://discord.gg/defense"
                target="_blank" rel="noreferrer noopener"
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#5865F2]/90 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#5865F2] hover:scale-105"
              >
                {sv.joinDiscord}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Section: Footer with Social Links ───────────────────────────────────

/** Maps a social link label to its icon JSX */
// ── Section: Discord Server + Profile GUI ───────────────────────────────

function DiscordGUISection() {
  const [tab, setTab] = useState<"server" | "profile">("server");
  const [inviteData, setInviteData] = useState<{
    members: number;
    online: number;
    description?: string;
    iconUrl?: string;
    name?: string;
  } | null>(null);
  const [inviteLoading, setInviteLoading] = useState(true);
  const { t } = useLanguage();

  // Touch swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      setTab(dx > 0 ? "server" : "profile");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://discord.com/api/v9/invites/defense?with_counts=true", { signal: controller.signal })
      .then((r) => r.json())
      .then((json) => {
        if (json?.approximate_member_count != null) {
          const iconHash = json.guild?.icon;
          const iconUrl = iconHash
            ? `https://cdn.discordapp.com/icons/${json.guild.id}/${iconHash}.${iconHash.startsWith("a_") ? "gif" : "png"}?size=128`
            : undefined;

          setInviteData({
            members: json.approximate_member_count,
            online: json.approximate_presence_count ?? 0,
            description: json.guild?.description ?? "A supportive community for Discord bots, server design, and custom development.",
            iconUrl,
            name: json.guild?.name ?? "Hetzel's Workshop",
          });
        }
      })
      .catch(() => {})
      .finally(() => setInviteLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <section
      id="discord"
      className="reveal-on-scroll relative mx-auto max-w-6xl px-6 py-28"
      style={{ scrollMarginTop: 80 }}
    >
      <SectionLabel label="DISCORD" />
      <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl md:text-5xl">
        Find me on{" "}
        <span
          className="text-gradient-brand"
          style={{ background: "linear-gradient(135deg, #5865F2, #eb459e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          Discord
        </span>
      </h2>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
        Live Discord data — server stats, my profile, current status and activity, all in real time.
      </p>

      {/* Tab switcher */}
      <div
        className="mt-8 inline-flex items-center gap-1 rounded-xl p-1"
        style={{ background: "#1e1f22", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {(["server", "profile"] as const).map((id) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold capitalize transition-all sm:px-5"
            style={
              tab === id
                ? { background: "#5865F2", color: "#fff" }
                : { color: "#b5bac1" }
            }
          >
            {id === "server" ? "\uD83C\uDFF0 Server" : "\uD83D\uDC64 Profile"}
          </button>
        ))}
      </div>

      {/* Swipe hint on mobile */}
      <p className="mt-2 font-mono text-[10px] text-muted-foreground/50 sm:hidden">Swipe to switch tabs</p>

      {/* Panel */}
      <div
        className="mt-4 flex justify-center sm:mt-6"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {tab === "server" ? (
          <div className="w-full max-w-3xl">
            <div
              className="rounded-2xl border border-border bg-[#24262b] p-5 shadow-2xl sm:rounded-3xl sm:p-6"
              style={{ minHeight: 280 }}
            >
              <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-[#1f2330] sm:h-20 sm:w-20 sm:rounded-3xl">
                    {inviteData?.iconUrl ? (
                      <img src={inviteData.iconUrl} alt={inviteData.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-2xl font-semibold text-white sm:text-3xl">H</span>
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#94a3b8] sm:text-sm">
                      Discord Community
                    </div>
                    <h3 className="mt-1 text-xl font-semibold text-white sm:mt-2 sm:text-3xl">
                      {inviteData?.name ?? "Hetzel's Workshop"}
                    </h3>
                  </div>
                </div>
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#5865F2] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#4752c4] active:scale-95 sm:w-auto"
                >
                  Join Server
                </a>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:mt-6">
                {inviteData?.description ?? "A supportive community for Discord bots, server design, and custom development."}
              </p>

              <div className="mt-6 grid gap-3 grid-cols-2 sm:mt-8 sm:gap-4">
                <div className="rounded-xl bg-[#1e1f22] px-4 py-3 sm:rounded-2xl sm:px-5 sm:py-4">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#94a3b8] sm:text-xs">Members</div>
                  <div className="mt-1 text-2xl font-semibold text-white sm:mt-2 sm:text-3xl">
                    {inviteLoading ? "..." : inviteData?.members.toLocaleString() ?? "n/a"}
                  </div>
                </div>
                <div className="rounded-xl bg-[#1e1f22] px-4 py-3 sm:rounded-2xl sm:px-5 sm:py-4">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#94a3b8] sm:text-xs">Online now</div>
                  <div className="mt-1 text-2xl font-semibold text-white sm:mt-2 sm:text-3xl">
                    {inviteLoading ? "..." : inviteData?.online.toLocaleString() ?? "n/a"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <DiscordProfileCard />
        )}
      </div>

      {/* Footnote */}
      <p className="mt-4 text-center font-mono text-xs text-muted-foreground">
        Live data via{" "}
        <a
          href="https://lanyard.rest"
          target="_blank" rel="noreferrer noopener"
          className="underline underline-offset-2 hover:text-foreground"
        >
          Lanyard API
        </a>{" "}
        · Updates every 30s
      </p>
      <div className="mt-4 flex justify-center">
        <CopyDiscordTag tag="hetzel401" />
      </div>
    </section>
  );
}

function SocialIcon({ label }: { label: string }) {
  if (label === "Discord") return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.7 19.7 0 0 0 3.677 4.37.077.077 0 0 0 3.65 4.487c.72 10.795 5.098 16.793 9.3 17.773.5.084 1.002.084 1.501 0 4.203-.98 8.581-6.978 9.3-17.773.015-.12-.005-.243-.05-.36z" />
    </svg>
  );
  if (label === "YouTube") return <Youtube className="h-5 w-5" />;
  if (label === "Roblox")  return <Gamepad2 className="h-5 w-5" />;
  if (label === "GitHub")  return <Github className="h-5 w-5" />;
  return <Send className="h-5 w-5" />;
}

function FullFooter() {
  const { t } = useLanguage();
  const f = t.footer;
  return (
    <footer className="border-t border-border/60 bg-card/30 backdrop-blur reveal-on-scroll">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 font-mono text-lg font-bold">
              <Code2 className="h-5 w-5 text-accent" />
              Hetzel401
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              {f.brandDescription}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : "_self"}
                  rel="noreferrer noopener"
                  title={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary/40 transition-all hover:scale-110"
                  style={{ color: s.color, borderColor: `${s.color}30` }}
                >
                  <SocialIcon label={s.label} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">{f.statusTitle}</div>
            <div className="space-y-3">
              {f.statusItems.map(({ label, ok }) => (
                <div key={label} className="flex items-center gap-2 font-mono text-sm">
                  <span className={`h-2 w-2 rounded-full ${ok ? "bg-emerald-400" : "bg-amber-400"}`} />
                  <span className="text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-accent/20 bg-accent/5 p-4">
              <div className="font-mono text-xs text-muted-foreground mb-1">{f.contactTitle}</div>
              <a href="mailto:universemax401@gmail.com" className="font-mono text-sm text-accent hover:underline">
                universemax401@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border/60 pt-8 flex flex-col items-center justify-between gap-3 font-mono text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} Hetzel401 · {f.builtWith}</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {f.allOperational}
          </span>
        </div>
      </div>
    </footer>
  );
}

// ── Main Page ────────────────────────────────────────────────────────

export default function Index() {
  useSectionReveal();
  return (
    <div id="top" className="relative min-h-screen overflow-x-hidden bg-background text-foreground pb-16 sm:pb-0">
      <Helmet>
        <title>Hetzel401 — Discord Bot & Server Developer</title>
        <meta name="description" content="Independent developer building custom Discord bots, server designs, and web projects. Open for commissions." />
        <meta property="og:title" content="Hetzel401 — Discord Bot & Server Developer" />
        <meta property="og:description" content="Independent developer building custom Discord bots, server designs, and web projects. Open for commissions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hetzel401.vercel.app" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hetzel401 — Discord Bot & Server Developer" />
        <meta name="twitter:description" content="Independent developer building custom Discord bots, server designs, and web projects. Open for commissions." />
        <meta name="twitter:image" content="/og-image.png" />
        <link rel="canonical" href="https://hetzel401.vercel.app" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Hetzel401",
            "url": "https://hetzel401.vercel.app",
            "jobTitle": "Discord Bot & Server Developer",
            "sameAs": [
              "https://github.com/hetzel401",
              "https://www.youtube.com/@Hetzel401",
              "https://discordapp.com/users/1097536305027629119"
            ]
          }
        `}</script>
      </Helmet>
      {/* Skip to content - accessibility */}
      <a
        href="#about"
        className="fixed left-4 top-2 z-[999] -translate-y-full rounded-lg bg-accent px-4 py-2 font-mono text-sm text-background transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Nav />
      <HeroSection />
      <AboutSection />
      <SkillsMarquee />
      <TimelineSection />
      <FeaturedProductsSection />
      <CommunityStatsSection />
      <TestimonialsSection />
      <YouTubeSection />
      <FAQSection />
      <ContactSection />
      <DiscordGUISection />
      <QuestionnaireSection />
      <FullFooter />
      <SectionDots />
      <MobileBottomNav />
    </div>
  );
}
