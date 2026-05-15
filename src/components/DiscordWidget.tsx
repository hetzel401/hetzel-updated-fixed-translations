import { useEffect, useState } from "react";
import { Users, Hash, Wifi } from "lucide-react";

const INVITE_CODE = "cQcEHtFmYX";

type InviteData = {
  guild: {
    id: string;
    name: string;
    icon: string | null;
    description: string | null;
  };
  approximate_member_count: number;
  approximate_presence_count: number;
};

export default function DiscordWidget() {
  const [data, setData] = useState<InviteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://discord.com/api/v9/invites/${INVITE_CODE}?with_counts=true`)
      .then((r) => r.json())
      .then((json) => {
        if (json.guild) setData(json as InviteData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const iconUrl = data?.guild.icon
    ? `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.${data.guild.icon.startsWith("a_") ? "gif" : "png"}?size=128`
    : null;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#5865F2]/40 bg-[#1e1f22]/80 p-6 shadow-[0_0_60px_-20px_rgba(88,101,242,0.5)] backdrop-blur transition-all hover:border-[#5865F2]/70 hover:shadow-[0_0_80px_-15px_rgba(88,101,242,0.6)]">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#5865F2]/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      {loading ? (
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 animate-pulse rounded-2xl bg-white/10" />
          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4">
            {iconUrl ? (
              <img src={iconUrl} alt={data?.guild.name} className="h-14 w-14 rounded-2xl object-cover" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5865F2] font-display text-xl font-bold text-white">
                {data?.guild.name?.[0] ?? "H"}
              </div>
            )}
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                {data?.guild.name ?? "Hetzel's Workshop"}
              </h3>
              <p className="font-mono text-xs text-[#b9bbbe]">discord.gg/{INVITE_CODE}</p>
            </div>
          </div>

          {data?.guild.description && (
            <p className="mt-3 text-sm text-[#b9bbbe] line-clamp-2">{data.guild.description}</p>
          )}

          <div className="mt-4 flex items-center gap-4 font-mono text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Wifi className="h-3 w-3" />
              {(data?.approximate_presence_count ?? 0).toLocaleString()} online
            </span>
            <span className="flex items-center gap-1.5 text-[#b9bbbe]">
              <Users className="h-3 w-3" />
              {(data?.approximate_member_count ?? 0).toLocaleString()} members
            </span>
            <span className="flex items-center gap-1.5 text-[#b9bbbe]">
              <Hash className="h-3 w-3" />
              channels
            </span>
          </div>

          <a
            href={`https://discord.gg/${INVITE_CODE}`}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#5865F2] py-2.5 font-display text-sm font-semibold text-white transition-all hover:bg-[#4752c4] active:scale-95"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.032.019.063.041.082a19.921 19.921 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .041-.082c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            Join Server
          </a>
        </>
      )}
    </div>
  );
}
