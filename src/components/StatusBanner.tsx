import React from "react";
import { Clock as LucideClock, ShieldCheck, Activity } from "lucide-react";
import { useLanyardContext } from "@/context/LanyardContext";
import { useCustomization } from "@/context/CustomizationContext";
import { useLanguage } from "@/context/LanguageContext";

const STATUS_COLOR: Record<string, string> = {
  online: "bg-emerald-400",
  idle: "bg-amber-400",
  dnd: "bg-rose-500",
  offline: "bg-zinc-500",
};

export default function StatusBanner() {
  const { data: presence } = useLanyardContext();
  const { config } = useCustomization();
  const { t } = useLanguage();
  
  if (!presence || !config.statusBannerVisible) return null;

  const user = presence.discord_user;
  const status = presence.discord_status;
  const activity = presence.activities?.find(a => a.type !== 4); // Find non-custom status activity

  const statusLabel = (t.widgets.status as any)[status] || status;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm animate-fade-up">
      <div className="glass group relative overflow-hidden rounded-2xl border border-border/60 p-4 shadow-2xl transition-all hover:border-accent/40">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        
        <div className="relative flex items-center gap-4">
          <div className="relative shrink-0">
            <img 
              src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar?.startsWith("a_") ? "gif" : "png"}?size=128`}
              className="h-12 w-12 rounded-full border-2 border-white/10 shadow-lg"
              alt={user.username}
            />
            <div className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#0a0a0a] ${STATUS_COLOR[status]}`} />
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate font-display text-sm font-bold text-foreground">
                {user.global_name || user.username}
              </h3>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <p className="truncate font-mono text-[10px] text-muted-foreground">
              {activity ? activity.name : `${t.widgets.status.currently} ${statusLabel}`}
            </p>
          </div>
        </div>

        {activity && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-secondary/40 px-2.5 py-1.5">
            <Activity className="h-3 w-3 text-accent" />
            <span className="truncate font-mono text-[10px] text-muted-foreground">
              {activity.details || activity.state || t.widgets.status.activeNow}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}