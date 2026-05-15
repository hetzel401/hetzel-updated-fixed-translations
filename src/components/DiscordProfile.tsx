import { useEffect, useState } from "react";

const DEFAULT_DISCORD_ID = "1097536305027629119";

type LanyardData = {
  discord_user?: {
    id: string;
    username: string;
    global_name?: string | null;
    avatar?: string | null;
    avatar_decoration_data?: { asset: string; sku_id?: string } | null;
  };
  discord_status?: "online" | "idle" | "dnd" | "offline";
};

export default function DiscordProfile({ userId = DEFAULT_DISCORD_ID }: { userId?: string }) {
  const [data, setData] = useState<LanyardData | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const json = await res.json();
        if (!json.success) throw new Error(json?.error?.message || "Not tracked");
        if (!cancelled) setData(json.data as LanyardData);
      } catch (e: unknown) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Failed to load profile");
      }
    };
    load();
    const t = setInterval(load, 30_000);
    return () => { cancelled = true; clearInterval(t); };
  }, [userId]);

  const user = data?.discord_user;
  const status = data?.discord_status ?? "offline";

  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=512`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  const decorationUrl = user?.avatar_decoration_data?.asset
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png?size=512&passthrough=true`
    : null;

  const statusColor: Record<string, string> = {
    online: "bg-emerald-400",
    idle: "bg-amber-400",
    dnd: "bg-rose-500",
    offline: "bg-zinc-500",
  };

  return (
    <div className="relative animate-float">
      <div className="absolute inset-0 -z-10 blur-3xl">
        <div className="mx-auto h-full w-full rounded-full bg-brand opacity-40" />
      </div>
      <div className="relative flex h-36 w-36 items-center justify-center rounded-full p-[2px] md:h-40 md:w-40">
        <div className="absolute inset-0 rounded-full bg-brand opacity-80 blur-[2px]" />
        <div className="relative h-full w-full overflow-visible rounded-full bg-black">
          <img
            src={avatarUrl}
            alt={user?.global_name || user?.username || "Discord avatar"}
            width={512}
            height={512}
            className="absolute inset-0 h-full w-full rounded-full object-cover"
          />
          {decorationUrl && (
            <img
              src={decorationUrl}
              alt=""
              aria-hidden
              width={512}
              height={512}
              className="pointer-events-none absolute inset-0 h-full w-full scale-[1.18] rounded-full object-contain"
            />
          )}
          <span
            className={`absolute bottom-1 right-1 block h-4 w-4 rounded-full ring-4 ring-black ${statusColor[status]}`}
            title={status}
          />
        </div>
      </div>
      <div className="mt-3 text-center font-mono text-xs text-muted-foreground">
        {user ? <>@{user.username}</> : err ? <span className="text-muted-foreground/60">offline</span> : <span className="opacity-60">connecting…</span>}
      </div>
    </div>
  );
}
