/**
 * DiscordServerCard — Live Discord server preview.
 * Real member/online counts from Discord's public invite API.
 * Channel sidebar + mock activity based on actual server structure.
 */
import { useEffect, useState } from "react";
import {
  Hash, Volume2, Users, ChevronDown, ChevronRight, Shield,
  Bell, Pin, Search, Settings, Wifi, UserPlus, ExternalLink,
  BookOpen, Swords, Bot, Wrench, Star
} from "lucide-react";

const INVITE_CODE = "defense";
const INVITE_URL  = `https://discord.gg/${INVITE_CODE}`;
const API_URL     = `https://discord.com/api/v9/invites/${INVITE_CODE}?with_counts=true`;

type InviteData = {
  guild: { id: string; name: string; icon: string | null; description: string | null };
  approximate_member_count: number;
  approximate_presence_count: number;
};

// Real server channel structure
const CHANNELS = [
  {
    category: "📋 INFORMATION",
    items: [
      { type: "text",  name: "welcome",        Icon: BookOpen,  pinned: true  },
      { type: "text",  name: "announcements",  Icon: Bell,      pinned: false },
      { type: "text",  name: "rules",          Icon: Shield,    pinned: true  },
      { type: "text",  name: "roles",          Icon: Star,      pinned: false },
    ],
  },
  {
    category: "💬 GENERAL",
    items: [
      { type: "text",  name: "general",        Icon: Hash,      pinned: false },
      { type: "text",  name: "bot-commands",   Icon: Bot,       pinned: false },
      { type: "text",  name: "media",          Icon: Hash,      pinned: false },
      { type: "voice", name: "General Voice",  Icon: Volume2,   pinned: false },
    ],
  },
  {
    category: "🤖 DISCORD BOTS",
    items: [
      { type: "text",  name: "bot-discussion", Icon: Hash,      pinned: false },
      { type: "text",  name: "bot-showcase",   Icon: Hash,      pinned: false },
      { type: "text",  name: "commissions",    Icon: Wrench,    pinned: false },
    ],
  },
  {
    category: "🔫 EFT SECTION",
    items: [
      { type: "text",  name: "eft-general",    Icon: Swords,    pinned: false },
      { type: "text",  name: "loot-tips",      Icon: Hash,      pinned: false },
      { type: "text",  name: "raid-squads",    Icon: Users,     pinned: false },
    ],
  },
];

// Real community member display (usernames from testimonials/readme)
const MEMBERS = [
  { name: "Hetzel401",   emoji: "🔧", role: "Owner",          status: "online"  as const, color: "#f59e0b" },
  { name: "MIAQ",        emoji: "⭐", role: "Executive",      status: "online"  as const, color: "#8b5cf6" },
  { name: "nightshade",  emoji: "🌙", role: "Executive",      status: "idle"    as const, color: "#8b5cf6" },
  { name: "badgy",       emoji: "🛡", role: "Head of Admin",  status: "online"  as const, color: "#34d399" },
  { name: "TarkovRat",   emoji: "🐀", role: "EFT Member",     status: "dnd"     as const, color: "#6b7280" },
  { name: "PixelRaven",  emoji: "🎮", role: "Member",         status: "online"  as const, color: "#6b7280" },
  { name: "ShadowBlitz", emoji: "⚡", role: "Member",         status: "offline" as const, color: "#6b7280" },
];

const STATUS_DOT = {
  online:  "#23a55a",
  idle:    "#f0b232",
  dnd:     "#f23f43",
  offline: "#80848e",
};

// Real-ish messages with actual member names
const MESSAGES = [
  { user: "Hetzel401", emoji: "🔧", color: "#f59e0b", time: "Today at 12:00",
    text: "Welcome to Hetzel's Workshop! 🎉 Check #rules and grab your roles in #roles. Don't hesitate to ask anything!" },
  { user: "badgy",     emoji: "🛡", color: "#34d399", time: "Today at 12:15",
    text: "Great community here — bot commands in #bot-commands, EFT chat in the EFT section. Enjoy!" },
  { user: "nightshade",emoji: "🌙", color: "#8b5cf6", time: "Today at 12:30",
    text: "If you need a custom Discord bot, Hetzel builds quality stuff fast 🤖 Check #commissions for info." },
  { user: "MIAQ",      emoji: "⭐", color: "#8b5cf6", time: "Today at 12:45",
    text: "The EFT section is super active lately. Drop into #raid-squads if you want to run some raids!" },
];

function StatusDot({ s }: { s: keyof typeof STATUS_DOT }) {
  return (
    <span
      className="absolute bottom-0 right-0 h-3 w-3 rounded-full"
      style={{ background: STATUS_DOT[s], border: "2px solid #2b2d31" }}
    />
  );
}

