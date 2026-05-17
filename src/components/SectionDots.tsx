import { useState, useEffect } from "react";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "products", label: "Work" },
  { id: "stats", label: "Stats" },
  { id: "testimonials", label: "Reviews" },
  { id: "videos", label: "Videos" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
  { id: "discord", label: "Discord" },
] as const;

export default function SectionDots() {
  const [active, setActive] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);

      const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
      let current = "";
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= window.innerHeight / 2) {
          current = el.id;
        }
      }
      setActive(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <nav
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
      aria-label="Section navigation"
    >
      {SECTIONS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            className="group relative flex items-center justify-end"
            aria-label={`Jump to ${label}`}
          >
            <span
              className={`absolute right-5 whitespace-nowrap rounded-md bg-card/90 px-2 py-1 font-mono text-[10px] opacity-0 shadow-lg backdrop-blur transition-opacity group-hover:opacity-100 ${
                isActive ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
            <span
              className={`block rounded-full transition-all ${
                isActive
                  ? "h-3 w-3 bg-accent shadow-[0_0_8px_hsl(var(--accent)/0.5)]"
                  : "h-2 w-2 bg-muted-foreground/40 group-hover:bg-muted-foreground"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
