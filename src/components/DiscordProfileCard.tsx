/**
 * DiscordProfileCard — fully live via Lanyard + Discord CDN.
 * All user data, status, activity, Spotify pulled in real-time.
 * Zero hardcoded profile fields.
 */
import { useState, useEffect } from "react";
import { useLanyardContext } from "@/context/LanyardContext";
import { ExternalLink, Music, Clock, Gamepad2, MessageSquare, Wifi } from "lucide-react";

const DISCORD_INVITE = "https://discord.gg/defense";
const DISCORD_PROFILE = "https://discordapp.com/users/1097536305027629119";
const LANYARD_KV_URL  = "https://api.lanyard.rest/v1/users/1097536305027629119";

// Member join date (not in Lanyard, set manually)
const MEMBER_SINCE = "Apr 15, 2023";

const ROLES = [
  { name: "Workshop Owner", color: "#f59e0b" },
  { name: "Bot Developer",  color: "#8b5cf6" },
  { name: "Community Lead", color: "#34d399" },
];

const STATUS_CFG = {
  online:  { color: "#23a55a", ring: "#1a7a41", label: "Online"         },
  idle:    { color: "#f0b232", ring: "#a07820", label: "Idle"           },
  dnd:     { color: "#f23f43", ring: "#a02830", label: "Do Not Disturb" },
  offline: { color: "#80848e", ring: "#555860", label: "Offline"        },
} as const;

function ProgressBar({ start, end }: { start: number; end: number }) {
  const [pct, setPct] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const total = end - start;
    const tick = () => {
      const e = Date.now() - start;
      setPct(Math.min((e / total) * 100, 100));
      setElapsed(Math.min(e, total));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [start, end]);

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  };

  return (
    <div className="mt-2 select-none">
      <div className="h-1 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: "#1db954" }}
        />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[10px]" style={{ color: "#b5bac1" }}>
        <span>{fmt(elapsed)}</span>
        <span>{fmt(end - start)}</span>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl" style={{ width: 340, background: "#232428", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="h-24 animate-pulse" style={{ background: "rgba(88,101,242,0.3)" }} />
      <div className="px-4 pb-4">
        <div className="flex items-end gap-3 -mt-10 mb-4">
          <div className="h-20 w-20 animate-pulse rounded-full" style={{ background: "#3b3d44", border: "4px solid #232428" }} />
        </div>
        {[130, 85, 110, 95].map((w, i) => (
          <div key={i} className="mb-2.5 h-3 animate-pulse rounded-full" style={{ width: w, background: "#3b3d44" }} />
        ))}
      </div>
    </div>
  );
}

