import { useState } from "react";
import { Play, Eye, ThumbsUp, Clock, X } from "lucide-react";
import { VIDEOS } from "@/lib/site-constants";
import { SectionLabel } from "@/components/SectionLabel";

export default function YouTubeSection() {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <section
      id="videos"
      className="relative mx-auto max-w-6xl px-6 py-28 reveal-on-scroll content-visibility-auto"
      style={{ scrollMarginTop: 80 }}
    >
      <SectionLabel label="VIDEOS" />
      <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl md:text-5xl">
        Watch &amp; learn
      </h2>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
        Tutorials, server tours, and community highlights from the channel.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {VIDEOS.map((video) => (
          <div
            key={video.id}
            className="stagger-child group relative overflow-hidden rounded-2xl border border-border bg-card/50 card-hover"
          >
            {/* Thumbnail / Player */}
            <div className="relative aspect-video bg-secondary/40">
              {playingId === video.id ? (
                <div className="relative h-full w-full">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                    title={video.title}
                  />
                  <button
                    onClick={() => setPlayingId(null)}
                    className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-1.5 text-white transition hover:bg-black/80"
                    aria-label="Close video"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setPlayingId(video.id)}
                  className="relative flex h-full w-full items-center justify-center"
                  aria-label={`Play ${video.title}`}
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-accent/90 text-background shadow-lg transition-transform group-hover:scale-110">
                    <Play className="ml-0.5 h-6 w-6 fill-current" />
                  </div>
                  <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white">
                    {video.duration}
                  </span>
                </button>
              )}
            </div>

            {/* Info */}
            <div className="p-4 sm:p-5">
              <h3 className="font-display text-sm font-semibold leading-snug line-clamp-2">
                {video.title}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                {video.desc}
              </p>
              <div className="mt-3 flex items-center gap-3 font-mono text-[10px] text-muted-foreground/70">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" /> {video.views}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" /> {video.likes}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {video.duration}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
