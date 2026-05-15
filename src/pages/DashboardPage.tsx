import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import { useLanyardContext } from "@/context/LanyardContext";
import { DISCORD_ID } from "@/lib/site-constants";
import {
  Wifi, WifiOff, Activity, Clock, Users, Hash, Bot, Music2, Gamepad2, Code2, Monitor,
  ExternalLink, ShieldCheck, Cpu, Globe, Zap, Server, ChevronUp,
} from "lucide-react";

const STATUS_COLOR: Record<string, string> = {
  online: "text-emerald-400",
  idle: "text-amber-400",
  dnd: "text-rose-400",
  offline: "text-zinc-500",
};

const STATUS_BG: Record<string, string> = {
  online: "bg-emerald-400/20 border-emerald-400/30",
  idle: "bg-amber-400/20 border-amber-400/30",
  dnd: "bg-rose-400/20 border-rose-400/30",
  offline: "bg-zinc-500/20 border-zinc-500/30",
};

const STATUS_LABEL: Record<string, string> = {
  online: "Online",
  idle: "Away",
  dnd: "Do Not Disturb",
  offline: "Offline",
};

const INVITE_CODE = "cQcEHtFmYX";

type InviteData = {
  guild: { id: string; name: string; icon: string | null; description: string | null };
  approximate_member_count: number;
  approximate_presence_count: number;
};

