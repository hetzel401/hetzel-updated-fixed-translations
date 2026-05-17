import { useState, useEffect } from "react";
import { User, Briefcase, MessageSquare, Send } from "lucide-react";

const NAV_ITEMS = [
  { href: "#about", label: "About", icon: User },
  { href: "#products", label: "Work", icon: Briefcase },
  { href: "#discord", label: "Discord", icon: MessageSquare },
  { href: "#contact", label: "Contact", icon: Send },
] as const;

export default function MobileBottomNav() {
  const [activeSection, setActiveSection] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);

      const sections = NAV_ITEMS.map((item) =>
        document.querySelector(item.href)
      ).filter(Boolean) as Element[];

      let current = "";
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
          current = `#${section.id}`;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-card/95 backdrop-blur-xl sm:hidden animate-fade-up"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = activeSection === href;
          return (
            <a
              key={href}
              href={href}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-mono transition-colors ${
                isActive
                  ? "text-accent"
                  : "text-muted-foreground active:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-accent" : ""}`} />
              <span>{label}</span>
              {isActive && (
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-accent" />
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
