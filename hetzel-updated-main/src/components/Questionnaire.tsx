import { useState } from "react";
import { CheckCircle, ChevronRight, ChevronLeft, Send, Loader2, Trophy } from "lucide-react";

const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1504718321537515620/d_T7GNMD1lUZRjTkuxTmt4uPA_4dLv-nEBDmdK9-quG6o650EXCUhctaTuQwEFtWvpcw";

interface Question {
  id: number;
  text: string;
  type: "radio" | "textarea" | "rating";
  options?: string[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What do you think of Hetzel's Workshop overall?",
    type: "radio",
    options: ["🔥 Amazing — love everything about it", "😊 Pretty good, has some great stuff", "🙂 It's decent, room to grow", "🤔 Not sure yet, still exploring", "😕 Could use a lot of improvement"],
  },
  {
    id: 2,
    text: "Which of my projects do you like the most?",
    type: "radio",
    options: ["🏗️ Hetzel's Workshop (the community)", "🤖 My Discord bots", "🎮 My EFT-related work", "💻 My web development projects", "⚡ I like all of them equally!"],
  },
  {
    id: 3,
    text: "What feature or improvement would you most like to see added to my Discord bots?",
    type: "radio",
    options: ["🎮 More fun mini-games", "📊 Better economy & leveling systems", "🛡️ Improved moderation tools", "🎵 Music & voice features", "🔧 Custom automation & utility commands"],
  },
  {
    id: 4,
    text: "What do you think is the best part of Hetzel's Workshop?",
    type: "radio",
    options: ["👥 The community & people", "🎨 The design & aesthetics", "🤖 The bots & automation", "🎯 The events & activities", "📝 The content & updates"],
  },
  {
    id: 5,
    text: "What suggestions do you have to help me improve my projects and community?",
    type: "textarea",
  },
];

type Answers = Record<number, string>;

// ── Helpers ────────────────────────────────────────────────────────────────

function buildEmbed(answers: Answers) {
  const fields = QUESTIONS.map((q) => ({
    name: `${q.id}. ${q.text}`,
    value: answers[q.id] || "*No answer provided*",
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
  const [step, setStep]     = useState(0); // 0 = intro
  const [answers, setAnswers] = useState<Answers>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isIntro = step === 0;
  const isDone  = step > QUESTIONS.length;
  const q       = QUESTIONS[step - 1];

  const canAdvance = isIntro || (q?.type === "textarea" ? true : !!answers[q?.id]);

  const next = () => {
    if (step < QUESTIONS.length) {
      setStep((s) => s + 1);
    } else {
      submit();
    }
  };

  const prev = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    setStatus("sending");
    try {
      const payload = buildEmbed(answers);
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("done");
      setStep(QUESTIONS.length + 1);
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
          <h3 className="font-display text-2xl font-semibold">Quick Questionnaire</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            5 short questions about Hetzel's Workshop. Takes about 60 seconds and helps me improve everything I build.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {["📋 5 questions", "⏱ ~60 seconds", "🔒 Anonymous"].map((chip) => (
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
          Start Survey <ChevronRight className="h-4 w-4" />
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
          <h3 className="font-display text-2xl font-semibold">Thanks so much! 🎉</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Your feedback has been sent straight to my Discord. I read every response and use it to make Hetzel's Workshop better.
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
          Take it again
        </button>
      </div>
    );
  }

  // ── Question step ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5">
      <ProgressBar step={step} total={QUESTIONS.length} />

      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          Question {step} of {QUESTIONS.length}
        </p>
        <h3 className="font-display text-lg font-semibold leading-snug">{q.text}</h3>
      </div>

      {/* Options */}
      {q.type === "radio" && (
        <div className="flex flex-col gap-2">
          {q.options?.map((opt) => (
            <OptionBtn
              key={opt}
              label={opt}
              selected={answers[q.id] === opt}
              onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
            />
          ))}
        </div>
      )}

      {q.type === "textarea" && (
        <textarea
          rows={4}
          placeholder="Share your thoughts — any feedback is welcome!"
          value={answers[q.id] ?? ""}
          onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
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
          ⚠ Failed to send: {errorMsg}. Please try again.
        </p>
      )}

      {/* Nav */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={prev}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/30 px-4 py-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Back
        </button>

        <button
          onClick={next}
          disabled={!canAdvance || status === "sending"}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 font-semibold text-sm text-background transition-all disabled:opacity-40"
          style={{ background: canAdvance ? "hsl(var(--accent))" : "hsl(var(--muted))" }}
        >
          {status === "sending" ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
          ) : step === QUESTIONS.length ? (
            <><Send className="h-4 w-4" /> Submit</>
          ) : (
            <>Next <ChevronRight className="h-4 w-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}
