import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Zap, TrendingUp, Code2, Users2 } from "lucide-react";

interface Stat {
  value: number;
  label: string;
  icon: typeof Zap;
  color: string;
}

export default function LiveStatsWidget() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stat[]>([
    { value: 0, label: "Lines of Code", icon: Code2, color: "from-blue-500" },
    { value: 0, label: "Projects Built", icon: TrendingUp, color: "from-purple-500" },
    { value: 0, label: "Community Size", icon: Users2, color: "from-pink-500" },
    { value: 0, label: "API Uptime", icon: Zap, color: "from-green-500" },
  ]);

  useEffect(() => {
    // Animate counter values
    const targets = [50000, 42, 1200, 99.9];
    const intervals = targets.map((target, idx) => {
      let current = 0;
      return setInterval(() => {
        const increment = Math.ceil(target / 50);
        current += increment;
        if (current >= target) current = target;
        setStats((prev) => {
          const newStats = [...prev];
          newStats[idx].value = current;
          return newStats;
        });
        if (current >= target) clearInterval(intervals[idx]);
      }, 30);
    });
    return () => intervals.forEach((interval) => clearInterval(interval));
  }, []);

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-20 reveal-on-scroll">
      <h3 className="font-display text-2xl font-semibold mb-8 text-center">By The Numbers</h3>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${stat.color}/10 p-6 transition-all hover:border-accent/50 hover:shadow-lg`}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(135deg, ${stat.color}, transparent)` }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="h-6 w-6 text-accent opacity-60" />
                </div>
                <div className="font-display text-4xl font-bold text-foreground">
                  {stat.value}{idx === 3 ? "%" : "+"}
                </div>
                <div className="mt-2 font-mono text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
