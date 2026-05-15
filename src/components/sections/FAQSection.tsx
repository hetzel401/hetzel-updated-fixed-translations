import React, { useState } from "react";
import { SectionLabel } from "@/components/SectionLabel";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQSection() {
  const { t } = useLanguage();
  const faqData = t.faq;
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="relative mx-auto max-w-3xl px-6 py-28 reveal-on-scroll content-visibility-auto" style={{ scrollMarginTop: 80 }}>
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