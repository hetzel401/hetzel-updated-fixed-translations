import { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import { ANNOUNCEMENT } from "@/lib/site-constants";

const VARIANT_STYLES = {
  info:    { bg: "bg-blue-500/15 border-blue-500/30",   text: "text-blue-300",   btn: "bg-blue-500/20 hover:bg-blue-500/35"   },
  success: { bg: "bg-emerald-500/15 border-emerald-500/30", text: "text-emerald-300", btn: "bg-emerald-500/20 hover:bg-emerald-500/35" },
  warning: { bg: "bg-amber-500/15 border-amber-500/30", text: "text-amber-300",  btn: "bg-amber-500/20 hover:bg-amber-500/35"  },
  accent:  { bg: "bg-accent/10 border-accent/30",       text: "text-accent",     btn: "bg-accent/20 hover:bg-accent/35"       },
};

const STORAGE_KEY = "hetzel-announcement-dismissed";

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ANNOUNCEMENT.enabled) return;
    // Show if the user hasn't dismissed this version of the banner
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed !== ANNOUNCEMENT.text) setVisible(true);
  }, []);

  if (!ANNOUNCEMENT.enabled || !visible) return null;

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, ANNOUNCEMENT.text);
    setVisible(false);
  };

  const s = VARIANT_STYLES[ANNOUNCEMENT.variant];

  return (
    <div
      className={`relative z-[60] w-full border-b px-4 py-2.5 ${s.bg} backdrop-blur`}
      role="banner"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <p className={`font-mono text-xs truncate ${s.text}`}>{ANNOUNCEMENT.text}</p>
          {ANNOUNCEMENT.link && (
            <a
              href={ANNOUNCEMENT.link.href}
              className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-xs transition-colors ${s.text} ${s.btn}`}
            >
              {ANNOUNCEMENT.link.label}
              <ArrowRight className="h-3 w-3" />
            </a>
          )}
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className={`shrink-0 rounded-full p-1 transition-colors ${s.text} ${s.btn}`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
