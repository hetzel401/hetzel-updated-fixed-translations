import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { useLanyardContext } from "@/context/LanyardContext";
import { LANGUAGES } from "@/i18n/translations";
import { ChevronDown } from "lucide-react";

const STATUS_DOT: Record<string, string> = {
  online: "#23a55a",
  idle: "#f0b232",
  dnd: "#f23f43",
  offline: "#80848e",
};

const DiscordIcon = () => (
  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.032.019.063.041.082a19.921 19.921 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .041-.082c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
  </svg>
);

interface TabItem {
  id: string;
  label: string;
  href: string;
}

export default function WindowsNav() {
  const { t, language, setLanguage } = useLanguage();
  const { data: lanyard } = useLanyardContext();
  const [langOpen, setLangOpen] = useState(false);
  const [loc] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const status = (lanyard?.discord_status ?? "offline") as keyof typeof STATUS_DOT;

  const isHome = loc === "/" || loc === "";

  // Tabs for different sections
  const tabs: TabItem[] = [
    { id: "about", label: t.nav.about, href: "#about" },
    { id: "timeline", label: t.nav.timeline, href: "#journey" },
    { id: "work", label: t.nav.work, href: "#products" },
    { id: "discord", label: "Discord", href: "#discord" },
    { id: "contact", label: t.nav.contact, href: "#contact" },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const current = LANGUAGES.find((l) => l.code === language);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-slate-200 to-slate-100 border-b-2 border-slate-400 shadow-md">
      {/* Windows 95 Title Bar */}
      <div className="flex items-center justify-between px-2 py-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white" />
          <span className="font-bold text-xs">Hetzel's Workshop</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Discord Status Indicator */}
          <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500 rounded">
            <DiscordIcon />
            <span className="text-xs">{lanyard?.discord_status || "offline"}</span>
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: STATUS_DOT[status] }}
            />
          </div>
        </div>
      </div>

      {/* Tabs Bar - Windows 95 Style */}
      <div className="flex items-center bg-gradient-to-b from-slate-100 to-slate-50 border-b border-slate-300 px-1 py-0.5">
        {/* Brand Tab */}
        <Link
          href="/"
          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-b from-slate-200 to-slate-100 border border-slate-400 border-b-slate-600 border-r-slate-600 text-sm font-semibold text-slate-800 mr-1 hover:from-slate-300 hover:to-slate-200 active:border-slate-600 active:border-b-slate-300 active:border-r-slate-300 transition-all"
        >
          <span className="text-lg">→</span>
        </Link>

        {/* Section Tabs */}
        {isHome &&
          tabs.map((tab) => (
            <a
              key={tab.id}
              href={tab.href}
              onClick={(e) => scrollTo(e, tab.href)}
              className="px-3 py-1.5 bg-gradient-to-b from-slate-200 to-slate-100 border border-slate-400 border-b-slate-600 border-r-slate-600 text-sm text-slate-800 hover:from-slate-300 hover:to-slate-200 active:border-slate-600 active:border-b-slate-300 active:border-r-slate-300 transition-all whitespace-nowrap"
            >
              {tab.label}
            </a>
          ))}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Language Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-b from-slate-200 to-slate-100 border border-slate-400 border-b-slate-600 border-r-slate-600 text-sm text-slate-800 hover:from-slate-300 hover:to-slate-200 active:border-slate-600 active:border-b-slate-300 active:border-r-slate-300 transition-all"
          >
            <span className="text-xs">🌐</span>
            <span>{current?.name.split(" ")[0]}</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {langOpen && (
            <div className="absolute right-0 mt-1 bg-slate-100 border-2 border-slate-400 border-b-slate-600 border-r-slate-600 shadow-lg">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as any);
                    setLangOpen(false);
                  }}
                  className="block w-full text-left px-3 py-1.5 text-sm text-slate-800 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
