import { Helmet } from "react-helmet-async";
import PageLayout from "@/components/PageLayout";
import { useLanguage } from "@/context/LanguageContext";
import { articles } from "@/data/blog";
import { Link, useRoute } from "wouter";
import { Calendar, ArrowLeft, Tag } from "lucide-react";
import NotFound from "./not-found";

export default function BlogPostPage() {
  const { t } = useLanguage();
  const [, params] = useRoute("/blog/:slug");
  const article = articles.find((a) => a.slug === params?.slug);

  if (!article) return <NotFound />;

  return (
    <PageLayout>
      <Helmet>
        <title>{article.title} — Hetzel401 Blog</title>
        <meta name="description" content={article.summary} />
      </Helmet>
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 md:pt-36">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3 w-3" /> {t.blog.backToBlog}
        </Link>

        <article className="mt-8">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-accent">
                <Tag className="h-3 w-3" />
                {article.tag}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                {t.blog.publishedOn} {article.date}
              </span>
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl">
              {article.title}
            </h1>
            <p className="text-lg text-muted-foreground italic border-l-2 border-accent/30 pl-4">
              {article.summary}
            </p>
          </header>

          <div className="mt-12 space-y-6 text-lg leading-relaxed text-foreground/90">
            {article.content.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </article>

        <div className="mt-20 border-t border-border/60 pt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold transition-all hover:bg-secondary/80"
          >
            <ArrowLeft className="h-4 w-4" /> {t.blog.backToBlog}
          </Link>
        </div>
      </main>
    </PageLayout>
  );
}