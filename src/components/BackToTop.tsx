import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useCustomization } from "@/context/CustomizationContext";

export default function BackToTop() {
  const { config } = useCustomization();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!config.showBackToTop || !show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 right-6 z-50 glass rounded-full border border-border/60 bg-card/80 backdrop-blur-xl p-3 shadow-lg hover:shadow-[0_0_20px_hsl(var(--accent)/0.3)] transition-all hover:scale-110 animate-fade-up"
      aria-label="Back to top"
    >
      <ArrowUp className="h-4 w-4 text-accent" />
    </button>
  );
}
