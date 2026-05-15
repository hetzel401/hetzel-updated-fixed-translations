import React from "react";
import { Clock, ShieldCheck, Zap } from "lucide-react";
import { useLanyard } from "../hooks/use-lanyard";

export const StatusBanner = () => {
  const { data: presence } = useLanyard();
  
  if (!presence) return null;

  return (
    <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/10 flex flex-wrap gap-6 items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img 
            src={`https://cdn.discordapp.com/avatars/${presence.discord_user.id}/${presence.discord_user.avatar}.png`}
            className="w-12 h-12 rounded-full border-2 border-white/20"
            alt="Avatar"
          />
          <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0a0a0a] ${
            presence.discord_status === 'online' ? 'bg-green-500' : 
            presence.discord_status === 'dnd' ? 'bg-red-500' : 'bg-gray-500'
          }`} />
        </div>
        <div>
          <h3 className="font-bold text-white">{presence.discord_user.username}</h3>
          <p className="text-xs text-white/50">Currently {presence.discord_status}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-medium text-white/80">Active Now</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span className="text-xs font-medium text-white/80">Verified</span>
        </div>
      </div>
    </div>
  );
};