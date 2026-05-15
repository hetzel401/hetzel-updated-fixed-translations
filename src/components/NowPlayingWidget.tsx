import { useEffect, useState, useRef, useCallback, type CSSProperties, type ReactNode, type RefObject } from "react";
import { Music, ExternalLink, Heart, Minimize2, Maximize2, Volume2, Disc3, ListMusic, Copy, Check, Share2, BookOpen } from "lucide-react";
import { useLanyardContext } from "@/context/LanyardContext";
import { useLanguage } from "@/context/LanguageContext";
import { useCustomization, type WidgetPosition, type NowPlayingProgressStyle } from "@/context/CustomizationContext";

const positionClasses: Record<WidgetPosition, CSSProperties> = {
  "bottom-right": { position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 50 },
  "bottom-left": { position: "fixed", bottom: "1.5rem", left: "1.5rem", zIndex: 50 },
  "top-right": { position: "fixed", top: "5rem", right: "1.5rem", zIndex: 50 },
  "top-left": { position: "fixed", top: "5rem", left: "1.5rem", zIndex: 50 },
};

const scaleOrigin: Record<WidgetPosition, string> = {
  "bottom-right": "right bottom",
  "bottom-left": "left bottom",
  "top-right": "right top",
  "top-left": "left top",
};

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function ProgressRow({
  elapsed,
  duration,
  progress,
  kind,
  inverse,
}: {
  elapsed: number;
  duration: number;
  progress: number;
  kind: NowPlayingProgressStyle;
  inverse?: boolean;
}) {
  const track = inverse ? "bg-white/20" : "bg-accent/20";
  const h = kind === "thin" ? "h-0.5" : kind === "blocks" ? "h-2" : "h-1.5";
  const fill =
    inverse
      ? "bg-white/85"
      : kind === "blocks"
        ? "bg-accent"
        : "bg-gradient-to-r from-accent via-accent/80 to-accent/60 shadow-[0_0_8px_hsl(var(--accent)/0.45)]";

  if (kind === "blocks") {
    const n = 16;
    const timeCls = inverse ? "text-white/50" : "text-muted-foreground";
    return (
      <div className="flex items-center gap-2">
        <span className={`w-8 text-right font-mono text-[10px] ${timeCls}`}>{formatTime(elapsed)}</span>
        <div className={`flex flex-1 gap-px overflow-hidden rounded-sm ${track} p-px`}>
          {Array.from({ length: n }, (_, i) => {
            const filled = ((i + 1) / n) * 100 <= progress + 0.01;
            const seg = inverse ? (filled ? "bg-white/85" : "bg-white/12") : filled ? "bg-accent" : "bg-accent/20";
            return <div key={i} className={`min-h-[6px] flex-1 rounded-[1px] ${seg}`} />;
          })}
        </div>
        <span className={`w-8 font-mono text-[10px] ${timeCls}`}>{formatTime(duration)}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`w-8 text-right font-mono text-[10px] ${inverse ? "text-white/50" : "text-muted-foreground"}`}>{formatTime(elapsed)}</span>
      <div className={`flex-1 overflow-hidden rounded-full ${track} ${h}`}>
        <div className={`h-full rounded-full transition-all duration-500 ${fill}`} style={{ width: `${progress}%` }} />
      </div>
      <span className={`w-8 font-mono text-[10px] ${inverse ? "text-white/50" : "text-muted-foreground"}`}>{formatTime(duration)}</span>
    </div>
  );
}

