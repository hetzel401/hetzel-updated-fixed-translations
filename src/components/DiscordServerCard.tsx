/**
 * DiscordServerCard.tsx
 * Pixel-accurate Discord server invite preview — styled exactly like
 * Discord's own invite embed, with live member/online counts.
 * Also shows a mock channel/member sidebar for extra detail.
 */
import { useEffect, useState } from "react";
import {
  Hash, Volume2, Users, ChevronDown, Shield, Bell, Pin,
  Search, Settings, Wifi, UserPlus, ExternalLink
} from "lucide-react";

const INVITE_CODE  = "Mj9byBhusx";
const INVITE_URL   = `https://discord.gg/${INVITE_CODE}`;
const API_URL      = `https://discord.com/api/v9/invites/${INVITE_CODE}?with_counts=true`;

type InviteData = {
  guild: { id: string; name: string; icon: string | null; description: string | null };
  approximate_member_count: number;
  approximate_presence_count: number;
};

// Mock channels (Discord's sidebar)
const CHANNELS = [
  { category: "INFORMATION", items: [
    { type: "text",  name: "welcome",         icon: Hash, pinned: true  },
    { type: "text",  name: "announcements",   icon: Hash, pinned: false },
    { type: "text",  name: "rules",           icon: Shield, pinned: false },
  ]},
  { category: "GENERAL", items: [
    { type: "text",  name: "general",         icon: Hash, pinned: false },
    { type: "text",  name: "bot-commands",    icon: Hash, pinned: false },
    { type: "text",  name: "media",           icon: Hash, pinned: false },
    { type: "voice", name: "General Voice",   icon: Volume2, pinned: false },
  ]},
  { category: "DISCORD BOTS", items: [
    { type: "text",  name: "bot-discussion",  icon: Hash, pinned: false },
    { type: "text",  name: "bot-showcase",    icon: Hash, pinned: false },
  ]},
  { category: "EFT SECTION", items: [
    { type: "text",  name: "eft-general",     icon: Hash, pinned: false },
    { type: "text",  name: "loot-tips",       icon: Hash, pinned: false },
    { type: "text",  name: "raid-squads",     icon: Hash, pinned: false },
  ]},
];

// Mock online members
const ONLINE_MEMBERS = [
  { name: "Hetzel401",  role: "Owner",             status: "online", color: "#f59e0b", emoji: "🔧" },
  { name: "MIAQ",       role: "Executive",          status: "online", color: "#8b5cf6", emoji: "⭐" },
  { name: "nightshade", role: "Executive",          status: "idle",   color: "#8b5cf6", emoji: "🌙" },
  { name: "badgy",      role: "Head of Admin",      status: "online", color: "#34d399", emoji: "🛡" },
  { name: "TarkovRat",  role: "Member",             status: "dnd",    color: "#6b7280", emoji: "🐀" },
  { name: "PixelRaven", role: "Member",             status: "online", color: "#6b7280", emoji: "🎮" },
];

const STATUS_DOT = {
  online: "#23a55a",
  idle:   "#f0b232",
  dnd:    "#f23f43",
  offline: "#80848e",
} as const;

function StatusDot({ status }: { status: keyof typeof STATUS_DOT }) {
  return (
    <span
      className="absolute bottom-0 right-0 h-3 w-3 rounded-full"
      style={{ background: STATUS_DOT[status], border: "2px solid #2b2d31" }}
    />
  );
}

// ── Invite Pill (compact version) ─────────────────────────────────────────
export function DiscordInvitePill({ data }: { data: InviteData | null }) {
  const iconUrl = data?.guild.icon
    ? `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.${data.guild.icon.startsWith("a_") ? "gif" : "png"}?size=128`
    : null;

  return (
    <a
      href={INVITE_URL}
      target="_blank" rel="noreferrer noopener"
      className="group flex items-center gap-4 rounded-xl p-4 transition-all"
      style={{
        background: "#313338",
        border: "1px solid rgba(255,255,255,0.06)",
        maxWidth: 440,
      }}
    >
      {iconUrl ? (
        <img src={iconUrl} alt={data?.guild.name} className="h-12 w-12 rounded-2xl object-cover shrink-0" />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#5865F2] text-2xl font-bold text-white">H</div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white truncate">{data?.guild.name ?? "Hetzel's Workshop"}</div>
        <div className="flex items-center gap-3 font-mono text-xs mt-0.5" style={{ color: "#b5bac1" }}>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#23a55a]" />
            {(data?.approximate_presence_count ?? 0).toLocaleString()} Online
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: "#80848e" }} />
            {(data?.approximate_member_count ?? 0).toLocaleString()} Members
          </span>
        </div>
      </div>
      <div
        className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all group-hover:opacity-90"
        style={{ background: "#5865F2" }}
      >
        Join
      </div>
    </a>
  );
}