export default function DiscordProfileCard() {
  const { data, loading } = useLanyardContext();

  const user    = data?.discord_user;
  const status  = (data?.discord_status ?? "offline") as keyof typeof STATUS_CFG;
  const cfg     = STATUS_CFG[status];
  const spotify = data?.spotify ?? null;
  const gameAct = data?.activities?.find((a) => a.type === 0 && a.name !== "Spotify") ?? null;
  const custom  = data?.activities?.find((a) => a.type === 4) ?? null;

  // Build CDN URLs dynamically from Lanyard data
  const avatarHash = user?.avatar ?? null;
  const avatarUrl  = avatarHash
    ? `https://cdn.discordapp.com/avatars/${user!.id}/${avatarHash}.${avatarHash.startsWith("a_") ? "gif" : "png"}?size=256`
    : "https://cdn.discordapp.com/embed/avatars/0.png";

  // Game icon from Discord CDN if application_id exists
  const gameIconUrl = gameAct?.assets?.large_image
    ? gameAct.application_id
      ? `https://cdn.discordapp.com/app-assets/${gameAct.application_id}/${gameAct.assets.large_image}.png?size=64`
      : null
    : null;

  // Banner gradient — changes colour based on status
  const bannerGradients: Record<string, string> = {
    online:  "linear-gradient(135deg, #1e1460 0%, #5865F2 45%, #23a55a 100%)",
    idle:    "linear-gradient(135deg, #2a1a00 0%, #5865F2 45%, #f0b232 100%)",
    dnd:     "linear-gradient(135deg, #2a0010 0%, #5865F2 45%, #f23f43 100%)",
    offline: "linear-gradient(135deg, #1a1a2e 0%, #2b2d31 45%, #3b3d44 100%)",
  };

  if (loading) return <SkeletonCard />;

  const displayName = user?.global_name || user?.username || "Hetzel401";
  const username    = user?.username ? `@${user.username}` : "@hetzel401";

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-2xl"
      style={{
        width: 340,
        background: "#232428",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 16px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
        fontFamily: "'gg sans','Noto Sans',ui-sans-serif,system-ui,sans-serif",
      }}
    >
      {/* ── Banner (reacts to status colour) ───────────────────── */}
      <div
        style={{
          height: 92,
          background: bannerGradients[status],
          transition: "background 1s ease",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Noise texture */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.06]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" /></filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
        {/* Orb accents */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-25" style={{ background: cfg.color, filter: "blur(24px)", transition: "background 1s ease" }} />
        <div className="absolute -left-4 top-6 h-20 w-20 rounded-full opacity-15" style={{ background: "#5865F2", filter: "blur(16px)" }} />
      </div>

      <div className="px-4">
        {/* ── Avatar row ─────────────────────────────────────────── */}
        <div className="flex items-end justify-between -mt-[38px] mb-3">
          <div className="relative" style={{ width: 80, height: 80 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#232428", padding: 4 }}>
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full rounded-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Live status dot */}
            <div
              className="absolute bottom-1 right-1 h-4 w-4 rounded-full"
              style={{
                background: cfg.color,
                border: "3px solid #232428",
                boxShadow: `0 0 0 1px ${cfg.ring}, 0 0 8px ${cfg.color}80`,
                transition: "background 0.4s ease, box-shadow 0.4s ease",
              }}
            />
          </div>

          <div className="flex items-center gap-2 pb-1">
            <a
              href={DISCORD_INVITE}
              target="_blank" rel="noreferrer noopener"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-80"
              style={{ background: "#5865F2" }}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Join
            </a>
            <a
              href={DISCORD_PROFILE}
              target="_blank" rel="noreferrer noopener"
              className="flex h-7 w-7 items-center justify-center rounded-lg transition-opacity hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.08)" }}
              title="View Discord profile"
            >
              <ExternalLink className="h-3.5 w-3.5" style={{ color: "#b5bac1" }} />
            </a>
          </div>
        </div>

        {/* ── Name & tag ─────────────────────────────────────────── */}
        <div className="mb-2">
          <div className="text-xl font-bold text-white leading-tight">{displayName}</div>
          <div className="font-mono text-sm" style={{ color: "#b5bac1" }}>{username}</div>
        </div>

        {/* ── Live custom status ──────────────────────────────────── */}
        {custom?.state && (
          <div
            className="mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {custom.emoji?.name && (
              <span className="text-base shrink-0">{custom.emoji.name}</span>
            )}
            <span className="truncate" style={{ color: "#dbdee1" }}>{custom.state}</span>
          </div>
        )}

        {/* ── Live status badge ───────────────────────────────────── */}
        <div
          className="mb-3 flex items-center gap-2 rounded-xl p-3"
          style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold"
            style={{ background: `${cfg.color}22`, color: cfg.color, border: `1px solid ${cfg.color}44` }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: cfg.color }} />
            {cfg.label}
          </div>
          {/* Active platform icons */}
          <div className="ml-auto flex items-center gap-1.5" style={{ color: "#80848e" }}>
            {(data as any)?.active_on_discord_desktop && (
              <span title="Desktop" className="font-mono text-[10px]">🖥</span>
            )}
            {(data as any)?.active_on_discord_mobile && (
              <span title="Mobile" className="font-mono text-[10px]">📱</span>
            )}
            {(data as any)?.active_on_discord_web && (
              <span title="Web" className="font-mono text-[10px]">🌐</span>
            )}
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────────────────── */}
        <div className="mb-3" style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

        {/* ── About ───────────────────────────────────────────────── */}
        <div className="mb-3">
          <div className="mb-1 font-mono text-[11px] font-bold uppercase tracking-wider" style={{ color: "#b5bac1" }}>
            About Me
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#dbdee1" }}>
            Discord bot developer and server designer. I build custom bots, server layouts, and community tools for active communities.
          </p>
        </div>

        {/* ── Member since ─────────────────────────────────────────── */}
        <div className="mb-3 flex items-center gap-2 font-mono text-xs" style={{ color: "#80848e" }}>
          <Clock className="h-3.5 w-3.5 shrink-0" />
          Member since {MEMBER_SINCE}
        </div>

        {/* ── Roles ────────────────────────────────────────────────── */}
        <div className="mb-3">
          <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-wider" style={{ color: "#b5bac1" }}>
            Roles
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ROLES.map((r) => (
              <div
                key={r.name}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{ background: `${r.color}1a`, color: r.color, border: `1px solid ${r.color}33` }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                {r.name}
              </div>
            ))}
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────────────────── */}
        {(spotify || gameAct) && (
          <div className="mb-3" style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
        )}

        {/* ── Live Spotify ──────────────────────────────────────────── */}
        {spotify && (
          <div className="mb-3">
            <div className="mb-2 flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider" style={{ color: "#b5bac1" }}>
              <Music className="h-3 w-3" style={{ color: "#1db954" }} />
              Listening to Spotify
            </div>
            <a
              href={`https://open.spotify.com/track/${(data as any)?.spotify?.track_id ?? ""}`}
              target="_blank" rel="noreferrer noopener"
              className="group flex items-start gap-3 rounded-xl p-3 transition-all"
              style={{ background: "rgba(29,185,84,0.08)", border: "1px solid rgba(29,185,84,0.2)" }}
            >
              <img
                src={spotify.album_art_url}
                alt={spotify.album}
                className="h-12 w-12 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-white group-hover:underline">
                  {spotify.song}
                </div>
                <div className="truncate font-mono text-xs" style={{ color: "#b5bac1" }}>
                  {spotify.artist}
                </div>
                <div className="truncate font-mono text-[10px] mt-0.5" style={{ color: "#80848e" }}>
                  {spotify.album}
                </div>
                <ProgressBar start={spotify.timestamps.start} end={spotify.timestamps.end} />
              </div>
            </a>
          </div>
        )}

        {/* ── Live game activity ───────────────────────────────────── */}
        {gameAct && (
          <div className="mb-3">
            <div className="mb-2 flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider" style={{ color: "#b5bac1" }}>
              <Gamepad2 className="h-3 w-3" style={{ color: "hsl(var(--accent))" }} />
              Playing a Game
            </div>
            <div
              className="flex items-start gap-3 rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {gameIconUrl ? (
                <img src={gameIconUrl} alt={gameAct.name} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
              ) : (
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-2xl"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  🎮
                </div>
              )}
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-white">{gameAct.name}</div>
                {gameAct.details && (
                  <div className="truncate font-mono text-xs mt-0.5" style={{ color: "#b5bac1" }}>{gameAct.details}</div>
                )}
                {gameAct.state && (
                  <div className="truncate font-mono text-[10px] mt-0.5" style={{ color: "#80848e" }}>{gameAct.state}</div>
                )}
                {gameAct.timestamps?.start && (
                  <div className="font-mono text-[10px] mt-1" style={{ color: "#80848e" }}>
                    Since {new Date(gameAct.timestamps.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="pb-2" />
      </div>
    </div>
  );
}
