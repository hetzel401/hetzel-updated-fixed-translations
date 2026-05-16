/**
 * DiscordProfileCard.tsx
 * Pixel-accurate recreation of Discord's user profile popup.
 * Shows avatar, banner, badges, status, activity, Spotify, roles, bio.
 * Data comes from the shared LanyardContext so no extra fetches.
 */
import { useState, useEffect } from "react";
import { useLanyardContext } from "@/context/LanyardContext";
import { ExternalLink, Music, Clock, Gamepad2, MessageSquare } from "lucide-react";

const DISCORD_USER_URL = "https://discordapp.com/users/1097536305027629119";
const INVITE_URL       = "https://discord.gg/Mj9byBhusx";

// Nitro / badge icons as inline SVGs (Discord's actual badge shapes)
const BADGES = [
  {
    id: "nitro",
    label: "Discord Nitro",
    svg: (
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="none">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Z" fill="#f47fff"/>
        <path d="M7 10.5h3.5V8H17l-3 5.5h-3.5V16H7L10 10.5Z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "hypesquad",
    label: "HypeSquad Brilliance",
    svg: (
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="none">
        <path d="M12 2 L22 8 L22 16 L12 22 L2 16 L2 8 Z" fill="#e67e22"/>
        <path d="M12 6 L16 9 L15 14 L12 17 L9 14 L8 9 Z" fill="white" opacity="0.9"/>
      </svg>
    ),
  },
  {
    id: "activedeveloper",
    label: "Active Developer",
    svg: (
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#5865F2"/>
        <path d="M8 8 L4 12 L8 16M16 8 L20 12 L16 16M13 6 L11 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "bot",
    label: "Bot",
    svg: (
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="none">
        <rect x="2" y="6" width="20" height="14" rx="3" fill="#5865F2"/>
        <circle cx="9" cy="13" r="2" fill="white"/>
        <circle cx="15" cy="13" r="2" fill="white"/>
        <rect x="9" y="3" width="6" height="4" rx="1" fill="#5865F2"/>
        <rect x="11" y="2" width="2" height="2" rx="0.5" fill="#5865F2"/>
      </svg>
    ),
  },
];

const STATUS_CONFIG = {
  online:  { color: "#23a55a", label: "Online",          ring: "#1a7a41" },
  idle:    { color: "#f0b232", label: "Idle",            ring: "#a07820" },
  dnd:     { color: "#f23f43", label: "Do Not Disturb",  ring: "#a02830" },
  offline: { color: "#80848e", label: "Offline",         ring: "#555860" },
} as const;

function ActivityBar({ start, end }: { start: number; end: number }) {
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
    <div className="mt-2">
      <div className="h-1 w-full rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
        <div
          className="h-1 rounded-full transition-all"
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

export default function DiscordProfileCard() {
  const { data, loading } = useLanyardContext();

  const user   = data?.discord_user;
  const status = (data?.discord_status ?? "offline") as keyof typeof STATUS_CONFIG;
  const cfg    = STATUS_CONFIG[status];
  const spotify = data?.spotify;
  const gameAct = data?.activities?.find((a) => a.type === 0 && a.name !== "Spotify");
  const customStatus = data?.activities?.find((a) => a.type === 4);

  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=256`
    : "https://cdn.discordapp.com/embed/avatars/0.png";

  // Fake banner colour for style (real banner needs OAuth)
  const bannerGradient = "linear-gradient(135deg, #1e1460 0%, #5865F2 40%, #eb459e 100%)";

  const ROLES = [
    { name: "Workshop Owner", color: "#f59e0b" },
    { name: "Bot Developer",  color: "#8b5cf6" },
    { name: "Community Lead", color: "#34d399" },
  ];

  const NOTE = "Student dev building Discord bots, web projects & EFT tools. 17 y/o · UK 🇬🇧";

  if (loading) {
    return (
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ width: 340, background: "#232428", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Skeleton */}
        <div className="h-24 animate-pulse" style={{ background: "#1e1460" }} />
        <div className="px-4 pb-4">
          <div className="flex items-end gap-3 -mt-10 mb-4">
            <div className="h-20 w-20 rounded-full animate-pulse" style={{ background: "#3b3d44", border: "4px solid #232428" }} />
          </div>
          {[120, 80, 100].map((w, i) => (
            <div key={i} className="mb-2 h-3 rounded animate-pulse" style={{ width: w, background: "#3b3d44" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-2xl select-none"
      style={{
        width: 340,
        background: "#232428",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 16px 64px rgba(0,0,0,0.7)",
        fontFamily: "'gg sans', 'Noto Sans', ui-sans-serif, sans-serif",
      }}
    >
      {/* ── Banner ────────────────────────────────────────────────── */}
      <div
        className="relative"
        style={{ height: 92, background: bannerGradient, overflow: "hidden" }}
      >
        {/* Subtle noise overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "150px",
          }}
        />
        {/* Decorative shapes */}
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-30" style={{ background: "#eb459e", filter: "blur(20px)" }} />
        <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full opacity-20" style={{ background: "#5865F2", filter: "blur(16px)" }} />
      </div>

      {/* ── Avatar area ──────────────────────────────────────────── */}
      <div className="relative px-4">
        <div className="flex items-end justify-between -mt-10 mb-3">
          {/* Avatar */}
          <div className="relative" style={{ width: 80, height: 80 }}>
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: "#232428", padding: 4 }}
            >
              <img
                src={avatarUrl}
                alt={user?.global_name || user?.username || "Avatar"}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {/* Status dot */}
            <div
              className="absolute bottom-1 right-1 h-4 w-4 rounded-full"
              style={{
                background: cfg.color,
                border: `3px solid #232428`,
                boxShadow: `0 0 0 1px ${cfg.ring}`,
              }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pb-1">
            <a
              href={INVITE_URL}
              target="_blank" rel="noreferrer noopener"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-80"
              style={{ background: "#5865F2" }}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Message
            </a>
            <a
              href={DISCORD_USER_URL}
              target="_blank" rel="noreferrer noopener"
              className="flex items-center justify-center rounded-lg p-1.5 transition-all hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.08)" }}
              title="View on Discord"
            >
              <ExternalLink className="h-3.5 w-3.5" style={{ color: "#b5bac1" }} />
            </a>
          </div>
        </div>

        {/* ── Name + tag ──────────────────────────────────────────── */}
        <div className="mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold leading-tight text-white">
              {user?.global_name || user?.username || "Hetzel401"}
            </span>
            {/* Verified/bot badge placeholder */}
          </div>
          <div className="font-mono text-sm" style={{ color: "#b5bac1" }}>
            {user?.username ? `@${user.username}` : "@hetzel401"}
          </div>
        </div>

        {/* ── Custom status ────────────────────────────────────────── */}
        {customStatus?.state && (
          <div
            className="mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            {customStatus.emoji?.name && (
              <span className="text-base leading-none">{customStatus.emoji.name}</span>
            )}
            <span style={{ color: "#dbdee1" }}>{customStatus.state}</span>
          </div>
        )}

        {/* ── Badges ───────────────────────────────────────────────── */}
        <div
          className="mb-3 flex flex-wrap items-center gap-2 rounded-xl p-3"
          style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {BADGES.map((b) => (
            <div key={b.id} title={b.label} className="group relative cursor-pointer">
              <div className="h-6 w-6 transition-transform group-hover:scale-125">{b.svg}</div>
              {/* Tooltip */}
              <div
                className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-2 py-1 text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                style={{ background: "#111214", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {b.label}
              </div>
            </div>
          ))}
          {/* Status badge */}
          <div
            className="ml-auto flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold"
            style={{ background: `${cfg.color}22`, color: cfg.color, border: `1px solid ${cfg.color}44` }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: cfg.color }} />
            {cfg.label}
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────────────────── */}
        <div className="mb-3" style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

        {/* ── About me ─────────────────────────────────────────────── */}
        <div className="mb-3">
          <div className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#b5bac1" }}>
            About Me
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#dbdee1" }}>{NOTE}</p>
        </div>

        {/* ── Member since ─────────────────────────────────────────── */}
        <div className="mb-3">
          <div className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#b5bac1" }}>
            Member Since
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: "#dbdee1" }}>
            <Clock className="h-3.5 w-3.5 shrink-0" />
            Apr 15, 2023
          </div>
        </div>

        {/* ── Roles ────────────────────────────────────────────────── */}
        <div className="mb-3">
          <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#b5bac1" }}>
            Roles
          </div>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <div
                key={r.name}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{ background: `${r.color}18`, color: r.color, border: `1px solid ${r.color}33` }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                {r.name}
              </div>
            ))}
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────────────────── */}
        <div className="mb-3" style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

        {/* ── Spotify ──────────────────────────────────────────────── */}
        {spotify && (
          <div className="mb-3">
            <div className="mb-2 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#b5bac1" }}>
              <Music className="h-3 w-3" style={{ color: "#1db954" }} />
              Listening to Spotify
            </div>
            <a
              href={`https://open.spotify.com/track/${data?.spotify?.track_id}`}
              target="_blank" rel="noreferrer noopener"
              className="group flex items-start gap-3 rounded-xl p-3 transition-all"
              style={{ background: "rgba(29,185,84,0.08)", border: "1px solid rgba(29,185,84,0.2)" }}
            >
              <img
                src={spotify.album_art_url}
                alt={spotify.album}
                className="h-12 w-12 rounded-lg object-cover shrink-0"
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
                <ActivityBar start={spotify.timestamps.start} end={spotify.timestamps.end} />
              </div>
            </a>
          </div>
        )}

        {/* ── Game activity ─────────────────────────────────────────── */}
        {gameAct && (
          <div className="mb-3">
            <div className="mb-2 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#b5bac1" }}>
              <Gamepad2 className="h-3 w-3 text-accent" />
              Playing a Game
            </div>
            <div
              className="flex items-start gap-3 rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-2xl"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                🎮
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-white">{gameAct.name}</div>
                {gameAct.details && <div className="truncate font-mono text-xs" style={{ color: "#b5bac1" }}>{gameAct.details}</div>}
                {gameAct.state  && <div className="truncate font-mono text-[10px]" style={{ color: "#80848e" }}>{gameAct.state}</div>}
              </div>
            </div>
          </div>
        )}

        {/* ── Bottom pad ───────────────────────────────────────────── */}
        <div className="pb-1" />
      </div>
    </div>
  );
}
