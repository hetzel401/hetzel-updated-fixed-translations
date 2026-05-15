import { useState, useRef, useEffect } from "react";
import { Code2, Globe, Menu, X, ClipboardList, Youtube, Github, Gamepad2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { useLanyardContext } from "@/context/LanyardContext";
import { LANGUAGES, Language } from "@/i18n/translations";

const STATUS_DOT: Record<string, string> = {
  online: "bg-emerald-400",
  idle: "bg-amber-400",
  dnd: "bg-rose-500",
  offline: "bg-zinc-500",
};

const STATUS_TEXT: Record<string, string> = {
  online: "Online",
  idle: "Away",
  dnd: "Busy",
  offline: "Offline",
};

const socialLinks = [
  { label: "YouTube", href: "https://www.youtube.com/@Hetzel401", icon: Youtube, color: "#FF0000" },
  { label: "Roblox", href: "https://www.roblox.com/users/1517909098/profile", icon: Gamepad2, color: "#e1523d" },
  { label: "GitHub", href: "https://github.com/hetzel401", icon: Github, color: "#ffffff" },
  { label: "Discord", href: "https://discordapp.com/users/1097536305027629119", icon: () => (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.7 19.7 0 0 0 3.677 4.37.077.077 0 0 0 3.65 4.487c.72 10.795 5.098 16.793 9.3 17.773.5.084 1.002.084 1.501 0 4.203-.98 8.581-6.978 9.3-17.773.015-.12-.005-.243-.05-.36z" />
    </svg>
  ), color: "#5865F2" },
];

const Nav = () => {
  const { t, language, setLanguage } = useLanguage();
  const { data: lanyard } = useLanyardContext();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loc] = useLocation();
  const status = lanyard?.discord_status ?? "offline";

  const links = [
    { href: "/",        label: t.nav.home    },
    { href: "/about",   label: t.nav.about   },
    { href: "/work",    label: t.nav.work    },
    { href: "/contact", label: t.nav.contact },
  ];

  const isHome = loc === "/" || loc === "";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [loc]);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setMobileOpen(false);
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const current = LANGUAGES.find((l) => l.code === language);
  const isActive = (href: string) => (href === "/" ? loc === "/" || loc === "" : loc.startsWith(href));

  const linkClass = (href: string, variant: "pill" | "row" = "pill") => {
    const active = isActive(href);
    const base = variant === "pill" ? "rounded-full px-3 py-1.5 text-xs" : "block rounded-lg px-3 py-2.5 text-sm";
    return `${base} transition-colors whitespace-nowrap font-mono ${
      active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    }`;
  };

  return (
    <header className="fixed left-1/2 top-4 z-50 w-full max-w-4xl -translate-x-1/2 px-4">
      <nav className="glass flex items-center gap-2 rounded-full px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-full bg-secondary px-3 py-1.5 font-mono text-sm font-semibold"
        >
          <Code2 className="h-4 w-4 text-accent" />
          <span className="hidden tracking-widest sm:inline">Hetzel401</span>
        </Link>

        {/* Main page links */}
        <ul className="ml-1 hidden items-center gap-0.5 font-mono text-xs md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={linkClass(l.href, "pill")}>{l.label}</Link>
            </li>
          ))}
          {/* Social icons */}
          <li className="mx-1 h-4 w-px bg-border" />
          {socialLinks.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank" rel="noreferrer noopener"
                  title={s.label}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-all hover:scale-110 hover:text-foreground"
                  style={{ color: s.color }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground md:hidden"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        {/* Survey shortcut */}
        <a
          href={isHome ? "#questionnaire" : "/#questionnaire"}
          title="Community Survey"
          onClick={(e) => isHome && handleAnchorClick(e, "#questionnaire")}
          className="ml-auto hidden shrink-0 items-center gap-1.5 rounded-full bg-accent/10 border border-accent/30 px-3 py-1.5 font-mono text-xs text-accent transition-all hover:bg-accent/20 sm:flex"
        >
          <ClipboardList className="h-3.5 w-3.5" />
          <span>Survey</span>
        </a>

        {/* Live status badge */}
        <div className="hidden shrink-0 items-center gap-2 rounded-full bg-secondary px-3 py-1.5 font-mono text-xs text-muted-foreground sm:flex">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full rounded-full ${STATUS_DOT[status]}/50 ${status === "online" ? "animate-ping" : ""}`} />
            <span className={`relative inline-flex h-2 w-2 rounded-full ${STATUS_DOT[status]}`} />
          </span>
          {STATUS_TEXT[status]}
        </div>

        {/* Language picker */}
        <div ref={dropdownRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Switch language"
          >
            <Globe className="h-3.5 w-3.5 text-accent" />
            <span>{current?.flag}</span>
          </button>
          {open && (
            <div className="absolute right-0 top-full z-50 mt-2 min-w-[9rem] overflow-hidden rounded-xl border border-border bg-card shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => { setLanguage(lang.code as Language); setOpen(false); }}
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
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="mt-2 w-full rounded-2xl border border-border bg-card/95 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur md:hidden animate-fade-in">
          <ul className="flex flex-col gap-1 font-mono text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass(l.href, "row")}>{l.label}</Link>
              </li>
            ))}
            <li className="my-1 h-px bg-border mx-2" />
            <li className="px-3 py-2">
              <div className="flex items-center gap-3">
                {socialLinks.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a key={s.label} href={s.href} target="_blank" rel="noreferrer noopener" title={s.label} style={{ color: s.color }}>
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </li>
            <li className="my-1 h-px bg-border mx-2" />
            <li>
              <div className="px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">Language</div>
              <div className="mt-1 grid grid-cols-2 gap-1 px-3">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => { setLanguage(lang.code as Language); setMobileOpen(false); }}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${lang.code === language ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </li>
            <li className="my-1 h-px bg-border mx-2" />
            <li>
              <a
                href={isHome ? "#questionnaire" : "/#questionnaire"}
                onClick={(e) => isHome && handleAnchorClick(e, "#questionnaire")}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-mono text-accent hover:bg-secondary"
              >
                <ClipboardList className="h-4 w-4" /> Community Survey
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Nav;