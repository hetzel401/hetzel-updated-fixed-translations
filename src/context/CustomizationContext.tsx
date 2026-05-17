import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export type CursorStyle = "default" | "dot" | "ring" | "crosshair" | "emoji" | "trail" | "glow" | "none";
export type BackgroundType = "orbs" | "default" | "gradient" | "particles" | "matrix" | "stars" | "custom-image" | "solid" | "aurora" | "waves";
export type BackgroundImageFit = "cover" | "contain" | "stretch" | "repeat";
export type BackgroundImagePosition = "center" | "top" | "bottom";
export type NowPlayingProgressStyle = "smooth" | "thin" | "blocks";
export type CursorBlendMode = "normal" | "difference";
export type WidgetPosition = "bottom-left" | "bottom-right" | "top-left" | "top-right";
export type ThemeAccent = "purple" | "blue" | "green" | "pink" | "orange" | "red" | "cyan" | "yellow";
export type FontFamily = "default" | "inter" | "jetbrains" | "space-grotesk" | "fira-code" | "poppins" | "playfair" | "roboto-mono";
export type ThemePreset = "custom" | "cyberpunk" | "dracula" | "nord" | "gruvbox" | "catppuccin" | "tokyo-night" | "rose-pine" | "synthwave";

export interface CustomizationState {
  // Cursor
  cursorStyle: CursorStyle;
  cursorColor: string;
  cursorSize: number;
  cursorTrailLength: number;
  cursorEmoji: string;
  /** Improves visibility on mixed light/dark UI */
  cursorBlendMode: CursorBlendMode;

  // Background
  backgroundType: BackgroundType;
  backgroundGradient: string;
  backgroundImage: string;
  backgroundOpacity: number;
  backgroundBlur: number;
  backgroundColor: string;
  backgroundSpeed: number;
  particleCount: number;
  particleColor: string;
  backgroundImageFit: BackgroundImageFit;
  backgroundImagePosition: BackgroundImagePosition;
  backgroundOverlayOpacity: number;
  backgroundOverlayTint: string;

  // Theme
  darkMode: boolean;
  accentColor: ThemeAccent;
  themePreset: ThemePreset;
  glassOpacity: number;
  borderGlow: boolean;
  animationsEnabled: boolean;
  reducedMotion: boolean;

  // Fonts
  fontFamily: FontFamily;
  monoFont: FontFamily;

  // Widgets
  nowPlayingPosition: WidgetPosition;
  statusBannerPosition: WidgetPosition;
  nowPlayingVisible: boolean;
  statusBannerVisible: boolean;
  nowPlayingMinimized: boolean;
  nowPlayingStyle: "default" | "vinyl" | "minimal" | "fullart" | "neon" | "dock";
  nowPlayingSpotifyProfileUrl: string;
  nowPlayingWidgetScale: number;
  nowPlayingVisualizerMode: "bars" | "wave" | "spectrum";
  nowPlayingVisualizerDefault: boolean;
  nowPlayingShowQueueHint: boolean;
  nowPlayingWidgetOpacity: number;
  nowPlayingProgressStyle: NowPlayingProgressStyle;
  nowPlayingShowQuickActions: boolean;
  statusBannerStyle: "default" | "minimal" | "detailed" | "pill" | "hud" | "orbit" | "ribbon";
  statusBannerShowAvatar: boolean;
  statusBannerCustomTagline: string;
  statusBannerShowActivity: boolean;
  statusBannerShowElapsed: boolean;
  statusBannerPulse: boolean;
  statusBannerShowCustomStatus: boolean;
  statusBannerShowSpotifyLine: boolean;
  clockWidgetVisible: boolean;
  clockWidgetPosition: WidgetPosition;
  clockFormat: "12h" | "24h";
  clockShowSeconds: boolean;
  quoteWidgetVisible: boolean;

  // Layout
  showScrollIndicator: boolean;
  showScrollProgress: boolean;
  showBackToTop: boolean;
  navStyle: "glass" | "solid" | "minimal" | "hidden";
  cardStyle: "glass" | "solid" | "outlined" | "floating";
  fontScale: number;
  sectionAnimations: boolean;

