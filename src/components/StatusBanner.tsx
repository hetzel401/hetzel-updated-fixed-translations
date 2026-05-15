import { useEffect, useState, type CSSProperties } from "react";
import { useLanyardContext } from "@/context/LanyardContext";
import { useLanguage } from "@/context/LanguageContext";
import { useCustomization, type WidgetPosition } from "@/context/CustomizationContext";
import type { LanyardActivity } from "@/hooks/use-lanyard";
import { Gamepad2, Code2, Monitor, Clock, Zap, Wifi, WifiOff, Activity, Music2 } from "lucide-react";

const dotColor: Record<string, string> = {
  online: "bg-emerald-400",
  idle: "bg-amber-400",
  dnd: "bg-rose-500",
  offline: "bg-zinc-500",
};

const dotGlow: Record<string, string> = {
  online: "shadow-[0_0_8px_hsl(150_80%_50%/0.6)]",
  idle: "shadow-[0_0_8px_hsl(40_80%_50%/0.6)]",
  dnd: "shadow-[0_0_8px_hsl(0_80%_50%/0.6)]",
  offline: "",
};

const statusText: Record<string, string> = {
  online: "Online",
  idle: "Away",
  dnd: "Do Not Disturb",
  offline: "Offline",
};

const positionStyles: Record<WidgetPosition, CSSProperties> = {
  "bottom-left": { position: "fixed", bottom: "1.5rem", left: "1.5rem", zIndex: 50 },
  "bottom-right": { position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 50 },
  "top-left": { position: "fixed", top: "5rem", left: "1.5rem", zIndex: 50 },
  "top-right": { position: "fixed", top: "5rem", right: "1.5rem", zIndex: 50 },
};

const RIBBON_STYLE: CSSProperties = {
  position: "fixed",
  left: 0,
  right: 0,
  top: "5rem",
  zIndex: 48,
};

function formatElapsed(ms: number) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function discordActivityAssetUrl(activity: LanyardActivity, raw: string): string {
  const s = raw.trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("mp:")) {
    return `https://media.discordapp.net/${s.slice(3)}`;
  }
  if (activity.application_id) {
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${s}.png`;
  }
  return "";
}

function discordAvatarUrl(userId: string, avatar: string | null | undefined, size = 64): string | null {
  if (!avatar) return null;
  const ext = avatar.startsWith("a_") ? "gif" : "webp";
  return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.${ext}?size=${size}`;
}

function customStatusFromActivities(activities: LanyardActivity[] | undefined): string | null {
  const a = activities?.find((x) => x.type === 4);
  if (!a) return null;
  const s = (a.state ?? a.name ?? "").trim();
  return s || null;
}

type Translations = { status?: { workingOn?: string; available?: string; busy?: string } };

