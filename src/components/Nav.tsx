import { useState, useRef, useEffect } from "react";
import { Code2, Globe, Menu, X, ClipboardList } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { useLanyardContext } from "@/context/LanyardContext";
import { LANGUAGES, Language } from "@/i18n/translations";

const STATUS_DOT: Record<string, string> = {
  online:  "#23a55a",
  idle:    "#f0b232",
  dnd:     "#f23f43",
  offline: "#80848e",
};
const STATUS_TEXT: Record<string, string> = {
  online:  "Online",
  idle:    "Away",
  dnd:     "Busy",
  offline: "Offline",
};

const DiscordIcon = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.032.019.063.041.082a19.921 19.921 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .041-.082c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
  </svg>
);

const Nav = () => {
  const { t, language, setLanguage } = useLanguage();
  const { data: lanyard } = useLanyardContext();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loc] = useLocation();
  const status = (lanyard?.discord_status ?? "offline") as keyof typeof STATUS_DOT;

  const isHome = loc === "/" || loc === "";

  const anchorLinks = [
    { href: "#about",         label: t.nav.about    },
    { href: "#journey",       label: t.nav.timeline },
    { href: "#products",      label: t.nav.work     },
    { href: "#discord",       label: "Discord"      },
    { href: "#contact",       label: t.nav.contact  },
  ];

  const mobileExtras = [
    { href: "https://www.youtube.com/@Hetzel401",                  label: "YouTube"  },
    { href: "https://www.roblox.com/users/1517909098/profile",     label: "Roblox"   },
    { href: "https://github.com/hetzel401",                        label: "GitHub"   },
    { href: "https://discordapp.com/users/1097536305027629119",    label: "Discord"  },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [loc]);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const current = LANGUAGES.find((l) => l.code === language);

  const pillCls = "rounded-full px-3 py-1.5 font-mono text-xs whitespace-nowrap transition-colors text-muted-foreground hover:bg-secondary hover:text-foreground";

  return (
    <header className="fixed left-1/2 top-4 z-50 w-full max-w-5xl -translate-x-1/2 px-4">
      {/* ── Desktop nav ─────────────────────────────────────────── */}
      <nav className="glass flex items-center gap-1.5 rounded-full px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">

        {/* Brand */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-full bg-secondary px-3 py-1.5 font-mono text-sm font-semibold mr-1"
        >
          <Code2 className="h-4 w-4 text-accent" />
          <span className="hidden tracking-widest sm:inline">Hetzel401</span>
        </Link>

        {/* ── Anchor links (desktop, home only) ─── */}
        <div className="hidden items-center gap-0.5 xl:flex">
          {anchorLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => scrollTo(e, l.href)} className={pillCls}>
              {l.label}
            </a>
          ))}
        </div>

        {/* ── Condensed links for md–xl ─── */}
        <div className="hidden items-center gap-0.5 md:flex xl:hidden">
          {anchorLinks.slice(0, 3).map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => scrollTo(e, l.href)} className={pillCls}>
              {l.label}
            </a>
          ))}
          {/* "More" dropdown for the rest */}
          <div className="relative">
            <button className={pillCls + " flex items-center gap-1"} onClick={() => setLangOpen((v) => !v)}>
              more ▾
            </button>
          </div>
        </div>

        {/* Push right */}
        <div className="flex-1" />

        {/* Survey pill */}
        <a
          href={isHome ? "#questionnaire" : "/#questionnaire"}
          onClick={(e) => isHome && scrollTo(e, "#questionnaire")}
          className="hidden shrink-0 items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 font-mono text-xs text-accent transition-all hover:bg-accent/20 sm:flex"
        >
          <ClipboardList className="h-3.5 w-3.5" />
          Survey
        </a>

        {/* Status pill */}
        <a
          href="#discord"
          onClick={(e) => scrollTo(e, "#discord")}
          className="hidden shrink-0 items-center gap-2 rounded-full bg-secondary px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground sm:flex"
          title="Discord status"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            {status === "online" && (
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                style={{ background: STATUS_DOT[status] }}
              />
            )}
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ background: STATUS_DOT[status] }}
            />
          </span>
          <span className="hidden lg:inline">{STATUS_TEXT[status]}</span>
          {/* Avatar */}
          {lanyard?.discord_user?.avatar && (
            <img
              src={`https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.png?size=32`}
              alt=""
              className="h-5 w-5 rounded-full object-cover"
            />
          )}
        </a>

        {/* Language picker */}
        <div ref={dropdownRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setLangOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Language"
          >
            <Globe className="h-3.5 w-3.5 text-accent" />
            <span>{current?.flag}</span>
          </button>

          {langOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 min-w-[9rem] overflow-hidden rounded-xl border border-border bg-card shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => { setLanguage(lang.code as Language); setLangOpen(false); }}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 font-mono text-xs transition-colors hover:bg-secondary ${lang.code === language ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                  {lang.code === language && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground md:hidden"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {/* ── Mobile drawer ──────────────────────────────────────── */}
      {mobileOpen && (
        <div className="mt-2 w-full overflow-hidden rounded-2xl border border-border bg-card/95 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur md:hidden animate-fade-in">
          <ul className="flex flex-col gap-1">

            {/* Page nav */}
            {anchorLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => scrollTo(e, l.href)}
                  className="flex items-center rounded-lg px-3 py-2.5 font-mono text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}

            <li className="my-1 h-px bg-border" />

            {/* Survey */}
            <li>
              <a
                href={isHome ? "#questionnaire" : "/#questionnaire"}
                onClick={(e) => isHome && scrollTo(e, "#questionnaire")}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-mono text-sm text-accent hover:bg-secondary"
              >
                <ClipboardList className="h-4 w-4" /> Community Survey
              </a>
            </li>

            <li className="my-1 h-px bg-border" />

            {/* Social links */}
            <li>
              <div className="px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Socials</div>
              <div className="mt-1 flex flex-wrap gap-2 px-3">
                {mobileExtras.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank" rel="noreferrer noopener"
                    className="rounded-full border border-border bg-secondary/50 px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </li>

            <li className="my-1 h-px bg-border" />

            {/* Language grid */}
            <li>
              <div className="px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Language</div>
              <div className="mt-1 grid grid-cols-3 gap-1 px-3">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => { setLanguage(lang.code as Language); setMobileOpen(false); }}
                    className={`flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs transition-colors ${lang.code === language ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </li>

            {/* Status footer */}
            <li className="my-1 h-px bg-border" />
            <li>
              <div className="flex items-center gap-2 px-3 py-2 font-mono text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: STATUS_DOT[status] }} />
                Discord: {STATUS_TEXT[status]}
                {lanyard?.discord_user && (
                  <span className="ml-1 opacity-60">· @{lanyard.discord_user.username}</span>
                )}
              </div>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Nav;