  // Effects
  snowEffect: boolean;
  rainEffect: boolean;
  fireflyEffect: boolean;
  scanlineEffect: boolean;
  vignetteEffect: boolean;
  glitchEffect: boolean;
  bloomEffect: boolean;
  confettiEffect: boolean;
  clickRipple: boolean;
  customScrollbar: boolean;
  loadingScreen: boolean;

  /** 0.06–0.28; lower = snappier ring follow */
  cursorRingLag: number;

  // Sound
  clickSound: boolean;
  hoverSound: boolean;
  ambientSound: boolean;
}

/** Default hero gradient; used when stored gradient is empty or invalid */
export const DEFAULT_BACKGROUND_GRADIENT =
  "linear-gradient(135deg, #0a0015, #1a0030, #0d0020)";

const DEFAULT_STATE: CustomizationState = {
  cursorStyle: "dot",
  cursorColor: "hsl(260 85% 70%)",
  cursorSize: 8,
  cursorTrailLength: 5,
  cursorEmoji: "\u2728",
  cursorBlendMode: "normal",
  backgroundType: "orbs",
  backgroundGradient: DEFAULT_BACKGROUND_GRADIENT,
  backgroundImage: "",
  backgroundOpacity: 100,
  backgroundBlur: 0,
  backgroundColor: "#000000",
  backgroundSpeed: 50,
  particleCount: 50,
  particleColor: "#a78bfa",
  backgroundImageFit: "cover",
  backgroundImagePosition: "center",
  backgroundOverlayOpacity: 0,
  backgroundOverlayTint: "#000000",
  darkMode: true,
  accentColor: "purple",
  themePreset: "custom",
  glassOpacity: 40,
  borderGlow: true,
  animationsEnabled: true,
  reducedMotion: false,
  fontFamily: "default",
  monoFont: "default",
  nowPlayingPosition: "bottom-right",
  statusBannerPosition: "bottom-left",
  nowPlayingVisible: true,
  statusBannerVisible: true,
  nowPlayingMinimized: false,
  nowPlayingStyle: "default",
  nowPlayingSpotifyProfileUrl: "https://open.spotify.com/user/31kpf3d5pmpmpbz42b3igtsaiogm",
  nowPlayingWidgetScale: 100,
  nowPlayingVisualizerMode: "bars",
  nowPlayingVisualizerDefault: false,
  nowPlayingShowQueueHint: true,
  nowPlayingWidgetOpacity: 100,
  nowPlayingProgressStyle: "smooth",
  nowPlayingShowQuickActions: true,
  statusBannerStyle: "default",
  statusBannerShowAvatar: true,
  statusBannerCustomTagline: "",
  statusBannerShowActivity: true,
  statusBannerShowElapsed: true,
  statusBannerPulse: true,
  statusBannerShowCustomStatus: true,
  statusBannerShowSpotifyLine: false,
  clockWidgetVisible: false,
  clockWidgetPosition: "top-right",
  clockFormat: "12h",
  clockShowSeconds: true,
  quoteWidgetVisible: false,
  showScrollIndicator: true,
  showScrollProgress: true,
  showBackToTop: true,
  navStyle: "glass",
  cardStyle: "glass",
  fontScale: 100,
  sectionAnimations: true,
  snowEffect: false,
  rainEffect: false,
  fireflyEffect: false,
  scanlineEffect: false,
  vignetteEffect: false,
  glitchEffect: false,
  bloomEffect: false,
  confettiEffect: false,
  clickRipple: true,
  customScrollbar: true,
  loadingScreen: true,
  cursorRingLag: 12,
  clickSound: false,
  hoverSound: false,
  ambientSound: false,
};

type CustomizationContextValue = {
  config: CustomizationState;
  update: <K extends keyof CustomizationState>(key: K, value: CustomizationState[K]) => void;
  reset: () => void;
  exportConfig: () => string;
  importConfig: (json: string) => boolean;
};

const CustomizationContext = createContext<CustomizationContextValue | null>(null);

const STORAGE_KEY = "hetzel-customization";

function loadConfig(): CustomizationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_STATE };
}

export const ACCENT_COLORS: Record<ThemeAccent, string> = {
  purple: "260 85% 70%",
  blue: "220 90% 60%",
  green: "150 80% 50%",
  pink: "330 85% 65%",
  orange: "25 95% 60%",
  red: "0 85% 60%",
  cyan: "185 90% 55%",
  yellow: "50 95% 55%",
};

