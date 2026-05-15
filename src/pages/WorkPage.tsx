import PageLayout from "@/components/PageLayout";
import { SectionLabel } from "@/components/SectionLabel";
import { useLanguage } from "@/context/LanguageContext";
import { projectFeatured, projectHrefs, projectStacks } from "@/lib/site-constants";
import {
  ArrowUpRight,
  Bot,
  Boxes,
  Cpu,
  Globe,
  Send,
  Server,
  Sparkles,
  Terminal,
  Users,
  Wrench,
} from "lucide-react";
import { Link } from "wouter";

const stackIcons = [Terminal, Boxes, Server, Cpu, Sparkles, Send];
const serviceIcons = [Bot, Globe, Wrench, Users];

export default function WorkPage() {
  const { t } = useLanguage();

  return (
    <PageLayout>
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-32 md:pt-36">
        <SectionLabel label={t.services.sectionLabel} />
        <h1 className="mt-6 max-w-2xl font-display text-4xl font-semibold tracking-tight md:text-5xl">
          {t.services.heading}{" "}
          <span className="text-gradient-brand">{t.services.headingHighlight}</span>
        </h1>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {t.services.items.map((item, idx) => {
            const Icon = serviceIcons[idx];
            return (
              <article
                key={item.title}
                className="rounded-xl border border-border bg-card/30 p-6 md:p-8"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-display text-xl font-semibold">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md border border-border/80 bg-secondary/40 px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <section className="mt-24">
          <SectionLabel label={t.work.sectionLabel} />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {t.work.projects.map((p, idx) => (
              <a
                key={idx}
                href={projectHrefs[idx]}
                target="_blank"
                rel="noreferrer noopener"
                className={`group block rounded-xl border bg-card/30 p-6 transition-colors hover:border-accent/35 md:p-8 ${
                  projectFeatured[idx] ? "border-accent/30" : "border-border"
                } ${!projectFeatured[idx] ? "md:col-span-2" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-xl font-semibold md:text-2xl">{p.name}</h3>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-accent">
                    {t.work.live}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{p.blurb}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {projectStacks[idx].map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-border/80 bg-secondary/40 px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  {p.cta}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-24">
          <SectionLabel label={t.stack.sectionLabel} />
          <h2 className="mt-6 font-display text-2xl font-semibold md:text-3xl">{t.stack.heading}</h2>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
            {t.stack.items.map(({ label, note }, idx) => {
              const Icon = stackIcons[idx];
              return (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card/25 p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary/80 text-accent">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{label}</div>
                    <div className="truncate font-mono text-[11px] text-muted-foreground">{note}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <Link
          href="/contact"
          className="mt-16 inline-flex items-center gap-2 font-mono text-sm text-accent transition-colors hover:text-accent/80"
        >
          {t.hero.startProject} <ArrowUpRight className="h-4 w-4" />
        </Link>
      </main>
    </PageLayout>
  );
}