function useNowPlayingVisualizer(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  active: boolean,
  spotify: { timestamps: { start: number; end: number } } | null,
  mode: "bars" | "wave" | "spectrum",
  progress: number,
  animationsEnabled: boolean,
  reducedMotion: boolean
) {
  const animRef = useRef(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    if (!active || !canvasRef.current || !spotify) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    let w = Math.max(canvas.clientWidth || canvas.offsetWidth || 260, 40);
    let h = Math.max(canvas.clientHeight || canvas.offsetHeight || 28, 16);

    const syncSize = () => {
      const nw = Math.max(canvas.clientWidth || canvas.offsetWidth || 260, 40);
      const nh = Math.max(canvas.clientHeight || canvas.offsetHeight || 28, 16);
      if (nw !== w || nh !== h) {
        w = nw;
        h = nh;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };
    syncSize();

    const draw = () => {
      syncSize();
      const heavy = animationsEnabled && !reducedMotion;
      phaseRef.current += heavy ? 0.06 : reducedMotion ? 0.015 : 0.03;
      const t = phaseRef.current;
      ctx.clearRect(0, 0, w, h);

      if (mode === "bars") {
        const bars = 20;
        const barW = w / bars;
        for (let i = 0; i < bars; i++) {
          const wave = Math.sin(t + i * 0.4) * 0.25 + 0.75;
          const heightFactor = (progress / 100) * 0.45 + 0.35;
          const jitter = heavy ? Math.sin(t * 3 + i * 1.7) * 0.22 + 0.22 : 0.2;
          const bh = h * heightFactor * wave * (0.6 + jitter);
          const hue = 260 + (i / bars) * 40;
          ctx.fillStyle = `hsla(${hue}, 85%, 62%, 0.85)`;
          ctx.fillRect(i * barW + 1, h - bh, barW - 2, bh);
        }
      } else if (mode === "wave") {
        ctx.beginPath();
        ctx.strokeStyle = "hsla(270, 85%, 65%, 0.9)";
        ctx.lineWidth = 2;
        const amp = (h * 0.38 * (0.4 + progress / 160)) | 0;
        const mid = h / 2;
        for (let x = 0; x <= w; x += 2) {
          const y = mid + Math.sin(x / 22 + t * 1.4) * amp + Math.sin(x / 9 + t) * (amp * 0.25);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.strokeStyle = "hsla(220, 90%, 55%, 0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const y = mid + Math.cos(x / 18 + t) * amp * 0.6;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else {
        const bins = 32;
        const binW = w / bins;
        for (let i = 0; i < bins; i++) {
          const n = Math.abs(Math.sin(t * 1.2 + i * 0.35));
          const bh = h * (0.15 + n * 0.75) * (0.55 + progress / 220);
          const hue = (i / bins) * 120 + 240;
          const grd = ctx.createLinearGradient(0, h - bh, 0, h);
          grd.addColorStop(0, `hsla(${hue}, 95%, 72%, 0.95)`);
          grd.addColorStop(1, `hsla(${hue + 20}, 70%, 45%, 0.5)`);
          ctx.fillStyle = grd;
          ctx.fillRect(i * binW + 0.5, h - bh, binW - 1, bh);
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active, spotify, mode, progress, animationsEnabled, reducedMotion]);
}

export default function NowPlayingWidget() {
  const { data, error } = useLanyardContext();
  const { t } = useLanguage();
  const { config, update } = useCustomization();
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(() => config.nowPlayingVisualizerDefault);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const spotify = !error && data?.spotify ? data.spotify : null;
  const visible = config.nowPlayingVisible;
  const minimized = config.nowPlayingMinimized;
  const style = config.nowPlayingStyle;
  const profileUrl = config.nowPlayingSpotifyProfileUrl?.trim() || "https://open.spotify.com/";
  const motionOk = config.animationsEnabled && !config.reducedMotion;

  useNowPlayingVisualizer(
    canvasRef,
    showVisualizer,
    spotify,
    config.nowPlayingVisualizerMode,
    progress,
    config.animationsEnabled,
    config.reducedMotion
  );

  useEffect(() => {
    setShowVisualizer(config.nowPlayingVisualizerDefault);
  }, [config.nowPlayingVisualizerDefault]);

  useEffect(() => {
    if (!spotify) {
      setProgress(0);
      setElapsed(0);
      setDuration(0);
      return;
    }
    const { start, end } = spotify.timestamps;
    const total = end - start;
    setDuration(total);

    const compute = () => {
      const e = Date.now() - start;
      setElapsed(Math.min(e, total));
      return Math.min((e / total) * 100, 100);
    };
    setProgress(compute());
    const id = setInterval(() => setProgress(compute()), 500);
    return () => clearInterval(id);
  }, [spotify]);

  useEffect(() => {
    setLiked(false);
  }, [spotify?.song]);

  const pos = positionClasses[config.nowPlayingPosition] ?? positionClasses["bottom-right"];
  const label = (t as { nowPlaying?: { label?: string } }).nowPlaying?.label ?? "Now Playing";
  const scale = config.nowPlayingWidgetScale / 100;
  const origin = scaleOrigin[config.nowPlayingPosition] ?? "right bottom";

  const wrap = useCallback(
    (node: ReactNode) => (
      <div
        style={{
          ...pos,
          opacity: (config.nowPlayingWidgetOpacity ?? 100) / 100,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: origin,
        }}
      >
        {node}
      </div>
    ),
    [pos, scale, origin, config.nowPlayingWidgetOpacity]
  );

  if (!visible) return null;

  if (minimized) {
    return wrap(
      <button
        type="button"
        onClick={() => update("nowPlayingMinimized", false)}
        className="glass rounded-full border border-border/60 backdrop-blur-xl p-2.5 shadow-lg transition-all hover:shadow-[0_0_20px_hsl(var(--accent)/0.3)] group"
        aria-label={spotify ? "Expand now playing" : "Expand now playing widget"}
      >
        <div className="relative flex h-8 w-8 items-center justify-center">
          {spotify ? (
            <>
              <img src={spotify.album_art_url} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-accent/30" />
              <Maximize2 className="absolute inset-0 m-auto h-3 w-3 text-white opacity-0 transition-opacity group-hover:opacity-100 drop-shadow-md" />
            </>
          ) : (
            <Music className="h-4 w-4 text-accent" />
          )}
        </div>
      </button>
    );
  }

  const chrome = config.borderGlow ? "hover:shadow-[0_0_40px_hsl(var(--accent)/0.28)]" : "hover:shadow-lg";
  const controls = (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={() => setShowVisualizer(!showVisualizer)}
        className="rounded-full p-1 transition-colors hover:bg-secondary"
        title={`Visualizer (${config.nowPlayingVisualizerMode})`}
      >
        <Volume2 className="h-3 w-3 text-muted-foreground" />
      </button>
      <button type="button" onClick={() => update("nowPlayingMinimized", true)} className="rounded-full p-1 transition-colors hover:bg-secondary" title="Minimize">
        <Minimize2 className="h-3 w-3 text-muted-foreground" />
      </button>
    </div>
  );

  const trackUrl = spotify ? `https://open.spotify.com/track/${spotify.track_id}` : "";
  const geniusHref = spotify
    ? `https://genius.com/search?q=${encodeURIComponent(`${spotify.song} ${spotify.artist}`)}`
    : "";

  const copyTrackLink = async () => {
    if (!trackUrl) return;
    try {
      await navigator.clipboard.writeText(trackUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const shareTrack = async () => {
    if (!spotify || !trackUrl) return;
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: spotify.song,
          text: `${spotify.song} — ${spotify.artist}`,
          url: trackUrl,
        });
      } catch {
        /* dismissed */
      }
    } else {
      void copyTrackLink();
    }
  };

  const quickActions =
    spotify && config.nowPlayingShowQuickActions ? (
      <div className="mt-2 flex flex-wrap items-center justify-center gap-1 border-t border-border/40 pt-2 font-mono text-[10px] text-muted-foreground">
        <button
          type="button"
          onClick={() => void copyTrackLink()}
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors hover:bg-secondary"
          title="Copy Spotify track link"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy link"}
        </button>
        <a
          href={geniusHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors hover:bg-secondary hover:text-accent"
          title="Search lyrics on Genius"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Lyrics
        </a>
        {typeof navigator !== "undefined" && typeof navigator.share === "function" ? (
          <button
            type="button"
            onClick={() => void shareTrack()}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors hover:bg-secondary"
            title="Share track"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
        ) : null}
      </div>
    ) : null;

  const metaBlock = (
    <div className="min-w-0 flex-1">
      <a
        href={`https://open.spotify.com/track/${spotify?.track_id}`}
        target="_blank"
        rel="noreferrer"
        className="block max-w-[180px] truncate text-sm font-medium hover:text-accent"
      >
        {spotify?.song}
      </a>
      <p className="max-w-[180px] truncate font-mono text-xs text-muted-foreground">{spotify?.artist}</p>
      <p className="max-w-[180px] truncate font-mono text-[10px] text-muted-foreground/60">{spotify?.album}</p>
    </div>
  );

  if (style === "dock" && spotify) {
    return wrap(
      <div
        className={`glass flex max-w-md flex-col gap-1.5 rounded-2xl border border-border/60 px-3 py-2 shadow-lg transition-all duration-300 ${chrome}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-3">
          <a href={`https://open.spotify.com/track/${spotify.track_id}`} target="_blank" rel="noreferrer" className="relative shrink-0">
            <img src={spotify.album_art_url} alt="" width={44} height={44} className="h-11 w-11 rounded-lg object-cover shadow-md" />
          </a>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] text-muted-foreground">{label}</p>
            <p className="truncate text-sm font-medium">{spotify.song}</p>
          </div>
          {controls}
          {isHovered && (
            <div className="flex shrink-0 items-center gap-1 border-l border-border/40 pl-2">
              <button type="button" onClick={() => setLiked(!liked)} className={`rounded-full p-1 ${liked ? "text-pink-500" : "text-muted-foreground hover:text-pink-400"}`}>
                <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
              </button>
              <a href={profileUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-accent">
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
        <div className="min-w-0 pl-[52px] pr-1">
          <ProgressRow elapsed={elapsed} duration={duration} progress={progress} kind={config.nowPlayingProgressStyle} />
        </div>
        {isHovered ? quickActions : null}
      </div>
    );
  }

  if (style === "neon" && spotify) {
    return wrap(
      <div
        className="relative w-72 rounded-2xl border border-accent/50 bg-card/70 p-3 shadow-[0_0_32px_hsl(var(--accent)/0.35),inset_0_0_20px_hsl(var(--accent)/0.08)] backdrop-blur-xl transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/15 via-transparent to-accent/10" />
        <div className="relative flex items-center justify-between">
          <p className="flex items-center gap-1.5 font-mono text-xs text-accent drop-shadow-[0_0_8px_hsl(var(--accent)/0.6)]">
            <span className={`h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_10px_lime] ${motionOk ? "animate-pulse" : ""}`} />
            {label}
          </p>
          {controls}
        </div>
        <div className="relative mt-2 flex items-center gap-3">
          <div className={`relative shrink-0 rounded-xl ring-2 ring-accent/40 ${motionOk ? "animate-pulse" : ""}`}>
            <img src={spotify.album_art_url} alt="" width={56} height={56} className="h-14 w-14 rounded-xl object-cover" />
          </div>
          {metaBlock}
        </div>
        {showVisualizer && <canvas ref={canvasRef} width={280} height={32} className="relative mt-2 h-8 w-full rounded-md bg-black/20" />}
        <div className="relative mt-2">
          <ProgressRow elapsed={elapsed} duration={duration} progress={progress} kind={config.nowPlayingProgressStyle} />
        </div>
        {isHovered && (
          <div className="relative mt-2 space-y-2">
            {quickActions}
            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
              <button type="button" onClick={() => setLiked(!liked)} className={liked ? "text-pink-400" : ""}>
                <Heart className={`inline h-4 w-4 ${liked ? "fill-current" : ""}`} />
              </button>
              <a href={`https://open.spotify.com/track/${spotify.track_id}`} target="_blank" rel="noreferrer" className="hover:text-accent">
                Open track
              </a>
              <a href={profileUrl} target="_blank" rel="noreferrer" className="hover:text-accent">
                Profile
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (style === "vinyl" && spotify) {
    return wrap(
      <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <div className={`glass flex w-72 flex-col gap-3 rounded-2xl border border-border/60 p-4 shadow-lg transition-all duration-300 ${chrome}`}>
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-muted-foreground">{label}</p>
            {controls}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div
                className={`h-16 w-16 overflow-hidden rounded-full border-2 border-accent/30 shadow-[0_0_20px_hsl(var(--accent)/0.3)] ${motionOk ? "animate-spin" : ""}`}
                style={{ animationDuration: "3s" }}
              >
                <img src={spotify.album_art_url} alt={spotify.album} className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full border border-border bg-background" />
              </div>
            </div>
            {metaBlock}
          </div>
          {showVisualizer && <canvas ref={canvasRef} width={260} height={32} className="h-8 w-full rounded-md bg-black/10" />}
          <ProgressRow elapsed={elapsed} duration={duration} progress={progress} kind={config.nowPlayingProgressStyle} />
          {isHovered ? quickActions : null}
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => setLiked(!liked)} className={`rounded-full p-1.5 transition-all ${liked ? "scale-110 text-pink-500" : "text-muted-foreground hover:text-pink-400"}`}>
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            </button>
            <a href={`https://open.spotify.com/track/${spotify.track_id}`} target="_blank" rel="noreferrer" className="rounded-full p-1.5 text-muted-foreground hover:text-accent">
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (style === "minimal" && spotify) {
    return wrap(
      <div
        className={`glass flex max-w-[min(92vw,280px)] items-center gap-3 rounded-full border border-border/60 px-4 py-2 shadow-lg ${chrome}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Disc3 className={`h-4 w-4 shrink-0 text-accent ${motionOk ? "animate-spin" : ""}`} style={{ animationDuration: "2s" }} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-xs">
            {spotify.song} — {spotify.artist}
          </p>
        </div>
        <div className="h-1 w-8 shrink-0 overflow-hidden rounded-full bg-accent/20">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
        </div>
        {isHovered && (
          <a href={`https://open.spotify.com/track/${spotify.track_id}`} target="_blank" rel="noreferrer" className="shrink-0 text-muted-foreground hover:text-accent">
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    );
  }

  if (style === "fullart" && spotify) {
    return wrap(
      <div className="relative w-72 overflow-hidden rounded-2xl border border-border/40 shadow-2xl">
        <img src={spotify.album_art_url} alt={spotify.album} className="h-40 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="mb-1 flex items-center justify-between">
            <p className="font-mono text-[10px] text-white/50">{label}</p>
            <button type="button" onClick={() => update("nowPlayingMinimized", true)} className="text-white/50 hover:text-white">
              <Minimize2 className="h-3 w-3" />
            </button>
          </div>
          <a href={`https://open.spotify.com/track/${spotify.track_id}`} target="_blank" rel="noreferrer" className="block truncate text-sm font-semibold text-white hover:underline">
            {spotify.song}
          </a>
          <p className="truncate font-mono text-xs text-white/60">{spotify.artist}</p>
          <div className="mt-2">
            <ProgressRow
              elapsed={elapsed}
              duration={duration}
              progress={progress}
              kind={config.nowPlayingProgressStyle === "blocks" ? "smooth" : config.nowPlayingProgressStyle}
              inverse
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <button type="button" onClick={() => setLiked(!liked)} className={`transition-all ${liked ? "scale-110 text-pink-400" : "text-white/50 hover:text-pink-300"}`}>
              <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`} />
            </button>
            <a href={profileUrl} target="_blank" rel="noreferrer" className="text-white/50 transition-colors hover:text-white">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return wrap(
    <div>
      {spotify ? (
        <div
          className={`glass flex w-72 flex-col gap-2 rounded-2xl border border-border/60 p-3 shadow-lg transition-all duration-300 ${chrome}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <span className={`h-1.5 w-1.5 rounded-full bg-green-500 ${motionOk ? "animate-pulse" : ""}`} />
              {label}
            </p>
            {controls}
          </div>

          <div className="flex items-center gap-3">
            <a href={`https://open.spotify.com/track/${spotify.track_id}`} target="_blank" rel="noreferrer" className="group relative shrink-0">
              <img src={spotify.album_art_url} alt={spotify.album} width={56} height={56} className="rounded-lg object-cover shadow-md transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <ExternalLink className="h-4 w-4 text-white" />
              </div>
            </a>
            <div className="min-w-0 flex-1">
              <p className="max-w-[170px] truncate text-sm font-medium">{spotify.song}</p>
              <p className="max-w-[170px] truncate font-mono text-xs text-muted-foreground">{spotify.artist}</p>
              <p className="max-w-[170px] truncate font-mono text-[10px] text-muted-foreground/50">{spotify.album}</p>
            </div>
          </div>

          {showVisualizer && <canvas ref={canvasRef} width={280} height={28} className="h-7 w-full rounded-md bg-black/5" />}

          <ProgressRow elapsed={elapsed} duration={duration} progress={progress} kind={config.nowPlayingProgressStyle} />

          {config.nowPlayingShowQueueHint && isHovered && (
            <p className="flex items-center gap-1 font-mono text-[9px] text-muted-foreground/70">
              <ListMusic className="h-3 w-3" />
              Live from Discord · Ctrl+K palette
            </p>
          )}

          {isHovered && (
            <div className="animate-fade-in space-y-2">
              {quickActions}
              <div className="flex items-center justify-between">
                <button type="button" onClick={() => setLiked(!liked)} className={`rounded-full p-1.5 transition-all duration-200 ${liked ? "scale-110 text-pink-500" : "text-muted-foreground hover:text-pink-400"}`}>
                  <Heart className={`h-4 w-4 transition-all ${liked ? "fill-current" : ""}`} />
                </button>
                <a href={profileUrl} target="_blank" rel="noreferrer" className="font-mono text-[10px] text-muted-foreground hover:text-accent">
                  Spotify profile
                </a>
                <a href={`https://open.spotify.com/track/${spotify.track_id}`} target="_blank" rel="noreferrer" className="rounded-full p-1.5 text-muted-foreground hover:text-accent">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass rounded-2xl border border-border/60">
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Open Spotify profile"
            className="flex h-10 w-10 items-center justify-center text-accent transition-transform hover:scale-110 hover:text-accent/80"
          >
            <Music className="h-5 w-5" />
          </a>
        </div>
      )}
    </div>
  );
}