// ── Full Discord-style server preview ─────────────────────────────────────
export default function DiscordServerCard() {
  const [data, setData] = useState<InviteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChannel, setActiveChannel] = useState("general");
  const [showMembers, setShowMembers] = useState(true);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then((json) => { if (json.guild) setData(json); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const iconUrl = data?.guild.icon
    ? `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.${data.guild.icon.startsWith("a_") ? "gif" : "png"}?size=128`
    : null;

  const serverName = data?.guild.name ?? "Hetzel's Workshop";
  const onlineCount  = data?.approximate_presence_count ?? 0;
  const memberCount  = data?.approximate_member_count  ?? 0;

  const toggleCategory = (cat: string) =>
    setCollapsed((p) => ({ ...p, [cat]: !p[cat] }));

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-2xl"
      style={{
        background: "#313338",
        border: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "'gg sans','Noto Sans',ui-sans-serif,sans-serif",
        maxWidth: 760,
        height: 480,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="flex flex-1 overflow-hidden">
        {/* ── Channel sidebar ──────────────────────────────────── */}
        <div
          className="flex flex-col overflow-hidden"
          style={{ width: 200, background: "#2b2d31", flexShrink: 0 }}
        >
          {/* Server header */}
          <div
            className="flex cursor-pointer items-center justify-between px-4 py-3 font-semibold text-white transition-colors"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="truncate text-sm">{serverName}</span>
            <ChevronDown className="h-4 w-4 shrink-0" style={{ color: "#b5bac1" }} />
          </div>

          {/* Channels */}
          <div className="flex-1 overflow-y-auto py-3 scrollbar-thin" style={{ scrollbarWidth: "none" }}>
            {CHANNELS.map((cat) => (
              <div key={cat.category} className="mb-1">
                <button
                  onClick={() => toggleCategory(cat.category)}
                  className="flex w-full items-center gap-1 px-2 py-0.5 transition-colors"
                  style={{ color: "#80848e" }}
                >
                  <ChevronDown
                    className="h-3 w-3 transition-transform"
                    style={{ transform: collapsed[cat.category] ? "rotate(-90deg)" : "none" }}
                  />
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
                    {cat.category}
                  </span>
                </button>
                {!collapsed[cat.category] && cat.items.map((ch) => {
                  const Icon = ch.icon;
                  const active = activeChannel === ch.name;
                  return (
                    <button
                      key={ch.name}
                      onClick={() => setActiveChannel(ch.name)}
                      className="group flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left transition-all"
                      style={{
                        marginLeft: 8, width: "calc(100% - 8px)",
                        background: active ? "rgba(255,255,255,0.1)" : "transparent",
                        color: active ? "#ffffff" : "#80848e",
                      }}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate text-sm">{ch.name}</span>
                      {ch.pinned && <Pin className="ml-auto h-3 w-3 shrink-0" style={{ color: "#80848e" }} />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* User bar (bottom of sidebar) */}
          <div
            className="flex items-center gap-2 px-2 py-2"
            style={{ background: "#232428", borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="relative shrink-0">
              <img
                src="https://cdn.discordapp.com/avatars/1097536305027629119/a_default.png"
                alt="You"
                className="h-8 w-8 rounded-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://cdn.discordapp.com/embed/avatars/0.png"; }}
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#23a55a]" style={{ border: "2px solid #232428" }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-white">hetzel401</div>
              <div className="truncate font-mono text-[10px]" style={{ color: "#80848e" }}>Owner</div>
            </div>
            <div className="flex gap-1">
              <button className="rounded p-1 transition-colors hover:bg-white/10" style={{ color: "#80848e" }}>
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Main content area ─────────────────────────────────── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Channel topbar */}
          <div
            className="flex items-center justify-between px-4 py-2"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#313338" }}
          >
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 shrink-0" style={{ color: "#80848e" }} />
              <span className="font-semibold text-white text-sm">{activeChannel}</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowMembers((v) => !v)} title="Toggle member list" style={{ color: showMembers ? "#fff" : "#80848e" }}>
                <Users className="h-5 w-5" />
              </button>
              <Bell className="h-5 w-5 cursor-pointer" style={{ color: "#80848e" }} />
              <Search className="h-5 w-5 cursor-pointer" style={{ color: "#80848e" }} />
            </div>
          </div>

          {/* Message area */}
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: "none" }}>
              {/* Join prompt */}
              <div
                className="mb-4 flex items-start gap-4 rounded-2xl p-5"
                style={{ background: "#2b2d31", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {iconUrl ? (
                  <img src={iconUrl} alt={serverName} className="h-16 w-16 rounded-2xl object-cover shrink-0" />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#5865F2] text-3xl font-bold text-white">H</div>
                )}
                <div>
                  <div className="mb-1 text-lg font-bold text-white">{serverName}</div>
                  {data?.guild.description && (
                    <p className="text-sm" style={{ color: "#b5bac1" }}>{data.guild.description}</p>
                  )}
                  <div className="mt-2 flex items-center gap-4 font-mono text-xs">
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
                    className="mt-3 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "#5865F2" }}
                  >
                    <UserPlus className="h-4 w-4" />
                    Join Server
                    <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                  </a>
                </div>
              </div>

              {/* Mock messages */}
              {[
                { user: "Hetzel401", color: "#f59e0b", emoji: "🔧", text: "Welcome to Hetzel's Workshop! Check #rules and #welcome to get started. 🎉", time: "Today at 12:00" },
                { user: "badgy",     color: "#34d399", emoji: "🛡", text: "Great community here — bot commands in #bot-commands, EFT chat in the EFT section!", time: "Today at 12:05" },
                { user: "nightshade",color: "#8b5cf6", emoji: "🌙", text: "If you need a custom Discord bot, hit up Hetzel — builds quality stuff fast 🤖", time: "Today at 12:08" },
                { user: "MIAQ",      color: "#8b5cf6", emoji: "⭐", text: "Ping @Hetzel401 for commissions — server setups, bots, you name it.", time: "Today at 12:12" },
              ].map((msg, i) => (
                <div key={i} className="group flex gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.03] mb-1">
                  <div
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold"
                    style={{ background: `${msg.color}22`, color: msg.color }}
                  >
                    {msg.emoji}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold" style={{ color: msg.color }}>{msg.user}</span>
                      <span className="font-mono text-[10px]" style={{ color: "#80848e" }}>{msg.time}</span>
                    </div>
                    <p className="text-sm" style={{ color: "#dbdee1" }}>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Member list ───────────────────────────────────── */}
            {showMembers && (
              <div
                className="overflow-y-auto py-3"
                style={{ width: 200, background: "#2b2d31", borderLeft: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, scrollbarWidth: "none" }}
              >
                <div className="px-3 mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#80848e" }}>
                  Online — {ONLINE_MEMBERS.filter(m => m.status !== "offline").length}
                </div>
                {ONLINE_MEMBERS.map((m) => (
                  <div
                    key={m.name}
                    className="group flex items-center gap-2.5 rounded-md px-3 py-1.5 transition-colors hover:bg-white/[0.06] cursor-pointer"
                  >
                    <div className="relative shrink-0">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                        style={{ background: `${m.color}22`, color: m.color }}
                      >
                        {m.emoji}
                      </div>
                      <StatusDot status={m.status as any} />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-medium text-white">{m.name}</div>
                      <div className="truncate font-mono text-[10px]" style={{ color: "#80848e" }}>{m.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message input (cosmetic) */}
          <div className="px-4 pb-4 pt-2">
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-2.5"
              style={{ background: "#383a40" }}
            >
              <span className="flex-1 text-sm" style={{ color: "#80848e" }}>
                Message #{activeChannel}
              </span>
              <div className="flex gap-2" style={{ color: "#80848e" }}>
                <UserPlus className="h-5 w-5 cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