export const THEME_PRESETS: Record<ThemePreset, { accent: string; bg: string; fg: string; card: string; secondary: string; muted: string; mutedFg: string; border: string; label: string }> = {
  custom:      { accent: "260 85% 70%", bg: "260 15% 4%", fg: "270 20% 98%", card: "260 20% 7%", secondary: "260 25% 10%", muted: "260 20% 13%", mutedFg: "260 20% 60%", border: "260 25% 12%", label: "Custom" },
  cyberpunk:   { accent: "55 100% 50%", bg: "240 10% 3%", fg: "55 100% 90%", card: "240 15% 6%", secondary: "240 15% 10%", muted: "240 10% 15%", mutedFg: "55 30% 55%", border: "55 80% 20%", label: "Cyberpunk" },
  dracula:     { accent: "265 90% 78%", bg: "231 15% 18%", fg: "60 30% 96%", card: "232 14% 21%", secondary: "230 14% 24%", muted: "232 14% 28%", mutedFg: "225 27% 51%", border: "232 14% 25%", label: "Dracula" },
  nord:        { accent: "213 32% 52%", bg: "220 16% 22%", fg: "219 28% 88%", card: "220 16% 25%", secondary: "220 16% 28%", muted: "220 16% 30%", mutedFg: "219 28% 65%", border: "220 16% 30%", label: "Nord" },
  gruvbox:     { accent: "27 87% 67%", bg: "0 0% 16%", fg: "49 87% 84%", card: "20 5% 19%", secondary: "20 5% 22%", muted: "20 5% 25%", mutedFg: "40 20% 55%", border: "20 5% 25%", label: "Gruvbox" },
  catppuccin:  { accent: "267 83% 80%", bg: "240 21% 15%", fg: "226 64% 88%", card: "240 21% 18%", secondary: "240 21% 21%", muted: "240 21% 24%", mutedFg: "228 24% 55%", border: "240 21% 22%", label: "Catppuccin" },
  "tokyo-night": { accent: "230 80% 70%", bg: "235 18% 14%", fg: "224 30% 85%", card: "235 18% 17%", secondary: "235 18% 20%", muted: "235 18% 23%", mutedFg: "224 14% 50%", border: "235 18% 22%", label: "Tokyo Night" },
  "rose-pine":  { accent: "280 50% 76%", bg: "249 22% 12%", fg: "245 50% 91%", card: "249 22% 15%", secondary: "249 22% 18%", muted: "249 22% 21%", mutedFg: "249 12% 47%", border: "249 22% 19%", label: "Rose Pine" },
  synthwave:   { accent: "300 90% 65%", bg: "260 30% 5%", fg: "300 50% 90%", card: "260 30% 8%", secondary: "260 30% 12%", muted: "260 30% 15%", mutedFg: "280 30% 55%", border: "260 30% 14%", label: "Synthwave" },
};

export const FONT_OPTIONS: Record<FontFamily, string> = {
  default: "'Inter', ui-sans-serif, system-ui",
  inter: "'Inter', sans-serif",
  "jetbrains": "'JetBrains Mono', monospace",
  "space-grotesk": "'Space Grotesk', sans-serif",
  "fira-code": "'Fira Code', monospace",
  poppins: "'Poppins', sans-serif",
  playfair: "'Playfair Display', serif",
  "roboto-mono": "'Roboto Mono', monospace",
};

