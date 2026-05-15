import React from "react";
import { SectionLabel } from "@/components/SectionLabel";
import { useLanguage } from "@/context/LanguageContext";

export default function TimelineSection() {
  const { t } = useLanguage();
  return (
    <section id="journey" className="relative mx-auto max-w-4xl px-6 py-28 reveal-on-scroll" style={{ scrollMarginTop: 80 }}>
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