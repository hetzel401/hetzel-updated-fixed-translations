import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyDiscordTag({ tag }: { tag: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(tag).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [tag]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-1.5 font-mono text-xs text-muted-foreground transition-all hover:border-accent/40 hover:text-accent active:scale-95"
      aria-label={`Copy Discord tag: ${tag}`}
    >
      <span>{tag}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied && (
        <span className="text-[10px] text-emerald-400">Copied!</span>
      )}
    </button>
  );
}
