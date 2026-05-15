import { useEffect, useCallback } from "react";
import { useCustomization } from "@/context/CustomizationContext";

export default function ClickRipple() {
  const { config } = useCustomization();

  const handleClick = useCallback((e: MouseEvent) => {
    if (!config.clickRipple) return;
    const ripple = document.createElement("div");
    ripple.className = "click-ripple-effect";
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, [config.clickRipple]);

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [handleClick]);

  return null;
}
