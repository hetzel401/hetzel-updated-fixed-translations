import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronDown, Code2, Palette, Zap, Wrench, Shield, Rocket } from "lucide-react";

interface Tool {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

interface Category {
  title: string;
  icon: typeof Code2;
  tools: Tool[];
  color: string;
}

export default function ToolsAndSkillsGrid() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState<number | null>(0);

  const categories: Category[] = [
    {
      title: "Languages",
      icon: Code2,
      color: "from-blue-500",
      tools: [
        { name: "TypeScript", level: "Expert" },
        { name: "JavaScript", level: "Expert" },
        { name: "Python", level: "Advanced" },
        { name: "Java", level: "Intermediate" },
      ],
    },
    {
      title: "Frameworks",
      icon: Rocket,
      color: "from-purple-500",
      tools: [
        { name: "React", level: "Expert" },
        { name: "Node.js", level: "Expert" },
        { name: "Express", level: "Advanced" },
        { name: "Vue.js", level: "Intermediate" },
      ],
    },
    {
      title: "Tools & Platforms",
      icon: Wrench,
      color: "from-pink-500",
      tools: [
        { name: "Discord.js", level: "Expert" },
        { name: "Git", level: "Expert" },
        { name: "Docker", level: "Advanced" },
        { name: "Vercel", level: "Advanced" },
      ],
    },
    {
      title: "Design & UI",
      icon: Palette,
      color: "from-green-500",
      tools: [
        { name: "Tailwind CSS", level: "Expert" },
        { name: "Figma", level: "Advanced" },
        { name: "Framer Motion", level: "Advanced" },
        { name: "UI/UX Design", level: "Intermediate" },
      ],
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Expert":
        return "bg-green-500/20 text-green-400";
      case "Advanced":
        return "bg-blue-500/20 text-blue-400";
      case "Intermediate":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-20 reveal-on-scroll">
      <div className="mb-8">
        <h3 className="font-display text-3xl font-semibold">Skills & Tools</h3>
        <p className="mt-2 text-muted-foreground">Technologies I work with daily</p>
      </div>

      <div className="space-y-3">
        {categories.map((category, idx) => {
          const Icon = category.icon;
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
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.color}/20 text-accent`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-semibold">{category.title}</h4>
                    <p className="text-sm text-muted-foreground">{category.tools.length} tools</p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  style={{ color: "hsl(var(--accent))" }}
                />
              </button>

              {isExpanded && (
                <div className="border-t border-border/40 px-6 py-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {category.tools.map((tool, toolIdx) => (
                      <div
                        key={toolIdx}
                        className="flex items-center justify-between rounded-lg bg-secondary/30 p-3"
                      >
                        <span className="font-medium">{tool.name}</span>
                        <span className={`rounded-full px-3 py-1 font-mono text-xs font-semibold ${getLevelColor(tool.level)}`}>
                          {tool.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
