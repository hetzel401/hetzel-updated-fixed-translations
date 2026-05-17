import { useEffect } from "react";
import { useCustomization } from "@/context/CustomizationContext";

export default function useSectionReveal() {
  const { config } = useCustomization();

  useEffect(() => {
    if (!config.sectionAnimations) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");

            // Stagger direct children that opt-in with .stagger-child
            const children = entry.target.querySelectorAll(":scope > .stagger-child, :scope > * > .stagger-child");
            children.forEach((child, i) => {
              (child as HTMLElement).style.transitionDelay = `${i * 80}ms`;
              child.classList.add("stagger-visible");
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const sections = document.querySelectorAll(".reveal-on-scroll");
    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, [config.sectionAnimations]);
}
