import { useEffect, useState } from "react";

const DISCORD_ID = "1097536305027629119";

export type LanyardActivity = {
  type: number;
  name: string;
  details?: string;
  state?: string;
  application_id?: string;
  timestamps?: { start?: number; end?: number };
  assets?: { large_image?: string; small_image?: string };
};

export type LanyardData = {
  discord_status: "online" | "idle" | "dnd" | "offline";
  discord_user: {
    id: string;
    username: string;
    global_name?: string | null;
    avatar?: string | null;
  };
  activities?: LanyardActivity[];
  spotify?: {
    song: string;
    artist: string;
    album: string;
    album_art_url: string;
    timestamps: { start: number; end: number };
    track_id: string;
  } | null;
};

export function useLanyard() {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const json = await res.json();
        if (!json.success) throw new Error(json?.error?.message ?? "Not tracked");
        if (!cancelled) {
          setData(json.data);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    const t = setInterval(fetchData, 30_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  return { data, loading, error };
}