export function CustomizationProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<CustomizationState>(loadConfig);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  // Apply theme preset
  useEffect(() => {
    const preset = THEME_PRESETS[config.themePreset];
    if (config.themePreset !== "custom") {
      document.documentElement.style.setProperty("--accent", preset.accent);
      document.documentElement.style.setProperty("--primary", preset.accent);
      document.documentElement.style.setProperty("--ring", preset.accent);
      document.documentElement.style.setProperty("--glow", preset.accent);
      document.documentElement.style.setProperty("--background", preset.bg);
      document.documentElement.style.setProperty("--foreground", preset.fg);
      document.documentElement.style.setProperty("--card", preset.card);
      document.documentElement.style.setProperty("--card-foreground", preset.fg);
      document.documentElement.style.setProperty("--secondary", preset.secondary);
      document.documentElement.style.setProperty("--secondary-foreground", preset.fg);
      document.documentElement.style.setProperty("--muted", preset.muted);
      document.documentElement.style.setProperty("--muted-foreground", preset.mutedFg);
      document.documentElement.style.setProperty("--border", preset.border);
      document.documentElement.style.setProperty("--input", preset.border);
    }
  }, [config.themePreset]);

  // Apply accent color (only when custom)
  useEffect(() => {
    if (config.themePreset === "custom") {
      const hsl = ACCENT_COLORS[config.accentColor];
      document.documentElement.style.setProperty("--accent", hsl);
      document.documentElement.style.setProperty("--primary", hsl);
      document.documentElement.style.setProperty("--ring", hsl);
      document.documentElement.style.setProperty("--glow", hsl);
    }
  }, [config.accentColor, config.themePreset]);

  // Apply dark/light mode (only when custom preset)
  useEffect(() => {
    if (config.themePreset !== "custom") return;
    if (config.darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.setProperty("--background", "260 15% 4%");
      document.documentElement.style.setProperty("--foreground", "270 20% 98%");
      document.documentElement.style.setProperty("--card", "260 20% 7%");
      document.documentElement.style.setProperty("--card-foreground", "270 20% 98%");
      document.documentElement.style.setProperty("--secondary", "260 25% 10%");
      document.documentElement.style.setProperty("--secondary-foreground", "270 20% 95%");
      document.documentElement.style.setProperty("--muted", "260 20% 13%");
      document.documentElement.style.setProperty("--muted-foreground", "260 20% 60%");
      document.documentElement.style.setProperty("--border", "260 25% 12%");
      document.documentElement.style.setProperty("--input", "260 25% 12%");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.setProperty("--background", "270 20% 98%");
      document.documentElement.style.setProperty("--foreground", "260 15% 8%");
      document.documentElement.style.setProperty("--card", "0 0% 100%");
      document.documentElement.style.setProperty("--card-foreground", "260 15% 8%");
      document.documentElement.style.setProperty("--secondary", "260 10% 92%");
      document.documentElement.style.setProperty("--secondary-foreground", "260 15% 15%");
      document.documentElement.style.setProperty("--muted", "260 10% 90%");
      document.documentElement.style.setProperty("--muted-foreground", "260 10% 40%");
      document.documentElement.style.setProperty("--border", "260 10% 85%");
      document.documentElement.style.setProperty("--input", "260 10% 85%");
    }
  }, [config.darkMode, config.themePreset]);

  // Apply font family
  useEffect(() => {
    document.documentElement.style.setProperty("--app-font-sans", FONT_OPTIONS[config.fontFamily]);
    if (config.monoFont !== "default") {
      document.documentElement.style.setProperty("--app-font-mono", FONT_OPTIONS[config.monoFont]);
    }
  }, [config.fontFamily, config.monoFont]);

  // Apply font scale
  useEffect(() => {
    document.documentElement.style.fontSize = `${config.fontScale}%`;
    return () => { document.documentElement.style.fontSize = ""; };
  }, [config.fontScale]);

  useEffect(() => {
    document.documentElement.style.setProperty("--glass-alpha", String(config.glassOpacity / 100));
  }, [config.glassOpacity]);

  // Apply custom scrollbar
  useEffect(() => {
    if (config.customScrollbar) {
      document.documentElement.classList.add("custom-scrollbar");
    } else {
      document.documentElement.classList.remove("custom-scrollbar");
    }
  }, [config.customScrollbar]);

  const update = useCallback(<K extends keyof CustomizationState>(key: K, value: CustomizationState[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setConfig({ ...DEFAULT_STATE });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const exportConfig = useCallback(() => JSON.stringify(config, null, 2), [config]);

  const importConfig = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      setConfig({ ...DEFAULT_STATE, ...parsed });
      return true;
    } catch {
      return false;
    }
  }, []);

  return (
    <CustomizationContext.Provider value={{ config, update, reset, exportConfig, importConfig }}>
      {children}
    </CustomizationContext.Provider>
  );
}

export function useCustomization() {
  const ctx = useContext(CustomizationContext);
  if (!ctx) throw new Error("useCustomization must be used inside CustomizationProvider");
  return ctx;
}
