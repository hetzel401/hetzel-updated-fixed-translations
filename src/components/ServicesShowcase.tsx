import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Bot, Palette, Globe, Zap, ChevronDown, ArrowUpRight } from "lucide-react";

interface Service {
  title: string;
  icon: typeof Bot;
  description: string;
  color: string;
  features: string[];
  price: string;
}

export default function ServicesShowcase() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState<number | null>(null);

  const services: Service[] = [
    {
      title: "Discord Bot Development",
      icon: Bot,
      color: "from-[#5865F2]",
      price: "Custom Quote",
      description: "Custom Discord bots tailored to your community needs",
      features: [
        "Command systems & slash commands",
        "Moderation tools & automation",
        "Custom leveling & economy systems",
        "Music & media streaming",
        "Database integration",
        "24/7 support & updates",
      ],
    },
    {
      title: "Server Design & Setup",
      icon: Palette,
      color: "from-pink-500",
      price: "Starting $50",
      description: "Professional Discord server design and configuration",
      features: [
        "Channel structure & organization",
        "Role hierarchy setup",
        "Custom permissions & security",
        "Welcome systems & verification",
        "Theme customization",
        "Best practices implementation",
      ],
    },
    {
      title: "Web Development",
      icon: Globe,
      color: "from-blue-500",
      price: "Starting $100",
      description: "Modern, responsive web applications and websites",
      features: [
        "React & Next.js applications",
        "Responsive design (mobile-first)",
        "API integration & backend",
        "Database setup & management",
        "SEO optimization",
        "Deployment & hosting",
      ],
    },
    {
      title: "API Development",
      icon: Zap,
      color: "from-purple-500",
      price: "Custom Quote",
      description: "RESTful & scalable APIs for your applications",
      features: [
        "Node.js & Express servers",
        "MongoDB/PostgreSQL databases",
        "Authentication & authorization",
        "Rate limiting & security",
        "Documentation & testing",
        "Deployment & monitoring",
      ],
    },
  ];

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-20 reveal-on-scroll">
      <div className="mb-8">
        <h3 className="font-display text-3xl font-semibold">Services</h3>
        <p className="mt-2 text-muted-foreground">Professional development services tailored for you</p>
      </div>

      <div className="space-y-3">
        {services.map((service, idx) => {
          const Icon = service.icon;
          const isExpanded = expanded === idx;

          return (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 transition-all hover:border-accent/30"
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : idx)}
                className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-card/60"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${service.color}/20 text-accent`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-semibold">{service.title}</h4>
                    <p className="text-sm text-accent font-mono">{service.price}</p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  style={{ color: "hsl(var(--accent))" }}
                />
              </button>

              {isExpanded && (
                <div className="border-t border-border/40 px-6 py-6">
                  <p className="mb-6 text-muted-foreground">{service.description}</p>

                  {/* Features Grid */}
                  <div className="mb-6 grid gap-3 sm:grid-cols-2">
                    {service.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-accent shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent to-accent/70 px-6 py-3 font-semibold text-background transition-all hover:shadow-lg hover:scale-105">
                    Get Started
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
