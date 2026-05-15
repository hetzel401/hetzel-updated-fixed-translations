import React from "react";
import Constellation from "@/components/Constellation";
import DiscordProfile from "@/components/DiscordProfile";
import Typewriter from "@/components/Typewriter";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowUpRight, ChevronDown, Send } from "lucide-react";
import { DISCORD_ID } from "@/lib/site-constants";

export default function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 pt-28 pb-16">
      <Constellation />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center animate-fade-up">
        <div className="mb-8">
          <DiscordProfile userId={DISCORD_ID} />
        </div>
        <h1 className="font-feminine text-7xl tracking-[0.14em] md:text-9xl">
          <span className="text-shimmer">Hetzel401</span>
        </h1>
        <div className="mt-6 terminal-chip">
          <Typewriter />
        </div>
        <p className="mx-auto mt-6 max-w-xl text-balance text-muted-foreground md:text-lg">
          {t.hero.description}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#products"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:bg-foreground/90 hover:scale-105"
          >
            {t.hero.seeWork} <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="#contact"
            className="btn-grad-border inline-flex items-center gap-2 rounded-full bg-secondary/50 px-6 py-3 text-sm font-semibold backdrop-blur transition-all hover:scale-105"
          >
            <Send className="h-4 w-4" /> {t.hero.startProject}
          </a>
        </div>
        <div className="mt-16 flex items-center gap-2 font-mono text-xs text-muted-foreground animate-bounce">
          <ChevronDown className="h-4 w-4" /> {t.hero.scroll}
        </div>
      </div>
    </section>
  );
}