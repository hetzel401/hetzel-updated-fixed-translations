import { useState, useEffect } from "react";
import { useCustomization } from "@/context/CustomizationContext";

export default function LoadingScreen() {
  const { config } = useCustomization();
  const [visible, setVisible] = useState(config.loadingScreen);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!config.loadingScreen) { setVisible(false); return; }
    const t1 = setTimeout(() => setFadeOut(true), 1200);
    const t2 = setTimeout(() => setVisible(false), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
        </div>
      </div>
      <p className="mt-6 font-mono text-sm text-muted-foreground animate-pulse">Loading...</p>
      <p className="mt-2 font-feminine text-2xl tracking-[0.14em] text-shimmer">Hetzel401</p>
    </div>
  );
}
