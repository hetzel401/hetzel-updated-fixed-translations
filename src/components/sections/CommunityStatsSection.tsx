import React from "react";
import { SectionLabel } from "@/components/SectionLabel";
import { useLanguage } from "@/context/LanguageContext";
import { communityStatValues } from "@/lib/site-constants";
import { Users, Bot, Server, Clock, Star, Zap } from "lucide-react";

const communityStatIcons = [Users, Bot, Server, Clock, Star, Zap];

export default function CommunityStatsSection() {
  const { t } = useLanguage();
  const s = t.stats;
  return (
    <section id="stats" className="relative mx-auto max-w-6xl px-6 py-28 reveal-on-scroll content-visibility-auto" style={{ scrollMarginTop: 80 }}>
      <SectionLabel label={s.sectionLabel} />
      <h2 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        {s.heading}
      </h2>
      <p className="mt-3 max-w-xl text-muted-foreground">
        {s.description}
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {communityStatIcons.map((Icon, idx) => (
          <div key={idx} className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-7 card-hover">
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