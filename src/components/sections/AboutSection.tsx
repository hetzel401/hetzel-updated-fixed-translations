import React from "react";
import { SectionLabel } from "@/components/SectionLabel";
import { useLanguage } from "@/context/LanguageContext";
import { stats } from "@/lib/site-constants";
import { Terminal, Boxes, Server, Cpu, Sparkles, Send } from "lucide-react";

const stackIcons = [Terminal, Boxes, Server, Cpu, Sparkles, Send];

export default function AboutSection() {
  const { t } = useLanguage();
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-28 reveal-on-scroll" style={{ scrollMarginTop: 80 }}>
      <SectionLabel label={t.about.sectionLabel} />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-card/60 p-8 shadow-[0_0_60px_-20px_hsl(var(--accent)/0.6)] backdrop-blur md:p-10">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
          <h2 className="font-display text-3xl font-semibold md:text-4xl">
            {t.about.heading} <span className="text-accent">Hetzel401</span>.
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">{t.about.bio1}</p>
          <p className="mt-4 text-muted-foreground leading-relaxed">{t.about.bio2}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {t.about.badges.map((b) => (
              <span key={b} className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <div key={s.key} className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 card-hover md:p-8">
              <div className="card-inner-glow" />
              <div className="relative">
                <div className="font-display text-4xl font-semibold tracking-tight md:text-5xl">{s.value}</div>
                <div className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {t.about.stats[s.key]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
        {t.stack.items.map(({ label, note }, idx) => {
          const Icon = stackIcons[idx];
          return (
            <div key={label} className="group flex items-center gap-4 rounded-xl border border-border bg-card/40 p-5 transition-all card-hover">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-accent transition-colors group-hover:bg-accent/20">
                {Icon && <Icon className="h-5 w-5" />}
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