import { useState } from "react";
import { CheckCircle, ChevronRight, ChevronLeft, Send, Loader2, Trophy } from "lucide-react";
import { DISCORD_WEBHOOK } from "@/lib/site-constants";
import { useLanguage } from "@/context/LanguageContext";

type Answers = Record<number, string>;

// ── Helpers ────────────────────────────────────────────────────────────────

function buildEmbed(answers: Answers, questions: any[]) {
  const fields = questions.map((q, i) => ({
    name: `${i + 1}. ${q.text}`,
    value: answers[i + 1] || "*No answer provided*",
    inline: false,
  }));

  return {
    embeds: [
      {
        title: "📋 New Questionnaire Response",
        description: "Someone just filled out the Hetzel's Workshop questionnaire!",
        color: 0x7c3aed,
        fields,
        footer: { text: `Submitted at ${new Date().toUTCString()}` },
        thumbnail: {
          url: "https://cdn.discordapp.com/avatars/1097536305027629119/a_placeholder.png",
        },
      },
    ],
    username: "Hetzel's Workshop",
  };
}

// ── Progress bar ───────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = ((step) / total) * 100;
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: "hsl(var(--accent))" }}
        />
      </div>
      <span className="font-mono text-[10px] text-muted-foreground shrink-0">
        {step} / {total}
      </span>
    </div>
  );
}

// ── Option button ──────────────────────────────────────────────────────────

function OptionBtn({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl border px-4 py-3 font-mono text-sm transition-all hover:border-accent/60"
      style={
        selected
          ? {
              borderColor: "hsl(var(--accent) / 0.8)",
              background: "hsl(var(--accent) / 0.1)",
              color: "hsl(var(--foreground))",
            }
          : {
              borderColor: "hsl(var(--border))",
              background: "hsl(var(--card) / 0.5)",
              color: "hsl(var(--muted-foreground))",
            }
      }
    >
      <span className="flex items-center gap-3">
        <span
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all"
          style={
            selected
              ? { borderColor: "hsl(var(--accent))", background: "hsl(var(--accent))" }
              : { borderColor: "hsl(var(--border))" }
          }
        >
          {selected && (
            <span
              className="block h-1.5 w-1.5 rounded-full"
              style={{ background: "hsl(var(--background))" }}
            />
          )}
        </span>
        {label}
      </span>
    </button>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function Questionnaire() {
  const { t } = useLanguage();
  const s = t.survey;
  const questions = s.questions;
  
  const [step, setStep]     = useState(0); // 0 = intro
  const [answers, setAnswers] = useState<Answers>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isIntro = step === 0;
  const isDone  = step > questions.length;
  const q       = questions[step - 1];

  const canAdvance = isIntro || (q?.placeholder ? true : !!answers[step]);

  const next = () => {
    if (step < questions.length) {
      setStep((s) => s + 1);
    } else {
      submit();
    }
  };

  const prev = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    setStatus("sending");
    try {
      const payload = buildEmbed(answers, questions);
      const res = await fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("done");
      setStep(questions.length + 1);
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Unknown error");
    }
  };

  // ── Intro ────────────────────────────────────────────────────────────────
  if (isIntro) {
    return (
      <div className="flex flex-col items-center text-center gap-6">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/30"
          style={{ background: "hsl(var(--accent) / 0.1)" }}
        >
          <Trophy className="h-8 w-8" style={{ color: "hsl(var(--accent))" }} />
        </div>
        <div>
          <h3 className="font-display text-2xl font-semibold">{s.introTitle}</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            {s.introText}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {s.chips.map((chip: string) => (
            <span
              key={chip}
              className="rounded-full border border-border bg-secondary/40 px-3 py-1 font-mono text-xs text-muted-foreground"
            >
              {chip}
            </span>
          ))}
        </div>
        <button
          onClick={() => setStep(1)}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          {s.start} <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // ── Success ──────────────────────────────────────────────────────────────
  if (isDone) {
    return (
      <div className="flex flex-col items-center text-center gap-6">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30"
          style={{ background: "rgba(52,211,153,0.1)" }}
        >
          <CheckCircle className="h-8 w-8 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-display text-2xl font-semibold">{s.thanks}</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            {s.successText}
          </p>
        </div>
        <button
          onClick={() => {
            setStep(0);
            setAnswers({});
            setStatus("idle");
          }}
          className="rounded-full border border-border bg-secondary/40 px-6 py-2.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {s.takeAgain}
        </button>
      </div>
    );
  }

  // ── Question step ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5">
      <ProgressBar step={step} total={questions.length} />

      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          {s.questionOf.replace("{step}", String(step)).replace("{total}", String(questions.length))}
        </p>
        <h3 className="font-display text-lg font-semibold leading-snug">{q.text}</h3>
      </div>

      {/* Options */}
      {q.options && (
        <div className="flex flex-col gap-2">
          {q.options.map((opt: string) => (
            <OptionBtn
              key={opt}
              label={opt}
              selected={answers[step] === opt}
              onClick={() => setAnswers((a) => ({ ...a, [step]: opt }))}
            />
          ))}
        </div>
      )}

      {q.placeholder && (
        <textarea
          rows={4}
          placeholder={q.placeholder}
          value={answers[step] ?? ""}
          onChange={(e) => setAnswers((a) => ({ ...a, [step]: e.target.value }))}
          className="w-full rounded-xl border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
          style={{
            background: "hsl(var(--secondary) / 0.4)",
            borderColor: "hsl(var(--border))",
          }}
        />
      )}

      {/* Error */}
      {status === "error" && (
        <p className="font-mono text-xs text-rose-400">
          ⚠ {s.error.replace("{error}", errorMsg)}
        </p>
      )}

      {/* Nav */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={prev}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/30 px-4 py-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> {s.back}
        </button>

        <button
          onClick={next}
          disabled={!canAdvance || status === "sending"}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 font-semibold text-sm text-background transition-all disabled:opacity-40"
          style={{ background: canAdvance ? "hsl(var(--accent))" : "hsl(var(--muted))" }}
        >
          {status === "sending" ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> {s.submitting}</>
          ) : step === questions.length ? (
            <><Send className="h-4 w-4" /> {s.submit}</>
          ) : (
            <>{s.next} <ChevronRight className="h-4 w-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}