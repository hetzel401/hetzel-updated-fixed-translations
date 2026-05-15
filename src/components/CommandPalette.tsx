import { useState, useEffect, useCallback, useRef } from "react";
import { Search, Settings, ArrowUp, Palette, Music, MessageSquare, Snowflake, Sun, Moon, X } from "lucide-react";
import { useCustomization } from "@/context/CustomizationContext";

interface Command {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { config, update } = useCustomization();

  const commands: Command[] = [
    { id: "top", label: "Scroll to Top", icon: <ArrowUp className="h-4 w-4" />, action: () => window.scrollTo({ top: 0, behavior: "smooth" }), keywords: ["scroll", "top", "up"] },
    { id: "about", label: "Go to About", icon: <ArrowUp className="h-4 w-4" />, action: () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }), keywords: ["about", "bio"] },
    { id: "work", label: "Go to Work", icon: <ArrowUp className="h-4 w-4" />, action: () => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" }), keywords: ["work", "projects"] },
    { id: "contact", label: "Go to Contact", icon: <ArrowUp className="h-4 w-4" />, action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), keywords: ["contact", "email"] },
    { id: "discord", label: "Go to Discord", icon: <ArrowUp className="h-4 w-4" />, action: () => document.getElementById("discord")?.scrollIntoView({ behavior: "smooth" }), keywords: ["discord", "server"] },
    { id: "dark", label: "Toggle Dark Mode", icon: config.darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />, action: () => update("darkMode", !config.darkMode), keywords: ["dark", "light", "mode", "theme"] },
    { id: "snow", label: "Toggle Snow", icon: <Snowflake className="h-4 w-4" />, action: () => update("snowEffect", !config.snowEffect), keywords: ["snow", "winter", "effect"] },
    { id: "music", label: "Toggle Now Playing", icon: <Music className="h-4 w-4" />, action: () => update("nowPlayingVisible", !config.nowPlayingVisible), keywords: ["music", "spotify", "playing"] },
    { id: "status", label: "Toggle Status Banner", icon: <MessageSquare className="h-4 w-4" />, action: () => update("statusBannerVisible", !config.statusBannerVisible), keywords: ["status", "banner", "discord"] },
    { id: "confetti", label: "Toggle Confetti", icon: <Palette className="h-4 w-4" />, action: () => update("confettiEffect", !config.confettiEffect), keywords: ["confetti", "celebrate", "party"] },
    { id: "animations", label: "Toggle Animations", icon: <Settings className="h-4 w-4" />, action: () => update("animationsEnabled", !config.animationsEnabled), keywords: ["animations", "motion"] },
    { id: "clock", label: "Toggle Clock Widget", icon: <Settings className="h-4 w-4" />, action: () => update("clockWidgetVisible", !config.clockWidgetVisible), keywords: ["clock", "time", "widget"] },
    { id: "quote", label: "Toggle Quote Widget", icon: <Settings className="h-4 w-4" />, action: () => update("quoteWidgetVisible", !config.quoteWidgetVisible), keywords: ["quote", "inspiration"] },
    { id: "fullscreen", label: "Toggle Fullscreen", icon: <Settings className="h-4 w-4" />, action: () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); }, keywords: ["fullscreen", "full", "screen"] },
  ];

  const filtered = query
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()) || c.keywords.some((k) => k.includes(query.toLowerCase())))
    : commands;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setSelected(0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => { setSelected(0); }, [query]);

  const run = useCallback((cmd: Command) => {
    cmd.action();
    setOpen(false);
    setQuery("");
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && filtered[selected]) { run(filtered[selected]); }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[301] w-[520px] max-w-[90vw] rounded-2xl border border-border/60 bg-card/95 backdrop-blur-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
          />
          <kbd className="rounded bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">ESC</kbd>
        </div>
        <div className="max-h-[320px] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <div className="p-6 text-center font-mono text-sm text-muted-foreground">No commands found</div>
          )}
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              onClick={() => run(cmd)}
              onMouseEnter={() => setSelected(i)}
              className={`flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left transition-colors ${i === selected ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-secondary/60"}`}
            >
              <span className="shrink-0">{cmd.icon}</span>
              <span className="font-mono text-sm">{cmd.label}</span>
            </button>
          ))}
        </div>
        <div className="border-t border-border/40 px-4 py-2 flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted-foreground/50">Navigate with arrow keys</span>
          <span className="font-mono text-[10px] text-muted-foreground/50">Press Enter to run</span>
        </div>
      </div>
    </>
  );
}
