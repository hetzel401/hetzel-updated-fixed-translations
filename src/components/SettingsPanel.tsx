import { useState } from "react";
import {
  Settings, X, MousePointer2, Paintbrush, Palette, Layout, Sparkles, RotateCcw,
  Download, Upload, Music, MessageSquare, Image, Type, Clock, Quote,
  Sun, Moon,
} from "lucide-react";
import {
  useCustomization,
  ACCENT_COLORS,
  THEME_PRESETS,
  FONT_OPTIONS,
  DEFAULT_BACKGROUND_GRADIENT,
  type CursorStyle,
  type BackgroundType,
  type BackgroundImageFit,
  type BackgroundImagePosition,
  type WidgetPosition,
  type ThemeAccent,
  type ThemePreset,
  type FontFamily,
  type NowPlayingProgressStyle,
  type CursorBlendMode,
} from "@/context/CustomizationContext";

const TABS = [
  { id: "cursor", icon: MousePointer2, label: "Cursor" },
  { id: "background", icon: Paintbrush, label: "Background" },
  { id: "theme", icon: Palette, label: "Theme" },
  { id: "widgets", icon: Layout, label: "Widgets" },
  { id: "effects", icon: Sparkles, label: "Effects" },
  { id: "fonts", icon: Type, label: "Fonts" },
  { id: "advanced", icon: Settings, label: "Advanced" },
] as const;

type TabId = typeof TABS[number]["id"];

const CURSOR_OPTIONS: { value: CursorStyle; label: string }[] = [
  { value: "dot", label: "Dot + Ring" },
  { value: "ring", label: "Ring only" },
  { value: "crosshair", label: "Crosshair" },
  { value: "glow", label: "Glow" },
  { value: "trail", label: "Trail" },
  { value: "emoji", label: "Emoji" },
  { value: "none", label: "System Default" },
];

const BG_OPTIONS: { value: BackgroundType; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "gradient", label: "Gradient" },
  { value: "particles", label: "Particles" },
  { value: "stars", label: "Starfield" },
  { value: "matrix", label: "Matrix" },
  { value: "aurora", label: "Aurora" },
  { value: "waves", label: "Waves" },
  { value: "solid", label: "Solid Color" },
  { value: "custom-image", label: "Custom Image" },
];

const GRADIENT_PRESETS = [
  { label: "Midnight", value: DEFAULT_BACKGROUND_GRADIENT },
  { label: "Ocean", value: "linear-gradient(135deg, #000428, #004e92)" },
  { label: "Sunset", value: "linear-gradient(135deg, #1a0000, #4a1a2e, #2d1b4e)" },
  { label: "Forest", value: "linear-gradient(135deg, #000a00, #003300, #001a00)" },
  { label: "Neon", value: "linear-gradient(135deg, #0d001a, #1a0033, #330066)" },
  { label: "Cyber", value: "linear-gradient(135deg, #000000, #0a0a2e, #1a0030)" },
  { label: "Rose", value: "linear-gradient(135deg, #1a0010, #2d0020, #1a0020)" },
  { label: "Arctic", value: "linear-gradient(135deg, #000a1a, #001a33, #00264d)" },
];

const BG_FIT_OPTIONS: { value: BackgroundImageFit; label: string }[] = [
  { value: "cover", label: "Cover" },
  { value: "contain", label: "Contain" },
  { value: "stretch", label: "Stretch" },
  { value: "repeat", label: "Tile" },
];

const BG_POS_OPTIONS: { value: BackgroundImagePosition; label: string }[] = [
  { value: "center", label: "Center" },
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
];

const PROGRESS_STYLE_OPTIONS: { value: NowPlayingProgressStyle; label: string }[] = [
  { value: "smooth", label: "Smooth" },
  { value: "thin", label: "Thin" },
  { value: "blocks", label: "Blocks" },
];

const CURSOR_BLEND_OPTIONS: { value: CursorBlendMode; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "difference", label: "Difference" },
];

const POSITION_OPTIONS: { value: WidgetPosition; label: string }[] = [
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-right", label: "Bottom Right" },
  { value: "top-left", label: "Top Left" },
  { value: "top-right", label: "Top Right" },
];

