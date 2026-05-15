import { useEffect, useRef } from "react";
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
