import { useEffect, useRef, useCallback } from "react";
import { useCustomization } from "@/context/CustomizationContext";

export default function useKeyboardShortcuts(setSettingsOpen?: (v: boolean | ((prev: boolean) => boolean)) => void) {
  const { config, update } = useCustomization();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ctrl+, -> toggle settings
      if ((e.ctrlKey || e.metaKey) && e.key === ",") {
        e.preventDefault();
        setSettingsOpen?.((v) => !v);
      }
      // Ctrl+E -> toggle all effects off/on
      if ((e.ctrlKey || e.metaKey) && e.key === "e" && !e.shiftKey) {
        e.preventDefault();
        const anyOn = config.snowEffect || config.rainEffect || config.fireflyEffect || config.scanlineEffect || config.vignetteEffect || config.bloomEffect || config.confettiEffect;
        if (anyOn) {
          update("snowEffect", false);
          update("rainEffect", false);
          update("fireflyEffect", false);
          update("scanlineEffect", false);
          update("vignetteEffect", false);
          update("bloomEffect", false);
          update("confettiEffect", false);
        }
      }
      // Ctrl+D -> toggle dark mode
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        update("darkMode", !config.darkMode);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [config, update, setSettingsOpen]);
}
