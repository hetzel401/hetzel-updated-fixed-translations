import React from "react";
import { SectionLabel } from "@/components/SectionLabel";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowUpRight, Bot, Users, Globe, Wrench } from "lucide-react";

export default function FeaturedProductsSection() {
  const { t } = useLanguage();
  const productData = t.productsExtra;
  const productMeta = [
    { icon: Users, href: "https://discord.gg/Mj9byBhusx", gradient: "from-[#5865F2]/20 via-transparent to-transparent" },
    { icon: Bot, href: "#contact", gradient: "from-accent/20 via-transparent to-transparent" },
    { icon: Globe, href: "#contact", gradient: "from-[#3b82f6]/20 via-transparent to-transparent" },
    { icon: Wrench, href: "#contact", gradient: "from-[#34d399]/20 via-transparent to-transparent" },
  ];

  return (
    <section id="products" className="relative mx-auto max-w-6xl px-6 py-28 reveal-on-scroll" style={{ scrollMarginTop: 80 }}>
      <SectionLabel label={productData.sectionLabel} />
      <h2 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        {productData.heading}
      </h2>
      <p className="mt-3 max-w-xl text-muted-foreground">
        {productData.description}
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {productData.items.map((p, idx) => {
          const Icon = productMeta[idx]?.icon || Bot;
          const { href, gradient } = productMeta[idx] || { href: "#", gradient: "from-accent/20 via-transparent to-transparent" };
          return (
            <a
              key={p.name}
              href={href}
              target={href.startsWith("http") ? "_blank" : "_self"}
              rel="noreferrer noopener"
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-7 card-hover transition-all flex flex-col"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />
              <div className="card-inner-glow" />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
                    {p.badge}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <span key={tag} className="rounded-md border border-border bg-secondary/60 px-3 py-1 font-mono text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-5 inline-flex items-center gap-1.5 font-medium text-sm text-accent">
                  Learn more <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}