function ServerStatsCard() {
  const [data, setData] = useState<InviteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`https://discord.com/api/v9/invites/${INVITE_CODE}?with_counts=true`)
      .then((r) => r.json())
      .then((json) => {
        if (json.guild) setData(json as InviteData);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-accent mb-4">
        <Server className="h-4 w-4" />
        Discord Server
      </div>
      {loading ? (
        <div className="space-y-3">
          <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
          <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
        </div>
      ) : error ? (
        <p className="font-mono text-xs text-muted-foreground">Unable to fetch server data</p>
      ) : data ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {data.guild.icon ? (
              <img
                src={`https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png?size=64`}
                alt={data.guild.name}
                className="h-10 w-10 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5865F2] font-mono text-sm font-bold text-white">
                {data.guild.name[0]}
              </div>
            )}
            <div>
              <p className="font-medium">{data.guild.name}</p>
              <p className="font-mono text-xs text-muted-foreground">discord.gg/{INVITE_CODE}</p>
            </div>
          </div>
          <div className="flex gap-4 font-mono text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Wifi className="h-3.5 w-3.5" />
              {(data.approximate_presence_count ?? 0).toLocaleString()} online
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {(data.approximate_member_count ?? 0).toLocaleString()} members
            </span>
            <span className="flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5" />
              channels
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PresenceCard() {
  const { data, loading, error } = useLanyardContext();
  const status = data?.discord_status ?? "offline";
  const user = data?.discord_user;
  const activities = data?.activities ?? [];
  const spotify = data?.spotify;
  const activity = activities.find((a) => a.type !== 2 && a.name !== "Spotify");

  const activityIcon = (type: number) => {
    switch (type) {
      case 0: return <Gamepad2 className="h-4 w-4" />;
      case 3: return <Monitor className="h-4 w-4" />;
      default: return <Code2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-accent mb-4">
        <Activity className="h-4 w-4" />
        Discord Presence
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 animate-pulse rounded-full bg-secondary" />
            <div className="space-y-2">
              <div className="h-4 w-28 animate-pulse rounded bg-secondary" />
              <div className="h-3 w-20 animate-pulse rounded bg-secondary" />
            </div>
          </div>
        </div>
      ) : error ? (
        <p className="font-mono text-xs text-muted-foreground">Discord presence unavailable — user may not be tracked on Lanyard</p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "webp"}?size=128`}
                alt={user.username}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-border/50"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary font-mono text-lg font-bold">
                {user?.username?.[0] ?? "?"}
              </div>
            )}
            <div>
              <p className="font-medium">{user?.global_name ?? user?.username ?? "Unknown"}</p>
              <p className="font-mono text-xs text-muted-foreground">@{user?.username ?? "unknown"}</p>
            </div>
            <div className={`ml-auto flex items-center gap-2 rounded-full px-3 py-1.5 border ${STATUS_BG[status]}`}>
              <span className={`h-2 w-2 rounded-full ${status === "online" ? "bg-emerald-400 animate-pulse" : STATUS_COLOR[status].replace("text-", "bg-")}`} />
              <span className={`font-mono text-xs ${STATUS_COLOR[status]}`}>{STATUS_LABEL[status]}</span>
            </div>
          </div>

          {spotify && (
            <div className="flex items-center gap-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3">
              <img src={spotify.album_art_url} alt="" className="h-12 w-12 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <Music2 className="h-3.5 w-3.5 text-emerald-400" />
                  {spotify.song}
                </p>
                <p className="font-mono text-xs text-muted-foreground">{spotify.artist}</p>
                <p className="font-mono text-[10px] text-muted-foreground/60">{spotify.album}</p>
              </div>
            </div>
          )}

          {activity && (
            <div className="flex items-center gap-3 rounded-xl bg-secondary/40 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                {activityIcon(activity.type)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{activity.name}</p>
                {activity.details && <p className="truncate font-mono text-xs text-muted-foreground">{activity.details}</p>}
                {activity.state && <p className="truncate font-mono text-[10px] text-muted-foreground/60">{activity.state}</p>}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 font-mono text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Discord ID: {user?.id ?? DISCORD_ID}
            </span>
            <span className="flex items-center gap-1">
              <Wifi className={`h-3 w-3 ${error ? "text-rose-400" : "text-emerald-400"}`} />
              {error ? "Disconnected" : "Connected"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function SystemCard() {
  const [uptime, setUptime] = useState("");
  useEffect(() => {
    const fmt = (ms: number) => {
      const s = Math.floor(ms / 1000);
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      return `${h}h ${m}m`;
    };
    setUptime(fmt(performance.now()));
    const id = setInterval(() => setUptime(fmt(performance.now())), 30000);
    return () => clearInterval(id);
  }, []);

  const items = [
    { icon: Globe, label: "Host", value: window.location.hostname },
    { icon: Cpu, label: "Platform", value: navigator.platform },
    { icon: Zap, label: "Session", value: uptime },
    { icon: ShieldCheck, label: "Connection", value: navigator.onLine ? "Online" : "Offline" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-accent mb-4">
        <Cpu className="h-4 w-4" />
        System
      </div>
      <div className="space-y-3">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-between py-1">
            <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <Icon className="h-3.5 w-3.5" />
              {label}
            </span>
            <span className="font-mono text-xs text-foreground/80">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityLogCard() {
  const { data, error } = useLanyardContext();
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    setLog((prev) => {
      const next = [`[${new Date().toLocaleTimeString()}] Status: ${data?.discord_status ?? "offline"}`, ...prev];
      return next.slice(0, 20);
    });
  }, [data?.discord_status]);

  useEffect(() => {
    if (error) {
      setLog((prev) => [`[${new Date().toLocaleTimeString()}] Error: ${error}`, ...prev].slice(0, 20));
    }
  }, [error]);

  const activities = data?.activities ?? [];
  useEffect(() => {
    const a = activities.find((x) => x.type !== 4);
    if (a) {
      setLog((prev) => [`[${new Date().toLocaleTimeString()}] Activity: ${a.name}`, ...prev].slice(0, 20));
    }
  }, [activities.map((a) => a.name).join(",")]);

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-accent mb-4">
        <Clock className="h-4 w-4" />
        Recent Events
      </div>
      {log.length === 0 ? (
        <p className="font-mono text-xs text-muted-foreground">Waiting for events…</p>
      ) : (
        <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin">
          {log.map((entry, i) => (
            <p key={i} className="font-mono text-[10px] text-muted-foreground/70">{entry}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Dashboard — Hetzel401</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Nav />
      <main className="mx-auto max-w-5xl px-6 pt-28 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            <ShieldCheck className="h-4 w-4" />
            Status Dashboard
          </div>
          <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
            Live <span className="text-gradient-brand">monitoring</span>
          </h1>
          <p className="mt-2 max-w-lg text-muted-foreground">
            Real-time system status, Discord presence, and server analytics.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PresenceCard />
          <ServerStatsCard />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <SystemCard />
          <ActivityLogCard />
        </div>

        <div className="mt-10 rounded-2xl border border-accent/20 bg-accent/5 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs text-accent">
              <ChevronUp className="h-4 w-4" />
              All systems {typeof navigator !== "undefined" && navigator.onLine ? "operational" : "offline"}
            </div>
            <a
              href="https://discordapp.com/users/1097536305027629119"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#5865F2]/90 px-4 py-2 font-mono text-xs text-white transition-all hover:bg-[#5865F2]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              DM on Discord
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