const EMOJI_PRESETS = ["\u2728", "\uD83D\uDD25", "\uD83D\uDC9C", "\u2B50", "\uD83C\uDFAF", "\uD83D\uDC8E", "\uD83C\uDF19", "\uD83D\uDC7E", "\uD83E\uDD8B", "\uD83C\uDFB5", "\u26A1", "\uD83C\uDF38"];

const FONT_LABELS: Record<FontFamily, string> = {
  default: "Default (Inter)",
  inter: "Inter",
  jetbrains: "JetBrains Mono",
  "space-grotesk": "Space Grotesk",
  "fira-code": "Fira Code",
  poppins: "Poppins",
  playfair: "Playfair Display",
  "roboto-mono": "Roboto Mono",
};

function Slider({ value, onChange, min = 0, max = 100, step = 1, label, suffix = "" }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; label: string; suffix?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
        <span className="font-mono text-xs text-accent">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-secondary cursor-pointer accent-[hsl(var(--accent))]"
      />
    </div>
  );
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button onClick={() => onChange(!value)} className="flex items-center justify-between w-full py-1.5">
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
      <div className={`w-8 h-4.5 rounded-full transition-colors flex items-center px-0.5 ${value ? "bg-accent" : "bg-secondary"}`}>
        <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform ${value ? "translate-x-3.5" : "translate-x-0"}`} />
      </div>
    </button>
  );
}

function SelectGrid<T extends string>({ value, onChange, options }: {
  value: T; onChange: (v: T) => void; options: { value: T; label: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)}
          className={`rounded-lg px-3 py-2 font-mono text-xs transition-all ${value === o.value ? "bg-accent/20 text-accent border border-accent/40" : "bg-secondary/60 text-muted-foreground border border-transparent hover:bg-secondary"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabId>("cursor");
  const { config, update, reset, exportConfig, importConfig } = useCustomization();

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => importConfig(ev.target?.result as string);
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExport = () => {
    const blob = new Blob([exportConfig()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "hetzel-theme.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => { update("backgroundImage", ev.target?.result as string); update("backgroundType", "custom-image"); };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <>
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2">
        <button
          onClick={() => setOpen(!open)}
          className="glass rounded-full border border-border/60 bg-card/80 backdrop-blur-xl p-3 shadow-lg hover:shadow-[0_0_20px_hsl(var(--accent)/0.3)] transition-all hover:scale-110 group relative"
          aria-label="Open settings"
          title="Customize"
        >
          <Settings className={`h-5 w-5 text-accent transition-transform duration-500 ${open ? "rotate-180" : "group-hover:rotate-90"}`} />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-accent animate-pulse-glow" />
        </button>

        <button
          onClick={() => { update("darkMode", !config.darkMode); if (config.themePreset !== "custom") update("themePreset", "custom"); }}
          className="glass rounded-full border border-border/60 bg-card/80 backdrop-blur-xl p-3 shadow-lg hover:shadow-[0_0_20px_hsl(var(--accent)/0.3)] transition-all hover:scale-110 group"
          aria-label={config.darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={config.darkMode ? "Light mode" : "Dark mode"}
        >
          {config.darkMode ? (
            <Sun className="h-5 w-5 text-amber-400 transition-transform duration-500 group-hover:rotate-90" />
          ) : (
            <Moon className="h-5 w-5 text-indigo-400 transition-transform duration-500 group-hover:-rotate-12" />
          )}
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 z-[100] w-[380px] max-w-[90vw] bg-card/95 backdrop-blur-2xl border-l border-border/60 shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border/60">
              <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                <Palette className="h-5 w-5 text-accent" />
                Customize
              </h2>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-1 p-2 border-b border-border/40 overflow-x-auto scrollbar-none">
              {TABS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 font-mono text-xs whitespace-nowrap transition-all ${tab === t.id ? "bg-accent/15 text-accent" : "text-muted-foreground hover:bg-secondary"}`}
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* CURSOR */}
              {tab === "cursor" && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-border/40 bg-secondary/15 p-4 space-y-4">
                    <h3 className="font-mono text-[11px] font-medium uppercase tracking-wider text-foreground/90">Pointer</h3>
                    <div className="space-y-3">
                      <span className="font-mono text-xs text-muted-foreground">Style</span>
                      <SelectGrid value={config.cursorStyle} onChange={(v) => update("cursorStyle", v)} options={CURSOR_OPTIONS} />
                    </div>
                    <div className="space-y-3">
                      <span className="font-mono text-xs text-muted-foreground">Color</span>
                      <div className="flex items-center gap-2">
                        <input type="color" value={config.cursorColor.startsWith("#") ? config.cursorColor : "#a78bfa"} onChange={(e) => update("cursorColor", e.target.value)} className="w-8 h-8 rounded-lg border border-border cursor-pointer" />
                        <input type="text" value={config.cursorColor} onChange={(e) => update("cursorColor", e.target.value)} className="flex-1 rounded-lg bg-secondary px-3 py-2 font-mono text-xs text-foreground border border-border/60" />
                      </div>
                    </div>
                    <Slider label="Size" value={config.cursorSize} onChange={(v) => update("cursorSize", v)} min={4} max={24} />
                    {(config.cursorStyle === "dot" || config.cursorStyle === "ring" || config.cursorStyle === "default" || config.cursorStyle === "glow") && (
                      <Slider label="Ring follow (lag)" value={config.cursorRingLag} onChange={(v) => update("cursorRingLag", v)} min={5} max={30} />
                    )}
                    <div className="space-y-2">
                      <span className="font-mono text-xs text-muted-foreground">Blend mode</span>
                      <SelectGrid value={config.cursorBlendMode} onChange={(v) => update("cursorBlendMode", v)} options={CURSOR_BLEND_OPTIONS} />
                      <p className="font-mono text-[10px] text-muted-foreground/80">Difference can improve contrast on bright or noisy areas.</p>
                    </div>
                    {config.cursorStyle === "trail" && <Slider label="Trail Length" value={config.cursorTrailLength} onChange={(v) => update("cursorTrailLength", v)} min={3} max={15} />}
                    {config.cursorStyle === "emoji" && (
                      <div className="space-y-2">
                        <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Emoji</h3>
                        <div className="flex flex-wrap gap-2">
                          {EMOJI_PRESETS.map((e) => (
                            <button key={e} onClick={() => update("cursorEmoji", e)} className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${config.cursorEmoji === e ? "bg-accent/20 border border-accent/40 scale-110" : "bg-secondary hover:bg-secondary/80"}`}>{e}</button>
                          ))}
                        </div>
                        <input type="text" value={config.cursorEmoji} onChange={(e) => update("cursorEmoji", e.target.value)} className="w-full rounded-lg bg-secondary px-3 py-2 font-mono text-xs border border-border/60" placeholder="Type custom emoji..." maxLength={4} />
                      </div>
                    )}
                  </div>
                  <div className="rounded-xl border border-border/40 bg-secondary/10 p-3">
                    <Toggle label="Click ripple on press" value={config.clickRipple} onChange={(v) => update("clickRipple", v)} />
                  </div>
                </div>
              )}

              {/* BACKGROUND */}
              {tab === "background" && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-border/40 bg-secondary/15 p-4 space-y-4">
                    <h3 className="font-mono text-[11px] font-medium uppercase tracking-wider text-foreground/90">Background type</h3>
                    <SelectGrid value={config.backgroundType} onChange={(v) => update("backgroundType", v)} options={BG_OPTIONS} />
                  </div>

                  {config.backgroundType === "gradient" && (
                    <div className="rounded-xl border border-border/40 bg-secondary/15 p-4 space-y-3">
                      <h3 className="font-mono text-[11px] font-medium uppercase tracking-wider text-foreground/90">Gradient</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {GRADIENT_PRESETS.map((p) => (
                          <button key={p.label} onClick={() => update("backgroundGradient", p.value)} className="group relative rounded-lg overflow-hidden h-12 border border-border/40 hover:border-accent/60 transition-all">
                            <div className="absolute inset-0" style={{ background: p.value }} />
                            <span className="relative font-mono text-[9px] text-white/70 group-hover:text-white">{p.label}</span>
                          </button>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <span className="font-mono text-xs text-muted-foreground">Custom CSS gradient</span>
                        <textarea
                          value={config.backgroundGradient}
                          onChange={(e) => update("backgroundGradient", e.target.value)}
                          onBlur={() => {
                            if (!config.backgroundGradient.trim()) {
                              update("backgroundGradient", DEFAULT_BACKGROUND_GRADIENT);
                            }
                          }}
                          rows={3}
                          spellCheck={false}
                          className="w-full resize-y rounded-lg border border-border/60 bg-secondary px-3 py-2 font-mono text-[11px] text-foreground"
                          placeholder="linear-gradient(135deg, #0a0015, #1a0030)"
                        />
                        <p className="font-mono text-[10px] text-muted-foreground/80">Must be a non-empty CSS background (e.g. linear-gradient or radial-gradient). Empty values reset on blur.</p>
                      </div>
                    </div>
                  )}

                  {config.backgroundType === "solid" && (
                    <div className="rounded-xl border border-border/40 bg-secondary/15 p-4 flex items-center gap-2">
                      <input type="color" value={config.backgroundColor} onChange={(e) => update("backgroundColor", e.target.value)} className="w-8 h-8 rounded-lg border border-border cursor-pointer" />
                      <span className="font-mono text-xs text-muted-foreground">{config.backgroundColor}</span>
                    </div>
                  )}

                  {config.backgroundType === "custom-image" && (
                    <div className="rounded-xl border border-border/40 bg-secondary/15 p-4 space-y-4">
                      <h3 className="font-mono text-[11px] font-medium uppercase tracking-wider text-foreground/90">Custom image</h3>
                      <button type="button" onClick={handleImageUpload} className="w-full rounded-xl border-2 border-dashed border-border/60 p-6 text-center hover:border-accent/40 transition-colors">
                        <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <span className="font-mono text-xs text-muted-foreground">Upload from device</span>
                      </button>
                      <div className="space-y-1">
                        <span className="font-mono text-xs text-muted-foreground">Image URL or data URL</span>
                        <input
                          type="text"
                          value={config.backgroundImage}
                          onChange={(e) => update("backgroundImage", e.target.value)}
                          className="w-full rounded-lg border border-border/60 bg-secondary px-3 py-2 font-mono text-[11px] text-foreground"
                          placeholder="https://… or paste data:image/…"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            update("backgroundImage", "");
                            update("backgroundType", "default");
                          }}
                          className="rounded-lg border border-border/60 bg-secondary/80 px-3 py-2 font-mono text-xs text-muted-foreground hover:bg-secondary"
                        >
                          Clear image
                        </button>
                      </div>
                      <div className="space-y-2">
                        <span className="font-mono text-xs text-muted-foreground">Fit mode</span>
                        <SelectGrid value={config.backgroundImageFit} onChange={(v) => update("backgroundImageFit", v)} options={BG_FIT_OPTIONS} />
                      </div>
                      <div className="space-y-2">
                        <span className="font-mono text-xs text-muted-foreground">Focal alignment</span>
                        <SelectGrid value={config.backgroundImagePosition} onChange={(v) => update("backgroundImagePosition", v)} options={BG_POS_OPTIONS} />
                      </div>
                    </div>
                  )}

                  {config.backgroundType === "particles" && (
                    <div className="rounded-xl border border-border/40 bg-secondary/15 p-4 space-y-3">
                      <Slider label="Particle Count" value={config.particleCount} onChange={(v) => update("particleCount", v)} min={10} max={150} />
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">Particle Color</span>
                        <input type="color" value={config.particleColor} onChange={(e) => update("particleColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer" />
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border border-border/40 bg-secondary/10 p-4 space-y-4">
                    <h3 className="font-mono text-[11px] font-medium uppercase tracking-wider text-foreground/90">Backdrop</h3>
                    <Slider label="Layer opacity" value={config.backgroundOpacity} onChange={(v) => update("backgroundOpacity", v)} suffix="%" />
                    <Slider label="Blur" value={config.backgroundBlur} onChange={(v) => update("backgroundBlur", v)} max={20} suffix="px" />
                  </div>

                  <div className="rounded-xl border border-border/40 bg-secondary/10 p-4 space-y-3">
                    <h3 className="font-mono text-[11px] font-medium uppercase tracking-wider text-foreground/90">Tint overlay</h3>
                    <p className="font-mono text-[10px] text-muted-foreground/80">Applies on top of any background type.</p>
                    <Slider label="Overlay strength" value={config.backgroundOverlayOpacity} onChange={(v) => update("backgroundOverlayOpacity", v)} max={90} suffix="%" />
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.backgroundOverlayTint?.startsWith("#") ? config.backgroundOverlayTint : "#000000"}
                        onChange={(e) => update("backgroundOverlayTint", e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded-lg border border-border"
                      />
                      <input
                        type="text"
                        value={config.backgroundOverlayTint}
                        onChange={(e) => update("backgroundOverlayTint", e.target.value)}
                        className="flex-1 rounded-lg border border-border/60 bg-secondary px-3 py-2 font-mono text-xs text-foreground"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* THEME */}
              {tab === "theme" && (
                <>
                  <div className="space-y-3">
                    <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Theme Presets</h3>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(Object.keys(THEME_PRESETS) as ThemePreset[]).map((p) => (
                        <button key={p} onClick={() => update("themePreset", p)}
                          className={`rounded-lg px-2 py-2.5 font-mono text-[11px] transition-all ${config.themePreset === p ? "bg-accent/20 text-accent border border-accent/40" : "bg-secondary/60 text-muted-foreground border border-transparent hover:bg-secondary"}`}
                        >
                          {THEME_PRESETS[p].label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {config.themePreset === "custom" && (
                    <>
                      <Toggle label="Dark Mode" value={config.darkMode} onChange={(v) => update("darkMode", v)} />
                      <div className="space-y-3">
                        <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Accent Color</h3>
                        <div className="flex flex-wrap gap-2">
                          {(Object.keys(ACCENT_COLORS) as ThemeAccent[]).map((c) => (
                            <button key={c} onClick={() => update("accentColor", c)}
                              className={`w-10 h-10 rounded-xl transition-all ${config.accentColor === c ? "ring-2 ring-offset-2 ring-offset-background scale-110" : "hover:scale-105"}`}
                              style={{ background: `hsl(${ACCENT_COLORS[c]})`, ringColor: `hsl(${ACCENT_COLORS[c]})` }}
                              title={c}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  <Slider label="Glass Opacity" value={config.glassOpacity} onChange={(v) => update("glassOpacity", v)} suffix="%" />
                  <p className="font-mono text-[10px] text-muted-foreground/80">Controls the --glass-alpha CSS variable (see .glass in global styles).</p>
                  <Toggle label="Border Glow on Hover" value={config.borderGlow} onChange={(v) => update("borderGlow", v)} />
                  <Toggle label="Animations Enabled" value={config.animationsEnabled} onChange={(v) => update("animationsEnabled", v)} />
                  <Toggle label="Reduce motion (accessibility)" value={config.reducedMotion} onChange={(v) => update("reducedMotion", v)} />
                  <Toggle label="Section Reveal Animations" value={config.sectionAnimations} onChange={(v) => update("sectionAnimations", v)} />
                  <Slider label="Font Scale" value={config.fontScale} onChange={(v) => update("fontScale", v)} min={75} max={150} suffix="%" />
                </>
              )}

              {/* WIDGETS */}
              {tab === "widgets" && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-border/40 bg-secondary/15 p-4 space-y-3">
                    <h3 className="font-mono text-[11px] font-medium uppercase tracking-wider text-foreground/90 flex items-center gap-2">
                      <Music className="h-3.5 w-3.5 text-accent" /> Now playing
                    </h3>
                    <Toggle label="Visible" value={config.nowPlayingVisible} onChange={(v) => update("nowPlayingVisible", v)} />
                    <Toggle label="Start minimized (when music is live)" value={config.nowPlayingMinimized} onChange={(v) => update("nowPlayingMinimized", v)} />
                    <SelectGrid
                      value={config.nowPlayingStyle}
                      onChange={(v) => update("nowPlayingStyle", v)}
                      options={[
                        { value: "default", label: "Default" },
                        { value: "vinyl", label: "Vinyl" },
                        { value: "minimal", label: "Minimal" },
                        { value: "fullart", label: "Full Art" },
                        { value: "neon", label: "Neon" },
                        { value: "dock", label: "Dock" },
                      ]}
                    />
                    <SelectGrid value={config.nowPlayingPosition} onChange={(v) => update("nowPlayingPosition", v)} options={POSITION_OPTIONS} />
                    <Slider label="Widget scale" value={config.nowPlayingWidgetScale} onChange={(v) => update("nowPlayingWidgetScale", v)} min={80} max={120} suffix="%" />
                    <Slider label="Widget opacity" value={config.nowPlayingWidgetOpacity} onChange={(v) => update("nowPlayingWidgetOpacity", v)} min={60} max={100} suffix="%" />
                    <div className="space-y-2">
                      <span className="font-mono text-xs text-muted-foreground">Progress bar style</span>
                      <SelectGrid value={config.nowPlayingProgressStyle} onChange={(v) => update("nowPlayingProgressStyle", v)} options={PROGRESS_STYLE_OPTIONS} />
                    </div>
                    <div className="space-y-1">
                      <span className="font-mono text-xs text-muted-foreground">Spotify profile URL</span>
                      <input
                        type="url"
                        value={config.nowPlayingSpotifyProfileUrl}
                        onChange={(e) => update("nowPlayingSpotifyProfileUrl", e.target.value)}
                        className="w-full rounded-lg border border-border/60 bg-secondary px-3 py-2 font-mono text-[11px] text-foreground"
                        placeholder="https://open.spotify.com/user/…"
                      />
                    </div>
                    <SelectGrid
                      value={config.nowPlayingVisualizerMode}
                      onChange={(v) => update("nowPlayingVisualizerMode", v)}
                      options={[
                        { value: "bars", label: "Bars" },
                        { value: "wave", label: "Wave" },
                        { value: "spectrum", label: "Spectrum" },
                      ]}
                    />
                    <Toggle label="Visualizer on by default" value={config.nowPlayingVisualizerDefault} onChange={(v) => update("nowPlayingVisualizerDefault", v)} />
                    <Toggle label="Queue / palette hint on hover" value={config.nowPlayingShowQueueHint} onChange={(v) => update("nowPlayingShowQueueHint", v)} />
                    <Toggle label="Copy link, Genius search, Share" value={config.nowPlayingShowQuickActions} onChange={(v) => update("nowPlayingShowQuickActions", v)} />
                  </div>

                  <div className="rounded-xl border border-border/40 bg-secondary/15 p-4 space-y-3">
                    <h3 className="font-mono text-[11px] font-medium uppercase tracking-wider text-foreground/90 flex items-center gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-accent" /> Status banner
                    </h3>
                    <Toggle label="Visible" value={config.statusBannerVisible} onChange={(v) => update("statusBannerVisible", v)} />
                    <SelectGrid
                      value={config.statusBannerStyle}
                      onChange={(v) => update("statusBannerStyle", v)}
                      options={[
                        { value: "default", label: "Default" },
                        { value: "detailed", label: "Detailed" },
                        { value: "pill", label: "Pill" },
                        { value: "minimal", label: "Minimal" },
                        { value: "hud", label: "HUD" },
                        { value: "orbit", label: "Orbit" },
                        { value: "ribbon", label: "Ribbon" },
                      ]}
                    />
                    <p className="font-mono text-[10px] text-muted-foreground/80">Ribbon is fixed under the nav (full width). Corner position applies to other styles.</p>
                    <SelectGrid value={config.statusBannerPosition} onChange={(v) => update("statusBannerPosition", v)} options={POSITION_OPTIONS} />
                    <Toggle label="Show Discord avatar" value={config.statusBannerShowAvatar} onChange={(v) => update("statusBannerShowAvatar", v)} />
                    <Toggle label="Show rich activity" value={config.statusBannerShowActivity} onChange={(v) => update("statusBannerShowActivity", v)} />
                    <Toggle label="Show session timer" value={config.statusBannerShowElapsed} onChange={(v) => update("statusBannerShowElapsed", v)} />
                    <Toggle label="Pulse when status changes" value={config.statusBannerPulse} onChange={(v) => update("statusBannerPulse", v)} />
                    <Toggle label="Show Discord custom status" value={config.statusBannerShowCustomStatus} onChange={(v) => update("statusBannerShowCustomStatus", v)} />
                    <Toggle label="Show Spotify line (Lanyard)" value={config.statusBannerShowSpotifyLine} onChange={(v) => update("statusBannerShowSpotifyLine", v)} />
                    <div className="space-y-1">
                      <span className="font-mono text-xs text-muted-foreground">Custom tagline (empty = default copy)</span>
                      <textarea
                        value={config.statusBannerCustomTagline}
                        onChange={(e) => update("statusBannerCustomTagline", e.target.value)}
                        rows={2}
                        className="w-full resize-none rounded-lg border border-border/60 bg-secondary px-3 py-2 font-mono text-[11px] text-foreground"
                        placeholder="Building cool things…"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/40 bg-secondary/10 p-4 space-y-3">
                    <h3 className="font-mono text-[11px] font-medium uppercase tracking-wider text-foreground/90 flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" /> Clock widget
                    </h3>
                    <Toggle label="Visible" value={config.clockWidgetVisible} onChange={(v) => update("clockWidgetVisible", v)} />
                    {config.clockWidgetVisible && (
                      <>
                        <SelectGrid value={config.clockFormat} onChange={(v) => update("clockFormat", v)} options={[
                          { value: "12h", label: "12 Hour" }, { value: "24h", label: "24 Hour" },
                        ]} />
                        <Toggle label="Show Seconds" value={config.clockShowSeconds} onChange={(v) => update("clockShowSeconds", v)} />
                        <SelectGrid value={config.clockWidgetPosition} onChange={(v) => update("clockWidgetPosition", v)} options={POSITION_OPTIONS} />
                      </>
                    )}
                  </div>

                  <div className="rounded-xl border border-border/40 bg-secondary/10 p-4 space-y-3">
                    <h3 className="font-mono text-[11px] font-medium uppercase tracking-wider text-foreground/90 flex items-center gap-2">
                      <Quote className="h-3.5 w-3.5" /> Quote widget
                    </h3>
                    <Toggle label="Visible" value={config.quoteWidgetVisible} onChange={(v) => update("quoteWidgetVisible", v)} />
                  </div>

                  <div className="rounded-xl border border-border/40 bg-secondary/10 p-4 space-y-2">
                    <h3 className="font-mono text-[11px] font-medium uppercase tracking-wider text-foreground/90">Page chrome</h3>
                    <Toggle label="Scroll Progress Bar" value={config.showScrollProgress} onChange={(v) => update("showScrollProgress", v)} />
                    <Toggle label="Scroll Indicator" value={config.showScrollIndicator} onChange={(v) => update("showScrollIndicator", v)} />
                    <Toggle label="Back to Top Button" value={config.showBackToTop} onChange={(v) => update("showBackToTop", v)} />
                    <Toggle label="Custom Scrollbar" value={config.customScrollbar} onChange={(v) => update("customScrollbar", v)} />
                    <Toggle label="Loading Screen" value={config.loadingScreen} onChange={(v) => update("loadingScreen", v)} />
                  </div>
                </div>
              )}

              {/* EFFECTS */}
              {tab === "effects" && (
                <>
                  <div className="space-y-2">
                    <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Weather & Particles</h3>
                    <Toggle label="Snow" value={config.snowEffect} onChange={(v) => update("snowEffect", v)} />
                    <Toggle label="Rain" value={config.rainEffect} onChange={(v) => update("rainEffect", v)} />
                    <Toggle label="Fireflies" value={config.fireflyEffect} onChange={(v) => update("fireflyEffect", v)} />
                    <Toggle label="Confetti" value={config.confettiEffect} onChange={(v) => update("confettiEffect", v)} />
                  </div>
                  <div className="border-t border-border/40 pt-4 space-y-2">
                    <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Post-Processing</h3>
                    <Toggle label="Scanlines" value={config.scanlineEffect} onChange={(v) => update("scanlineEffect", v)} />
                    <Toggle label="Vignette" value={config.vignetteEffect} onChange={(v) => update("vignetteEffect", v)} />
                    <Toggle label="Bloom" value={config.bloomEffect} onChange={(v) => update("bloomEffect", v)} />
                  </div>
                  <div className="border-t border-border/40 pt-4 space-y-2">
                    <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Interaction</h3>
                    <Toggle label="Click Ripple" value={config.clickRipple} onChange={(v) => update("clickRipple", v)} />
                  </div>
                </>
              )}

              {/* FONTS */}
              {tab === "fonts" && (
                <>
                  <div className="space-y-3">
                    <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Body Font</h3>
                    <div className="space-y-1.5">
                      {(Object.keys(FONT_LABELS) as FontFamily[]).map((f) => (
                        <button key={f} onClick={() => update("fontFamily", f)}
                          className={`w-full text-left rounded-lg px-3 py-2.5 transition-all ${config.fontFamily === f ? "bg-accent/20 text-accent border border-accent/40" : "bg-secondary/40 text-muted-foreground border border-transparent hover:bg-secondary"}`}
                        >
                          <span className="font-mono text-xs">{FONT_LABELS[f]}</span>
                          <p className="mt-0.5 text-[11px] text-muted-foreground/60" style={{ fontFamily: FONT_OPTIONS[f] }}>The quick brown fox jumps over the lazy dog</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-border/40 pt-4 space-y-3">
                    <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Monospace Font</h3>
                    <div className="space-y-1.5">
                      {(["default", "jetbrains", "fira-code", "roboto-mono"] as FontFamily[]).map((f) => (
                        <button key={f} onClick={() => update("monoFont", f)}
                          className={`w-full text-left rounded-lg px-3 py-2.5 transition-all ${config.monoFont === f ? "bg-accent/20 text-accent border border-accent/40" : "bg-secondary/40 text-muted-foreground border border-transparent hover:bg-secondary"}`}
                        >
                          <span className="font-mono text-xs">{FONT_LABELS[f]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ADVANCED */}
              {tab === "advanced" && (
                <>
                  <div className="space-y-3">
                    <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Import / Export</h3>
                    <div className="flex gap-2">
                      <button onClick={handleExport} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-accent/10 border border-accent/30 px-4 py-3 font-mono text-xs text-accent hover:bg-accent/20 transition-colors">
                        <Download className="h-4 w-4" /> Export Theme
                      </button>
                      <button onClick={handleImport} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-secondary border border-border px-4 py-3 font-mono text-xs text-muted-foreground hover:bg-secondary/80 transition-colors">
                        <Upload className="h-4 w-4" /> Import Theme
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-border/40 pt-4">
                    <button onClick={reset} className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 px-4 py-3 font-mono text-xs text-rose-400 hover:bg-rose-500/20 transition-colors">
                      <RotateCcw className="h-4 w-4" /> Reset Everything
                    </button>
                  </div>

                  <div className="border-t border-border/40 pt-4 space-y-2">
                    <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Keyboard Shortcuts</h3>
                    <div className="space-y-1.5 font-mono text-[11px] text-muted-foreground">
                      <div className="flex justify-between"><span>Command Palette</span><kbd className="rounded bg-secondary px-1.5 py-0.5">Ctrl + K</kbd></div>
                      <div className="flex justify-between"><span>Toggle Dark Mode</span><kbd className="rounded bg-secondary px-1.5 py-0.5">Ctrl + D</kbd></div>
                      <div className="flex justify-between"><span>Clear All Effects</span><kbd className="rounded bg-secondary px-1.5 py-0.5">Ctrl + E</kbd></div>
                      <div className="flex justify-between"><span>Close Panel</span><kbd className="rounded bg-secondary px-1.5 py-0.5">Escape</kbd></div>
                    </div>
                  </div>

                  <div className="border-t border-border/40 pt-4 space-y-2">
                    <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Quick Info</h3>
                    <div className="rounded-xl bg-secondary/30 p-3 space-y-1 font-mono text-[11px] text-muted-foreground">
                      <div className="flex justify-between"><span>Active Effects</span><span className="text-accent">{[config.snowEffect, config.rainEffect, config.fireflyEffect, config.confettiEffect, config.scanlineEffect, config.vignetteEffect, config.bloomEffect].filter(Boolean).length}</span></div>
                      <div className="flex justify-between"><span>Theme Preset</span><span className="text-accent">{THEME_PRESETS[config.themePreset].label}</span></div>
                      <div className="flex justify-between"><span>Cursor Style</span><span className="text-accent">{config.cursorStyle}</span></div>
                      <div className="flex justify-between"><span>Background</span><span className="text-accent">{config.backgroundType}</span></div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-border/40 p-3 text-center">
              <span className="font-mono text-[10px] text-muted-foreground/50">Hetzel401 Customization Engine v3.0 &middot; Ctrl+K for commands</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