// ── Compact invite pill (can be used elsewhere) ────────────────────────
export function DiscordInvitePill({ memberCount, onlineCount, iconUrl, name }: {
  memberCount: number; onlineCount: number; iconUrl: string | null; name: string;
}) {
  return (
    <a
      href={INVITE_URL}
      target="_blank" rel="noreferrer noopener"
      className="group flex items-center gap-4 rounded-xl p-4 transition-all hover:opacity-90"
      style={{ background: "#313338", border: "1px solid rgba(255,255,255,0.06)", maxWidth: 440 }}
    >
      {iconUrl ? (
        <img src={iconUrl} alt={name} className="h-12 w-12 shrink-0 rounded-2xl object-cover" />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#5865F2] text-2xl font-bold text-white">H</div>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold text-white">{name}</div>
        <div className="mt-0.5 flex items-center gap-3 font-mono text-xs" style={{ color: "#b5bac1" }}>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#23a55a]" />
            {onlineCount.toLocaleString()} Online
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: "#80848e" }} />
            {memberCount.toLocaleString()} Members
          </span>
        </div>
      </div>
      <div className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-[#4752c4]" style={{ background: "#5865F2" }}>
        Join
      </div>
    </a>
  );
}

// ── Full Discord app preview ───────────────────────────────────────────
export default function DiscordServerCard() {
  const [invite, setInvite]           = useState<InviteData | null>(null);
  const [loading, setLoading]         = useState(true);
  const [activeChannel, setChannel]   = useState("general");
  const [showMembers, setShowMembers] = useState(true);
  const [collapsed, setCollapsed]     = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then((json) => { if (json.guild) setInvite(json); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const guild      = invite?.guild;
  const serverName = guild?.name ?? "Hetzel's Workshop";
  const onlineCount  = invite?.approximate_presence_count ?? 0;
  const memberCount  = invite?.approximate_member_count   ?? 0;

  const iconUrl = guild?.icon
    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${guild.icon.startsWith("a_") ? "gif" : "png"}?size=128`
    : null;

  const toggle = (cat: string) => setCollapsed((p) => ({ ...p, [cat]: !p[cat] }));
  const onlineMembers = MEMBERS.filter((m) => m.status !== "offline");
  const offlineMembers = MEMBERS.filter((m) => m.status === "offline");

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-2xl"
      style={{
        background: "#313338",
        border: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "'gg sans','Noto Sans',ui-sans-serif,system-ui,sans-serif",
        maxWidth: 760,
        height: 500,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-14 w-14 animate-pulse rounded-2xl" style={{ background: "#3b3d44" }} />
            <div className="h-4 w-40 animate-pulse rounded-full" style={{ background: "#3b3d44" }} />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* ── Channel sidebar ──────────────────────────────────── */}
          <div
            className="flex flex-col overflow-hidden"
            style={{ width: 196, background: "#2b2d31", flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.04)" }}
          >
            {/* Server name */}
            <div
              className="flex cursor-default items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="truncate text-sm font-semibold text-white">{serverName}</span>
              <ChevronDown className="h-4 w-4 shrink-0" style={{ color: "#b5bac1" }} />
            </div>

            {/* Channels */}
            <div className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: "none" }}>
              {CHANNELS.map((cat) => {
                const isOpen = !collapsed[cat.category];
                return (
                  <div key={cat.category} className="mb-1">
                    <button
                      onClick={() => toggle(cat.category)}
                      className="flex w-full items-center gap-1 px-1.5 py-0.5 text-left transition-colors hover:text-white"
                      style={{ color: "#80848e" }}
                    >
                      {isOpen
                        ? <ChevronDown className="h-2.5 w-2.5 shrink-0" />
                        : <ChevronRight className="h-2.5 w-2.5 shrink-0" />}
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider">{cat.category}</span>
                    </button>

                    {isOpen && cat.items.map((ch) => {
                      const active = activeChannel === ch.name;
                      const { Icon } = ch;
                      return (
                        <button
                          key={ch.name}
                          onClick={() => setChannel(ch.name)}
                          className="group flex w-full items-center gap-1.5 rounded-md px-2 py-[5px] text-left transition-all"
                          style={{
                            margin: "1px 4px",
                            width: "calc(100% - 8px)",
                            background: active ? "rgba(255,255,255,0.1)" : "transparent",
                            color: active ? "#fff" : "#80848e",
                          }}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="flex-1 truncate text-sm">{ch.name}</span>
                          {ch.pinned && <Pin className="h-2.5 w-2.5 shrink-0 opacity-50" />}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Bottom user bar */}
            <div
              className="flex items-center gap-2 px-2 py-2 shrink-0"
              style={{ background: "#232428", borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="relative shrink-0">
                {iconUrl ? (
                  <img src={iconUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5865F2] text-sm font-bold text-white">H</div>
                )}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#23a55a]" style={{ border: "2px solid #232428" }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-white">hetzel401</div>
                <div className="truncate font-mono text-[10px]" style={{ color: "#23a55a" }}>Owner</div>
              </div>
              <button className="rounded p-1 hover:bg-white/10 transition-colors" style={{ color: "#80848e" }}>
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── Main chat area ───────────────────────────────────── */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Topbar */}
            <div
              className="flex shrink-0 items-center justify-between px-4 py-2"
              style={{ background: "#313338", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 shrink-0" style={{ color: "#80848e" }} />
                <span className="font-semibold text-white text-sm">{activeChannel}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMembers((v) => !v)}
                  title="Toggle member list"
                  style={{ color: showMembers ? "#c9cdfb" : "#80848e" }}
                  className="transition-colors hover:text-white"
                >
                  <Users className="h-5 w-5" />
                </button>
                <Search className="h-5 w-5 cursor-pointer transition-colors hover:text-white" style={{ color: "#80848e" }} />
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: "none" }}>
                {/* Server info card */}
                <div
                  className="mb-4 flex items-start gap-4 rounded-2xl p-5"
                  style={{ background: "#2b2d31", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {iconUrl ? (
                    <img src={iconUrl} alt={serverName} className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#5865F2] text-3xl font-bold text-white">H</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-lg font-bold text-white">{serverName}</div>
                    {guild?.description && (
                      <p className="mb-2 text-sm" style={{ color: "#b5bac1" }}>{guild.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 font-mono text-xs">
                      <span className="flex items-center gap-1.5" style={{ color: "#23a55a" }}>
                        <Wifi className="h-3.5 w-3.5" />
                        {onlineCount.toLocaleString()} Online
                      </span>
                      <span className="flex items-center gap-1.5" style={{ color: "#b5bac1" }}>
                        <Users className="h-3.5 w-3.5" />
                        {memberCount.toLocaleString()} Members
                      </span>
                    </div>
                    <a
                      href={INVITE_URL}
                      target="_blank" rel="noreferrer noopener"
                      className="mt-3 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80 active:scale-95"
                      style={{ background: "#5865F2" }}
                    >
                      <UserPlus className="h-4 w-4" />
                      Join Server
                      <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                    </a>
                  </div>
                </div>

                {/* Messages */}
                {MESSAGES.map((msg, i) => (
                  <div
                    key={i}
                    className="group flex gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.03]"
                  >
                    <div
                      className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
                      style={{ background: `${msg.color}22` }}
                    >
                      {msg.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold" style={{ color: msg.color }}>{msg.user}</span>
                        <span className="font-mono text-[10px]" style={{ color: "#80848e" }}>{msg.time}</span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "#dbdee1" }}>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Member list ───────────────────────────────── */}
              {showMembers && (
                <div
                  className="flex-shrink-0 overflow-y-auto py-3"
                  style={{ width: 186, background: "#2b2d31", borderLeft: "1px solid rgba(255,255,255,0.04)", scrollbarWidth: "none" }}
                >
                  {/* Online */}
                  <div className="px-3 mb-1 font-mono text-[11px] font-bold uppercase tracking-wider" style={{ color: "#80848e" }}>
                    Online — {onlineMembers.length}
                  </div>
                  {onlineMembers.map((m) => (
                    <div
                      key={m.name}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-[5px] transition-colors hover:bg-white/[0.06]"
                    >
                      <div className="relative shrink-0">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
                          style={{ background: `${m.color}22` }}
                        >
                          {m.emoji}
                        </div>
                        <StatusDot s={m.status} />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-semibold text-white">{m.name}</div>
                        <div className="truncate font-mono text-[10px]" style={{ color: "#80848e" }}>{m.role}</div>
                      </div>
                    </div>
                  ))}

                  {/* Offline */}
                  {offlineMembers.length > 0 && (
                    <>
                      <div className="mt-3 px-3 mb-1 font-mono text-[11px] font-bold uppercase tracking-wider" style={{ color: "#80848e" }}>
                        Offline — {offlineMembers.length}
                      </div>
                      {offlineMembers.map((m) => (
                        <div
                          key={m.name}
                          className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-[5px] opacity-40 transition-colors hover:opacity-60"
                        >
                          <div className="relative shrink-0">
                            <div
                              className="flex h-8 w-8 items-center justify-center rounded-full text-sm grayscale"
                              style={{ background: "rgba(255,255,255,0.05)" }}
                            >
                              {m.emoji}
                            </div>
                            <StatusDot s="offline" />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-xs font-semibold text-white">{m.name}</div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Message input bar */}
            <div className="shrink-0 px-4 pb-4 pt-2">
              <a
                href={INVITE_URL}
                target="_blank" rel="noreferrer noopener"
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 transition-opacity hover:opacity-80"
                style={{ background: "#383a40" }}
              >
                <span className="flex-1 text-sm" style={{ color: "#80848e" }}>
                  Join to message #{activeChannel}…
                </span>
                <span
                  className="shrink-0 rounded-lg px-3 py-1 text-xs font-semibold text-white"
                  style={{ background: "#5865F2" }}
                >
                  Join →
                </span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
