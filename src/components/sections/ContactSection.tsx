import React, { useState } from "react";
import { SectionLabel } from "@/components/SectionLabel";
import { useLanguage } from "@/context/LanguageContext";
import { DISCORD_WEBHOOK } from "@/lib/site-constants";
import { Send, Youtube, Gamepad2, Github } from "lucide-react";

export default function ContactSection() {
  const { t } = useLanguage();
  const c = t.contact;
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "📬 Contact Form",
          embeds: [
            {
              title: "📨 New Contact Form Submission",
              color: 0x8b5cf6,
              fields: [
                { name: "👤 Name",    value: form.name    || "Not provided", inline: true  },
                { name: "📧 Email",   value: form.email   || "Not provided", inline: true  },
                { name: "💬 Message", value: form.message || "Not provided", inline: false },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative mx-auto max-w-4xl px-6 py-28 reveal-on-scroll content-visibility-auto" style={{ scrollMarginTop: 80 }}>
      <SectionLabel label={c.sectionLabel} />
      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card/60 p-10 md:p-16 relative">
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
          {c.heading}
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground md:text-lg">
          {c.description}
        </p>

        {status === "sent" ? (
          <div className="mt-10 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
            <div className="text-4xl mb-3">✅</div>
            <div className="font-display text-xl font-semibold text-emerald-400">{c.successTitle}</div>
            <p className="mt-2 text-sm text-muted-foreground">{c.successText}</p>
            <button onClick={() => setStatus("idle")} className="mt-4 font-mono text-xs text-muted-foreground underline underline-offset-2">
              {c.sendAnother}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs text-muted-foreground">{c.formName}</label>
                <input
                  type="text" required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder={c.namePlaceholder}
                  className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs text-muted-foreground">{c.formEmail}</label>
                <input
                  type="email" required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder={c.emailPlaceholder}
                  className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/20"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs text-muted-foreground">{c.formMessage}</label>
              <textarea
                required rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder={c.messagePlaceholder}
                className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/20"
              />
            </div>

            {status === "error" && (
              <p className="font-mono text-xs text-rose-400">{c.errorText}</p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit" disabled={status === "sending"}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background transition-all hover:bg-foreground/90 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "sending" ? (
                  <><span className="animate-spin">⏳</span> {c.sending}</>
                ) : (
                  <><Send className="h-4 w-4" /> {c.sendMessage}</>
                )}
              </button>
              <span className="font-mono text-xs text-muted-foreground">{c.or}</span>
              <a
                href="https://discordapp.com/users/1097536305027629119"
                target="_blank" rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full bg-[#5865F2]/90 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#5865F2] hover:scale-105"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.7 19.7 0 0 0 3.677 4.37.077.077 0 0 0 3.65 4.487c.72 10.795 5.098 16.793 9.3 17.773.5.084 1.002.084 1.501 0 4.203-.98 8.581-6.978 9.3-17.773.015-.12-.005-.243-.05-.36z" />
                </svg>
                {c.dmOnDiscord}
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border/60 pt-6">
              <span className="font-mono text-xs text-muted-foreground">{c.findMeOn}</span>
              <a href="https://www.youtube.com/@Hetzel401" target="_blank" rel="noreferrer noopener" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary/40 text-[#FF0000] transition-all hover:scale-110">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="https://www.roblox.com/users/1517909098/profile" target="_blank" rel="noreferrer noopener" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary/40 text-[#e1523d] transition-all hover:scale-110">
                <Gamepad2 className="h-5 w-5" />
              </a>
              <a href="https://github.com/hetzel401" target="_blank" rel="noreferrer noopener" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary/40 text-white transition-all hover:scale-110">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}