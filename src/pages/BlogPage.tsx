import { Helmet } from "react-helmet-async";
import PageLayout from "@/components/PageLayout";
import { SectionLabel } from "@/components/SectionLabel";
import { useLanguage } from "@/context/LanguageContext";
import { articles } from "@/data/blog";
import { Link } from "wouter";
import { Calendar, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const { t } = useLanguage();

  return (
    <PageLayout>
      <Helmet>
        <title>Blog — Hetzel401</title>
        <meta name="description" content="Updates, tutorials, and behind-the-scenes looks at my projects." />
      </Helmet>
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-32 md:pt-36">
        <SectionLabel label={t.blog.sectionLabel} />
        <h1 className="mt-6 font-display text-4xl font-semibold md:text-5xl">
          {t.blog.heading}
        </h1>
        <p className="mt-4 text-muted-foreground md:text-lg">
          {t.blog.description}
        </p>

        <div className="mt-16 grid gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-6 transition-all hover:border-accent/40 hover:shadow-lg"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-accent">
                    <span className="rounded-full bg-accent/10 px-2 py-0.5">{article.tag}</span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {article.date}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-semibold group-hover:text-accent transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">
                    {article.summary}
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-accent opacity-0 transition-all group-hover:opacity-100 md:translate-x-4 group-hover:translate-x-0">
                  {t.blog.readMore} <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </PageLayout>
  );
}