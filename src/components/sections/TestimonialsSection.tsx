import React from "react";
import { SectionLabel } from "@/components/SectionLabel";
import { useLanguage } from "@/context/LanguageContext";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const { t } = useLanguage();
  const testimonialData = t.testimonials;

  return (
    <section id="testimonials" className="relative mx-auto max-w-6xl px-6 py-28 reveal-on-scroll content-visibility-auto" style={{ scrollMarginTop: 80 }}>
      <SectionLabel label={testimonialData.sectionLabel} />
      <h2 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        {testimonialData.heading}
      </h2>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {testimonialData.items.map((item, idx) => (
          <div key={idx} className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-7 card-hover flex flex-col">
            <div className="card-inner-glow" />
            <div className="relative flex flex-col h-full">
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