export default function StatusBanner() {
  const { data } = useLanyardContext();
  const { t } = useLanguage();
  const { config } = useCustomization();
  const [elapsed, setElapsed] = useState(0);
  const [pulse, setPulse] = useState(false);

  const status = data?.discord_status ?? "offline";
  const isAvailable = status === "online" || status === "idle";
  const visible = config.statusBannerVisible;
  const style = config.statusBannerStyle;
  const tr = t as Translations;

  const activities = data?.activities ?? [];
  const activity = activities.find((a) => a.type !== 2 && a.name !== "Spotify");
  const spotify = data?.spotify ?? null;
  const customStatus = customStatusFromActivities(activities);

  const defaultTagline = tr.status?.workingOn ?? "currently working on Hetzel's Workshop";
  const tagline = config.statusBannerCustomTagline.trim() || defaultTagline;
  const showActivity = config.statusBannerShowActivity;
  const showElapsed = config.statusBannerShowElapsed;
  const showAvatar = config.statusBannerShowAvatar;
  const pulseEnabled = config.statusBannerPulse;
  const showCustomStatus = config.statusBannerShowCustomStatus;
  const showSpotifyLine = config.statusBannerShowSpotifyLine;
  const motionOk = config.animationsEnabled && !config.reducedMotion;

  const userId = data?.discord_user?.id ?? "";
  const avatarUrl = userId ? discordAvatarUrl(userId, data?.discord_user?.avatar) : null;

  useEffect(() => {
    if (!activity?.timestamps?.start) {
      setElapsed(0);
      return;
    }
    const start = activity.timestamps.start;
    const compute = () => setElapsed(Date.now() - start);
    compute();
    const id = setInterval(compute, 30_000);
    return () => clearInterval(id);
  }, [activity?.timestamps?.start]);

  useEffect(() => {
    if (!pulseEnabled) return;
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 1000);
    return () => clearTimeout(timer);
  }, [status, pulseEnabled]);

  if (!visible) return null;

  const pos = positionStyles[config.statusBannerPosition] ?? positionStyles["bottom-left"];
  const pulseClass = pulseEnabled && pulse ? "scale-[1.02]" : "";
  const activityAsset =
    activity?.assets?.large_image && activity.assets.large_image.length > 0
      ? discordActivityAssetUrl(activity, activity.assets.large_image)
      : null;

  const elapsedBlock =
    showElapsed && elapsed > 0 && activity?.timestamps?.start ? (
      <span className="flex shrink-0 items-center gap-1 font-mono text-[10px] text-muted-foreground">
        <Clock className="h-3 w-3" />
        {formatElapsed(elapsed)}
      </span>
    ) : null;

  if (style === "ribbon") {
    return (
      <div style={RIBBON_STYLE} className="pointer-events-none px-3 sm:px-6">
        <div
          className={`glass pointer-events-auto mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full border border-border/60 px-4 py-2 shadow-lg backdrop-blur-xl transition-transform duration-300 ${pulseClass}`}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {showAvatar && avatarUrl && (
              <img src={avatarUrl} alt="" className="h-9 w-9 shrink-0 rounded-full ring-2 ring-border/50" />
            )}
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${dotColor[status]} ${dotGlow[status]} ${status === "online" ? "animate-pulse" : ""}`}
            />
            <div className="min-w-0">
              <p className="truncate font-mono text-[11px] text-muted-foreground">{tagline}</p>
              <p className="truncate font-mono text-xs text-foreground/90">
                {statusText[status]}
                {showActivity && activity ? <span className="text-accent/80"> · {activity.name}</span> : null}
              </p>
              {(showCustomStatus && customStatus) || (showSpotifyLine && spotify) ? (
                <div className="mt-0.5 max-w-full space-y-0.5">
                  {showCustomStatus && customStatus ? (
                    <p className="truncate font-mono text-[10px] text-muted-foreground/90">&ldquo;{customStatus}&rdquo;</p>
                  ) : null}
                  {showSpotifyLine && spotify ? (
                    <p className="flex min-w-0 items-center gap-1 truncate font-mono text-[10px] text-emerald-400/90">
                      <Music2 className="h-3 w-3 shrink-0" />
                      <span className="truncate">{spotify.song} — {spotify.artist}</span>
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {isAvailable ? <Wifi className="h-3.5 w-3.5 text-emerald-400" /> : <WifiOff className="h-3.5 w-3.5 text-muted-foreground" />}
            {elapsedBlock}
          </div>
        </div>
      </div>
    );
  }

  if (style === "hud") {
    return (
      <div style={pos}>
        <div
          className={`glass relative w-72 overflow-hidden rounded-lg border border-accent/25 p-3 shadow-[inset_0_0_0_1px_hsl(var(--accent)/0.15)] backdrop-blur-xl transition-transform duration-300 ${pulseClass}`}
        >
          <div className="pointer-events-none absolute left-2 top-2 h-2 w-2 border-l border-t border-accent/50" />
          <div className="pointer-events-none absolute right-2 top-2 h-2 w-2 border-r border-t border-accent/50" />
          <div className="pointer-events-none absolute bottom-2 left-2 h-2 w-2 border-b border-l border-accent/50" />
          <div className="pointer-events-none absolute bottom-2 right-2 h-2 w-2 border-b border-r border-accent/50" />

          <div className="flex items-start gap-3 pl-1 pr-1">
            {showAvatar && avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-11 w-11 shrink-0 rounded-md object-cover grayscale-[0.2]" />
            ) : (
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${dotColor[status]} ${dotGlow[status]}`} />
            )}
            <div className="min-w-0 flex-1 font-mono">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent/80">status</span>
                {isAvailable ? <Wifi className="h-3 w-3 text-emerald-400" /> : <WifiOff className="h-3 w-3" />}
              </div>
              <p className="text-xs text-foreground/90">{statusText[status]}</p>
              <p className="mt-1 text-[10px] leading-snug text-muted-foreground">{tagline}</p>
              {(showCustomStatus && customStatus) || (showSpotifyLine && spotify) ? (
                <div className="mt-1 space-y-0.5">
                  {showCustomStatus && customStatus ? (
                    <p className="truncate font-mono text-[10px] text-muted-foreground/90">&ldquo;{customStatus}&rdquo;</p>
                  ) : null}
                  {showSpotifyLine && spotify ? (
                    <p className="flex items-center gap-1 truncate font-mono text-[10px] text-emerald-400/90">
                      <Music2 className="h-3 w-3 shrink-0" />
                      <span className="truncate">{spotify.song}</span>
                    </p>
                  ) : null}
                </div>
              ) : null}
              {showActivity && activity && (
                <p className="mt-2 truncate text-[10px] text-accent/90">
                  <Zap className="mr-1 inline h-3 w-3" />
                  {activity.name}
                  {activity.details ? ` — ${activity.details}` : ""}
                </p>
              )}
              {elapsedBlock && <div className="mt-2">{elapsedBlock}</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (style === "orbit") {
    return (
      <div style={pos}>
        <div
          className={`glass flex w-64 items-center gap-3 rounded-2xl border border-border/60 p-3 shadow-lg backdrop-blur-xl transition-transform duration-300 ${pulseClass}`}
        >
          <div className="relative shrink-0">
            <div
              className={`absolute -inset-1 rounded-full ${motionOk ? "animate-spin" : ""}`}
              style={{
                animationDuration: "8s",
                background: `conic-gradient(from 0deg, hsl(var(--accent) / 0.5), transparent, hsl(var(--accent) / 0.35))`,
              }}
            />
            <div className="relative rounded-full bg-card p-0.5">
              {showAvatar && avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <span className={`h-3 w-3 rounded-full ${dotColor[status]} ${dotGlow[status]}`} />
                </div>
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs font-medium text-foreground/90">{statusText[status]}</p>
            <p className="mt-0.5 line-clamp-2 font-mono text-[10px] text-muted-foreground">{tagline}</p>
            {(showCustomStatus && customStatus) || (showSpotifyLine && spotify) ? (
              <div className="mt-1 space-y-0.5">
                {showCustomStatus && customStatus ? (
                  <p className="line-clamp-2 font-mono text-[10px] text-muted-foreground/90">&ldquo;{customStatus}&rdquo;</p>
                ) : null}
                {showSpotifyLine && spotify ? (
                  <p className="flex items-center gap-1 truncate font-mono text-[10px] text-emerald-400/90">
                    <Music2 className="h-3 w-3 shrink-0" />
                    <span className="truncate">{spotify.song}</span>
                  </p>
                ) : null}
              </div>
            ) : null}
            {showActivity && activity && <p className="mt-1 truncate font-mono text-[10px] text-accent/80">{activity.name}</p>}
            <div className="mt-1 flex items-center gap-2">{elapsedBlock}</div>
          </div>
        </div>
      </div>
    );
  }

  if (style === "pill") {
    return (
      <div style={pos}>
        <div
          className={`glass flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 shadow-lg backdrop-blur-xl transition-transform ${pulseEnabled && pulse ? "scale-105" : ""}`}
        >
          {showAvatar && avatarUrl && <img src={avatarUrl} alt="" className="h-6 w-6 shrink-0 rounded-full" />}
          <span className={`h-2 w-2 rounded-full ${dotColor[status]} ${dotGlow[status]} ${status === "online" ? "animate-pulse" : ""}`} />
          <span className="font-mono text-xs text-foreground/80">{statusText[status]}</span>
          {showActivity && activity && (
            <span className="max-w-[140px] truncate font-mono text-[10px] text-muted-foreground sm:max-w-[200px]">
              · {activity.name}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (style === "minimal") {
    return (
      <div style={pos}>
        <div className={`flex items-center gap-2 transition-transform ${pulseEnabled && pulse ? "scale-105" : ""}`}>
          {showAvatar && avatarUrl && <img src={avatarUrl} alt="" className="h-6 w-6 shrink-0 rounded-full opacity-90" />}
          <span className={`h-2.5 w-2.5 rounded-full ${dotColor[status]} ${dotGlow[status]} ${status === "online" ? "animate-pulse" : ""}`} />
          <span className="font-mono text-xs text-muted-foreground">{statusText[status]}</span>
        </div>
      </div>
    );
  }

  if (style === "detailed") {
    return (
      <div style={pos}>
        <div
          className={`glass flex w-72 flex-col gap-3 rounded-2xl border border-border/60 p-4 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--accent)/0.2)] ${pulseClass}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {showAvatar && avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover ring-1 ring-border/50" />
              ) : (
                <span className={`h-2.5 w-2.5 rounded-full ${dotColor[status]} ${dotGlow[status]} ${status === "online" ? "animate-pulse" : ""}`} />
              )}
              <span className="font-mono text-xs font-medium">{statusText[status]}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              {isAvailable ? <Wifi className="h-3 w-3 text-emerald-400" /> : <WifiOff className="h-3 w-3" />}
            </div>
          </div>

          {showActivity && activity && (
            <div className="flex items-center gap-3 rounded-xl bg-secondary/40 p-3">
              {activityAsset ? (
                <img src={activityAsset} alt="" className="h-12 w-12 rounded-lg object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  {activity.type === 0 ? (
                    <Gamepad2 className="h-5 w-5 text-accent" />
                  ) : activity.type === 3 ? (
                    <Monitor className="h-5 w-5 text-accent" />
                  ) : (
                    <Code2 className="h-5 w-5 text-accent" />
                  )}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{activity.name}</p>
                {activity.details && <p className="truncate font-mono text-[11px] text-muted-foreground">{activity.details}</p>}
                {activity.state && <p className="truncate font-mono text-[10px] text-muted-foreground/60">{activity.state}</p>}
              </div>
            </div>
          )}

          {(showCustomStatus && customStatus) || (showSpotifyLine && spotify) ? (
            <div className="space-y-1 rounded-lg border border-border/40 bg-secondary/20 px-3 py-2">
              {showCustomStatus && customStatus ? (
                <p className="font-mono text-[10px] text-muted-foreground">&ldquo;{customStatus}&rdquo;</p>
              ) : null}
              {showSpotifyLine && spotify ? (
                <p className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400/90">
                  <Music2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{spotify.song} — {spotify.artist}</span>
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-muted-foreground">{tagline}</span>
          </div>
          <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground/60">
            <span className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              {isAvailable ? (tr.status?.available ?? "available") : (tr.status?.busy ?? "busy")}
            </span>
            {elapsedBlock}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pos}>
      <div
        className={`glass flex items-center gap-3 rounded-2xl border border-border/60 p-3 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--accent)/0.2)] ${pulseClass}`}
      >
        {showAvatar && avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-border/40" />
        ) : (
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotColor[status] ?? dotColor.offline} ${dotGlow[status] ?? ""} ${status === "online" ? "animate-pulse" : ""}`}
            aria-hidden="true"
          />
        )}
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="font-mono text-xs text-foreground/80">{tagline}</span>
          {(showCustomStatus && customStatus) || (showSpotifyLine && spotify) ? (
            <div className="mt-0.5 space-y-0.5">
              {showCustomStatus && customStatus ? (
                <span className="block truncate font-mono text-[10px] text-muted-foreground/90">&ldquo;{customStatus}&rdquo;</span>
              ) : null}
              {showSpotifyLine && spotify ? (
                <span className="flex items-center gap-1 truncate font-mono text-[10px] text-emerald-400/90">
                  <Music2 className="h-3 w-3 shrink-0" />
                  {spotify.song}
                </span>
              ) : null}
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[0.65rem] text-muted-foreground">
              {isAvailable ? (tr.status?.available ?? "available") : (tr.status?.busy ?? "busy")}
            </span>
            {showActivity && activity && (
              <span className="flex max-w-[160px] items-center gap-1 truncate font-mono text-[0.6rem] text-accent/70 sm:max-w-[220px]">
                <Zap className="h-2.5 w-2.5 shrink-0" /> {activity.name}
              </span>
            )}
            {elapsedBlock}
          </div>
        </div>
      </div>
    </div>
  );
}
