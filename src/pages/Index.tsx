import React from "react";
import { Helmet } from "react-helmet-async";
import Nav from "@/components/Nav";
import useSectionReveal from "@/hooks/use-section-reveal";

// Refactored sections
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import TimelineSection from "@/components/sections/TimelineSection";
import FeaturedProductsSection from "@/components/sections/FeaturedProductsSection";
import CommunityStatsSection from "@/components/sections/CommunityStatsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactSection from "@/components/sections/ContactSection";
import Questionnaire from "@/components/Questionnaire";
import FullFooter from "@/components/sections/FullFooter";

export default function Index() {
  useSectionReveal();
  
  return (
    <div id="top" className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Helmet>
        <title>Hetzel401 — Discord Bot & Server Developer</title>
        <meta name="description" content="Independent developer building custom Discord bots, server designs, and web projects. Open for commissions." />
        <meta property="og:title" content="Hetzel401 — Discord Bot & Server Developer" />
        <meta property="og:description" content="Independent developer building custom Discord bots, server designs, and web projects. Open for commissions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hetzel401.vercel.app" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hetzel401 — Discord Bot & Server Developer" />
        <meta name="twitter:description" content="Independent developer building custom Discord bots, server designs, and web projects. Open for commissions." />
        <meta name="twitter:image" content="/og-image.png" />
        <link rel="canonical" href="https://hetzel401.vercel.app" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Hetzel401",
            "url": "https://hetzel401.vercel.app",
            "jobTitle": "Discord Bot & Server Developer",
            "sameAs": [
              "https://github.com/hetzel401",
              "https://www.youtube.com/@Hetzel401",
              "https://discordapp.com/users/1097536305027629119"
            ]
          }
        `}</script>
      </Helmet>
      
      <Nav />
      
      <main>
        <HeroSection />
        <AboutSection />
        <TimelineSection />
        <FeaturedProductsSection />
        <CommunityStatsSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
        
        <section id="questionnaire" className="relative mx-auto max-w-2xl px-6 py-28 reveal-on-scroll content-visibility-auto" style={{ scrollMarginTop: 80 }}>
          <Questionnaire />
        </section>
      </main>
      
      <FullFooter />
    </div>
  );
}