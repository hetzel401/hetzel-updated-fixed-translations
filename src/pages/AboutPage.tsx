import PageLayout from "@/components/PageLayout";
import { SectionLabel } from "@/components/SectionLabel";
import { useLanguage } from "@/context/LanguageContext";
import { stats } from "@/lib/site-constants";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <PageLayout>
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 md:pt-36">
        <SectionLabel label={t.about.sectionLabel} />
        <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight md:text-5xl">
          {t.about.heading} <span className="text-foreground">Hetzel401</span>
        </h1>
        <div className="mt-10 space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>{t.about.bio1}</p>
          <p>{t.about.bio2}</p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.key}
              className="rounded-xl border border-border bg-card/40 px-5 py-6 transition-colors hover:border-accent/30"
            >
              <div className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{s.value}</div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {t.about.stats[s.key]}
              </div>
            </div>
          ))}
        </div>

        <section className="mt-24">
          <SectionLabel label={t.timeline.sectionLabel} />
          <h2 className="mt-6 font-display text-2xl font-semibold md:text-3xl">{t.timeline.heading}</h2>
          <div className="mt-10 space-y-6 border-l border-border pl-6">
            {t.timeline.items.map((item, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-accent" />
                <div className="font-mono text-xs text-accent">{item.year}</div>
                <h3 className="mt-1 font-display text-lg font-medium">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <Link
          href="/work"
          className="mt-16 inline-flex items-center gap-2 font-mono text-sm text-accent transition-colors hover:text-accent/80"
        >
          {t.hero.seeWork} <ArrowUpRight className="h-4 w-4" />
        </Link>
      </main>
    </PageLayout>
  );
}
