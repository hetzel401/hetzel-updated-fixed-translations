import { useEffect, useState } from "react";

const SKILLS = [
  "Node.js",
  "discord.js",
  "React",
  "Vite",
  "Tailwind CSS",
  "Roblox",
  "VS Code",
  "Vercel",
  "TypeScript",
  "Framer Motion",
];

export default function SkillsMarquee() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Duplicate the list end-to-end for the seamless infinite loop
  const badges = [...SKILLS, ...SKILLS];

  return (
    <div className="w-full overflow-hidden border-y border-border/60 bg-card/40 backdrop-blur py-4 group">
      <div
        className={`flex gap-3 w-max ${
          reduced ? "" : "animate-marquee group-hover:animate-marquee-paused"
        }`}
      >
        {badges.map((skill, i) => (
          <span
            key={i}
            className="rounded-full border border-border bg-secondary/60 px-3 py-1 font-mono text-xs text-muted-foreground whitespace-nowrap"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
