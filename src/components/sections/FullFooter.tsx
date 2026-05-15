import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { SOCIAL_LINKS } from "@/lib/site-constants";
import { Code2, Github } from "lucide-react";

export default function FullFooter() {
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
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">{f.brandDescription}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer noopener" title={s.label} className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary/40 transition-all hover:scale-110">
                  {s.label === "Discord" ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.7 19.7 0 0 0 3.677 4.37.077.077 0 0 0 3.65 4.487c.72 10.795 5.098 16.793 9.3 17.773.5.084 1.002.084 1.501 0 4.203-.98 8.581-6.978 9.3-17.773.015-.12-.005-.243-.05-.36z" /></svg>
                  ) : <Github className="h-5 w-5" />}
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
              <a href="mailto:universemax401@gmail.com" className="font-mono text-sm text-accent hover:underline">universemax401@gmail.com</a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border/60 pt-8 flex flex-col items-center justify-between gap-3 font-mono text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} Hetzel401 · {f.builtWith}</span>
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />{f.allOperational}</span>
        </div>
      </div>
    </footer>
  );
}