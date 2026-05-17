import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { SectionLabel } from "@/components/SectionLabel";
import DiscordWidget from "@/components/DiscordWidget";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowUpRight, ChevronDown, ChevronUp, Github } from "lucide-react";
import { Link } from "wouter";

export default function ContactPage() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <PageLayout>
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-32 md:pt-36">
        <div className="mx-auto max-w-3xl">
          <SectionLabel label={t.contact.sectionLabel} />
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight md:text-5xl">
            {t.contact.heading}{" "}
            <span className="text-gradient-brand">{t.contact.headingHighlight}</span>
          </h1>
          <p className="mt-6 text-muted-foreground md:text-lg">{t.contact.description}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="mailto:universemax401@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              universemax401@gmail.com <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/hetzel401"
              target="_blank"
              rel="noreferrer noopener"
              className="btn-grad-border inline-flex items-center justify-center gap-2 rounded-full bg-secondary/40 px-6 py-3 text-sm font-semibold"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
            <a
              href="https://discordapp.com/users/1097536305027629119"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5865F2]/90 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95"
            >
              Discord
            </a>
          </div>
        </div>

        <section className="mt-24 max-w-3xl">
          <SectionLabel label={t.discord.sectionLabel} />
          <h2 className="mt-6 font-display text-2xl font-semibold">{t.discord.heading}</h2>
          <p className="mt-3 text-muted-foreground">{t.discord.description}</p>
          <div className="mt-8 max-w-sm">
            <DiscordWidget />
          </div>
        </section>

        <section className="mt-24">
          <SectionLabel label={t.testimonials.sectionLabel} />
          <h2 className="mt-6 font-display text-2xl font-semibold md:text-3xl">{t.testimonials.heading}</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {t.testimonials.items.map((item, idx) => (
              <figure
                key={idx}
                className="flex flex-col rounded-xl border border-border bg-card/25 p-6"
              >
                <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-display text-3xl leading-none text-accent/30">"</span>
                  {item.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 font-display text-sm font-semibold text-accent">
                    {item.author[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{item.author}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">{item.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-2xl">
          <SectionLabel label={t.faq.sectionLabel} />
          <h2 className="mt-6 font-display text-2xl font-semibold md:text-3xl">{t.faq.heading}</h2>
          <div className="mt-8 space-y-2">
            {t.faq.items.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`overflow-hidden rounded-xl border transition-colors ${
                    isOpen ? "border-accent/30 bg-card/35" : "border-border bg-card/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left text-sm"
                  >
                    <span className="font-medium">{item.question}</span>
                    <span className="shrink-0 text-accent">
                      {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-border/60 px-5 pb-5 pt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <Link
          href="/"
          className="mt-16 inline-flex items-center gap-2 font-mono text-sm text-accent transition-colors hover:text-accent/80"
        >
          {t.nav.home} <ArrowUpRight className="h-4 w-4" />
        </Link>
      </main>
    </PageLayout>
  );
}
